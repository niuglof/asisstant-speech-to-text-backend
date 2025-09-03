# Unit Tests for Subscription Service API

This document outlines the unit tests created for the Node.js backend API, covering authentication, user management, and generic CRUD operations for subscription-related models.

## How to Run the Tests

1.  **Ensure Dependencies are Installed**: Make sure you have `jest` and `supertest` installed. If not, run:
    ```bash
    npm install jest supertest --save-dev
    ```

2.  **Run Tests**: In your terminal, navigate to the `packages/backend` directory and run the following command:
    ```bash
    npm test
    ```

**Important Notes:**

*   **Database State**: The tests use `sequelize.sync({ force: true })` in their `beforeAll` hooks. This means that before each test suite runs, your database tables will be dropped and recreated. **Do not run these tests against a production database.**
*   **Environment Variables**: The tests mock `process.env.JWT_SECRET` with `'test_jwt_secret'`. Ensure your actual application uses the same secret for consistency during testing, or adjust the test secret as needed.
*   **Test Data**: The tests create their own test data. You might need to adjust the test data (e.g., user IDs, emails) if they conflict with existing data or constraints in your development database.

---

## 1. Auth API Tests (`tests/auth.test.js`)

This test suite covers the authentication functionality, specifically the `/api/login` endpoint. It ensures that users can log in successfully with valid credentials and handles cases of invalid or missing credentials.

```javascript
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
```

---

## 2. Users API Tests (`tests/users.test.js`)

This test suite covers the CRUD (Create, Read, Update, Delete) operations for the `/api/users` endpoint. It also includes tests for authentication and soft deletion functionality.

```javascript
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
```

---

## 3. Subscription Plans API Tests (`tests/subscriptions.test.js`)

This test suite covers the generic CRUD operations for the `/api/subscription_plans` endpoint. It demonstrates how to test the creation, retrieval, update, and soft deletion of subscription plans, along with authentication checks.

```javascript
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
