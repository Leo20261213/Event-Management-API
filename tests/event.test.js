// tests/event.test.js
import request from 'supertest';
import app from '../src/app.js';

let token;
let venueId;

beforeAll(async () => {
  // Log in as admin to get token
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin@charlotte.edu',
      password: '2026LcUnCc1213*'
    });
  token = loginRes.body.token;

  // Fetch existing venue to link event
  const venueRes = await request(app).get('/api/venues');
  const mainHall = venueRes.body.find(v => v.name === 'Main Hall');
  venueId = mainHall ? mainHall.idVenue : null;
});

describe('Event Routes', () => {
    test('Admin can create an event', async () => {
    const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .send({
        title: 'Cybersecurity Workshop',
        description: 'Hands-on session on network forensics',
        startTime: '2026-05-10T10:00:00',
        endTime: '2026-05-10T12:00:00',
        venueId: venueId
        });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Cybersecurity Workshop');
    });

  test('GET /api/events returns created event', async () => {
    const res = await request(app).get('/api/events');
    expect(res.statusCode).toBe(200);
    expect(res.body.some(e => e.title === 'Cybersecurity Workshop')).toBe(true);
  });

  test('Non‑admin cannot create an event', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer invalidtoken`)
      .send({
        title: 'Unauthorized Event',
        description: 'Should fail',
        date: '2026-05-12T14:00:00',
        venueId: venueId
      });
    expect(res.statusCode).toBe(401);
  });
});