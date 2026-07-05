import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Route imports
import authRoutes from './server/routes/authRoutes.js';
import userRoutes from './server/routes/userRoutes.js';
import cmsRoutes from './server/routes/cmsRoutes.js';
import serviceRoutes from './server/routes/serviceRoutes.js';
import galleryRoutes from './server/routes/galleryRoutes.js';
import teamRoutes from './server/routes/teamRoutes.js';
import testimonialRoutes from './server/routes/testimonialRoutes.js';
import settingsRoutes from './server/routes/settingsRoutes.js';
import journeyRoutes from './server/routes/journeyRoutes.js';
import partnersRoutes from './server/routes/partnersRoutes.js';
import { errorHandler } from './server/middleware/errorHandler.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase body parser limits to support base64 image uploads securely
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Serve static files from uploads folder
  const uploadsPath = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsPath));

  // API Routes Setup
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // DB and Auth import for audit logs
  const { db } = await import('./server/db/json-db.js');
  const { authMiddleware } = await import('./server/middleware/authMiddleware.js');

  app.get('/api/audit-logs', authMiddleware as any, (req: any, res: any) => {
    try {
      const logs = db.list('audit_logs');
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve audit logs.' });
    }
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/cms', cmsRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/gallery', galleryRoutes);
  app.use('/api/team', teamRoutes);
  app.use('/api/testimonials', testimonialRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/journey', journeyRoutes);
  app.use('/api/partners', partnersRoutes);

  // Global Error Handler for API routes
  app.use(errorHandler);

  // Vite Integration
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    console.log('Starting Express server in DEVELOPMENT mode with Vite middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    // Use vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    console.log('Starting Express server in PRODUCTION mode...');
    const distPath = path.join(process.cwd(), 'dist');
    // Serve static files from the dist directory
    app.use(express.static(distPath));
    // Serve index.html for all other routes (SPA fallback)
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RB Associates server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start RB Associates full-stack server:', err);
});
