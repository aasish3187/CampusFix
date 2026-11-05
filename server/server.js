require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDatabase = require('./config/db');

const app = express();

const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:')
      ) {
        return callback(null, true);
      }
      callback(null, true);
    },
    credentials: true
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/api/v1/health', (req, res) =>
  res.json({ status: 'ok', service: 'CampusFix API', timestamp: new Date().toISOString() })
);

app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/tickets', require('./routes/ticketRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));
app.use('/api/v1', require('./routes/miscRoutes'));

// 404 handler for undefined API routes
app.use('/api/v1', (req, res) => {
  res.status(404).json({ message: `API route ${req.originalUrl} not found.` });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: Object.values(err.errors)
        .map((e) => e.message)
        .join(' ')
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid identifier: ${err.value}` });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'record';
    return res.status(409).json({ message: `A ${field} with that value already exists.` });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid authentication token.' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Your session has expired. Please sign in again.' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'An unexpected server error occurred.'
  });
});

const PORT = process.env.PORT || 5000;
connectDatabase()
  .then(() => {
    app.listen(PORT, () => console.log(`CampusFix API listening on port ${PORT} (MongoDB Connected)`));
  })
  .catch((error) => {
    console.warn(`Local MongoDB not found (${error.message}).`);
    console.log('⚡ Starting CampusFix API in 100% Standalone ByteXL Nimbus Mode (In-Memory Database)...');
    
    // Create standalone Express app for in-memory mode
    const standaloneApp = express();
    standaloneApp.use(cors({ origin: true, credentials: true }));
    standaloneApp.use(express.json({ limit: '50mb' }));
    standaloneApp.use(express.urlencoded({ extended: true, limit: '50mb' }));
    standaloneApp.get('/api/v1/health', (req, res) =>
      res.json({ status: 'ok', service: 'CampusFix API (ByteXL In-Memory Mode)', timestamp: new Date().toISOString() })
    );
    standaloneApp.use('/api/v1', require('./inMemoryRouter'));

    standaloneApp.listen(PORT, () => console.log(`🚀 CampusFix API listening on port ${PORT} (ByteXL Native Mode - No external MongoDB needed!)`));
  });
