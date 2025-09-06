const express = require('express');
const { body, validationResult } = require('express-validator');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const config = require('../config');

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Complete purchase
router.post('/', authenticateToken, [
  body('items').isArray().withMessage('Items must be an array'),
  body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, shippingAddress, paymentMethod } = req.body;
    const db = new sqlite3.Database(config.DATABASE_PATH);

    // Start transaction
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      const purchasePromises = items.map((item) => {
        return new Promise((resolve, reject) => {
          // Get product details
          db.get('SELECT * FROM products WHERE id = ?', [item.productId], (err, product) => {
            if (err) {
              reject(err);
            } else if (!product) {
              reject(new Error(`Product ${item.productId} not found`));
            } else if (product.seller_id === req.userId) {
              reject(new Error('Cannot purchase your own product'));
            } else if (product.is_sold) {
              reject(new Error(`Product ${item.productId} is already sold`));
            } else {
              // Create purchase record
              const totalAmount = product.price * item.quantity;
              const insertPurchase = `
                INSERT INTO purchases (buyer_id, seller_id, product_id, quantity, total_amount, shipping_address, payment_method, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
              `;
              
              db.run(insertPurchase, [
                req.userId,
                product.seller_id,
                item.productId,
                item.quantity,
                totalAmount,
                shippingAddress,
                paymentMethod
              ], function(err) {
                if (err) {
                  reject(err);
                } else {
                  // Mark product as sold
                  db.run('UPDATE products SET is_sold = 1 WHERE id = ?', [item.productId], (err) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve({
                        purchaseId: this.lastID,
                        productId: item.productId,
                        totalAmount
                      });
                    }
                  });
                }
              });
            }
          });
        });
      });

      Promise.all(purchasePromises)
        .then((results) => {
          // Clear user's cart
          db.run('DELETE FROM cart WHERE user_id = ?', [req.userId], (err) => {
            if (err) {
              db.run('ROLLBACK');
              res.status(500).json({ message: 'Failed to clear cart' });
            } else {
              db.run('COMMIT', (err) => {
                if (err) {
                  db.run('ROLLBACK');
                  res.status(500).json({ message: 'Transaction failed' });
                } else {
                  res.json({
                    message: 'Purchase completed successfully',
                    purchases: results
                  });
                }
              });
            }
          });
        })
        .catch((error) => {
          db.run('ROLLBACK');
          res.status(400).json({ message: error.message });
        });
    });

    db.close();
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's purchase history
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = new sqlite3.Database(config.DATABASE_PATH);
    
    const sql = `
      SELECT p.*, pr.title, pr.image_urls, pr.price,
             u.username as seller_name, u.avatar_url as seller_avatar
      FROM purchases p
      JOIN products pr ON p.product_id = pr.id
      JOIN users u ON p.seller_id = u.id
      WHERE p.buyer_id = ?
      ORDER BY p.created_at DESC
    `;
    
    db.all(sql, [req.userId], (err, rows) => {
      if (err) {
        console.error('Get purchases error:', err);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        const purchases = rows.map(row => ({
          ...row,
          image_urls: JSON.parse(row.image_urls || '[]')
        }));
        res.json({ purchases });
      }
      db.close();
    });
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's sales history
router.get('/sales', authenticateToken, async (req, res) => {
  try {
    const db = new sqlite3.Database(config.DATABASE_PATH);
    
    const sql = `
      SELECT p.*, pr.title, pr.image_urls, pr.price,
             u.username as buyer_name, u.avatar_url as buyer_avatar
      FROM purchases p
      JOIN products pr ON p.product_id = pr.id
      JOIN users u ON p.buyer_id = u.id
      WHERE p.seller_id = ?
      ORDER BY p.created_at DESC
    `;
    
    db.all(sql, [req.userId], (err, rows) => {
      if (err) {
        console.error('Get sales error:', err);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        const sales = rows.map(row => ({
          ...row,
          image_urls: JSON.parse(row.image_urls || '[]')
        }));
        res.json({ sales });
      }
      db.close();
    });
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update purchase status (for sellers)
router.patch('/:id/status', authenticateToken, [
  body('status').isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const db = new sqlite3.Database(config.DATABASE_PATH);
    
    // Check if user is the seller
    const checkSql = 'SELECT seller_id FROM purchases WHERE id = ?';
    
    db.get(checkSql, [id], (err, row) => {
      if (err) {
        console.error('Check purchase error:', err);
        res.status(500).json({ message: 'Internal server error' });
      } else if (!row) {
        res.status(404).json({ message: 'Purchase not found' });
      } else if (row.seller_id !== req.userId) {
        res.status(403).json({ message: 'Not authorized to update this purchase' });
      } else {
        // Update status
        const updateSql = 'UPDATE purchases SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        
        db.run(updateSql, [status, id], function(err) {
          if (err) {
            console.error('Update purchase error:', err);
            res.status(500).json({ message: 'Internal server error' });
          } else {
            res.json({ message: 'Purchase status updated successfully' });
          }
          db.close();
        });
      }
    });
  } catch (error) {
    console.error('Update purchase error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
