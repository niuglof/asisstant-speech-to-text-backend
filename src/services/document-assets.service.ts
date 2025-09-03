import { DocumentAsset, DocumentAssetCreate, DocumentAssetUpdate } from '../models/document-asset.model';
import { DatabaseService } from './database.service';
import { StorageService } from './storage.service';

export class DocumentAssetsService {
  private db: DatabaseService;
  private storage: StorageService;

  constructor() {
    this.db = new DatabaseService();
    this.storage = new StorageService();
  }

  async getAssets(organizationId: string, type?: string): Promise<DocumentAsset[]> {
    let query = `
      SELECT * FROM document_assets 
      WHERE organization_id = $1 AND is_active = true
    `;
    const params: any[] = [organizationId];

    if (type) {
      query += ` AND type = $2`;
      params.push(type);
    }

    query += ` ORDER BY is_default DESC, name ASC`;

    const result = await this.db.query(query, params);
    return result.rows;
  }

  async getAssetById(id: string, organizationId: string): Promise<DocumentAsset | null> {
    const query = `
      SELECT * FROM document_assets 
      WHERE id = $1 AND organization_id = $2 AND is_active = true
    `;
    const result = await this.db.query(query, [id, organizationId]);
    return result.rows[0] || null;
  }

  async createAsset(assetData: DocumentAssetCreate): Promise<DocumentAsset> {
    // If setting as default, unset other defaults of same type
    if (assetData.is_default) {
      await this.unsetDefaultAssets(assetData.organization_id, assetData.type);
    }

    const query = `
      INSERT INTO document_assets (
        organization_id, type, name, description, file_url, 
        file_size, mime_type, is_default, uploaded_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const params = [
      assetData.organization_id,
      assetData.type,
      assetData.name,
      assetData.description,
      assetData.file_url,
      assetData.file_size,
      assetData.mime_type,
      assetData.is_default || false,
      assetData.uploaded_by
    ];

    const result = await this.db.query(query, params);
    return result.rows[0];
  }

  async updateAsset(id: string, organizationId: string, updateData: DocumentAssetUpdate): Promise<DocumentAsset | null> {
    const asset = await this.getAssetById(id, organizationId);
    if (!asset) return null;

    // If setting as default, unset other defaults of same type
    if (updateData.is_default) {
      await this.unsetDefaultAssets(organizationId, asset.type);
    }

    const fields: string[] = [];
    const params: any[] = [];
    let paramCount = 0;

    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${++paramCount}`);
        params.push(value);
      }
    });

    if (fields.length === 0) return asset;

    fields.push(`updated_at = $${++paramCount}`);
    params.push(new Date());

    params.push(id, organizationId);

    const query = `
      UPDATE document_assets 
      SET ${fields.join(', ')}
      WHERE id = $${++paramCount} AND organization_id = $${++paramCount}
      RETURNING *
    `;

    const result = await this.db.query(query, params);
    return result.rows[0] || null;
  }

  async deleteAsset(id: string, organizationId: string): Promise<boolean> {
    const asset = await this.getAssetById(id, organizationId);
    if (!asset) return false;

    // Soft delete - mark as inactive
    const query = `
      UPDATE document_assets 
      SET is_active = false, updated_at = $1
      WHERE id = $2 AND organization_id = $3
    `;

    await this.db.query(query, [new Date(), id, organizationId]);

    // Delete file from storage
    try {
      await this.storage.deleteFile(asset.file_url);
    } catch (error) {
      console.error('Error deleting file from storage:', error);
    }

    return true;
  }

  async getDefaultAssets(organizationId: string): Promise<Record<string, DocumentAsset>> {
    const query = `
      SELECT * FROM document_assets 
      WHERE organization_id = $1 AND is_default = true AND is_active = true
    `;
    const result = await this.db.query(query, [organizationId]);

    const defaults: Record<string, DocumentAsset> = {};
    result.rows.forEach((asset: DocumentAsset) => {
      defaults[asset.type] = asset;
    });

    return defaults;
  }

  async uploadAsset(
    organizationId: string, 
    userId: string, 
    file: Express.Multer.File, 
    type: string, 
    name: string, 
    description?: string,
    isDefault: boolean = false
  ): Promise<DocumentAsset> {
    // Upload file to storage
    const fileName = `assets/${organizationId}/${type}/${Date.now()}_${file.originalname}`;
    const fileUrl = await this.storage.uploadFile(file.buffer, fileName, file.mimetype);

    // Create asset record
    return await this.createAsset({
      organization_id: organizationId,
      type: type as any,
      name,
      description,
      file_url: fileUrl,
      file_size: file.size,
      mime_type: file.mimetype,
      is_default: isDefault,
      uploaded_by: userId
    });
  }

  private async unsetDefaultAssets(organizationId: string, type: string): Promise<void> {
    const query = `
      UPDATE document_assets 
      SET is_default = false, updated_at = $1
      WHERE organization_id = $2 AND type = $3 AND is_default = true
    `;
    await this.db.query(query, [new Date(), organizationId, type]);
  }

  async getAssetsByType(organizationId: string): Promise<Record<string, DocumentAsset[]>> {
    const assets = await this.getAssets(organizationId);
    
    const assetsByType: Record<string, DocumentAsset[]> = {
      logo: [],
      signature: [],
      background: [],
      letterhead: []
    };

    assets.forEach(asset => {
      if (assetsByType[asset.type]) {
        assetsByType[asset.type].push(asset);
      }
    });

    return assetsByType;
  }
}