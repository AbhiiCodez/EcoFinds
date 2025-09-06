const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
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

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search, minPrice, maxPrice, condition, isEcoFriendly } = req.query;
    
    const productModel = new Product();
    const filters = {
      category: category ? parseInt(category) : undefined,
      search,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      condition,
      isEcoFriendly: isEcoFriendly !== undefined ? isEcoFriendly === 'true' : undefined
    };

    const products = await productModel.getAll(parseInt(page), parseInt(limit), filters);
    
    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: products.length
      }
    });

    productModel.close();
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const productModel = new Product();
    const products = await productModel.getFeatured(parseInt(limit));
    
    res.json({ products });
    productModel.close();
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const productModel = new Product();
    const product = await productModel.getById(parseInt(id));
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ product });
    productModel.close();
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new product
router.post('/', authenticateToken, [
  body('title').isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('condition').isIn(['excellent', 'good', 'fair', 'poor']).withMessage('Invalid condition'),
  body('categoryId').isInt().withMessage('Category ID must be a number'),
  body('imageUrls').isArray().withMessage('Image URLs must be an array')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, price, originalPrice, condition, categoryId, imageUrls, isEcoFriendly = true } = req.body;
    
    const productModel = new Product();
    const product = await productModel.create({
      title,
      description,
      price,
      originalPrice,
      condition,
      categoryId: parseInt(categoryId),
      sellerId: req.userId,
      imageUrls,
      isEcoFriendly
    });

    res.status(201).json({
      message: 'Product created successfully',
      product
    });

    productModel.close();
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update product
router.put('/:id', authenticateToken, [
  body('title').optional().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').optional().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('condition').optional().isIn(['excellent', 'good', 'fair', 'poor']).withMessage('Invalid condition')
], async (req, res) => {
  try {
    const { id } = req.params;
    const productModel = new Product();
    
    // Check if product exists and belongs to user
    const existingProduct = await productModel.getById(parseInt(id));
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (existingProduct.seller_id !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = req.body;
    const updatedProduct = await productModel.update(parseInt(id), updateData);

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });

    productModel.close();
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete product
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const productModel = new Product();
    
    // Check if product exists and belongs to user
    const existingProduct = await productModel.getById(parseInt(id));
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (existingProduct.seller_id !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await productModel.delete(parseInt(id));

    res.json({ message: 'Product deleted successfully' });
    productModel.close();
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add to cart
router.post('/:id/cart', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity = 1 } = req.body;
    
    const productModel = new Product();
    const product = await productModel.getById(parseInt(id));
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.is_sold) {
      return res.status(400).json({ message: 'Product is already sold' });
    }
    
    if (product.seller_id === req.userId) {
      return res.status(400).json({ message: 'Cannot add your own product to cart' });
    }

    const cartModel = new Cart();
    await cartModel.addItem(req.userId, parseInt(id), quantity);

    res.json({ message: 'Product added to cart successfully' });
    
    productModel.close();
    cartModel.close();
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Mark product as sold
router.patch('/:id/sold', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const productModel = new Product();
    
    // Check if product exists and belongs to user
    const existingProduct = await productModel.getById(parseInt(id));
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (existingProduct.seller_id !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to mark this product as sold' });
    }

    await productModel.markAsSold(parseInt(id));

    res.json({ message: 'Product marked as sold successfully' });
    productModel.close();
  } catch (error) {
    console.error('Mark as sold error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's products
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const productModel = new Product();
    
    // Get products by seller ID
    const products = await productModel.getBySellerId(parseInt(userId));
    
    res.json({ products });
    productModel.close();
  } catch (error) {
    console.error('Get user products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
