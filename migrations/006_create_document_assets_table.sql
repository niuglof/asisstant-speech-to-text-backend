-- Migration: Create document_assets table
-- Description: Table to store logos, signatures, backgrounds, and letterheads for documents

CREATE TABLE IF NOT EXISTS document_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('logo', 'signature', 'background', 'letterhead')),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN NOT NULL DEFAULT false,
  uploaded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_document_assets_tenant ON document_assets(tenant_id);
CREATE INDEX idx_document_assets_type ON document_assets(type);
CREATE INDEX idx_document_assets_active ON document_assets(is_active);
CREATE INDEX idx_document_assets_default ON document_assets(is_default, type);
CREATE INDEX idx_document_assets_created_at ON document_assets(created_at);

-- Row Level Security
ALTER TABLE document_assets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their tenant's document assets"
  ON document_assets FOR SELECT
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = current_user_id()
  ));

CREATE POLICY "Users can insert document assets for their tenant"
  ON document_assets FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM users WHERE id = current_user_id()
    ) AND
    uploaded_by = current_user_id()
  );

CREATE POLICY "Users can update their tenant's document assets"
  ON document_assets FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM users WHERE id = current_user_id()
    )
  );

CREATE POLICY "Users can delete their tenant's document assets"
  ON document_assets FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM users WHERE id = current_user_id()
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_document_assets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_document_assets_updated_at
  BEFORE UPDATE ON document_assets
  FOR EACH ROW
  EXECUTE FUNCTION update_document_assets_updated_at();

-- Constraint: Only one default asset per type per tenant
CREATE UNIQUE INDEX idx_document_assets_unique_default
  ON document_assets(tenant_id, type)
  WHERE is_default = true AND is_active = true;

-- Comments
COMMENT ON TABLE document_assets IS 'Stores logos, signatures, backgrounds and letterheads for document generation';
COMMENT ON COLUMN document_assets.type IS 'Type of asset: logo, signature, background, letterhead';
COMMENT ON COLUMN document_assets.is_default IS 'Whether this asset is the default for its type';
COMMENT ON COLUMN document_assets.file_url IS 'URL or path to the uploaded file';
COMMENT ON COLUMN document_assets.file_size IS 'File size in bytes';
COMMENT ON COLUMN document_assets.mime_type IS 'MIME type of the uploaded file';