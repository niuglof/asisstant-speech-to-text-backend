export interface DocumentHistory {
  id: string;
  organization_id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string;
  document_type: 'prescription' | 'medical_certificate' | 'exam_order' | 'referral' | 'discharge_summary';
  template_name: string;
  document_title: string;
  file_url: string;
  file_size: number;
  status: 'draft' | 'approved' | 'sent' | 'cancelled';
  generated_by: 'doctor' | 'ai_assisted' | 'template';
  ai_prompt?: string;
  doctor_notes?: string;
  patient_data: any; // JSON field with patient information used
  template_data: any; // JSON field with template data used
  assets_used: any; // JSON field with logos/signatures used
  approved_at?: Date;
  sent_at?: Date;
  sent_to?: string; // WhatsApp number or email
  created_at: Date;
  updated_at: Date;
}

export interface DocumentHistoryCreate {
  organization_id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string;
  document_type: 'prescription' | 'medical_certificate' | 'exam_order' | 'referral' | 'discharge_summary';
  template_name: string;
  document_title: string;
  file_url: string;
  file_size: number;
  generated_by: 'doctor' | 'ai_assisted' | 'template';
  ai_prompt?: string;
  doctor_notes?: string;
  patient_data: any;
  template_data: any;
  assets_used: any;
}

export interface DocumentHistoryUpdate {
  status?: 'draft' | 'approved' | 'sent' | 'cancelled';
  doctor_notes?: string;
  approved_at?: Date;
  sent_at?: Date;
  sent_to?: string;
}

export interface DocumentHistoryFilter {
  organization_id: string;
  patient_id?: string;
  doctor_id?: string;
  document_type?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  limit?: number;
}