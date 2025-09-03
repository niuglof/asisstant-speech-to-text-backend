
const request = require('supertest');
const app = require('../index'); // Assuming your main app file is index.js
const { User } = require('../models/subscription');
const sequelize = require('../config/database');

// Mock environment variables for testing
process.env.JWT_SECRET = 'test_jwt_secret';

describe('Auth API', () => {
  beforeAll(async () => {
    // Sync database and create a test user
    await sequelize.sync({ force: true }); // Use force:true for testing to clear db
    await User.create({
      id: '660e8400-e29b-41d4-a716-446655440001',
      email: 'test@example.com',
      msisdn: '+1234567890',
      dni: '12345678A',
      first_name: 'Test',
      last_name: 'User',
      password_hash: 'password123',
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should login a user and return a token', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should return 400 for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Invalid Credentials');
  });

  it('should return 400 for missing credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'test@example.com',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('All input is required');
  });
});
