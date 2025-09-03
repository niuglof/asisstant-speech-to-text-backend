import { Request, Response } from 'express';
import { DatabaseService } from '../services/database.service';

export class TenantsController {
  private static db = new DatabaseService();

  static async getTenants(_req: Request, res: Response) {
    try {
      const tenants = await TenantsController.db.find('tenants');
      return res.json(tenants);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch tenants' });
    }
  }

  static async getTenant(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tenant = await TenantsController.db.findById('tenants', id);
      if (!tenant) {
        return res.status(404).json({ error: 'Tenant not found' });
      }
      return res.json(tenant);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch tenant' });
    }
  }

  static async createTenant(req: Request, res: Response) {
    try {
      const tenant = await TenantsController.db.insert('tenants', req.body);
      res.status(201).json(tenant);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create tenant' });
    }
  }

  static async updateTenant(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tenant = await TenantsController.db.update('tenants', id, req.body);
      if (!tenant) {
        return res.status(404).json({ error: 'Tenant not found' });
      }
      return res.json(tenant);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update tenant' });
    }
  }
}
