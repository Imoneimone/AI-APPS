const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Enhanced request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - IP: ${req.ip}`);
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] ${res.statusCode} ${res.statusMessage}`);
  });
  next();
});

app.use(cors({
  origin: [
    'https://ai-apps-alpha.vercel.app',
    'http://localhost:3000',
    'https://ai-apps-production.up.railway.app',
    'https://ai-apps-frontend.vercel.app' // Add production frontend URL
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // 24-hour preflight cache
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic middleware to ensure server is processing requests
app.use((req, res, next) => {
  console.log('Request received:', req.path);
  next();
});

// Root endpoint with explicit headers
app.get('/', (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      message: 'Welcome to AI Apps API',
      status: 'running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      frontend: 'https://ai-apps-alpha.vercel.app'
    });
  } catch (error) {
    console.error('Root endpoint error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  try {
    const healthData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      server: {
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
        platform: process.platform,
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
        }
      }
    };

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(healthData);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      error: 'Health Check Failed',
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: 'Not Found', 
    path: req.path,
    method: req.method 
  });
});

app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://ai-apps-production.up.railway.app"]
    }
  }
}));

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});