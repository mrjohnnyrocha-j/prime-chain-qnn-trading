// models/App.js

const mongoose = require('mongoose');

const AppSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: String,
  icon: String,
  category: String,
  jtmlContent: String,
  dateAdded: { type: Date, default: Date.now },
  ratings: [Number],
  popularity: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
});

module.exports = mongoose.model('App', AppSchema);
