import prisma from '../prismaClient.js';

export async function getCurrentUser(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { idUser: req.user.sub },
      select: { idUser: true, email: true, role: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('getCurrentUser error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}