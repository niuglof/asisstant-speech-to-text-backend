-- =============================================
-- DATOS DE PRUEBA
-- =============================================

-- Insertar planes de suscripción
INSERT INTO subscription_plans (id, name, description, price, currency, billing_period, billing_interval, trial_period_days, features, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Plan Básico', 'Plan básico con funcionalidades esenciales', 9.99, 'USD', 'monthly', 1, 7, '{"max_users": 1, "storage_gb": 5, "support": "email"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440002', 'Plan Pro', 'Plan profesional con funcionalidades avanzadas', 29.99, 'USD', 'monthly', 1, 14, '{"max_users": 5, "storage_gb": 50, "support": "priority", "analytics": true}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440003', 'Plan Enterprise', 'Plan empresarial con todas las funcionalidades', 99.99, 'USD', 'monthly', 1, 30, '{"max_users": "unlimited", "storage_gb": 500, "support": "dedicated", "analytics": true, "custom_integrations": true}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440004', 'Plan Anual Básico', 'Plan básico facturado anualmente', 99.99, 'USD', 'yearly', 1, 30, '{"max_users": 1, "storage_gb": 5, "support": "email", "discount": "2 meses gratis"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440005', 'Plan Anual Pro', 'Plan pro facturado anualmente', 299.99, 'USD', 'yearly', 1, 30, '{"max_users": 5, "storage_gb": 50, "support": "priority", "analytics": true, "discount": "2 meses gratis"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insertar usuarios de prueba
INSERT INTO users (id, email, msisdn, dni, first_name, last_name, phone, avatar_url, password_hash, is_active, email_verified, created_at, updated_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'juan.perez@email.com', '+1234567890', '12345678A', 'Juan', 'Pérez', '+1-234-567-890', null, '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8MfGqIB4tK', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440002', 'maria.garcia@email.com', '+1234567891', '87654321B', 'María', 'García', '+1-234-567-891', 'https://lh3.googleusercontent.com/a/example1', null, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440003', 'carlos.rodriguez@email.com', '+1234567892', '11223344C', 'Carlos', 'Rodríguez', '+1-234-567-892', null, '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8MfGqIB4tK', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440004', 'ana.martinez@email.com', '+1234567893', '55667788D', 'Ana', 'Martínez', '+1-234-567-893', 'https://lh3.googleusercontent.com/a/example2', null, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440005', 'luis.gonzalez@email.com', '+1234567894', '99887766E', 'Luis', 'González', '+1-234-567-894', null, '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8MfGqIB4tK', false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440006', 'sofia.lopez@email.com', '+34612345678', '44556677F', 'Sofía', 'López', '+34-612-345-678', 'https://lh3.googleusercontent.com/a/example3', null, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440007', 'diego.hernandez@email.com', '+525512345678', 'CURP123456G', 'Diego', 'Hernández', '+52-55-1234-5678', null, '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8MfGqIB4tK', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insertar proveedores OAuth
INSERT INTO oauth_providers (id, name, display_name, client_id, client_secret, authorization_url, token_url, user_info_url, scope, created_at, updated_at) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', 'google', 'Google', 'your-google-client-id.googleusercontent.com', 'ENCRYPTED_SECRET_REFERENCE', 'https://accounts.google.com/o/oauth2/auth', 'https://oauth2.googleapis.com/token', 'https://www.googleapis.com/oauth2/v2/userinfo', 'openid email profile', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cc0e8400-e29b-41d4-a716-446655440002', 'facebook', 'Facebook', 'your-facebook-app-id', 'ENCRYPTED_SECRET_REFERENCE', 'https://www.facebook.com/v18.0/dialog/oauth', 'https://graph.facebook.com/v18.0/oauth/access_token', 'https://graph.facebook.com/me', 'email,public_profile', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cc0e8400-e29b-41d4-a716-446655440003', 'apple', 'Apple', 'your.apple.service.id', 'ENCRYPTED_SECRET_REFERENCE', 'https://appleid.apple.com/auth/authorize', 'https://appleid.apple.com/auth/token', 'https://appleid.apple.com/auth/userinfo', 'openid email name', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insertar cuentas OAuth vinculadas
INSERT INTO user_oauth_accounts (id, user_id, provider_id, provider_user_id, provider_email, access_token, refresh_token, token_expires_at, provider_data, connected_at, last_used_at, created_at, updated_at) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'cc0e8400-e29b-41d4-a716-446655440001', '108234567890123456789', 'maria.garcia@gmail.com', 'ENCRYPTED_ACCESS_TOKEN_1', 'ENCRYPTED_REFRESH_TOKEN_1', '2025-09-02 10:30:00', '{"picture": "https://lh3.googleusercontent.com/a/example1", "locale": "es", "verified_email": true}', '2025-01-15 09:20:00', '2025-09-01 14:30:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dd0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440004', 'cc0e8400-e29b-41d4-a716-446655440001', '109876543210987654321', 'ana.martinez@gmail.com', 'ENCRYPTED_ACCESS_TOKEN_2', 'ENCRYPTED_REFRESH_TOKEN_2', '2025-09-02 15:45:00', '{"picture": "https://lh3.googleusercontent.com/a/example2", "locale": "es-ES", "verified_email": true}', '2025-02-10 11:15:00', '2025-09-02 08:15:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dd0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440006', 'cc0e8400-e29b-41d4-a716-446655440001', '111222333444555666777', 'sofia.lopez@gmail.com', 'ENCRYPTED_ACCESS_TOKEN_3', 'ENCRYPTED_REFRESH_TOKEN_3', '2025-09-02 12:20:00', '{"picture": "https://lh3.googleusercontent.com/a/example3", "locale": "es", "verified_email": true}', '2025-06-20 16:45:00', '2025-09-01 19:22:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insertar sesiones de usuario activas
INSERT INTO user_sessions (id, user_id, session_token, oauth_account_id, ip_address, user_agent, expires_at, last_activity_at, created_at, updated_at) VALUES
('ee0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'sess_1234567890abcdef1234567890abcdef', null, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-09-09 14:30:00', '2025-09-02 14:30:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ee0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'sess_abcdef1234567890abcdef1234567890', 'dd0e8400-e29b-41d4-a716-446655440001', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15', '2025-09-09 15:00:00', '2025-09-02 15:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ee0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440004', 'sess_fedcba0987654321fedcba0987654321', 'dd0e8400-e29b-41d4-a716-446655440002', '10.0.0.50', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', '2025-09-09 08:15:00', '2025-09-02 08:15:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insertar intentos de login (algunos exitosos, algunos fallidos)
INSERT INTO login_attempts (email, ip_address, user_agent, success, failure_reason, oauth_provider, attempted_at) VALUES
('juan.perez@email.com', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', true, null, null, '2025-09-02 14:25:00'),
('maria.garcia@gmail.com', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15', true, null, 'google', '2025-09-02 14:58:00'),
('wrongemail@example.com', '203.0.113.45', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', false, 'invalid_credentials', null, '2025-09-02 10:15:00'),
('ana.martinez@gmail.com', '10.0.0.50', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', true, null, 'google', '2025-09-02 08:10:00'),
('carlos.rodriguez@email.com', '192.168.1.200', 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36', false, 'invalid_credentials', null, '2025-09-02 12:30:00'),
('sofia.lopez@email.com', '172.16.0.10', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', true, null, 'google', '2025-09-01 19:20:00');

-- Insertar métodos de pago
INSERT INTO payment_methods (id, user_id, type, provider, provider_payment_method_id, is_default, card_last_four, card_brand, card_exp_month, card_exp_year, created_at, updated_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'card', 'stripe', 'pm_1234567890abcdef', true, '4242', 'visa', 12, 2025, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'card', 'stripe', 'pm_1234567890abcdeg', true, '5555', 'mastercard', 8, 2026, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'paypal', 'paypal', 'pp_1234567890abcdef', true, null, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 'card', 'stripe', 'pm_1234567890abcdeh', true, '4444', 'visa', 3, 2027, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440006', 'card', 'stripe', 'pm_1234567890abcdei', true, '3782', 'amex', 9, 2025, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Actualizar PayPal email para el método de pago PayPal
UPDATE payment_methods SET paypal_email = 'carlos.rodriguez@email.com' WHERE id = '770e8400-e29b-41d4-a716-446655440003';

-- Insertar suscripciones activas
INSERT INTO subscriptions (id, user_id, plan_id, status, start_date, current_period_start, current_period_end, trial_start, trial_end, created_at, updated_at) VALUES
('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'active', '2025-01-15', '2025-08-15', '2025-09-15', '2025-01-15', '2025-01-22', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'active', '2024-12-01', '2025-08-01', '2025-09-01', null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'trialing', '2025-08-20', '2025-08-20', '2025-09-20', '2025-08-20', '2025-08-27', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'active', '2025-07-01', '2025-08-01', '2025-09-01', '2025-07-01', '2025-07-31', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440005', 'active', '2024-09-01', '2025-09-01', '2026-09-01', null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insertar suscripción cancelada
INSERT INTO subscriptions (id, user_id, plan_id, status, start_date, end_date, current_period_start, current_period_end, cancel_at_period_end, canceled_at, created_at, updated_at) VALUES
('880e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'canceled', '2025-06-01', '2025-08-15', '2025-07-15', '2025-08-15', true, '2025-08-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insertar cupones
INSERT INTO coupons (id, code, name, type, value, currency, valid_from, valid_until, max_uses, current_uses, minimum_amount, first_time_only, created_at, updated_at) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'WELCOME20', 'Descuento de Bienvenida', 'percentage', 20, null, '2025-01-01', '2025-12-31', 1000, 45, 5.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('990e8400-e29b-41d4-a716-446655440002', 'SUMMER50', 'Descuento de Verano', 'fixed_amount', 50, 'USD', '2025-06-01', '2025-09-30', 500, 123, 100.00, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('990e8400-e29b-41d4-a716-446655440003', 'PRO30', 'Descuento Plan Pro', 'percentage', 30, null, '2025-08-01', '2025-10-31', 200, 34, 25.00, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('990e8400-e29b-41d4-a716-446655440004', 'FRIEND10', 'Descuento Referido', 'fixed_amount', 10, 'USD', '2025-01-01', null, null, 89, 0, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Aplicar cupones a suscripciones
INSERT INTO subscription_coupons (subscription_id, coupon_id, applied_at, expires_at) VALUES
('880e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', '2025-01-15', '2025-02-15'),
('880e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440003', '2025-08-01', '2025-11-01');

-- Insertar facturas
INSERT INTO invoices (id, subscription_id, invoice_number, status, amount, currency, tax_amount, discount_amount, total_amount, issue_date, due_date, paid_at, period_start, period_end, payment_method_id, created_at, updated_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'INV-2025-000001', 'paid', 9.99, 'USD', 0.80, 2.00, 8.79, '2025-08-15', '2025-08-30', '2025-08-16', '2025-08-15', '2025-09-15', '770e8400-e29b-41d4-a716-446655440001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('aa0e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'INV-2025-000002', 'paid', 29.99, 'USD', 2.40, 0.00, 32.39, '2025-08-01', '2025-08-16', '2025-08-02', '2025-08-01', '2025-09-01', '770e8400-e29b-41d4-a716-446655440002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('aa0e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440004', 'INV-2025-000003', 'paid', 99.99, 'USD', 8.00, 30.00, 77.99, '2025-08-01', '2025-08-16', '2025-08-03', '2025-08-01', '2025-09-01', '770e8400-e29b-41d4-a716-446655440004', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('aa0e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440005', 'INV-2025-000004', 'paid', 299.99, 'USD', 24.00, 0.00, 323.99, '2025-09-01', '2025-09-16', '2025-09-01', '2025-09-01', '2026-09-01', '770e8400-e29b-41d4-a716-446655440005', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('aa0e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440003', 'INV-2025-000005', 'pending', 9.99, 'USD', 0.80, 0.00, 10.79, '2025-08-27', '2025-09-11', null, '2025-08-27', '2025-09-27', '770e8400-e29b-41d4-a716-446655440003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insertar pagos
INSERT INTO payments (id, invoice_id, payment_method_id, amount, currency, status, external_payment_id, provider, processed_at, created_at, updated_at) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 8.79, 'USD', 'succeeded', 'pi_1234567890abcdef', 'stripe', '2025-08-16', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bb0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 32.39, 'USD', 'succeeded', 'pi_1234567890abcdeg', 'stripe', '2025-08-02', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bb0e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004', 77.99, 'USD', 'succeeded', 'pi_1234567890abcdeh', 'stripe', '2025-08-03', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bb0e8400-e29b-41d4-a716-446655440004', 'aa0e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440005', 323.99, 'USD', 'succeeded', 'pi_1234567890abcdei', 'stripe', '2025-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insertar eventos de suscripción
INSERT INTO subscription_events (subscription_id, event_type, event_data, created_at, updated_at) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'created', '{"plan_id": "550e8400-e29b-41d4-a716-446655440001", "trial_days": 7}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('880e8400-e29b-41d4-a716-446655440001', 'trial_started', '{"trial_start": "2025-01-15", "trial_end": "2025-01-22"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('880e8400-e29b-41d4-a716-446655440001', 'trial_ended', '{"converted": true, "activation_date": "2025-01-22"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('880e8400-e29b-41d4-a716-446655440001', 'renewed', '{"period_start": "2025-08-15", "period_end": "2025-09-15", "amount": 8.79}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('880e8400-e29b-41d4-a716-446655440002', 'created', '{"plan_id": "550e8400-e29b-41d4-a716-446655440002", "trial_days": 14}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('880e8400-e29b-41d4-a716-446655440002', 'activated', '{"activation_date": "2024-12-15"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('880e8400-e29b-41d4-a716-446655440002', 'renewed', '{"period_start": "2025-08-01", "period_end": "2025-09-01", "amount": 32.39}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('880e8400-e29b-41d4-a716-446655440003', 'created', '{"plan_id": "550e8400-e29b-41d4-a716-446655440001", "trial_days": 7}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('880e8400-e29b-41d4-a716-446655440003', 'trial_started', '{"trial_start": "2025-08-20", "trial_end": "2025-08-27"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('880e8400-e29b-41d4-a716-446655440006', 'created', '{"plan_id": "550e8400-e29b-41d4-a716-446655440002", "trial_days": 14}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('880e8400-e29b-41d4-a716-446655440006', 'canceled', '{"canceled_at": "2025-08-10", "cancel_reason": "user_request", "refund_amount": 0}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insertar API Keys de prueba
INSERT INTO api_keys (id, key, description, is_active, created_at, updated_at) VALUES
('5a0e8400-e29b-41d4-a716-446655440001', 'TEST_API_KEY_123', 'Key for external service A', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('5a0e8400-e29b-41d4-a716-446655440002', 'INACTIVE_API_KEY', 'Key for inactive service B', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =============================================
-- CONSULTAS ÚTILES PARA VERIFICAR LOS DATOS
-- =============================================

-- Ver resumen de suscripciones por estado
-- SELECT status, COUNT(*) as total FROM subscriptions GROUP BY status;

-- Ver usuarios con sus suscripciones activas y método de autenticación
-- SELECT u.first_name, u.last_name, u.email, u.msisdn, u.dni, sp.name as plan_name, s.status,
--        CASE WHEN uoa.id IS NOT NULL THEN 'OAuth (' || op.display_name || ')' ELSE 'Email/Password' END as auth_method
-- FROM users u
-- JOIN subscriptions s ON u.id = s.user_id
-- JOIN subscription_plans sp ON s.plan_id = sp.id
-- LEFT JOIN user_oauth_accounts uoa ON u.id = uoa.user_id
-- LEFT JOIN oauth_providers op ON uoa.provider_id = op.id
-- WHERE s.status IN ('active', 'trialing');

-- Ver sesiones activas con información OAuth
-- SELECT us.session_token, u.first_name, u.last_name, u.email,
--        CASE WHEN us.oauth_account_id IS NOT NULL THEN op.display_name ELSE 'Email/Password' END as login_method,
--        us.ip_address, us.expires_at, us.last_activity_at
-- FROM user_sessions us
-- JOIN users u ON us.user_id = u.id
-- LEFT JOIN user_oauth_accounts uoa ON us.oauth_account_id = uoa.id
-- LEFT JOIN oauth_providers op ON uoa.provider_id = op.id
-- WHERE us.is_active = true AND us.expires_at > CURRENT_TIMESTAMP;

-- Ver estadísticas de login por método
-- SELECT 
--     CASE 
--         WHEN oauth_provider IS NOT NULL THEN 'OAuth (' || oauth_provider || ')'
--         ELSE 'Email/Password' 
--     END as login_method,
--     COUNT(*) as total_attempts,
--     SUM(CASE WHEN success THEN 1 ELSE 0 END) as successful_logins,
--     SUM(CASE WHEN NOT success THEN 1 ELSE 0 END) as failed_logins,
--     ROUND(100.0 * SUM(CASE WHEN success THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
-- FROM login_attempts 
-- WHERE attempted_at >= CURRENT_DATE - INTERVAL '30 days'
-- GROUP BY oauth_provider
-- ORDER BY total_attempts DESC;

-- Ver facturas pendientes
-- SELECT i.invoice_number, u.email, sp.name as plan, i.total_amount, i.due_date
-- FROM invoices i
-- JOIN subscriptions s ON i.subscription_id = s.id
-- JOIN users u ON s.user_id = u.id  
-- JOIN subscription_plans sp ON s.plan_id = sp.id
-- WHERE i.status = 'pending';

-- Ver ingresos por mes
-- SELECT DATE_TRUNC('month', paid_at) as month, SUM(amount) as revenue
-- FROM payments 
-- WHERE status = 'succeeded'
-- GROUP BY DATE_TRUNC('month', paid_at)
-- ORDER BY month;