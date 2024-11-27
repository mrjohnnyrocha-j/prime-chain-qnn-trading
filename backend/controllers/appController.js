// controllers/appController.js

const App = require('../models/App');
const Review = require('../models/Review');

exports.getApps = async (req, res) => {
  try {
    const apps = await App.find();
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addApp = async (req, res) => {
  try {
    const { name, url, icon, category, jtmlContent } = req.body;

    const newApp = new App({
      name,
      url,
      icon,
      category,
      jtmlContent,
    });

    await newApp.save();
    res.json({ message: 'App added successfully', app: newApp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAppById = async (req, res) => {
  try {
    const app = await App.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'App not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.submitReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const appId = req.params.id;
    const { rating, comment } = req.body;

    const newReview = new Review({
      app: appId,
      user: userId,
      rating,
      comment,
    });

    await newReview.save();

    // Update app ratings
    const app = await App.findById(appId);
    app.ratings.push(rating);
    app.reviews.push(newReview._id);
    await app.save();

    res.json({ message: 'Review submitted', review: newReview });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ app: req.params.id }).populate('user', 'username');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
