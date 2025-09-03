import { Request, Response } from 'express';
import { DatabaseService } from '../services/database.service';

export class AppointmentsController {
  private static db = new DatabaseService();

  static async getAppointments(_req: Request, res: Response) {
    try {
      const appointments = await AppointmentsController.db.find('appointments');
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch appointments' });
    }
  }

  static async getDoctorCalendar(req: Request, res: Response) {
    try {
      const { doctorId } = req.params;
      const appointments = await AppointmentsController.db.find('appointments', { doctorId });
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch doctor calendar' });
    }
  }

  static async getAppointment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const appointment = await AppointmentsController.db.findById('appointments', id);
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      return res.json(appointment);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch appointment' });
    }
  }

  static async createAppointment(req: Request, res: Response) {
    try {
      const appointment = await AppointmentsController.db.insert('appointments', req.body);
      res.status(201).json(appointment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create appointment' });
    }
  }

  static async updateAppointment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const appointment = await AppointmentsController.db.update('appointments', id, req.body);
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      return res.json(appointment);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update appointment' });
    }
  }

  static async cancelAppointment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await AppointmentsController.db.delete('appointments', id);
      if (!success) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      return res.json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to cancel appointment' });
    }
  }
}
