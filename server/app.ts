import express from 'express';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes';
import storesRoutes from './routes/stores.routes';
import couponsRoutes from './routes/coupons.routes';
import categoriesRoutes from './routes/categories.routes';
import analyticsRoutes from './routes/analytics.routes';
import importRoutes from './routes/import.routes';
import { errorHandler } from './middleware/error.middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createApp = () => {
  const app = express();

  app.use(cors({
    origin: true,
    credentials: true,
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(session({
    secret: process.env.SESSION_SECRET || 'aqwacode-super-secret-key-2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
  }));

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/stores', storesRoutes);
  app.use('/api/coupons', couponsRoutes);
  app.use('/api/categories', categoriesRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/import', importRoutes);

  // Serve static files from Vite dist in production
  const distPath = path.resolve(__dirname, '../dist');
  app.use(express.static(distPath));

  // SPA fallback for non-API routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.resolve(distPath, 'index.html'), (err) => {
      if (err) {
        res.status(404).send('Application build not found. Please run npm run build.');
      }
    });
  });

  app.use(errorHandler);

  return app;
};
