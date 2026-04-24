import prisma from '../prismaClient.js';

export async function createEvent(req, res) {
  const { title, description, startTime, endTime, venueId } = req.body;

  if (!title || !description || !startTime || !endTime || !venueId) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const venue = await prisma.venue.findUnique({
      where: { idVenue: venueId }
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
        venueId
      }
    });

    res.status(201).json({ id: event.idEvent, title: event.title });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getAllEvents(req, res) {
  try {
    const events = await prisma.event.findMany();
    res.status(200).json(events);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getEventById(req, res) {
  const id = req.params.idEvent;

  try {
    const event = await prisma.event.findUnique({
      where: { idEvent: id }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(event);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateEvent(req, res) {
  const id = req.params.idEvent;
  const { title, description, startTime, endTime, venueId } = req.body;

  try {
    const existing = await prisma.event.findUnique({ where: { idEvent: id } });
    if (!existing) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const updated = await prisma.event.update({
      where: { idEvent: id },
      data: {
        title,
        description,
        startTime: startTime ? new Date(startTime) : existing.startTime,
        endTime: endTime ? new Date(endTime) : existing.endTime,
        venueId: venueId ?? existing.venueId
      }
    });

    res.status(200).json(updated);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteEvent(req, res) {
  const id = req.params.idEvent;

  try {
    const existing = await prisma.event.findUnique({ where: { idEvent: id } });
    if (!existing) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await prisma.event.delete({ where: { idEvent: id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}