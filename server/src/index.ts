import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json';

import path from 'path';
import fs from 'fs';

import authRoutes from './routes/authRoutes';
import tripRoutes from './routes/tripRoutes';
import bookingRoutes from './routes/bookingRoutes';
import operatorRoutes from './routes/operatorRoutes';
import adminRoutes from './routes/adminRoutes';
import prisma from './prisma';
import { seedDatabase } from './services/seedService';

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 5000;

// Security and middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Swagger UI to load resources smoothly
  })
);

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json());

// Rate limiter for API safety
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Rova Bus Booking API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Swagger API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/api/docs.json', (_req, res) => {
  res.json(swaggerDocument);
});

// Mount application routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/operator', operatorRoutes);
app.use('/api/admin', adminRoutes);

// Serve client static build if present
const clientDistPath = path.resolve(__dirname, '../../client/dist');
const altClientDistPath = path.resolve(__dirname, '../client/dist');
const finalDistPath = fs.existsSync(clientDistPath) ? clientDistPath : fs.existsSync(altClientDistPath) ? altClientDistPath : null;

if (finalDistPath) {
  app.use(express.static(finalDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(finalDistPath, 'index.html'));
  });
} else {
  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint not found' });
  });
}

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    console.log(`🚀 Rova Server is running at http://localhost:${PORT}`);
    console.log(`📑 OpenAPI / Swagger Docs available at http://localhost:${PORT}/api/docs`);
    try {
      const demoUser = await prisma.user.findUnique({ where: { email: 'gozal@example.com' } });
      if (!demoUser) {
        console.log('🌱 Demo accounts not detected. Auto-seeding database...');
        await seedDatabase(prisma);
        console.log('✅ Demo accounts seeded successfully.');
      }
    } catch (e) {
      console.error('Auto-seed check error:', e);
    }
  });
}

export default app;
