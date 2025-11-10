import { Router } from 'express';
import db from '../db/knex.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing name, email or password' });
    }

    const existing = await db('users').where({ email }).first();
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }

    const hash = await bcrypt.hash(password, 10);
    const [id] = await db('users').insert({ name, email, password_hash: hash });

    const user = await db('users').where({ id }).first().select('id', 'name', 'email');
    return res.json({ success: true, message: 'User created', user });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: 'Could not create user' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Missing email or password' });
    }

    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: 'Login error' });
  }
});

export default router;
