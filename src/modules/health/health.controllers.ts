import { NextFunction, Request, Response } from 'express';
import * as healthService from '@/modules/health/health.services';

/**
 * Get Health Status
 */
export const getHealthStatus = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const health = await healthService.pingDB();
    res.status(200).json(health);
  } catch (error) {
    next(error);
  }
};
