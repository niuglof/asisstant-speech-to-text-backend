-- Migration: Create document_history table
-- Description: Table to store history of all generated documents

CREATE TABLE IF NOT EXISTS document_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('prescription', 'medical_certificate', 'exam_order', 'referral', 'discharge_summary')),
  template_name VARCHAR(255) NOT NULL,
  document_title VARCHAR(500) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'sent', 'cancelled')),
  generated_by VARCHAR(20) NOT NULL CHECK (generated_by IN ('doctor', 'ai_assisted', 'template')),
  ai_prompt TEXT,
  doctor_notes TEXT,
  patient_data JSONB NOT NULL,
  template_data JSONB NOT NULL,
  assets_used JSONB,
  approved_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  sent_to VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_document_history_tenant ON document_history(tenant_id);
CREATE INDEX idx_document_history_patient ON document_history(patient_id);
CREATE INDEX idx_document_history_doctor ON document_history(doctor_id);
CREATE INDEX idx_document_history_appointment ON document_history(appointment_id);
CREATE INDEX idx_document_history_type ON document_history(document_type);
CREATE INDEX idx_document_history_status ON document_history(status);
CREATE INDEX idx_document_history_generated_by ON document_history(generated_by);
CREATE INDEX idx_document_history_created_at ON document_history(created_at);
CREATE INDEX idx_document_history_approved_at ON document_history(approved_at);
CREATE INDEX idx_document_history_sent_at ON document_history(sent_at);

-- JSONB indexes for efficient querying
CREATE INDEX idx_document_history_patient_data_gin ON document_history USING gin(patient_data);
CREATE INDEX idx_document_history_template_data_gin ON document_history USING gin(template_data);
CREATE INDEX idx_document_history_assets_used_gin ON document_history USING gin(assets_used);

-- Row Level Security
ALTER TABLE document_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their tenant's document history"
  ON document_history FOR SELECT
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = current_user_id()
  ));

CREATE POLICY "Users can insert document history for their tenant"
  ON document_history FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM users WHERE id = current_user_id()
    ) AND
    doctor_id = current_user_id()
  );

CREATE POLICY "Users can update their tenant's document history"
  ON document_history FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM users WHERE id = current_user_id()
    )
  );

CREATE POLICY "Users can delete their tenant's document history"
  ON document_history FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM users WHERE id = current_user_id()
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_document_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_document_history_updated_at
  BEFORE UPDATE ON document_history
  FOR EACH ROW
  EXECUTE FUNCTION update_document_history_updated_at();

-- Trigger to automatically set approved_at when status changes to approved
CREATE OR REPLACE FUNCTION set_document_history_approved_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    NEW.approved_at = NOW();
  END IF;
  
  IF NEW.status = 'sent' AND OLD.status != 'sent' THEN
    NEW.sent_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_document_history_status_timestamps
  BEFORE UPDATE ON document_history
  FOR EACH ROW
  EXECUTE FUNCTION set_document_history_approved_at();

-- Check constraint to ensure sent documents are approved first
ALTER TABLE document_history ADD CONSTRAINT check_sent_documents_approved
  CHECK (status != 'sent' OR approved_at IS NOT NULL);

-- Comments
COMMENT ON TABLE document_history IS 'History of all generated documents with metadata and status tracking';
COMMENT ON COLUMN document_history.document_type IS 'Type of document generated';
COMMENT ON COLUMN document_history.template_name IS 'Name of the template used for generation';
COMMENT ON COLUMN document_history.status IS 'Current status of the document';
COMMENT ON COLUMN document_history.generated_by IS 'How the document was generated';
COMMENT ON COLUMN document_history.ai_prompt IS 'AI prompt used if generated with AI assistance';
COMMENT ON COLUMN document_history.patient_data IS 'Patient information used in document generation';
COMMENT ON COLUMN document_history.template_data IS 'Template data used in document generation';
COMMENT ON COLUMN document_history.assets_used IS 'Assets (logos, signatures) used in document generation';
COMMENT ON COLUMN document_history.sent_to IS 'WhatsApp number or email where document was sent';