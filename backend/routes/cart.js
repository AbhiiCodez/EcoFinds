const express = require('express');
const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
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

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const cartModel = new Cart();
    const cartItems = await cartModel.getCart(req.userId);
    
    res.json({ cartItems });
    cartModel.close();
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add item to cart
router.post('/', authenticateToken, [
  body('productId').isInt().withMessage('Product ID must be a number'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, quantity } = req.body;
    const cartModel = new Cart();
    
    await cartModel.addItem(req.userId, productId, quantity);

    res.json({ message: 'Item added to cart successfully' });
    cartModel.close();
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update cart item quantity
router.put('/:productId', authenticateToken, [
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId } = req.params;
    const { quantity } = req.body;
    const cartModel = new Cart();
    
    await cartModel.updateQuantity(req.userId, parseInt(productId), quantity);

    res.json({ message: 'Cart updated successfully' });
    cartModel.close();
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Remove item from cart
router.delete('/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const cartModel = new Cart();
    
    await cartModel.removeItem(req.userId, parseInt(productId));

    res.json({ message: 'Item removed from cart successfully' });
    cartModel.close();
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Clear cart
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const cartModel = new Cart();
    
    await cartModel.clearCart(req.userId);

    res.json({ message: 'Cart cleared successfully' });
    cartModel.close();
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get cart count
router.get('/count', authenticateToken, async (req, res) => {
  try {
    const cartModel = new Cart();
    const count = await cartModel.getCartCount(req.userId);
    
    res.json({ count });
    cartModel.close();
  } catch (error) {
    console.error('Get cart count error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get cart total
router.get('/total', authenticateToken, async (req, res) => {
  try {
    const cartModel = new Cart();
    const total = await cartModel.getCartTotal(req.userId);
    
    res.json({ total });
    cartModel.close();
  } catch (error) {
    console.error('Get cart total error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
