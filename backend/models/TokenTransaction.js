// models/TokenTransaction.js

const mongoose = require('mongoose');

const TokenTransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['buy', 'reward'], required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TokenTransaction', TokenTransactionSchema);
