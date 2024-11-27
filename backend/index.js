// index.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tokens', require('./routes/tokens'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/apps', require('./routes/apps'));
app.use('/api/users', require('./routes/users'));
app.use('/api/qrng', require('./routes/qrng'));
app.use('/api', require('./routes/walletRoutes'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
