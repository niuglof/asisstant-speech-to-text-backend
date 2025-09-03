import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  error: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const { statusCode = 500, message, stack } = error;

  logger.error('Error occurred:', {
    error: message,
    statusCode,
    stack: process.env.NODE_ENV === 'development' ? stack : undefined,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Don't expose sensitive error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const errorResponse = {
    error: message || 'Internal Server Error',
    ...(isDevelopment && { stack }),
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  res.status(statusCode).json(errorResponse);
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: 'Resource not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
}

export function validationErrorHandler(error: any): CustomError {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err: any) => err.message);
    return new CustomError(`Validation Error: ${messages.join(', ')}`, 400);
  }
  
  if (error.code === '23505') { // PostgreSQL unique violation
    return new CustomError('Resource already exists', 409);
  }
  
  if (error.code === '23503') { // PostgreSQL foreign key violation
    return new CustomError('Referenced resource not found', 400);
  }

  if (error.code === '23502') { // PostgreSQL not null violation
    return new CustomError('Required field missing', 400);
  }

  return error;
}