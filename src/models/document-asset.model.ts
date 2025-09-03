export interface DocumentAsset {
  id: string;
  organization_id: string;
  type: 'logo' | 'signature' | 'background' | 'letterhead';
  name: string;
  description?: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  is_active: boolean;
  is_default: boolean;
  uploaded_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface DocumentAssetCreate {
  organization_id: string;
  type: 'logo' | 'signature' | 'background' | 'letterhead';
  name: string;
  description?: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  is_default?: boolean;
  uploaded_by: string;
}

export interface DocumentAssetUpdate {
  name?: string;
  description?: string;
  is_active?: boolean;
  is_default?: boolean;
}