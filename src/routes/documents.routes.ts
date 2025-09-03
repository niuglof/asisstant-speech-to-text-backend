import { Router } from 'express';
import { DocumentsController } from '../controllers/documents.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/async-handler';

const router = Router();
const documentsController = new DocumentsController();

// All routes require authentication
router.use(authMiddleware);

// POST /api/documents/generate - Generate a new document
router.post('/generate', asyncHandler(documentsController.generateDocument));

// POST /api/documents/generate-with-ai - Generate document with AI assistance
router.post('/generate-with-ai', asyncHandler(documentsController.generateDocumentWithAI));

// GET /api/documents/templates/:type - Get available templates for document type
router.get('/templates/:type', asyncHandler(documentsController.getTemplates));

// POST /api/documents/preview - Preview document without saving
router.post('/preview', asyncHandler(documentsController.previewDocument));

export default router;
