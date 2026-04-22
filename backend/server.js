// backend/server.js
require('dotenv').config(); // Load .env variables FIRST
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./Routes/auth.routes');
const postRoutes = require('./Routes/post.routes');
const commentRoutes = require('./Routes/comment.routes');
const adminRoutes = require('./Routes/admin.routes');

const app = express();

// Connect to MongoDB
connectDB();

// ── Middleware ─────────────────────────────────────────────────
// Allow local development and the deployed frontend to call this server
const allowedOrigins = [
  'http://localhost:3000',
  'https://thefolio.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// Serve uploaded image files as public URLs
// e.g., http://localhost:5000/uploads/my-image.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

// ── Default route (optional) ──────────────────────────────────
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ── Global Error Handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

// ── Start Server ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
