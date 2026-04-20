const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // ✅ ADDED
require('dotenv').config();

const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transaction');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'EcoTrack AI Backend Running', timestamp: new Date() });
});

// ✅ Serve frontend build (ADD BEFORE app.get("*"))
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// ✅ Handle React routes (MUST BE LAST ROUTE)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecotrack')
  .then(() => {
    console.log('✅ MongoDB Connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });