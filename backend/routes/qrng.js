// routes/qrng.js

const express = require('express');
const router = express.Router();
const { getDiscount } = require('../controllers/qrngController');

router.get('/discount', getDiscount);

module.exports = router;
