// tests/auth.test.js
import request from 'supertest';
import app from '../src/app.js';

describe('Auth Routes', () => {
  test('Admin login returns a valid token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@charlotte.edu',
        password: '2026LcUnCc1213*'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});