const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');
const { initializeSocket } = require('./socket');

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

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
app.use('/api/adoption-requests', require('./routes/adoptionRequestRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Pawfect Care API is running!' });
});

// Port configuration
const PORT = process.env.PORT || 5001;

// Start server
server.listen(PORT, () => {
  console.log(`🐾 Pawfect Care server is running on port ${PORT}`);
});
