import prisma from '../prismaClient.js';

export async function createBooking(req, res) {
  const { eventId, numTickets } = req.body;

  if (!eventId || typeof numTickets !== 'number' || numTickets <= 0) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { idEvent: eventId }
    });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const booking = await prisma.booking.create({
      data: {
        eventId,
        userId: req.user.idUser,
        numTickets,
        status: 'CONFIRMED'
      }
    });

    res.status(201).json({
      id: booking.idBooking,
      eventId: booking.eventId,
      numTickets: booking.numTickets,
      status: booking.status
    });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getBookings(req, res) {
  try {
    let bookings;
    if (req.user.role === 'ADMIN') {
      bookings = await prisma.booking.findMany();
    } else {
      bookings = await prisma.booking.findMany({
        where: { userId: req.user.idUser }
      });
    }

    res.status(200).json(bookings);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getBookingById(req, res) {
  const id = req.params.idBooking;

  try {
    const booking = await prisma.booking.findUnique({
      where: { idBooking: id }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (
      booking.userId !== req.user.idUser &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.status(200).json(booking);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateBooking(req, res) {
  const id = req.params.idBooking;
  const { numTickets } = req.body;

  if (typeof numTickets !== 'number' || numTickets <= 0) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { idBooking: id }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== req.user.idUser) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await prisma.booking.update({
      where: { idBooking: id },
      data: { numTickets }
    });

    res.status(200).json(updated);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteBooking(req, res) {
  const id = req.params.idBooking;

  try {
    const booking = await prisma.booking.findUnique({
      where: { idBooking: id }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== req.user.idUser) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.booking.delete({ where: { idBooking: id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}