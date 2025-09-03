import express from 'express';
import { body } from 'express-validator';
import { AppointmentsController } from '../controllers/appointments.controller';
import { validationMiddleware } from '../middleware/validation.middleware';
import { requirePermission } from '../middleware/auth.middleware';

const router = express.Router();

const createAppointmentValidation = [
  body('patientId').isUUID().withMessage('Valid patient ID required'),
  body('doctorId').isUUID().withMessage('Valid doctor ID required'),
  body('appointmentDate').isISO8601().withMessage('Valid appointment date required'),
  body('appointmentType').isIn(['consultation', 'follow_up', 'routine_checkup', 'emergency']),
  body('durationMinutes').optional().isInt({ min: 15, max: 180 }),
];

router.get('/', requirePermission('appointment:read'), AppointmentsController.getAppointments);
router.get('/calendar/:doctorId', requirePermission('appointment:read'), AppointmentsController.getDoctorCalendar);
router.get('/:id', requirePermission('appointment:read'), AppointmentsController.getAppointment);
router.post('/', requirePermission('appointment:write'), createAppointmentValidation, validationMiddleware, AppointmentsController.createAppointment);
router.put('/:id', requirePermission('appointment:write'), AppointmentsController.updateAppointment);
router.delete('/:id', requirePermission('appointment:delete'), AppointmentsController.cancelAppointment);

export default router;
