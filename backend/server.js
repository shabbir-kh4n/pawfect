const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/pets', require('./routes/petRoutes'));
app.use('/api/records', require('./routes/healthRecordRoutes'));
app.use('/api/adoption', require('./routes/adoptionRoutes'));
app.use('/api/services', require('./routes/vetRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Pawfect Care API is running!' });
});

// Port configuration
const PORT = process.env.PORT || 5001;

// Start server
app.listen(PORT, () => {
  console.log(`🐾 Pawfect Care server is running on port ${PORT}`);
});
