import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { CustomError } from './error.middleware';
import { logger } from '../utils/logger';

export function validationMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);
  
  logger.info('Validation middleware check', {
    path: req.path,
    method: req.method,
    hasErrors: !errors.isEmpty(),
    errorCount: errors.array().length,
    body: req.body,
    timestamp: new Date().toISOString()
  });
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value,
    }));

    const errorMessage = errorMessages.map(err => `${err.field}: ${err.message}`).join(', ');
    
    logger.warn('Validation failed', {
      path: req.path,
      method: req.method,
      errors: errorMessages,
      errorMessage,
      body: req.body,
      timestamp: new Date().toISOString()
    });
    
    throw new CustomError(`Validation failed: ${errorMessage}`, 400);
  }
  
  logger.info('Validation passed', {
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  next();
}