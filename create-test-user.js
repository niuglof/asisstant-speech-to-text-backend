const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function createTestUser() {
  // Datos del usuario de prueba
  const userData = {
    email: 'admin@test.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'Test',
    role: 'admin',
    tenantId: uuidv4()
  };

  // Generar hash de la contraseña
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(userData.password, saltRounds);

  console.log('=== DATOS PARA INSERTAR EN LA BASE DE DATOS ===\n');
  
  // SQL para crear tenant
  console.log('-- 1. Crear tenant:');
  console.log(`INSERT INTO tenants (id, name, domain, settings, is_active, created_at, updated_at) 
VALUES (
  '${userData.tenantId}',
  'Tenant Test',
  'test.docflow.com',
  '{}',
  true,
  NOW(),
  NOW()
);\n`);

  // SQL para crear usuario
  console.log('-- 2. Crear usuario:');
  console.log(`INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at) 
VALUES (
  '${uuidv4()}',
  '${userData.tenantId}',
  '${userData.email}',
  '${passwordHash}',
  '${userData.firstName}',
  '${userData.lastName}',
  '${userData.role}',
  true,
  NOW(),
  NOW()
);\n`);

  console.log('=== DATOS PARA HACER LOGIN ===\n');
  console.log(`Email: ${userData.email}`);
  console.log(`Password: ${userData.password}\n`);

  console.log('=== FETCH PARA PROBAR ===\n');
  console.log(`fetch('/api/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    email: '${userData.email}',
    password: '${userData.password}'
  })
}).then(r => r.json()).then(console.log);`);
}

createTestUser().catch(console.error);