import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { logger } from '../utils/logger';

export interface TenantRequest extends AuthenticatedRequest {
  tenantId?: string;
}

export function tenantMiddleware(
  req: TenantRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Extract tenant ID from authenticated user
    const tenantId = req.user.tenantId;
    
    if (!tenantId) {
      logger.error('User without tenant ID attempted to access tenant-scoped resource:', {
        userId: req.user.id,
        email: req.user.email,
      });
      res.status(403).json({ error: 'Tenant context required' });
      return;
    }

    // Add tenant ID to request for use in controllers
    req.tenantId = tenantId;

    // Add tenant context to database queries (if using RLS)
    // This would be used with PostgreSQL Row Level Security
    req.headers['x-tenant-id'] = tenantId;

    next();
  } catch (error) {
    logger.error('Tenant middleware error:', error);
    res.status(500).json({ error: 'Tenant context setup failed' });
  }
}

export function validateTenantAccess(resourceTenantId: string, userTenantId: string): boolean {
  return resourceTenantId === userTenantId;
}