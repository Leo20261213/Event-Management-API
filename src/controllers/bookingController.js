import prisma from '../prismaClient.js';

// CREATE BOOKING (USER)
export async function createBooking(req, res) {
  const { eventId, numTickets } = req.body;

  const numericTickets = Number(numTickets);

  if (!eventId || isNaN(numericTickets) || numericTickets <= 0) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { idEvent: Number(eventId) }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const booking = await prisma.booking.create({
      data: {
        eventId: Number(eventId),
        userId: req.user.sub,   // MUST exist in JWT
        numTickets: numericTickets,
        status: 'CONFIRMED'
      }
    });

    res.status(201).json({
      id: booking.idBooking,
      eventId: booking.eventId,
      numTickets: booking.numTickets,
      status: booking.status
    });
  } catch (error) {
    console.error('createBooking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET BOOKINGS (USER → own, ADMIN → all)
export async function getBookings(req, res) {
  try {
    let bookings;

    if (req.user.role === 'ADMIN') {
      bookings = await prisma.booking.findMany();
    } else {
      bookings = await prisma.booking.findMany({
        where: { userId: req.user.sub }
      });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error('getBookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET BOOKING BY ID (OWNER or ADMIN)
export async function getBookingById(req, res) {
  const id = Number(req.params.idBooking);

  try {
    const booking = await prisma.booking.findUnique({
      where: { idBooking: id }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== req.user.sub && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('getBookingById error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// UPDATE BOOKING (OWNER ONLY)
export async function updateBooking(req, res) {
  const id = Number(req.params.idBooking);
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

    if (booking.userId !== req.user.sub) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await prisma.booking.update({
      where: { idBooking: id },
      data: { numTickets }
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error('updateBooking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// DELETE BOOKING (OWNER ONLY)
export async function deleteBooking(req, res) {
  const id = Number(req.params.idBooking);

  try {
    const booking = await prisma.booking.findUnique({
      where: { idBooking: id }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== req.user.sub) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.booking.delete({
      where: { idBooking: id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('deleteBooking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}