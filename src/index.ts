import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { errorHandler } from '@/middlewares/errorHandler';

/**
 * Importación de rutas
 */
import healthRoutes from '@/modules/health/health.routes';

/**
 * Host config
 */
dotenv.config();
const host = process.env.HOST ? String(process.env.HOST) : '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const prefix = process.env.API_PREFIX ? String(process.env.API_PREFIX) : '';

/**
 * Creación de Express App
 */
const app = express();

/**
 * Middlewares
 */
app.use(errorHandler);
app.use(cors());
app.use(express.json());

/**
 * Rutas
 */
app.use(`${prefix}/health`, healthRoutes);

/**
 * Runtime
 */
app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});
