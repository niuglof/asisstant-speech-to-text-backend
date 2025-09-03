import { db } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { authConfig } from '../config/auth';
import { logger } from '../utils/logger';

export interface UserData {
  id: string;
  tenant_id: string;
  email: string;
  password_hash?: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'doctor' | 'assistant' | 'receptionist';
  specialization?: string;
  license_number?: string;
  phone?: string;
  avatar_url?: string;
  calendar_id?: string;
  working_hours?: object;
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  tenant_id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'doctor' | 'assistant' | 'receptionist';
  specialization?: string;
  license_number?: string;
  phone?: string;
  calendar_id?: string;
  working_hours?: object;
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  specialization?: string;
  license_number?: string;
  phone?: string;
  avatar_url?: string;
  calendar_id?: string;
  working_hours?: object;
  is_active?: boolean;
}

export class User {
  static async findById(id: string): Promise<UserData | null> {
    const user = await db('users').where({ id }).first();
    return user || null;
  }

  static async findByEmail(email: string): Promise<UserData | null> {
    const user = await db('users').where({ email }).first();
    return user || null;
  }

  static async findByTenant(tenantId: string): Promise<UserData[]> {
    return await db('users')
      .where({ tenant_id: tenantId, is_active: true })
      .orderBy('created_at', 'desc');
  }

  static async create(userData: CreateUserData): Promise<UserData> {
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(userData.password, authConfig.bcrypt.saltRounds);
    
    const newUser = {
      id,
      tenant_id: userData.tenant_id,
      email: userData.email,
      password_hash: hashedPassword,
      first_name: userData.first_name,
      last_name: userData.last_name,
      role: userData.role,
      specialization: userData.specialization,
      license_number: userData.license_number,
      phone: userData.phone,
      calendar_id: userData.calendar_id,
      working_hours: userData.working_hours || {},
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await db('users').insert(newUser);
    const { password_hash, ...userWithoutPassword } = newUser;
    return userWithoutPassword as UserData;
  }

  static async update(id: string, userData: UpdateUserData): Promise<UserData | null> {
    const updateData = {
      ...userData,
      updated_at: new Date(),
    };

    await db('users').where({ id }).update(updateData);
    return await this.findById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db('users').where({ id }).update({
      is_active: false,
      updated_at: new Date(),
    });
    return result > 0;
  }

  static async verifyPassword(email: string, password: string): Promise<UserData | null> {
    logger.info('Starting password verification', { 
      email,
      timestamp: new Date().toISOString()
    });

    try {
      const user = await db('users')
        .where({ email, is_active: true })
        .first();

      if (!user) {
        logger.warn('User not found or inactive', { 
          email,
          timestamp: new Date().toISOString()
        });
        return null;
      }

      if (!user.password_hash) {
        logger.warn('User has no password hash', { 
          email,
          userId: user.id,
          timestamp: new Date().toISOString()
        });
        return null;
      }

      logger.info('User found, comparing password', {
        email,
        userId: user.id,
        tenantId: user.tenant_id,
        role: user.role,
        isActive: user.is_active,
        hasPasswordHash: !!user.password_hash,
        timestamp: new Date().toISOString()
      });

      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        logger.warn('Password comparison failed', { 
          email,
          userId: user.id,
          timestamp: new Date().toISOString()
        });
        return null;
      }

      logger.info('Password verification successful', {
        email,
        userId: user.id,
        tenantId: user.tenant_id,
        role: user.role,
        timestamp: new Date().toISOString()
      });

      // Update last login
      try {
        await db('users').where({ id: user.id }).update({
          last_login: new Date(),
          updated_at: new Date(),
        });
        logger.info('Last login updated successfully', {
          userId: user.id,
          timestamp: new Date().toISOString()
        });
      } catch (updateError) {
        logger.error('Failed to update last login', {
          userId: user.id,
          error: updateError,
          timestamp: new Date().toISOString()
        });
        // Don't throw error, continue with login
      }

      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword as UserData;
    } catch (dbError) {
      logger.error('Database error during password verification', {
        email,
        error: dbError,
        timestamp: new Date().toISOString()
      });
      return null;
    }
  }

  static async changePassword(id: string, newPassword: string): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(newPassword, authConfig.bcrypt.saltRounds);
    
    const result = await db('users').where({ id }).update({
      password_hash: hashedPassword,
      updated_at: new Date(),
    });

    return result > 0;
  }

  static async findDoctorsByTenant(tenantId: string): Promise<UserData[]> {
    return await db('users')
      .where({ 
        tenant_id: tenantId, 
        role: 'doctor', 
        is_active: true 
      })
      .orderBy('first_name', 'asc');
  }

  static async search(tenantId: string, query: string): Promise<UserData[]> {
    return await db('users')
      .where('tenant_id', tenantId)
      .andWhere('is_active', true)
      .andWhere(function() {
        this.where('first_name', 'ilike', `%${query}%`)
          .orWhere('last_name', 'ilike', `%${query}%`)
          .orWhere('email', 'ilike', `%${query}%`)
          .orWhere('specialization', 'ilike', `%${query}%`);
      })
      .orderBy('first_name', 'asc');
  }
}