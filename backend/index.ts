import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config/config';

// Import routes
import imageRoutes from './routes/imageRoutes';
import dataRoutes from './routes/dataRoutes';

const app = express();

// Middleware
app.use(cors({
  origin: config.allowedOrigins,
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// API routes
app.use('/api/image', imageRoutes);
app.use('/api/data', dataRoutes);

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export default app;
