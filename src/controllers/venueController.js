import prisma from '../prismaClient.js';

export async function createVenue(req, res) {
  const { name, address, city, capacity } = req.body;

  if (!name || !address || !city || typeof capacity !== 'number') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const venue = await prisma.venue.create({
      data: { name, address, city, capacity }
    });

    res.status(201).json({
      id: venue.idVenue,
      name: venue.name,
      city: venue.city
    });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getVenueById(req, res) {
  const id = req.params.idVenue;

  try {
    const venue = await prisma.venue.findUnique({
      where: { idVenue: id }
    });

    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    res.status(200).json(venue);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateVenue(req, res) {
  const id = req.params.idVenue;
  const { name, address, city, capacity } = req.body;

  try {
    const existing = await prisma.venue.findUnique({ where: { idVenue: id } });
    if (!existing) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    const updated = await prisma.venue.update({
      where: { idVenue: id },
      data: { name, address, city, capacity }
    });

    res.status(200).json(updated);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteVenue(req, res) {
  const id = req.params.idVenue;

  try {
    const existing = await prisma.venue.findUnique({ where: { idVenue: id } });
    if (!existing) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    await prisma.venue.delete({ where: { idVenue: id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}