// controllers/qrngController.js

const axios = require('axios');

exports.getDiscount = async (req, res) => {
  try {
    // Fetch a quantum random number from an external API
    const response = await axios.get('https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint8');
    const randomNumber = response.data.data[0] / 255;

    const discount = randomNumber > 0.8 ? 0.8 : 1; // 20% discount if randomNumber > 0.8
    res.json({ discount });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching QRNG discount' });
  }
};
