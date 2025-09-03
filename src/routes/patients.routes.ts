import express from 'express';
import { body, param } from 'express-validator';
import { PatientsController } from '../controllers/patients.controller';
import { validationMiddleware } from '../middleware/validation.middleware';
import { requirePermission } from '../middleware/auth.middleware';

const router = express.Router();

const createPatientValidation = [
  body('whatsappNumber').isMobilePhone('any').withMessage('Valid WhatsApp number required'),
  body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters'),
  body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters'),
  body('email').optional().isEmail().withMessage('Valid email required'),
  body('dateOfBirth').optional().isISO8601().withMessage('Valid date required'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
];

const updatePatientValidation = [
  param('id').isUUID().withMessage('Valid patient ID required'),
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 }),
  body('email').optional().isEmail(),
  body('dateOfBirth').optional().isISO8601(),
];

router.get('/', requirePermission('patient:read'), PatientsController.getPatients);
router.get('/search', requirePermission('patient:read'), PatientsController.searchPatients);
router.get('/stats', requirePermission('patient:read'), PatientsController.getPatientStats);
router.get('/:id', requirePermission('patient:read'), PatientsController.getPatient);
router.post('/', requirePermission('patient:write'), createPatientValidation, validationMiddleware, PatientsController.createPatient);
router.put('/:id', requirePermission('patient:write'), updatePatientValidation, validationMiddleware, PatientsController.updatePatient);
router.delete('/:id', requirePermission('patient:delete'), PatientsController.deletePatient);

export default router;
