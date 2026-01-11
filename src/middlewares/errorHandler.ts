import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/lib/appError';

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const isKnownError = err instanceof AppError;
  const statusCode = isKnownError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${statusCode}, - ${message}`);

  res.status(statusCode).json({
    status: 'error',
    message,
  });
};
