// tests/booking.test.js
import request from 'supertest';
import app from '../src/app.js';

let token;
let eventId;

beforeAll(async () => {
  // Log in as admin to get token
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin@charlotte.edu',
      password: '2026LcUnCc1213*'
    });
  token = loginRes.body.token;

  // Fetch existing event to link booking
  const eventRes = await request(app).get('/api/events');
  const workshop = eventRes.body.find(e => e.title === 'Cybersecurity Workshop');
  eventId = workshop ? workshop.idEvent : null;
});

describe('Booking Routes', () => {
    test('User can create a booking for an event', async () => {
    const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
        eventId: eventId,
        numTickets: 2
        });
    expect(res.statusCode).toBe(201);
    expect(res.body.eventId).toBe(eventId);
    });

   test('GET /api/bookings returns created booking', async () => {
    const res = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.some(b => b.numTickets === 2)).toBe(true);
    });

  test('Invalid booking request returns 400', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        eventId: null,
        userName: '',
        userEmail: 'invalid',
        seats: 0
      });
    expect(res.statusCode).toBe(400);
  });
});