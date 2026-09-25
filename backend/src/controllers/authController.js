import bcrypt from 'bcryptjs';
import { body } from 'express-validator';
import User from '../models/User.js';
import { isDbConnected } from '../config/db.js';
import { signToken } from '../utils/tokens.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { memoryUsers } from '../middleware/auth.js';

export const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const authPayload = (user) => ({
  user: typeof user.toSafeJSON === 'function' ? user.toSafeJSON() : { id: user.id, name: user.name, email: user.email },
  token: signToken(typeof user.toSafeJSON === 'function' ? user._id.toString() : user.id)
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (isDbConnected()) {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email is already registered. Please log in.' });
    }
    const user = await User.create({ name, email, password });
    // Migrate any anonymous in-memory saves is not possible; fresh account starts clean.
    return res.status(201).json({ success: true, ...authPayload(user) });
  }

  // In-memory fallback (dev without MongoDB)
  if (memoryUsers.some((u) => u.email === email.toLowerCase())) {
    return res.status(409).json({ success: false, message: 'Email is already registered. Please log in.' });
  }
  const hash = await bcrypt.hash(password, 10);
  const memUser = { id: `mem_${Date.now()}`, name, email: email.toLowerCase(), password: hash, createdAt: new Date() };
  memoryUsers.push(memUser);
  return res.status(201).json({
    success: true,
    storage: 'in_memory',
    user: { id: memUser.id, name: memUser.name, email: memUser.email, createdAt: memUser.createdAt },
    token: signToken(memUser.id)
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (isDbConnected()) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    return res.json({ success: true, ...authPayload(user) });
  }

  const mem = memoryUsers.find((u) => u.email === email.toLowerCase());
  if (!mem || !(await bcrypt.compare(password, mem.password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }
  return res.json({
    success: true,
    storage: 'in_memory',
    user: { id: mem.id, name: mem.name, email: mem.email, createdAt: mem.createdAt },
    token: signToken(mem.id)
  });
});

export const me = asyncHandler(async (req, res) => {
  // req.user is set by protect middleware
  if (isDbConnected()) {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, user: user.toSafeJSON() });
  }
  const mem = memoryUsers.find((u) => u.id === req.user.id);
  if (!mem) return res.status(404).json({ success: false, message: 'User not found' });
  return res.json({
    success: true,
    storage: 'in_memory',
    user: { id: mem.id, name: mem.name, email: mem.email, createdAt: mem.createdAt }
  });
});
