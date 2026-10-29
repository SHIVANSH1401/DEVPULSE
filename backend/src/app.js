import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { AppError } from './utils/AppError.js';

const app = express();

// Middlewares
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, postman, serverless internal)
      if (!origin) return callback(null, true);
      // Allow any vercel preview URL or matching origins
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in deployment to avoid CORS blockers
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Auto-connect database middleware for serverless invocations
app.use(async (req, res, next) => {
  try {
    if (process.env.MONGODB_URI && mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    next();
  } catch (error) {
    console.error('Database connection middleware failed:', error.message);
    next(error);
  }
});

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    success: true,
    status: 'UP',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Root welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'DevPulse API',
    version: '1.0.0',
    health: '/api/v1/health',
    docs: 'https://github.com/SHIVANSH1401/devpulse',
  });
});

// Mount API routes
app.use('/api/v1/workspaces', workspaceRoutes);
app.use('/api/v1/tasks', taskRoutes);

// Catch-all for undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find route ${req.originalUrl} on this server`, 404, 'ROUTE_NOT_FOUND'));
});

// Centralized Error Handling Pipeline
app.use(errorHandler);

export default app;
