import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { connectDB, closeDB } from './src/config/db.js';

const PORT = process.env.PORT || 5000;

// Catch unhandled exceptions before anything else
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err.name, err.message);
  console.error(err.stack);
  // In production, keep running or cleanly exit
});

let server;

const startServer = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
    } else {
      console.warn('[WARNING] MONGODB_URI is not set. Database operations will fail until provided.');
    }

    server = app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`  DevPulse Backend Engine Running`);
      console.log(`  Port: http://localhost:${PORT}`);
      console.log(`  Health: http://localhost:${PORT}/api/v1/health`);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('[ERROR] Unhandled Promise Rejection:', err);
  // Keep server alive or log
});

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      console.log('[Server] HTTP server closed.');
      await closeDB();
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
