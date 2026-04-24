import prisma from '../src/prismaClient.js';
import bcrypt from 'bcrypt';

async function main() {
  const password = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password,
      role: 'ADMIN'
    }
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password,
      role: 'USER'
    }
  });

  const venue = await prisma.venue.create({
    data: {
      name: 'Main Hall',
      address: '123 Main St',
      city: 'Charlotte',
      capacity: 500
    }
  });

  const event = await prisma.event.create({
    data: {
      title: 'Music Festival',
      description: 'Outdoor concert event',
      startTime: new Date('2026-05-01T18:00:00Z'),
      endTime: new Date('2026-05-01T22:00:00Z'),
      venueId: venue.idVenue
    }
  });

  await prisma.booking.create({
    data: {
      userId: user.idUser,
      eventId: event.idEvent,
      numTickets: 2,
      status: 'CONFIRMED'
    }
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});