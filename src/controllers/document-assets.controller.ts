import { Request, Response } from 'express';
import { DocumentAssetsService } from '../services/document-assets.service';
import { AppError } from '../utils/errors';

export class DocumentAssetsController {
  private documentAssetsService: DocumentAssetsService;

  constructor() {
    this.documentAssetsService = new DocumentAssetsService();
  }

  // GET /api/document-assets - Get all assets for organization
  getAssets = async (req: Request & { user?: { organization_id: string } }, res: Response): Promise<void> => {
    try {
      const { organization_id } = req.user ?? {};
      const { type } = req.query;

      if (!organization_id) {
        throw new AppError('Missing organization_id in user', 400);
      }

      const assets = await this.documentAssetsService.getAssets(
        organization_id,
        type as string
      );

      res.json({
        success: true,
        data: assets
      });
    } catch (error) {
      throw new AppError('Error fetching document assets', 500);
    }
  };

  // GET /api/document-assets/by-type - Get assets grouped by type
  getAssetsByType = async (
    req: Request & { user?: { organization_id: string } },
    res: Response
  ): Promise<void> => {
    try {
      const { organization_id } = req.user ?? {};

      if (!organization_id) {
        throw new AppError('Missing organization_id in user', 400);
      }

      const assetsByType = await this.documentAssetsService.getAssetsByType(organization_id);

      res.json({
        success: true,
        data: assetsByType
      });
    } catch (error) {
      throw new AppError('Error fetching document assets by type', 500);
    }
  };

  // GET /api/document-assets/defaults - Get default assets
  getDefaultAssets = async (
    req: Request & { user?: { organization_id: string } },
    res: Response
  ): Promise<void> => {
    try {
      const { organization_id } = req.user ?? {};

      if (!organization_id) {
        throw new AppError('Missing organization_id in user', 400);
      }

      const defaultAssets = await this.documentAssetsService.getDefaultAssets(organization_id);

      res.json({
        success: true,
        data: defaultAssets
      });
    } catch (error) {
      throw new AppError('Error fetching default assets', 500);
    }
  };

  // GET /api/document-assets/:id - Get specific asset
  getAssetById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { organization_id } = (req as Request & { user?: { organization_id: string } }).user ?? {};

      if (!organization_id) {
        throw new AppError('Missing organization_id in user', 400);
      }

      const asset = await this.documentAssetsService.getAssetById(id, organization_id);

      if (!asset) {
        throw new AppError('Asset not found', 404);
      }

      res.json({
        success: true,
        data: asset
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching asset', 500);
    }
  };

  // POST /api/document-assets/upload - Upload new asset
  uploadAsset = async (
    req: Request & { user?: { organization_id: string; id: string } },
    res: Response
  ): Promise<void> => {
    try {
      const { organization_id, id: user_id } = req.user ?? {};
      const { type, name, description, is_default } = req.body;
      const file = req.file;

      if (!organization_id || !user_id) {
        throw new AppError('Missing organization_id or user_id in user', 400);
      }

      if (!file) {
        throw new AppError('No file uploaded', 400);
      }

      if (!type || !name) {
        throw new AppError('Type and name are required', 400);
      }

      const validTypes = ['logo', 'signature', 'background', 'letterhead'];
      if (!validTypes.includes(type)) {
        throw new AppError('Invalid asset type', 400);
      }

      // Validate file type based on asset type
      const allowedMimeTypes: Record<string, string[]> = {
        logo: ['image/png', 'image/jpeg', 'image/svg+xml'],
        signature: ['image/png', 'image/jpeg', 'image/svg+xml'],
        background: ['image/png', 'image/jpeg'],
        letterhead: ['image/png', 'image/jpeg', 'application/pdf']
      };

      if (!allowedMimeTypes[type].includes(file.mimetype)) {
        throw new AppError(`Invalid file type for ${type}`, 400);
      }

      const asset = await this.documentAssetsService.uploadAsset(
        organization_id,
        user_id,
        file,
        type,
        name,
        description,
        is_default === 'true'
      );

      res.status(201).json({
        success: true,
        data: asset,
        message: 'Asset uploaded successfully'
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error uploading asset', 500);
    }
  };

  // PUT /api/document-assets/:id - Update asset
  updateAsset = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const organization_id = (req as any).user?.organization_id;
      const updateData = req.body;

      const asset = await this.documentAssetsService.updateAsset(id, organization_id, updateData);

      if (!asset) {
        throw new AppError('Asset not found', 404);
      }

      res.json({
        success: true,
        data: asset,
        message: 'Asset updated successfully'
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating asset', 500);
    }
  };

  // POST /api/document-assets/:id/set-default - Set asset as default
  setAsDefault = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const organization_id = (req as any).user?.organization_id;

      const asset = await this.documentAssetsService.updateAsset(id, organization_id, {
        is_default: true
      });

      if (!asset) {
        throw new AppError('Asset not found', 404);
      }

      res.json({
        success: true,
        data: asset,
        message: 'Asset set as default successfully'
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error setting asset as default', 500);
    }
  };

  // DELETE /api/document-assets/:id - Delete asset
  deleteAsset = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const organization_id = (req as any).user?.organization_id;

      const success = await this.documentAssetsService.deleteAsset(id, organization_id);

      if (!success) {
        throw new AppError('Asset not found', 404);
      }

      res.json({
        success: true,
        message: 'Asset deleted successfully'
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting asset', 500);
    }
  };
}