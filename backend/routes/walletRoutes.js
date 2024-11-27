// backend/src/routes/walletRoutes.js

const express = require('express');
const router = express.Router();
const { createWallet } = require('../walletService');

router.post('/create-wallet', async (req, res) => {
  const { password } = req.body;
  try {
    const walletDetails = await createWallet(password);
    res.json(walletDetails);
  } catch (error) {
    console.error('Error creating wallet:', error);
    res.status(500).json({ error: 'Error creating wallet' });
  }
});

module.exports = router;
