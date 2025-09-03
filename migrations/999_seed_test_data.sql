-- Seed test data for DocFlow
-- This file creates sample data for development and testing

-- Insert sample tenants (healthcare practices)
INSERT INTO tenants (id, name, slug, email, phone, address, subscription_plan, is_active, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Hospital General San Juan', 'hospital-san-juan', 'admin@hospitalsanjuan.com', '+1-555-0101', 'Av. Principal 123, Ciudad, País', 'premium', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Clínica Dental Sonrisa', 'clinica-sonrisa', 'info@clinicasonrisa.com', '+1-555-0102', 'Calle Dental 456, Ciudad, País', 'basic', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Centro Médico Familiar', 'centro-familiar', 'contacto@centrofamiliar.com', '+1-555-0103', 'Plaza Médica 789, Ciudad, País', 'standard', true, NOW(), NOW());

-- Insert sample users (doctors and staff)
INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, role, specialization, license_number, phone, is_active, created_at, updated_at) VALUES
-- Hospital San Juan staff
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'dr.rodriguez@hospitalsanjuan.com', '$2b$10$example_hash_here', 'Carlos', 'Rodríguez', 'doctor', 'Medicina General', 'MED-001', '+1-555-1001', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 'dr.martinez@hospitalsanjuan.com', '$2b$10$example_hash_here', 'Ana', 'Martínez', 'doctor', 'Cardiología', 'MED-002', '+1-555-1002', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', 'admin@hospitalsanjuan.com', '$2b$10$example_hash_here', 'María', 'González', 'admin', NULL, NULL, '+1-555-1003', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440001', 'recepcion@hospitalsanjuan.com', '$2b$10$example_hash_here', 'José', 'López', 'receptionist', NULL, NULL, '+1-555-1004', true, NOW(), NOW()),

-- Clínica Sonrisa staff
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440002', 'dr.dental@clinicasonrisa.com', '$2b$10$example_hash_here', 'Patricia', 'Herrera', 'doctor', 'Odontología', 'DENT-001', '+1-555-2001', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440002', 'asistente@clinicasonrisa.com', '$2b$10$example_hash_here', 'Carmen', 'Ruiz', 'assistant', NULL, NULL, '+1-555-2002', true, NOW(), NOW()),

-- Centro Familiar staff  
('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440003', 'dr.familia@centrofamiliar.com', '$2b$10$example_hash_here', 'Roberto', 'Sánchez', 'doctor', 'Medicina Familiar', 'MED-003', '+1-555-3001', true, NOW(), NOW());

-- Insert sample patients
INSERT INTO patients (id, tenant_id, whatsapp_number, first_name, last_name, date_of_birth, gender, email, address, medical_history, allergies, preferred_language, is_active, created_at, updated_at) VALUES
-- Hospital San Juan patients
('550e8400-e29b-41d4-a716-446655440100', '550e8400-e29b-41d4-a716-446655440001', '+1-555-9001', 'Juan', 'Pérez', '1985-05-15', 'male', 'juan.perez@email.com', 'Calle 1, Casa 123', 'Hipertensión controlada', 'Ninguna conocida', 'es', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', '+1-555-9002', 'María', 'García', '1990-08-22', 'female', 'maria.garcia@email.com', 'Avenida 2, Apt 456', 'Diabetes tipo 2', 'Penicilina', 'es', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440001', '+1-555-9003', 'Pedro', 'Jiménez', '1975-12-10', 'male', 'pedro.jimenez@email.com', 'Barrio Centro, Casa 789', 'Asma', 'Aspirina', 'es', true, NOW(), NOW()),

-- Clínica Sonrisa patients
('550e8400-e29b-41d4-a716-446655440110', '550e8400-e29b-41d4-a716-446655440002', '+1-555-9011', 'Laura', 'Moreno', '1988-03-18', 'female', 'laura.moreno@email.com', 'Sector Norte, Casa 321', 'Ninguna', 'Ninguna conocida', 'es', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440111', '550e8400-e29b-41d4-a716-446655440002', '+1-555-9012', 'Diego', 'Vargas', '1992-07-05', 'male', 'diego.vargas@email.com', 'Zona Sur, Apt 654', 'Ninguna', 'Ninguna conocida', 'es', true, NOW(), NOW()),

-- Centro Familiar patients
('550e8400-e29b-41d4-a716-446655440120', '550e8400-e29b-41d4-a716-446655440003', '+1-555-9021', 'Carmen', 'Torres', '1982-11-30', 'female', 'carmen.torres@email.com', 'Colonia Este, Casa 987', 'Migraña crónica', 'Ninguna conocida', 'es', true, NOW(), NOW());

-- Insert sample appointments
INSERT INTO appointments (id, tenant_id, patient_id, doctor_id, appointment_date, duration_minutes, appointment_type, status, reason, notes, created_at, updated_at) VALUES
-- Hospital San Juan appointments
('550e8400-e29b-41d4-a716-446655440200', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440100', '550e8400-e29b-41d4-a716-446655440010', '2024-01-15 09:00:00+00', 30, 'consultation', 'completed', 'Control de hipertensión', 'Presión arterial controlada, continuar medicación', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440011', '2024-01-16 10:30:00+00', 45, 'follow_up', 'completed', 'Control de diabetes', 'Niveles de glucosa estables', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440010', '2024-01-20 14:00:00+00', 30, 'routine_checkup', 'scheduled', 'Chequeo general', NULL, NOW(), NOW()),

-- Clínica Sonrisa appointments
('550e8400-e29b-41d4-a716-446655440210', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440110', '550e8400-e29b-41d4-a716-446655440020', '2024-01-17 11:00:00+00', 60, 'consultation', 'completed', 'Limpieza dental', 'Limpieza completa, próxima cita en 6 meses', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440211', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440111', '550e8400-e29b-41d4-a716-446655440020', '2024-01-22 15:30:00+00', 45, 'routine_checkup', 'confirmed', 'Revisión general', NULL, NOW(), NOW()),

-- Centro Familiar appointments
('550e8400-e29b-41d4-a716-446655440220', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440120', '550e8400-e29b-41d4-a716-446655440030', '2024-01-18 16:00:00+00', 30, 'consultation', 'completed', 'Dolor de cabeza recurrente', 'Prescripción de analgésico, seguimiento en 2 semanas', NOW(), NOW());

-- Insert sample conversations
INSERT INTO conversations (id, tenant_id, patient_id, status, assigned_to, last_message_at, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440300', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440100', 'active', '550e8400-e29b-41d4-a716-446655440010', '2024-01-19 10:30:00+00', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440101', 'closed', '550e8400-e29b-41d4-a716-446655440011', '2024-01-18 15:45:00+00', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440110', 'active', '550e8400-e29b-41d4-a716-446655440020', '2024-01-19 14:20:00+00', NOW(), NOW());

-- Insert sample messages
INSERT INTO messages (id, tenant_id, conversation_id, whatsapp_message_id, sender_type, sender_id, message_type, content, is_read, created_at) VALUES
-- Conversation 1 messages
('550e8400-e29b-41d4-a716-446655440400', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440300', 'wa_msg_001', 'patient', NULL, 'text', 'Buenos días doctor, tengo algunas dudas sobre mi medicación para la presión', false, '2024-01-19 09:15:00+00'),
('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440300', 'wa_msg_002', 'doctor', '550e8400-e29b-41d4-a716-446655440010', 'text', 'Buenos días Juan. ¿Qué dudas tienes sobre tu medicación?', true, '2024-01-19 09:20:00+00'),
('550e8400-e29b-41d4-a716-446655440402', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440300', 'wa_msg_003', 'patient', NULL, 'text', '¿Debo tomarla con comida o sin comida?', false, '2024-01-19 09:25:00+00'),
('550e8400-e29b-41d4-a716-446655440403', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440300', 'wa_msg_004', 'doctor', '550e8400-e29b-41d4-a716-446655440010', 'text', 'Es mejor tomarla con comida para evitar molestias estomacales. Siempre a la misma hora.', true, '2024-01-19 10:30:00+00'),

-- Conversation 2 messages
('550e8400-e29b-41d4-a716-446655440410', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440301', 'wa_msg_011', 'patient', NULL, 'text', 'Doctora, mis niveles de azúcar han estado un poco altos estos días', false, '2024-01-18 14:00:00+00'),
('550e8400-e29b-41d4-a716-446655440411', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440301', 'wa_msg_012', 'doctor', '550e8400-e29b-41d4-a716-446655440011', 'text', '¿Has estado siguiendo la dieta que te recomendé? ¿Qué valores has registrado?', true, '2024-01-18 14:15:00+00'),
('550e8400-e29b-41d4-a716-446655440412', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440301', 'wa_msg_013', 'patient', NULL, 'text', 'He estado entre 140-160 en ayunas. La dieta la he seguido casi completamente', false, '2024-01-18 15:00:00+00'),
('550e8400-e29b-41d4-a716-446655440413', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440301', 'wa_msg_014', 'doctor', '550e8400-e29b-41d4-a716-446655440011', 'text', 'Necesitamos ajustar tu medicación. Programa una cita para esta semana.', true, '2024-01-18 15:45:00+00'),

-- Conversation 3 messages
('550e8400-e29b-41d4-a716-446655440420', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440302', 'wa_msg_021', 'patient', NULL, 'text', 'Hola doctora, quería saber si ya puedo comer alimentos duros después de la limpieza', false, '2024-01-19 13:30:00+00'),
('550e8400-e29b-41d4-a716-446655440421', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440302', 'wa_msg_022', 'doctor', '550e8400-e29b-41d4-a716-446655440020', 'text', 'Sí Laura, ya puedes comer normalmente. Solo evita alimentos muy duros las primeras 24 horas.', true, '2024-01-19 14:20:00+00');

-- Insert sample document templates
INSERT INTO document_templates (id, tenant_id, name, type, template_content, variables, is_active, created_by, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440500', '550e8400-e29b-41d4-a716-446655440001', 'Receta Médica Estándar', 'prescription', 
'<html><body><h1>{{tenant_name}}</h1><h2>RECETA MÉDICA</h2><p>Paciente: {{patient_name}}</p><p>Fecha: {{date}}</p><p>Medicación:</p><ul>{{#medications}}<li>{{name}} - {{dosage}} - {{instructions}}</li>{{/medications}}</ul><p>Dr. {{doctor_name}}<br>{{doctor_license}}</p></body></html>', 
'["patient_name", "date", "medications", "doctor_name", "doctor_license", "tenant_name"]', true, '550e8400-e29b-41d4-a716-446655440010', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440501', '550e8400-e29b-41d4-a716-446655440001', 'Certificado Médico', 'medical_certificate',
'<html><body><h1>{{tenant_name}}</h1><h2>CERTIFICADO MÉDICO</h2><p>Yo, Dr. {{doctor_name}}, con licencia {{doctor_license}}, certifico que:</p><p>{{patient_name}}, identificado con {{patient_id}}, {{certificate_text}}</p><p>Fecha: {{date}}</p><p>Firma: Dr. {{doctor_name}}</p></body></html>',
'["patient_name", "patient_id", "certificate_text", "date", "doctor_name", "doctor_license", "tenant_name"]', true, '550e8400-e29b-41d4-a716-446655440010', NOW(), NOW());

-- Insert sample generated documents
INSERT INTO documents (id, tenant_id, patient_id, doctor_id, template_id, type, title, content, file_url, status, generated_at, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440600', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440100', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440500', 'prescription', 'Receta - Juan Pérez - Hipertensión', 'Receta médica para control de hipertensión', '/documents/prescription_001.pdf', 'generated', '2024-01-15 09:30:00+00', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440601', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440501', 'medical_certificate', 'Certificado - María García - Reposo', 'Certificado de reposo médico por diabetes', '/documents/certificate_001.pdf', 'sent', '2024-01-16 11:00:00+00', NOW(), NOW());

-- Insert sample appointment reminders
INSERT INTO appointment_reminders (id, tenant_id, appointment_id, reminder_type, status, sent_at, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440700', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440202', '24h', 'sent', '2024-01-19 14:00:00+00', NOW()),
('550e8400-e29b-41d4-a716-446655440701', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440211', '24h', 'pending', NULL, NOW());

-- Insert sample audit logs
INSERT INTO audit_logs (id, tenant_id, user_id, action, resource_type, resource_id, old_values, new_values, ip_address, user_agent, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440800', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', 'CREATE', 'prescription', '550e8400-e29b-41d4-a716-446655440600', '{}', '{"patient_id": "550e8400-e29b-41d4-a716-446655440100", "type": "prescription"}', '192.168.1.100', 'Mozilla/5.0', NOW()),
('550e8400-e29b-41d4-a716-446655440801', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', 'UPDATE', 'appointment', '550e8400-e29b-41d4-a716-446655440201', '{"status": "scheduled"}', '{"status": "completed"}', '192.168.1.101', 'Mozilla/5.0', NOW());

-- Insert sample document assets
INSERT INTO document_assets (id, tenant_id, type, name, description, file_url, file_size, mime_type, is_active, is_default, uploaded_by, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440900', '550e8400-e29b-41d4-a716-446655440001', 'logo', 'Logo Hospital San Juan', 'Logo principal del hospital', '/assets/logos/hospital_logo.png', 45632, 'image/png', true, true, '550e8400-e29b-41d4-a716-446655440012', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440901', '550e8400-e29b-41d4-a716-446655440001', 'signature', 'Firma Dr. Rodríguez', 'Firma digital del Dr. Carlos Rodríguez', '/assets/signatures/dr_rodriguez_signature.png', 12456, 'image/png', true, false, '550e8400-e29b-41d4-a716-446655440010', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440902', '550e8400-e29b-41d4-a716-446655440002', 'logo', 'Logo Clínica Sonrisa', 'Logo de la clínica dental', '/assets/logos/clinica_logo.png', 38291, 'image/png', true, true, '550e8400-e29b-41d4-a716-446655440021', NOW(), NOW());

-- Insert sample document history
INSERT INTO document_history (id, tenant_id, patient_id, doctor_id, appointment_id, document_type, template_name, document_title, file_url, file_size, status, generated_by, doctor_notes, patient_data, template_data, assets_used, approved_at, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655441000', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440100', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440200', 'prescription', 'Receta Médica Estándar', 'Receta - Control Hipertensión - Juan Pérez', '/documents/history/prescription_20240115_001.pdf', 125648, 'approved', 'doctor', 'Paciente responde bien al tratamiento actual', '{"name": "Juan Pérez", "age": 39, "gender": "male"}', '{"medications": [{"name": "Enalapril", "dosage": "10mg", "instructions": "Una vez al día en ayunas"}]}', '{"logo": "550e8400-e29b-41d4-a716-446655440900", "signature": "550e8400-e29b-41d4-a716-446655440901"}', '2024-01-15 09:30:00+00', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655441001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440201', 'medical_certificate', 'Certificado Médico', 'Certificado Reposo - Diabetes - María García', '/documents/history/certificate_20240116_001.pdf', 89743, 'sent', 'doctor', 'Paciente requiere reposo por descompensación diabética', '{"name": "María García", "age": 34, "gender": "female"}', '{"certificate_text": "requiere reposo médico por 3 días debido a descompensación diabética leve, puede reintegrarse a sus actividades el 20 de enero de 2024"}', '{"logo": "550e8400-e29b-41d4-a716-446655440900"}', '2024-01-16 10:45:00+00', NOW(), NOW());

COMMIT;