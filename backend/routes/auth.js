const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const config = require('../config');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: '7d' });
};

// Register
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, firstName, lastName, bio, location } = req.body;
    const userModel = new User();

    // Check if user already exists
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const existingUsername = await userModel.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Create user
    const user = await userModel.create({
      username,
      email,
      password,
      firstName,
      lastName,
      bio,
      location
    });

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    delete user.password;

    res.status(201).json({
      message: 'User created successfully',
      user,
      token
    });

    userModel.close();
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const userModel = new User();

    // Find user
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await userModel.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    delete user.password_hash;

    res.json({
      message: 'Login successful',
      user,
      token
    });

    userModel.close();
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const userModel = new User();
    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Remove password from response
    delete user.password_hash;

    res.json({ user });
    userModel.close();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Update profile
router.put('/profile', [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters')
], async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const userModel = new User();

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = req.body;
    const updatedUser = await userModel.update(decoded.userId, updateData);

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

    userModel.close();
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
