
const request = require('supertest');
const app = require('../index');
const { SubscriptionPlan, User } = require('../models/subscription');
const sequelize = require('../config/database');

// Mock environment variables for testing
process.env.JWT_SECRET = 'test_jwt_secret';

describe('Subscription Plans API', () => {
  let token;
  let testPlanId;

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

  it('should create a new subscription plan', async () => {
    const res = await request(app)
      .post('/api/subscription_plans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Plan',
        description: 'A plan for testing',
        price: 10.00,
        currency: 'USD',
        billing_period: 'monthly',
        billing_interval: 1,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    testPlanId = res.body.id;
  });

  it('should get all subscription plans', async () => {
    const res = await request(app)
      .get('/api/subscription_plans')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a subscription plan by ID', async () => {
    const res = await request(app)
      .get(`/api/subscription_plans/${testPlanId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(testPlanId);
  });

  it('should update a subscription plan', async () => {
    const res = await request(app)
      .put(`/api/subscription_plans/${testPlanId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        price: 15.00,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.price).toEqual('15.00');
  });

  it('should soft delete a subscription plan', async () => {
    const res = await request(app)
      .delete(`/api/subscription_plans/${testPlanId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(204);

    // Verify soft deletion
    const deletedPlan = await SubscriptionPlan.findByPk(testPlanId, { paranoid: false });
    expect(deletedPlan.deleted_at).not.toBeNull();
  });

  it('should not find a soft deleted subscription plan by ID', async () => {
    const res = await request(app)
      .get(`/api/subscription_plans/${testPlanId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(404);
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app)
      .get('/api/subscription_plans');
    expect(res.statusCode).toEqual(403);
  });

  it('should return 401 for invalid token', async () => {
    const res = await request(app)
      .get('/api/subscription_plans')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.statusCode).toEqual(401);
  });
});
