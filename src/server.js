import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerSetup from './swagger.js';
import yaml from 'js-yaml';
import fs from 'fs';
import prisma from './prismaClient.js';
import authRoutes from './routes/authRoutes.js';
import venueRoutes from './routes/venueRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

const app = express();
const PORT = process.env.PORT || 8000;

// ✅ Connect to Prisma
(async () => {
  try {
    await prisma.$connect();
    console.log('Prisma connected successfully');
  } catch (err) {
    console.error('Prisma connection failed:', err);
  }
})();

// ✅ Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') app.use(morgan('tiny'));

// ✅ Initialize Swagger UI
swaggerSetup(app);

// ✅ Load Swagger spec safely
let specs = {};
try {
  specs = yaml.load(fs.readFileSync('./openapi.yaml', 'utf8'));
} catch (error) {
  console.warn('Warning: Failed to load OpenAPI specification:', error.message);
}
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// ✅ Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

// ✅ Root route for Render health checks
app.get('/', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      database: 'connected',
      message: 'Event‑Management‑API is running. Use /api-docs for endpoints.'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      message: 'Server is up but database connection failed.'
    });
  }
});

// ✅ Handle favicon requests gracefully
app.get('/favicon.ico', (req, res) => res.status(204).end());

// ✅ Catch‑all for undefined routes (404)
app.all('*', (req, res) => {
  res.status(404).json({
    error: {
      message: `Route '${req.originalUrl}' not found. Check /api-docs for available endpoints.`,
      status: 404
    }
  });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: { message: err.message || 'Internal Server Error', status: err.status || 500 }
  });
});

// ✅ Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

export default app;