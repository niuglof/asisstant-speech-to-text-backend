import { DocumentHistory, DocumentHistoryCreate, DocumentHistoryUpdate, DocumentHistoryFilter } from '../models/document-history.model';
import { DatabaseService } from './database.service';

export class DocumentHistoryService {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  async getDocuments(filter: DocumentHistoryFilter): Promise<{ documents: DocumentHistory[], total: number }> {
    let query = `
      SELECT 
        dh.*,
        p.first_name || ' ' || p.last_name as patient_name,
        u.first_name || ' ' || u.last_name as doctor_name
      FROM document_history dh
      JOIN patients p ON p.id = dh.patient_id
      JOIN users u ON u.id = dh.doctor_id
      WHERE dh.organization_id = $1
    `;
    
    const params: any[] = [filter.organization_id];
    let paramCount = 1;

    // Add filters
    if (filter.patient_id) {
      query += ` AND dh.patient_id = $${++paramCount}`;
      params.push(filter.patient_id);
    }

    if (filter.doctor_id) {
      query += ` AND dh.doctor_id = $${++paramCount}`;
      params.push(filter.doctor_id);
    }

    if (filter.document_type) {
      query += ` AND dh.document_type = $${++paramCount}`;
      params.push(filter.document_type);
    }

    if (filter.status) {
      query += ` AND dh.status = $${++paramCount}`;
      params.push(filter.status);
    }

    if (filter.date_from) {
      query += ` AND dh.created_at >= $${++paramCount}`;
      params.push(filter.date_from);
    }

    if (filter.date_to) {
      query += ` AND dh.created_at <= $${++paramCount}`;
      params.push(filter.date_to);
    }

    if (filter.search) {
      query += ` AND (
        dh.document_title ILIKE $${++paramCount} OR
        p.first_name ILIKE $${paramCount} OR
        p.last_name ILIKE $${paramCount} OR
        u.first_name ILIKE $${paramCount} OR
        u.last_name ILIKE $${paramCount}
      )`;
      params.push(`%${filter.search}%`);
    }

    // Count query for pagination
    const countQuery = query.replace(
      'SELECT dh.*, p.first_name || \' \' || p.last_name as patient_name, u.first_name || \' \' || u.last_name as doctor_name',
      'SELECT COUNT(*)'
    );
    
    const countResult = await this.db.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    // Add pagination
    query += ` ORDER BY dh.created_at DESC`;
    
    if (filter.limit) {
      query += ` LIMIT $${++paramCount}`;
      params.push(filter.limit);
    }

    if (filter.page && filter.limit) {
      const offset = (filter.page - 1) * filter.limit;
      query += ` OFFSET $${++paramCount}`;
      params.push(offset);
    }

    const result = await this.db.query(query, params);
    
    return {
      documents: result.rows,
      total
    };
  }

  async getDocumentById(id: string, organizationId: string): Promise<DocumentHistory | null> {
    const query = `
      SELECT 
        dh.*,
        p.first_name || ' ' || p.last_name as patient_name,
        p.phone_number as patient_phone,
        p.email as patient_email,
        u.first_name || ' ' || u.last_name as doctor_name
      FROM document_history dh
      JOIN patients p ON p.id = dh.patient_id
      JOIN users u ON u.id = dh.doctor_id
      WHERE dh.id = $1 AND dh.organization_id = $2
    `;
    const result = await this.db.query(query, [id, organizationId]);
    return result.rows[0] || null;
  }

  async createDocument(documentData: DocumentHistoryCreate): Promise<DocumentHistory> {
    const query = `
      INSERT INTO document_history (
        organization_id, patient_id, doctor_id, appointment_id,
        document_type, template_name, document_title, file_url,
        file_size, generated_by, ai_prompt, doctor_notes,
        patient_data, template_data, assets_used, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;

    const params = [
      documentData.organization_id,
      documentData.patient_id,
      documentData.doctor_id,
      documentData.appointment_id,
      documentData.document_type,
      documentData.template_name,
      documentData.document_title,
      documentData.file_url,
      documentData.file_size,
      documentData.generated_by,
      documentData.ai_prompt,
      documentData.doctor_notes,
      JSON.stringify(documentData.patient_data),
      JSON.stringify(documentData.template_data),
      JSON.stringify(documentData.assets_used),
      'draft'
    ];

    const result = await this.db.query(query, params);
    return result.rows[0];
  }

  async updateDocument(id: string, organizationId: string, updateData: DocumentHistoryUpdate): Promise<DocumentHistory | null> {
    const fields: string[] = [];
    const params: any[] = [];
    let paramCount = 0;

    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${++paramCount}`);
        params.push(value);
      }
    });

    if (fields.length === 0) return null;

    fields.push(`updated_at = $${++paramCount}`);
    params.push(new Date());

    params.push(id, organizationId);

    const query = `
      UPDATE document_history 
      SET ${fields.join(', ')}
      WHERE id = $${++paramCount} AND organization_id = $${++paramCount}
      RETURNING *
    `;

    const result = await this.db.query(query, params);
    return result.rows[0] || null;
  }

  async approveDocument(id: string, organizationId: string, doctorNotes?: string): Promise<DocumentHistory | null> {
    return await this.updateDocument(id, organizationId, {
      status: 'approved',
      approved_at: new Date(),
      doctor_notes: doctorNotes
    });
  }

  async sendDocument(id: string, organizationId: string, sentTo: string): Promise<DocumentHistory | null> {
    return await this.updateDocument(id, organizationId, {
      status: 'sent',
      sent_at: new Date(),
      sent_to: sentTo
    });
  }

  async cancelDocument(id: string, organizationId: string, reason?: string): Promise<DocumentHistory | null> {
    return await this.updateDocument(id, organizationId, {
      status: 'cancelled',
      doctor_notes: reason
    });
  }

  async getDocumentsByPatient(patientId: string, organizationId: string): Promise<DocumentHistory[]> {
    const query = `
      SELECT 
        dh.*,
        u.first_name || ' ' || u.last_name as doctor_name
      FROM document_history dh
      JOIN users u ON u.id = dh.doctor_id
      WHERE dh.patient_id = $1 AND dh.organization_id = $2
      ORDER BY dh.created_at DESC
    `;
    const result = await this.db.query(query, [patientId, organizationId]);
    return result.rows;
  }

  async getDocumentsByDoctor(doctorId: string, organizationId: string): Promise<DocumentHistory[]> {
    const query = `
      SELECT 
        dh.*,
        p.first_name || ' ' || p.last_name as patient_name
      FROM document_history dh
      JOIN patients p ON p.id = dh.patient_id
      WHERE dh.doctor_id = $1 AND dh.organization_id = $2
      ORDER BY dh.created_at DESC
    `;
    const result = await this.db.query(query, [doctorId, organizationId]);
    return result.rows;
  }

  async getDocumentStats(organizationId: string, doctorId?: string): Promise<any> {
    let query = `
      SELECT 
        document_type,
        status,
        COUNT(*) as count
      FROM document_history 
      WHERE organization_id = $1
    `;
    const params: any[] = [organizationId];

    if (doctorId) {
      query += ` AND doctor_id = $2`;
      params.push(doctorId);
    }

    query += `
      GROUP BY document_type, status
      ORDER BY document_type, status
    `;

    const result = await this.db.query(query, params);
    
    const stats: any = {
      total: 0,
      byType: {},
      byStatus: {
        draft: 0,
        approved: 0,
        sent: 0,
        cancelled: 0
      }
    };

    result.rows.forEach((row: any) => {
      stats.total += parseInt(row.count);
      stats.byStatus[row.status] += parseInt(row.count);
      
      if (!stats.byType[row.document_type]) {
        stats.byType[row.document_type] = {
          total: 0,
          draft: 0,
          approved: 0,
          sent: 0,
          cancelled: 0
        };
      }
      
      stats.byType[row.document_type][row.status] = parseInt(row.count);
      stats.byType[row.document_type].total += parseInt(row.count);
    });

    return stats;
  }
}