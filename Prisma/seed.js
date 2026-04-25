import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 🔐 Hash passwords
  const adminPassword = await bcrypt.hash('Password123!', 10);
  const userPassword = await bcrypt.hash('Password123!', 10);

  // 👤 USERS
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      passwordHash: userPassword,
      role: 'USER',
    },
  });

  // 🏢 VENUES (✅ FIXED HERE)
  const mainHall = await prisma.venue.upsert({
    where: { idVenue: 1 }, // ✅ FIX
    update: {},
    create: {
      idVenue: 1,
      name: 'Main Hall',
      address: '123 Main St',
      city: 'Charlotte',
      capacity: 500,
    },
  });

  const techCenter = await prisma.venue.upsert({
    where: { idVenue: 2 }, // ✅ FIX
    update: {},
    create: {
      idVenue: 2,
      name: 'Tech Center',
      address: '456 Innovation Way',
      city: 'Charlotte',
      capacity: 300,
    },
  });

  // 🎉 EVENTS
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

  // 🎟 BOOKINGS
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

  console.log('✅ Seed data inserted successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });