const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const config = require('../config');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const db = new sqlite3.Database(config.DATABASE_PATH);
    
    const sql = 'SELECT * FROM categories ORDER BY name';
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('Get categories error:', err);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        res.json({ categories: rows });
      }
      db.close();
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = new sqlite3.Database(config.DATABASE_PATH);
    
    const sql = 'SELECT * FROM categories WHERE id = ?';
    
    db.get(sql, [id], (err, row) => {
      if (err) {
        console.error('Get category error:', err);
        res.status(500).json({ message: 'Internal server error' });
      } else if (row) {
        res.json({ category: row });
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
      db.close();
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get products by category
router.get('/:id/products', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const db = new sqlite3.Database(config.DATABASE_PATH);
    
    const sql = `
      SELECT p.*, c.name as category_name, u.username as seller_name, u.avatar_url as seller_avatar
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
      WHERE p.category_id = ? AND p.is_sold = 0
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    db.all(sql, [id, parseInt(limit), offset], (err, rows) => {
      if (err) {
        console.error('Get category products error:', err);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        const products = rows.map(row => ({
          ...row,
          image_urls: JSON.parse(row.image_urls || '[]')
        }));
        
        res.json({
          products,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: products.length
          }
        });
      }
      db.close();
    });
  } catch (error) {
    console.error('Get category products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
