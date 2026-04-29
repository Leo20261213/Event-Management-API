import prisma from '../prismaClient.js';

// CREATE EVENT (ADMIN)
export async function createEvent(req, res) {
  const { title, description, startTime, endTime, venueId } = req.body;

  if (!title || !description || !startTime || !endTime || !venueId) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const venue = await prisma.venue.findUnique({
      where: { idVenue: Number(venueId) }
    });

    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        venueId: Number(venueId)
      }
    });

    res.status(201).json({
      id: event.idEvent,
      title: event.title
    });
  } catch (error) {
    console.error('createEvent error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET ALL EVENTS (PUBLIC)
export async function getAllEvents(req, res) {
  try {
    const events = await prisma.event.findMany();
    res.status(200).json(events);
  } catch (error) {
    console.error('getAllEvents error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET EVENT BY ID (PUBLIC)
export async function getEventById(req, res) {
  const id = Number(req.params.idEvent);

  try {
    const event = await prisma.event.findUnique({
      where: { idEvent: id }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error('getEventById error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// UPDATE EVENT (ADMIN)
export async function updateEvent(req, res) {
  const id = Number(req.params.idEvent);
  const { title, description, startTime, endTime, venueId } = req.body;

  try {
    const existing = await prisma.event.findUnique({
      where: { idEvent: id }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const updated = await prisma.event.update({
      where: { idEvent: id },
      data: {
        title: title ?? existing.title,
        description: description ?? existing.description,
        startTime: startTime ? new Date(startTime) : existing.startTime,
        endTime: endTime ? new Date(endTime) : existing.endTime,
        venueId: venueId ? Number(venueId) : existing.venueId
      }
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error('updateEvent error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// DELETE EVENT (ADMIN)
export async function deleteEvent(req, res) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid event ID' });

  try {
    const existing = await prisma.event.findUnique({
      where: { idEvent: id },
      include: { bookings: true }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (existing.bookings.length > 0) {
      return res.status(400).json({ error: 'Cannot delete event with existing bookings' });
    }

    await prisma.event.delete({ where: { idEvent: id } });
    res.status(204).send();
  } catch (error) {
    console.error('deleteEvent error:', error.message);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}