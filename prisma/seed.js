import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 🔹 Test DB connection first
  try {
    await prisma.$connect();
    console.log('Connected to database');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }

  // --- Users ---
  const adminHash = await bcrypt.hash('Admin123!', 10);
  const userHash = await bcrypt.hash('User123!', 10);

  await prisma.user.createMany({
    data: [
      { email: 'admin@example.com', passwordHash: adminHash, role: 'ADMIN' },
      { email: 'user@example.com', passwordHash: userHash, role: 'USER' }
    ]
  });
  console.log('Users seeded successfully!');

  // --- Venues ---
  const venue1 = await prisma.venue.create({
    data: {
      name: 'Main Hall',
      address: '123 Main St',
      city: 'Charlotte',
      capacity: 500,
    },
  });

  const venue2 = await prisma.venue.create({
    data: {
      name: 'Tech Center',
      address: '456 Innovation Way',
      city: 'Charlotte',
      capacity: 300,
    },
  });

  // --- Events ---
  const event1 = await prisma.event.create({
    data: {
      title: 'Music Festival',
      description: 'Outdoor concert event',
      startTime: new Date('2026-05-01T18:00:00Z'),
      endTime: new Date('2026-05-01T22:00:00Z'),
      venueId: venue1.idVenue,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'Tech Conference',
      description: 'Annual technology conference',
      startTime: new Date('2026-06-10T09:00:00Z'),
      endTime: new Date('2026-06-10T17:00:00Z'),
      venueId: venue2.idVenue,
    },
  });

  // --- Bookings ---
  await prisma.booking.create({
    data: {
      userId: 2, // user@example.com
      eventId: event1.idEvent,
      numTickets: 2,
      status: 'CONFIRMED',
    },
  });

  await prisma.booking.create({
    data: {
      userId: 2, // user@example.com
      eventId: event2.idEvent,
      numTickets: 1,
      status: 'CONFIRMED',
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });