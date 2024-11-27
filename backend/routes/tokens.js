// routes/tokens.js

const express = require('express');
const router = express.Router();
const { buyTokens, getTokenBalance } = require('../controllers/tokenController');
const { authMiddleware } = require('../middleware/auth');

router.post('/buy', authMiddleware, buyTokens);
router.get('/balance', authMiddleware, getTokenBalance);

module.exports = router;
