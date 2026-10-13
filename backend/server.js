const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/database');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      // If FRONTEND_URL is '*', allow all
      if (process.env.FRONTEND_URL === '*') {
        return callback(null, true);
      }

      // Check against allowed origins or Netlify domains
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /\.netlify\.app$/.test(origin) ||
        origin.startsWith('http://localhost:');

      if (isAllowed) {
        return callback(null, true);
      } else {
        return callback(new Error(`CORS Error: Origin ${origin} not allowed by Access-Control-Allow-Origin`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (in non-test environments)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint for Render monitoring
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Student Information Management System API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    database: 'connected',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/students', studentRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Base URL: http://localhost:${PORT}`);
  console.log(`===============================================`);
});

module.exports = app;
