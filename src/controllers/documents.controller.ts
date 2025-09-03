import { Request, Response } from 'express';
import { DocumentHistoryService } from '../services/document-history.service';
import { AppError } from '../utils/errors';
import axios from 'axios';

interface GenerateDocumentRequest {
  patient_id: string;
  doctor_id: string;
  document_type: 'prescription' | 'medical_certificate' | 'exam_order' | 'referral' | 'discharge_summary';
  template_data: any;
  assets?: {
    logo_id?: string;
    signature_id?: string;
    background_id?: string;
    letterhead_id?: string;
  };
}

export class DocumentsController {
  private documentHistoryService: DocumentHistoryService;

  constructor() {
    this.documentHistoryService = new DocumentHistoryService();
  }

  // POST /api/documents/generate - Generate a new document
  generateDocument = async (req: Request, res: Response): Promise<void> => {
    try {
      const { organization_id } = (req as any).user!;
      const {
        patient_id,
        doctor_id,
        document_type,
        template_data,
        assets
      }: GenerateDocumentRequest = req.body;

      if (!patient_id || !doctor_id || !document_type || !template_data) {
        throw new AppError('Missing required fields', 400);
      }

      // Call document service to generate the document
      const documentServiceUrl = process.env.DOCUMENT_SERVICE_URL || 'http://document-service:3003';
      
      const documentRequest = {
        organizationId: organization_id,
        documentType: document_type,
        templateData: template_data,
        patientData: await this.getPatientData(patient_id, organization_id),
        doctorData: await this.getDoctorData(doctor_id, organization_id),
        assets
      };

      const response = await axios.post(`${documentServiceUrl}/generate`, documentRequest);
      const generatedDocument = response.data;

      // Save document to history
      const historyRecord = await this.documentHistoryService.createDocument({
        organization_id,
        patient_id,
        doctor_id,
        document_type,
        template_name: template_data.template || 'standard',
        document_title: this.generateDocumentTitle(document_type, template_data),
        file_url: generatedDocument.fileUrl,
        file_size: generatedDocument.fileSize,
        generated_by: 'doctor',
        patient_data: documentRequest.patientData,
        template_data,
        assets_used: generatedDocument.assetsUsed || []
      });

      res.status(201).json({
        success: true,
        data: {
          document_id: historyRecord.id,
          file_url: generatedDocument.fileUrl,
          file_name: generatedDocument.fileName,
          status: 'draft'
        },
        message: 'Document generated successfully'
      });

    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new AppError('Document service not available', 503);
      }
      if (error instanceof AppError) throw error;
      throw new AppError(`Error generating document: ${error.message}`, 500);
    }
  };

  // POST /api/documents/generate-with-ai - Generate document with AI assistance
  generateDocumentWithAI = async (req: Request, res: Response): Promise<void> => {
    try {
      const { organization_id } = (req as any).user!;
      const {
        patient_id,
        doctor_id,
        document_type,
        template_data,
        ai_prompt,
        assets
      } = req.body;

      if (!patient_id || !doctor_id || !document_type || !template_data) {
        throw new AppError('Missing required fields', 400);
      }

      // First, enhance template data with AI
      const enhancedTemplateData = await this.enhanceWithAI(template_data, ai_prompt);

      // Then generate the document
      const documentServiceUrl = process.env.DOCUMENT_SERVICE_URL || 'http://document-service:3003';
      
      const documentRequest = {
        organizationId: organization_id,
        documentType: document_type,
        templateData: enhancedTemplateData,
        patientData: await this.getPatientData(patient_id, organization_id),
        doctorData: await this.getDoctorData(doctor_id, organization_id),
        assets
      };

      const response = await axios.post(`${documentServiceUrl}/generate`, documentRequest);
      const generatedDocument = response.data;

      // Save document to history with AI flag
      const historyRecord = await this.documentHistoryService.createDocument({
        organization_id,
        patient_id,
        doctor_id,
        document_type,
        template_name: enhancedTemplateData.template || 'ai-enhanced',
        document_title: this.generateDocumentTitle(document_type, enhancedTemplateData),
        file_url: generatedDocument.fileUrl,
        file_size: generatedDocument.fileSize,
        generated_by: 'ai_assisted',
        ai_prompt,
        patient_data: documentRequest.patientData,
        template_data: enhancedTemplateData,
        assets_used: generatedDocument.assetsUsed || []
      });

      res.status(201).json({
        success: true,
        data: {
          document_id: historyRecord.id,
          file_url: generatedDocument.fileUrl,
          file_name: generatedDocument.fileName,
          status: 'draft',
          ai_enhanced: true
        },
        message: 'AI-enhanced document generated successfully'
      });

    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Error generating AI-enhanced document: ${error.message}`, 500);
    }
  };

  // GET /api/documents/templates/:type - Get available templates for document type
  getTemplates = async (req: Request, res: Response): Promise<void> => {
    try {
      const { type } = req.params;

      const templates = {
        prescription: [
          { id: 'standard', name: 'Standard Prescription', description: 'Basic prescription format' },
          { id: 'detailed', name: 'Detailed Prescription', description: 'Comprehensive prescription with instructions' },
          { id: 'minimal', name: 'Minimal Prescription', description: 'Simple prescription format' }
        ],
        medical_certificate: [
          { id: 'work_absence', name: 'Work Absence Certificate', description: 'Certificate for work absence' },
          { id: 'fitness', name: 'Fitness Certificate', description: 'Medical fitness certificate' },
          { id: 'disability', name: 'Disability Certificate', description: 'Certificate for disability claims' }
        ],
        exam_order: [
          { id: 'laboratory', name: 'Laboratory Order', description: 'Order for lab tests' },
          { id: 'imaging', name: 'Imaging Order', description: 'Order for imaging studies' },
          { id: 'specialist_referral', name: 'Specialist Referral', description: 'Referral to specialist' }
        ],
        referral: [
          { id: 'specialist', name: 'Specialist Referral', description: 'Referral to medical specialist' },
          { id: 'hospital', name: 'Hospital Referral', description: 'Referral to hospital' },
          { id: 'emergency', name: 'Emergency Referral', description: 'Emergency referral' }
        ],
        discharge_summary: [
          { id: 'standard', name: 'Standard Summary', description: 'Standard discharge summary' },
          { id: 'detailed', name: 'Detailed Summary', description: 'Comprehensive discharge summary' },
          { id: 'brief', name: 'Brief Summary', description: 'Brief discharge summary' }
        ]
      };

      const availableTemplates = templates[type as keyof typeof templates] || [];

      res.json({
        success: true,
        data: availableTemplates
      });

    } catch (error) {
      throw new AppError('Error fetching templates', 500);
    }
  };

  // POST /api/documents/preview - Preview document without saving
  previewDocument = async (req: Request, res: Response): Promise<void> => {
    try {
      const { organization_id } = (req as any).user!;
      const {
        patient_id,
        doctor_id,
        document_type,
        template_data,
        assets
      } = req.body;

      if (!patient_id || !doctor_id || !document_type || !template_data) {
        throw new AppError('Missing required fields', 400);
      }

      const documentServiceUrl = process.env.DOCUMENT_SERVICE_URL || 'http://document-service:3003';
      
      const documentRequest = {
        organizationId: organization_id,
        documentType: document_type,
        templateData: template_data,
        patientData: await this.getPatientData(patient_id, organization_id),
        doctorData: await this.getDoctorData(doctor_id, organization_id),
        assets
      };

      const response = await axios.post(`${documentServiceUrl}/preview`, documentRequest);
      
      res.json({
        success: true,
        data: response.data,
        message: 'Document preview generated successfully'
      });

    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Error generating document preview: ${error.message}`, 500);
    }
  };

  private async getPatientData(patientId: string, _organizationId: string): Promise<any> {
    // This would typically fetch from the database
    // For now, return mock data
    return {
      id: patientId,
      name: 'Patient Name',
      date_of_birth: '1990-01-01',
      phone: '+1234567890',
      email: 'patient@example.com'
    };
  }

  private async getDoctorData(doctorId: string, _organizationId: string): Promise<any> {
    // This would typically fetch from the database
    // For now, return mock data
    return {
      id: doctorId,
      name: 'Dr. Doctor Name',
      specialization: 'General Medicine',
      license: 'LIC123456',
      email: 'doctor@example.com'
    };
  }

  private generateDocumentTitle(documentType: string, templateData: any): string {
    const titles = {
      prescription: `Prescription - ${templateData.diagnosis || 'Medical Treatment'}`,
      medical_certificate: `Medical Certificate - ${templateData.certificate_type || 'General'}`,
      exam_order: `Exam Order - ${templateData.exam_type || 'Medical Examination'}`,
      referral: `Referral - ${templateData.specialist || 'Specialist Consultation'}`,
      discharge_summary: `Discharge Summary - ${templateData.admission_reason || 'Hospital Stay'}`
    };

    return titles[documentType as keyof typeof titles] || `${documentType} Document`;
  }

  private async enhanceWithAI(templateData: any, aiPrompt: string): Promise<any> {
    // Here we would integrate with the MCP AI agent to enhance the template data
    // For now, just return the original data with AI enhancement flag
    return {
      ...templateData,
      ai_enhanced: true,
      ai_prompt: aiPrompt,
      enhancement_timestamp: new Date().toISOString()
    };
  }
}