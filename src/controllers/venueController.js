import prisma from '../prismaClient.js';

// GET all venues
export async function getAllVenues(req, res) {
  try {
    const venues = await prisma.venue.findMany();
    res.status(200).json(venues);
  } catch (error) {
    console.error('getAllVenues error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// POST create venue
export async function createVenue(req, res) {
  const { name, address, city, capacity } = req.body;
  const numericCapacity = Number(capacity);

  if (!name || !address || !city || isNaN(numericCapacity)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const venue = await prisma.venue.create({
      data: { name, address, city, capacity: numericCapacity }
    });

    res.status(201).json({
      id: venue.idVenue,
      name: venue.name,
      city: venue.city
    });
  } catch (error) {
    console.error('createVenue error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET venue by ID
export async function getVenueById(req, res) {
  const id = parseInt(req.params.idVenue);

  try {
    const venue = await prisma.venue.findUnique({
      where: { idVenue: id }
    });

    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    res.status(200).json(venue);
  } catch (error) {
    console.error('getVenueById error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// PUT update venue
export async function updateVenue(req, res) {
  const id = parseInt(req.params.idVenue);
  const { name, address, city, capacity } = req.body;
  const numericCapacity = Number(capacity);

  try {
    const existing = await prisma.venue.findUnique({ where: { idVenue: id } });
    if (!existing) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    const updated = await prisma.venue.update({
      where: { idVenue: id },
      data: { name, address, city, capacity: numericCapacity }
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error('updateVenue error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// DELETE venue
export async function deleteVenue(req, res) {
  const id = parseInt(req.params.idVenue);

  try {
    const existing = await prisma.venue.findUnique({ where: { idVenue: id } });
    if (!existing) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    await prisma.venue.delete({ where: { idVenue: id } });
    res.status(204).send();
  } catch (error) {
    console.error('deleteVenue error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}