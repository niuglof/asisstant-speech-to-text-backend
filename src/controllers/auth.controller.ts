import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { authConfig } from '../config/auth';
import { CustomError } from '../middleware/error.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';
import { setCache, deleteCache } from '../config/redis';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      logger.info('Login attempt started', {
        email,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
        authConfig: {
          jwtSecretExists: !!process.env.JWT_SECRET,
          jwtExpiresIn: process.env.JWT_EXPIRES_IN || 'default',
          nodeEnv: process.env.NODE_ENV,
          saltRounds: authConfig.bcrypt.saltRounds
        }
      });

      // Verify user credentials
      const user = await User.verifyPassword(email, password);
      if (!user) {
        logger.warn('Login failed - Invalid credentials', {
          email,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          timestamp: new Date().toISOString()
        });
        throw new CustomError('Invalid credentials', 401);
      }

      logger.info('User credentials verified successfully', {
        userId: user.id,
        email: user.email,
        tenantId: user.tenant_id,
        role: user.role
      });

      // Generate JWT token
      logger.info('Generating JWT token', {
        userId: user.id,
        email: user.email,
        jwtConfig: {
          expiresIn: authConfig.jwt.expiresIn,
          issuer: authConfig.jwt.issuer,
          audience: authConfig.jwt.audience,
          secretExists: !!authConfig.jwt.secret
        }
      });

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          tenantId: user.tenant_id,
        }
        ,
        authConfig.jwt.secret as string,
        { 
          expiresIn: authConfig.jwt.expiresIn,
          issuer: authConfig.jwt.issuer,
          audience: authConfig.jwt.audience,
        } as jwt.SignOptions
      );

      logger.info('JWT token generated successfully', {
        userId: user.id,
        email: user.email,
        tokenLength: token.length
      });
      // Cache user session
      try {
        await setCache(`user:${user.id}`, user, 24 * 60 * 60); // 24 hours
        logger.info('User session cached successfully', {
          userId: user.id,
          cacheKey: `user:${user.id}`,
          cacheTTL: '24 hours'
        });
      } catch (cacheError) {
        logger.error('Failed to cache user session', {
          userId: user.id,
          error: cacheError,
          cacheKey: `user:${user.id}`
        });
        // Don't throw error, continue with login
      }

      logger.info('User logged in successfully', {
        userId: user.id,
        email: user.email,
        tenantId: user.tenant_id,
      });

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          tenantId: user.tenant_id,
          specialization: user.specialization,
          avatarUrl: user.avatar_url,
        },
      });
    } catch (error) {
      logger.error('Login process failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        email: req.body?.email,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      });
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        role,
        tenantId,
        specialization,
        licenseNumber,
        phone,
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        throw new CustomError('User with this email already exists', 409);
      }

      // Create new user
      const newUser = await User.create({
        tenant_id: tenantId,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        role,
        specialization,
        license_number: licenseNumber,
        phone,
      });

      logger.info('New user registered', {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        tenantId: newUser.tenant_id,
      });

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          role: newUser.role,
          tenantId: newUser.tenant_id,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user) {
        // Remove user session from cache
        await deleteCache(`user:${req.user.id}`);
        
        logger.info('User logged out', {
          userId: req.user.id,
          email: req.user.email,
        });
      }

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;
      
      if (!token) {
        throw new CustomError('Refresh token required', 400);
      }

      const decoded = jwt.verify(token, authConfig.jwt.secret) as any;
      const user = await User.findById(decoded.userId);

      if (!user || !user.is_active) {
        throw new CustomError('Invalid refresh token', 401);
      }

      // Generate new token
      const newToken = jwt.sign(
        { 
          userId: user.id,
          email: user.email,
          tenantId: user.tenant_id,
          role: user.role,
        },
        authConfig.jwt.secret,
        { 
          expiresIn: authConfig.jwt.expiresIn,
          issuer: authConfig.jwt.issuer,
          audience: authConfig.jwt.audience,
        }as jwt.SignOptions
      );

      res.json({
        message: 'Token refreshed successfully',
        token: newToken,
      });
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      
      const user = await User.findByEmail(email);
      if (!user) {
        // Don't reveal if email exists or not
        res.json({ message: 'If the email exists, a password reset link has been sent' });
        return;
      }

      // Generate password reset token (implement this method in User model)
      // const resetToken = await User.generatePasswordResetToken(user.id);
      
      // Send email with reset link (implement email service)
      // await EmailService.sendPasswordReset(user.email, resetToken);

      logger.info('Password reset requested', {
        userId: user.id,
        email: user.email,
      });

      res.json({ message: 'If the email exists, a password reset link has been sent' });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token: _token, password: _password  } = req.body;
      
      // Verify reset token and get user (implement this method)
      // const user = await User.verifyPasswordResetToken(token);
      
      // if (!user) {
      //   throw new CustomError('Invalid or expired reset token', 400);
      // }

      // Change password
      // await User.changePassword(user.id, password);

      logger.info('Password reset completed', {
        // userId: user.id,
      });

      res.json({ message: 'Password reset successful' });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!req.user) {
        throw new CustomError('Authentication required', 401);
      }

      // Verify current password
      const user = await User.verifyPassword(req.user.email, currentPassword);
      if (!user) {
        throw new CustomError('Current password is incorrect', 400);
      }

      // Change password
      await User.changePassword(user.id, newPassword);

      logger.info('Password changed', {
        userId: user.id,
        email: user.email,
      });

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async getCurrentUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new CustomError('Authentication required', 401);
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        throw new CustomError('User not found', 404);
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          tenantId: user.tenant_id,
          specialization: user.specialization,
          licenseNumber: user.license_number,
          phone: user.phone,
          avatarUrl: user.avatar_url,
          workingHours: user.working_hours,
          lastLogin: user.last_login,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;
      
      if (!token) {
        throw new CustomError('Token required', 400);
      }

      const decoded = jwt.verify(token, authConfig.jwt.secret) as any;
      const user = await User.findById(decoded.userId);

      if (!user || !user.is_active) {
        throw new CustomError('Invalid token', 401);
      }

      res.json({
        valid: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          tenantId: user.tenant_id,
        },
      });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ valid: false, error: 'Token expired' });
        return;
      }
      
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ valid: false, error: 'Invalid token' });
        return;
      }

      next(error);
    }
  }
}