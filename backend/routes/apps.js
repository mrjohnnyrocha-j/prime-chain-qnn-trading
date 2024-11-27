// routes/apps.js

const express = require('express');
const router = express.Router();
const { getApps, addApp, getAppById, submitReview, getReviews } = require('../controllers/appController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', getApps);
router.post('/', authMiddleware, addApp); // Admin only, implement admin check
router.get('/:id', getAppById);
router.post('/:id/reviews', authMiddleware, submitReview);
router.get('/:id/reviews', getReviews);

module.exports = router;
