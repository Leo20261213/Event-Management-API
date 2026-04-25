import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: 'hashed_admin_password',
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      passwordHash: 'hashed_user_password',
      role: 'USER',
    },
  });

  // Venues
  const mainHall = await prisma.venue.create({
    data: {
      name: 'Main Hall',
      address: '123 Main St',
      city: 'Charlotte',
      capacity: 500,
    },
  });

  const techCenter = await prisma.venue.create({
    data: {
      name: 'Tech Center',
      address: '456 Innovation Way',
      city: 'Charlotte',
      capacity: 300,
    },
  });

  // Events
  const musicFestival = await prisma.event.create({
    data: {
      title: 'Music Festival',
      description: 'Outdoor concert event',
      startTime: new Date('2026-05-01T18:00:00Z'),
      endTime: new Date('2026-05-01T22:00:00Z'),
      venueId: mainHall.idVenue,
    },
  });

  const techConference = await prisma.event.create({
    data: {
      title: 'Tech Conference',
      description: 'Annual technology conference',
      startTime: new Date('2026-06-10T09:00:00Z'),
      endTime: new Date('2026-06-10T17:00:00Z'),
      venueId: techCenter.idVenue,
    },
  });

  // Bookings
  await prisma.booking.create({
    data: {
      userId: user.idUser,
      eventId: musicFestival.idEvent,
      numTickets: 2,
      status: 'CONFIRMED',
    },
  });

  await prisma.booking.create({
    data: {
      userId: user.idUser,
      eventId: techConference.idEvent,
      numTickets: 1,
      status: 'CONFIRMED',
    },
  });

  console.log('Seed data inserted successfully');
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