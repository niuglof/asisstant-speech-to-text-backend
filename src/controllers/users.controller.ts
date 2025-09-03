import { Request, Response } from 'express';
import { DatabaseService } from '../services/database.service';

export class UsersController {
  private static db = new DatabaseService();

  static async getUsers(_req: Request, res: Response) {
    try {
      const users = await UsersController.db.find('users');
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  static async getDoctors(_req: Request, res: Response) {
    try {
      const doctors = await UsersController.db.find('users', { role: 'doctor' });
      return res.json(doctors);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch doctors' });
    }
  }

  static async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UsersController.db.findById('users', id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch user' });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UsersController.db.update('users', id, req.body);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update user' });
    }
  }
}
