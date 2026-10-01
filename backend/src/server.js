import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { connectDB, isDbConnected } from './config/db.js';
import { isCloudinaryConfigured } from './config/cloudinary.js';
import { isGeminiConfigured } from './config/gemini.js';
import visionRoutes from './routes/visionRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { notFound, errorHandler } from './middleware/validate.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '5050', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';

// Warn early if auth cannot work securely
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
  console.warn('⚠️  JWT_SECRET missing or too short. Auth tokens will fail — set JWT_SECRET (>=16 chars) in backend/.env');
}

// Trust proxy (needed for rate-limit + secure cookies behind Render/Vercel/Nginx)
app.set('trust proxy', 1);

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(compression());

// CORS — whitelist in production, permissive in dev
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // curl / mobile / same-origin
    if (!isProd || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return cb(null, true);
    }
    return cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(morgan(isProd ? 'combined' : 'dev'));

// Global API rate limit (generous; tighter limits live on auth/AI routes)
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false
}));

// Health and Diagnostics
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    env: NODE_ENV,
    timestamp: new Date().toISOString(),
    services: {
      geminiVision: isGeminiConfigured ? 'active' : 'fallback_mode',
      cloudinary: isCloudinaryConfigured ? 'active' : 'fallback_data_uri',
      database: isDbConnected() ? 'mongodb' : 'in_memory',
      auth: process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 16 ? 'jwt_ready' : 'jwt_misconfigured'
    }
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/vision', visionRoutes);
app.use('/api/recipes', recipeRoutes);

// Root greeting (API info in dev; SPA serves index in prod below)
app.get('/api', (req, res) => {
  res.json({ message: 'Fridge to Table API is running. Check /api/health for system status.' });
});

// ---- Production: serve built frontend ----
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
if (isProd && fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist, { maxAge: '1d', index: false }));
  // SPA fallback — but never swallow /api routes
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'Fridge to Table API is running. Check /api/health for system status.'
    });
  });
}

app.use(notFound);
app.use(errorHandler);

// Start server (skip when imported for tests)
const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT,"0.0.0.0", () => {
    console.log(`🚀 Fridge to Table API (${NODE_ENV}) running on http://localhost:${PORT}`);
    console.log(`   - Gemini Vision: ${isGeminiConfigured ? 'Connected' : 'Fallback Engine'}`);
    console.log(`   - Cloudinary: ${isCloudinaryConfigured ? 'Connected' : 'Fallback Data URI'}`);
    console.log(`   - Database: ${isDbConnected() ? 'MongoDB' : 'In-Memory Store'}`);
  });

  const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  return server;
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
