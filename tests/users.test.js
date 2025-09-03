
const request = require('supertest');
const app = require('../index');
const { User } = require('../models/subscription');
const sequelize = require('../config/database');

// Mock environment variables for testing
process.env.JWT_SECRET = 'test_jwt_secret';

describe('Users API', () => {
  let token;
  let testUserId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    // Create a user for authentication
    await User.create({
      id: '660e8400-e29b-41d4-a716-446655440001',
      email: 'authuser@example.com',
      msisdn: '+1111111111',
      dni: 'AUTH12345',
      first_name: 'Auth',
      last_name: 'User',
      password_hash: 'authpassword',
    });

    // Login to get a token
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'authuser@example.com',
        password: 'authpassword',
      });
    token = res.body.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'newuser@example.com',
        msisdn: '+2222222222',
        dni: 'NEW12345',
        first_name: 'New',
        last_name: 'User',
        password_hash: 'newpassword',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    testUserId = res.body.id;
  });

  it('should get all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a user by ID', async () => {
    const res = await request(app)
      .get(`/api/users/${testUserId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(testUserId);
  });

  it('should update a user', async () => {
    const res = await request(app)
      .put(`/api/users/${testUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        first_name: 'UpdatedName',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.first_name).toEqual('UpdatedName');
  });

  it('should soft delete a user', async () => {
    const res = await request(app)
      .delete(`/api/users/${testUserId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(204);

    // Verify soft deletion
    const deletedUser = await User.findByPk(testUserId, { paranoid: false });
    expect(deletedUser.deleted_at).not.toBeNull();
  });

  it('should not find a soft deleted user by ID', async () => {
    const res = await request(app)
      .get(`/api/users/${testUserId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(404);
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app)
      .get('/api/users');
    expect(res.statusCode).toEqual(403);
  });

  it('should return 401 for invalid token', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.statusCode).toEqual(401);
  });
});
