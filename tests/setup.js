import request from 'supertest';
import app from '../src/app.js';

export async function getAdminToken() {
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin@charlotte.edu',
      password: '2026LcUnCc1213*'
    });
  return res.body.token;
}