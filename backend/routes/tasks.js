// routes/tasks.js

const express = require('express');
const router = express.Router();
const { completeTask } = require('../controllers/taskController');
const { authMiddleware } = require('../middleware/auth');

router.post('/complete', authMiddleware, completeTask);

module.exports = router;
