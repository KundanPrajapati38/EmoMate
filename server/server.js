require('dotenv').config({ path: '../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Serve static assets in production (if needed, but for now we can serve translations and models if we want client to fetch them easily, or client can pack them)
app.use('/static', express.static(path.join(__dirname, '../static')));

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:admin@cluster0.mongodb.net/emomate?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB database successfully!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.log('Starting server without database (mock mode/retrying)...');
    // Still listen to port even if DB connection fails, so user's frontend doesn't break completely immediately
    app.listen(PORT, () => console.log(`Server running on port ${PORT} (Database Offline)`));
  });
