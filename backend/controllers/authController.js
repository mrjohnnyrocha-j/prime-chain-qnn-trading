// controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');
require('dotenv').config();

/**
 * @title authController
 * @dev Handles user signup and login, integrating Prime Chain Indexing and secure authentication.
 */
exports.signup = async (req, res) => {
  try {
    const { username, password, privateKey } = req.body;

    // Validate input
    if (!username || !password || !privateKey) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Derive public key from private key using ethers.js
    let wallet;
    try {
      wallet = new ethers.Wallet(privateKey);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid private key' });
    }

    const publicKey = wallet.address;

    // Create new user with public key
    user = new User({ username, password, publicKey });
    await user.save();

    const token = jwt.sign({ id: user._id, roles: user.roles }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(201).json({ token, user: { id: user._id, username: user.username, publicKey: user.publicKey } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT including user roles
    const token = jwt.sign({ id: user._id, roles: user.roles }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token, user: { id: user._id, username: user.username, publicKey: user.publicKey } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};
