// routes/users.js

const express = require('express');
const router = express.Router();
const { getFavorites, toggleFavorite } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

router.get('/:id/favorites', authMiddleware, getFavorites);
router.post('/:id/favorites', authMiddleware, toggleFavorite);

module.exports = router;
