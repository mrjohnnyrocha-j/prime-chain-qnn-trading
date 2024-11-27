// models/Review.js

const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  app: { type: mongoose.Schema.Types.ObjectId, ref: 'App', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true },
  comment: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', ReviewSchema);
