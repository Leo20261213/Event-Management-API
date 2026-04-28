import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import fs from 'fs';

import prisma from './prismaClient.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import venueRoutes from './routes/venueRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import userRoutes from './routes/userRoutes.js'; // ✅ ensure this file exists

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// --- Connect to Prisma ---
(async () => {
  try {
    await prisma.$connect();
    console.log('Prisma connected successfully');
  } catch (err) {
    console.error('Prisma connection failed:', err);
  }
})();

// --- Swagger setup ---
const openapiPath = './openapi.yaml';
if (fs.existsSync(openapiPath)) {
  const openapiDocument = yaml.load(fs.readFileSync(openapiPath, 'utf8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));
  console.log(`Loaded OpenAPI file at: ${openapiPath}`);
} else {
  console.warn('OpenAPI file not found at:', openapiPath);
}

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes); // ✅ mounts /api/users/me

// --- Default route ---
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: `Route '${req.originalUrl}' not found. Check /api-docs for available endpoints.`,
      status: 404
    }
  });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;