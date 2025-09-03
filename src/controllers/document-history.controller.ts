import { Request, Response } from 'express';
import { DocumentHistoryService } from '../services/document-history.service';
import { DocumentHistoryFilter } from '../models/document-history.model';
import { AppError } from '../utils/errors';

export class DocumentHistoryController {
  private documentHistoryService: DocumentHistoryService;

  constructor() {
    this.documentHistoryService = new DocumentHistoryService();
  }

  // GET /api/document-history - Get documents with filters
  getDocuments = async (req: Request & { user?: { organization_id: string } }, res: Response): Promise<void> => {
    try {
      const { organization_id } = req.user!;
      const {
        patient_id,
        doctor_id,
        document_type,
        status,
        date_from,
        date_to,
        search,
        page = 1,
        limit = 20
      } = req.query;

      const filter: DocumentHistoryFilter = {
        organization_id,
        patient_id: patient_id as string,
        doctor_id: doctor_id as string,
        document_type: document_type as string,
        status: status as string,
        date_from: date_from as string,
        date_to: date_to as string,
        search: search as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      };

      const result = await this.documentHistoryService.getDocuments(filter);

      res.json({
        success: true,
        data: result.documents,
        pagination: {
          page: filter.page,
          limit: filter.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / filter.limit!)
        }
      });
    } catch (error) {
      throw new AppError('Error fetching document history', 500);
    }
  };

  // GET /api/document-history/:id - Get specific document
  getDocumentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { organization_id } = (req as any).user!;

      const document = await this.documentHistoryService.getDocumentById(id, organization_id);

      if (!document) {
        throw new AppError('Document not found', 404);
      }

      res.json({
        success: true,
        data: document
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching document', 500);
    }
  };

  // GET /api/document-history/patient/:patientId - Get documents by patient
  getDocumentsByPatient = async (req: Request, res: Response): Promise<void> => {
    try {
      const { patientId } = req.params;
      const { organization_id } = (req as any).user!;

      const documents = await this.documentHistoryService.getDocumentsByPatient(
        patientId,
        organization_id
      );

      res.json({
        success: true,
        data: documents
      });
    } catch (error) {
      throw new AppError('Error fetching patient documents', 500);
    }
  };

  // GET /api/document-history/doctor/:doctorId - Get documents by doctor
  getDocumentsByDoctor = async (req: Request, res: Response): Promise<void> => {
    try {
      const { doctorId } = req.params;
      const { organization_id } = (req as any).user!;

      const documents = await this.documentHistoryService.getDocumentsByDoctor(
        doctorId,
        organization_id
      );

      res.json({
        success: true,
        data: documents
      });
    } catch (error) {
      throw new AppError('Error fetching doctor documents', 500);
    }
  };

  // GET /api/document-history/stats - Get document statistics
  getDocumentStats = async (req: Request, res: Response): Promise<void> => {
    try {
      // Use (req as any).user to avoid TS error about missing user property
      const { organization_id, id: user_id, role } = (req as any).user!;
      const { doctor_id } = req.query;

      // If user is a doctor and no specific doctor_id requested, show their stats
      const doctorIdToUse = role === 'doctor' && !doctor_id ? user_id : (doctor_id as string | undefined);

      const stats = await this.documentHistoryService.getDocumentStats(
        organization_id,
        doctorIdToUse
      );

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      throw new AppError('Error fetching document statistics', 500);
    }
  };

  // PUT /api/document-history/:id/approve - Approve document
  approveDocument = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      // Use (req as any).user to avoid TS error about missing user property
      const { organization_id } = (req as any).user!;
      const { doctor_notes } = req.body;

      const document = await this.documentHistoryService.approveDocument(
        id,
        organization_id,
        doctor_notes
      );

      if (!document) {
        throw new AppError('Document not found', 404);
      }

      res.json({
        success: true,
        data: document,
        message: 'Document approved successfully'
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error approving document', 500);
    }
  };

  // PUT /api/document-history/:id/send - Mark document as sent
  sendDocument = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      // Use (req as any).user to avoid TS error about missing user property
      const { organization_id } = (req as any).user!;
      const { sent_to } = req.body;

      if (!sent_to) {
        throw new AppError('sent_to field is required', 400);
      
      }

      const document = await this.documentHistoryService.sendDocument(
        id,
        organization_id,
        sent_to
      );

      if (!document) {
        throw new AppError('Document not found', 404);
      }

      res.json({
        success: true,
        data: document,
        message: 'Document marked as sent successfully'
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error marking document as sent', 500);
    }
  };

  // PUT /api/document-history/:id/cancel - Cancel document
  cancelDocument = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      // Use (req as any).user to avoid TS error about missing user property
      const { organization_id } = (req as any).user!;
      const { reason } = req.body;

      const document = await this.documentHistoryService.cancelDocument(
        id,
        organization_id,
        reason
      );

      if (!document) {
        throw new AppError('Document not found', 404);
      }

      res.json({
        success: true,
        data: document,
        message: 'Document cancelled successfully'
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error cancelling document', 500);
    }
  };

  // PUT /api/document-history/:id - Update document
  updateDocument = async (req: any, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      //const { organization_id } = req.user!;
      const updateData = req.body;

      // Defensive check for req.user and organization_id
      if (!req.user || typeof req.user.organization_id === 'undefined') {
        throw new AppError('User or organization_id not found', 400);
      }

      const document = await this.documentHistoryService.updateDocument(
        id,
        req.user.organization_id,
        updateData
      );

      if (!document) {
        throw new AppError('Document not found', 404);
      }

      res.json({
        success: true,
        data: document,
        message: 'Document updated successfully'
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating document', 500);
    }
  };
}