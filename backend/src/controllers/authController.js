import bcrypt from 'bcryptjs';
import validator from 'validator';
import { body } from 'express-validator';
import User from '../models/User.js';
import { isDbConnected } from '../config/db.js';
import { signToken } from '../utils/tokens.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { memoryUsers } from '../middleware/auth.js';

// Preserve what the user typed: trim + lowercase only.
// Default normalizeEmail() strips Gmail dots and +tags
// (a.b@gmail.com -> ab@gmail.com), which made valid logins miss.
const PRESERVE_EMAIL_OPTS = {
  all_lowercase: true,
  gmail_lowercase: true,
  gmail_remove_dots: false,
  gmail_remove_subaddress: false,
  outlookdotcom_lowercase: true,
  outlookdotcom_remove_subaddress: false,
  yahoo_lowercase: true,
  yahoo_remove_subaddress: false,
  icloud_lowercase: true,
  icloud_remove_subaddress: false
};

export const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(PRESERVE_EMAIL_OPTS),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
];

export const loginValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(PRESERVE_EMAIL_OPTS),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const canonicalEmail = (email) => String(email || '').trim().toLowerCase();

// Old accounts may have been stored with dots/subaddress stripped by the
// previous aggressive normalizeEmail(). Try every plausible variant so the
// same typed credentials keep working.
const emailVariants = (email) => {
  const canonical = canonicalEmail(email);
  const variants = [canonical];
  try {
    const aggressive = validator.normalizeEmail(canonical);
    if (aggressive && !variants.includes(aggressive)) variants.push(aggressive);
  } catch { /* ignore */ }
  // Gmail dot-insensitive fallback: a.b@gmail.com <-> ab@gmail.com
  const gmailDotless = canonical.replace(/\.+(?=[^@]*@gmail\.com$)/g, '');
  if (gmailDotless && !variants.includes(gmailDotless)) variants.push(gmailDotless);
  return variants;
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const findDbUserFlexible = async (email, withPassword = false) => {
  for (const variant of emailVariants(email)) {
    let q = User.findOne({ email: variant });
    if (withPassword) q = q.select('+password');
    const user = await q;
    if (user) return user;
  }
  // Final case-insensitive exact-match sweep (heals odd casing records)
  const canonical = canonicalEmail(email);
  let q = User.findOne({ email: { $regex: `^${escapeRegex(canonical)}$`, $options: 'i' } });
  if (withPassword) q = q.select('+password');
  return q;
};

const findMemoryUserFlexible = (email) => {
  const variants = emailVariants(email);
  return memoryUsers.find((u) => variants.includes(u.email));
};

const authPayload = (user) => ({
  user: typeof user.toSafeJSON === 'function' ? user.toSafeJSON() : { id: user.id, name: user.name, email: user.email },
  token: signToken(typeof user.toSafeJSON === 'function' ? user._id.toString() : user.id)
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const canonical = canonicalEmail(email);

  if (isDbConnected()) {
    const existing = await findDbUserFlexible(canonical);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email is already registered. Please log in.' });
    }
    const user = await User.create({ name, email: canonical, password });
    // Migrate any anonymous in-memory saves is not possible; fresh account starts clean.
    return res.status(201).json({ success: true, ...authPayload(user) });
  }

  // In-memory fallback (dev without MongoDB)
  if (findMemoryUserFlexible(canonical)) {
    return res.status(409).json({ success: false, message: 'Email is already registered. Please log in.' });
  }
  const hash = await bcrypt.hash(password, 10);
  const memUser = { id: `mem_${Date.now()}`, name, email: canonical, password: hash, createdAt: new Date() };
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
    const user = await findDbUserFlexible(email, true);
    if (!user || !(await user.comparePassword(password))) {
      console.warn(`⚠️ Failed login attempt for: ${canonicalEmail(email)}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    return res.json({ success: true, ...authPayload(user) });
  }

  const mem = findMemoryUserFlexible(email);
  if (!mem || !(await bcrypt.compare(password, mem.password))) {
    console.warn(`⚠️ Failed login attempt (in-memory) for: ${canonicalEmail(email)}`);
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
