import express from 'express';
import { getHealthStatus } from '@/modules/health/health.controllers';

const router = express.Router();

router.get('/', getHealthStatus);

export default router;
