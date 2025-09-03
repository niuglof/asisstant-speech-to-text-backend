import { Router } from 'express';
import { DocumentAssetsController } from '../controllers/document-assets.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { uploadAsset, handleMulterError } from '../middleware/upload.middleware';
import { asyncHandler } from '../utils/async-handler';

const router = Router();
const documentAssetsController = new DocumentAssetsController();

// All routes require authentication
router.use(authMiddleware);

// GET /api/document-assets - Get all assets for organization
router.get('/', asyncHandler(documentAssetsController.getAssets));

// GET /api/document-assets/by-type - Get assets grouped by type
router.get('/by-type', asyncHandler(documentAssetsController.getAssetsByType));

// GET /api/document-assets/defaults - Get default assets
router.get('/defaults', asyncHandler(documentAssetsController.getDefaultAssets));

// GET /api/document-assets/:id - Get specific asset
router.get('/:id', asyncHandler(documentAssetsController.getAssetById));

// POST /api/document-assets/upload - Upload new asset
router.post('/upload', 
  uploadAsset, 
  handleMulterError,
  asyncHandler(documentAssetsController.uploadAsset)
);

// PUT /api/document-assets/:id - Update asset
router.put('/:id', asyncHandler(documentAssetsController.updateAsset));

// POST /api/document-assets/:id/set-default - Set asset as default
router.post('/:id/set-default', asyncHandler(documentAssetsController.setAsDefault));

// DELETE /api/document-assets/:id - Delete asset
router.delete('/:id', asyncHandler(documentAssetsController.deleteAsset));

export default router;