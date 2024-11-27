// controllers/userController.js

const User = require('../models/User');
const App = require('../models/App');

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    if (userId !== req.params.id) return res.status(403).json({ message: 'Forbidden' });

    const user = await User.findById(userId).populate('favorites');
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    if (userId !== req.params.id) return res.status(403).json({ message: 'Forbidden' });

    const { appId } = req.body;
    const user = await User.findById(userId);
    const index = user.favorites.indexOf(appId);

    if (index > -1) {
      // Remove from favorites
      user.favorites.splice(index, 1);
      resMessage = 'Removed from favorites';
    } else {
      // Add to favorites
      user.favorites.push(appId);
      resMessage = 'Added to favorites';
    }

    await user.save();
    res.json({ message: resMessage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
