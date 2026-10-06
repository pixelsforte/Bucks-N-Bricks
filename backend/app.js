import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import apiV1Routes from './routes/index.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { notFoundMiddleware } from './middleware/notFoundMiddleware.js';
import { logger } from './utils/logger.js';

export const createApp = async () => {
  const app = express();
  app.set('trust proxy', 1);

  // 1. Security Headers via Helmet (Content-Security-Policy enabled)
  const isProduction = process.env.NODE_ENV === 'production';
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          // Vite dev server needs inline/eval scripts; production stays strict
          scriptSrc: isProduction ? ["'self'"] : ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
          imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
          // Vite hot-reload uses websockets in development
          connectSrc: isProduction ? ["'self'"] : ["'self'", 'ws:', 'wss:'],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'self'"],
          upgradeInsecureRequests: isProduction ? [] : null,
        },
      },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // 2. Rate Limiting Middleware
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Limit each IP to 300 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    validate: {
      xForwardedForHeader: false,
      forwardedHeader: false,
    },
    message: {
      success: false,
      statusCode: 429,
      message: 'Too many requests from this IP, please try again after 15 minutes.',
    },
  });
  app.use('/api/', limiter);

  // 3. CORS Configuration
  const allowedOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const corsOptions = {
    origin: (origin, callback) => {
      // Allow non-browser/same-origin requests that do not send Origin
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  };
  app.use(cors(corsOptions));

  // 4. Request Body Parsing Middlewares
  app.use(express.json({ limit: '16kb' }));
  app.use(express.urlencoded({ extended: true, limit: '16kb' }));

  // 5. Static Uploads Folder
  const uploadsPath = path.join(process.cwd(), 'backend', 'uploads');
  const uploadsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    validate: {
      xForwardedForHeader: false,
      forwardedHeader: false,
    },
  });
  app.use('/uploads', uploadsLimiter, express.static(uploadsPath));

  // 6. Basic Request Logging Middleware
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.originalUrl}`);
    next();
  });

  // 7. Mount API v1 Routes
  app.use('/api/v1', apiV1Routes);

  // 8. 404 Route Not Found Handler for API endpoints
  app.use('/api/*', limiter, notFoundMiddleware);

  // 9. Development Vite Integration / Production SPA
  if (process.env.NODE_ENV !== 'production') {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      logger.warn(`Vite middleware setup notice: ${err.message}`);
    }
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    const pageLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
      validate: {
        xForwardedForHeader: false,
        forwardedHeader: false,
      },
    });
    app.get('*', pageLimiter, (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 10. Centralized Global Error Handler
  app.use(errorMiddleware);

  return app;
};
