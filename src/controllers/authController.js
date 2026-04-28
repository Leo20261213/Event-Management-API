import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';

const JWT_SECRET = process.env.JWT_SECRET;

// --- SIGNUP ---
export async function signup(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hash,
        role: req.body.role || 'USER'
      }
    });

    res.status(201).json({
      id: user.idUser,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Signup error details:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
}

// --- LOGIN ---
export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { idUser: true, email: true, passwordHash: true, role: true }
    });

    console.log('User found:', user);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    console.log('Password match result:', match);

    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // ✅ Token now includes `sub` for bookingController
      const token = jwt.sign(
    { sub: user.idUser, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }   // or '7d', '30d', etc.
  );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error details:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
}