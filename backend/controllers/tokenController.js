// controllers/tokenController.js

const User = require('../models/User');
const TokenTransaction = require('../models/TokenTransaction');
const Web3 = require('web3');

exports.buyTokens = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, transactionHash } = req.body;

    // Verify transaction on the blockchain (simplified)
    // You should implement proper verification here
    const web3 = new Web3(process.env.INFURA_URL);
    const receipt = await web3.eth.getTransactionReceipt(transactionHash);

    if (!receipt || receipt.status !== true) {
      return res.status(400).json({ message: 'Invalid transaction' });
    }

    // Update user's token balance
    const user = await User.findById(userId);
    user.tokenBalance += amount;
    await user.save();

    // Record the transaction
    const tokenTransaction = new TokenTransaction({
      user: userId,
      amount,
      type: 'buy',
    });
    await tokenTransaction.save();

    res.json({ message: 'Tokens purchased successfully', tokenBalance: user.tokenBalance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTokenBalance = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('tokenBalance');
    res.json({ tokenBalance: user.tokenBalance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
