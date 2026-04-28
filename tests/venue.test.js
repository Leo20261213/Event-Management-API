// tests/venue.test.js
import request from 'supertest';
import app from '../src/app.js';

let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin@charlotte.edu',
      password: '2026LcUnCc1213*'
    });
  token = res.body.token;
});

describe('Venue Routes', () => {
  test('Admin can create a venue', async () => {
    const res = await request(app)
      .post('/api/venues')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Main Hall',
        address: '123 Main St',
        city: 'Charlotte',
        capacity: 500
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Main Hall');
  });

  test('Non‑admin cannot create a venue', async () => {
    const res = await request(app)
      .post('/api/venues')
      .set('Authorization', `Bearer invalidtoken`)
      .send({
        name: 'Test Venue',
        city: 'Charlotte'
      });
    expect(res.statusCode).toBe(401);
  });

  // ✅ Add this new test below
  test('GET /api/venues returns created venue', async () => {
    const res = await request(app).get('/api/venues');
    expect(res.statusCode).toBe(200);
    expect(res.body.some(v => v.name === 'Main Hall')).toBe(true);
  });
});