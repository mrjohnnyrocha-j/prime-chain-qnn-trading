// controllers/taskController.js

const User = require('../models/User');
const TokenTransaction = require('../models/TokenTransaction');

exports.completeTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.body;

    // Implement task completion logic
    // For simplicity, we'll assume the task is always valid

    // Reward tokens
    const rewardAmount = 10; // Define your reward logic
    const user = await User.findById(userId);
    user.tokenBalance += rewardAmount;
    await user.save();

    // Record the transaction
    const tokenTransaction = new TokenTransaction({
      user: userId,
      amount: rewardAmount,
      type: 'reward',
    });
    await tokenTransaction.save();

    res.json({ message: 'Task completed', tokenBalance: user.tokenBalance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
