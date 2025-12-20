import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import quotesRouter from './routes/quotes.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-quotation';

// Create uploads directory if it doesn't exist
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`✓ Created uploads directory: ${uploadDir}`);
}

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
  })
);

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use('/api/quotes', quotesRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Error Handler]', err);

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

/**
 * Connect to MongoDB and start server
 */
async function startServer() {
  try {
    // Connect to MongoDB
    console.log('[MongoDB] Connecting to:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI, {
      retryWrites: true,
      w: 'majority',
    });
    console.log('✓ MongoDB connected');

    // Start Express server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════╗
║   AI Manufacturing Quotation System             ║
║   Environment: ${process.env.NODE_ENV || 'development'}
║   Server running on port ${PORT}
║   Database: MongoDB
║   Uploads: ${uploadDir}
╚════════════════════════════════════════════════╝

Available endpoints:
  POST   /api/quotes/upload          - Upload drawing and generate quote
  GET    /api/quotes/:quoteId        - Fetch quote
  PUT    /api/quotes/:quoteId/status - Update quote status
  POST   /api/quotes/batch           - Batch process drawings
  GET    /health                     - Health check

API Documentation:
  http://localhost:${PORT}/api-docs (coming soon)
      `);
    });
  } catch (error) {
    console.error('[Fatal Error] Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n[Server] Shutting down gracefully...');
  await mongoose.disconnect();
  process.exit(0);
});

// Start the server
startServer();

export default app;
