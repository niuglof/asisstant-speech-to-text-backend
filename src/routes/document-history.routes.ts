import { Router } from 'express';
import { DocumentHistoryController } from '../controllers/document-history.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/async-handler';

const router = Router();
const documentHistoryController = new DocumentHistoryController();

// All routes require authentication
router.use(authMiddleware);

// GET /api/document-history - Get documents with filters
router.get('/', asyncHandler(documentHistoryController.getDocuments));

// GET /api/document-history/stats - Get document statistics
router.get('/stats', asyncHandler(documentHistoryController.getDocumentStats));

// GET /api/document-history/patient/:patientId - Get documents by patient
router.get('/patient/:patientId', asyncHandler(documentHistoryController.getDocumentsByPatient));

// GET /api/document-history/doctor/:doctorId - Get documents by doctor
router.get('/doctor/:doctorId', asyncHandler(documentHistoryController.getDocumentsByDoctor));

// GET /api/document-history/:id - Get specific document
router.get('/:id', asyncHandler(documentHistoryController.getDocumentById));

// PUT /api/document-history/:id - Update document
router.put('/:id', asyncHandler(documentHistoryController.updateDocument));

// PUT /api/document-history/:id/approve - Approve document
router.put('/:id/approve', asyncHandler(documentHistoryController.approveDocument));

// PUT /api/document-history/:id/send - Mark document as sent
router.put('/:id/send', asyncHandler(documentHistoryController.sendDocument));

// PUT /api/document-history/:id/cancel - Cancel document
router.put('/:id/cancel', asyncHandler(documentHistoryController.cancelDocument));

export default router;