import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
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
 * CORS Config
 */
const allowedOriginsEnv = process.env.CORS_ORIGIN ?? '';
const allowedOrigins = new Set(
  allowedOriginsEnv.split(',').map(o => o.trim()).filter(Boolean)
);

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) {
      // Permite requests desde herramientas como Postman o servidores
      return callback(null, true);
    }
    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS: Origin ${origin} forbidden`));
  },
};

/**
 * Middlewares
 */
app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet({ contentSecurityPolicy: false }));


/**
 * Rutas
 */
app.use(`${prefix}/health`, healthRoutes);

/**
 * Manejador de errores
 */
app.use(errorHandler);

/**
 * Runtime
 */
app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});
