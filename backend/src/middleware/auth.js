import User from '../models/User.js';
import { verifyToken } from '../utils/tokens.js';
import { isDbConnected } from '../config/db.js';

// In-memory user store fallback when MongoDB is unavailable (dev convenience only).
// NOTE: passwords are still hashed with bcrypt before storing here.
export const memoryUsers = [];

/** Required auth: rejects when no valid Bearer token. Attaches req.user = { id, name, email }. */
export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized. Please log in.' });
    }
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return res.status(401).json({ success: false, message: 'Session expired or invalid. Please log in again.' });
    }

    if (isDbConnected()) {
      const user = await User.findById(decoded.sub).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Account no longer exists.' });
      }
      req.user = { id: user._id.toString(), name: user.name, email: user.email };
      return next();
    }

    const mem = memoryUsers.find((u) => u.id === decoded.sub);
    if (!mem) {
      return res.status(401).json({ success: false, message: 'Session invalid. Please log in again.' });
    }
    req.user = { id: mem.id, name: mem.name, email: mem.email };
    return next();
  } catch (err) {
    return next(err);
  }
};

/** Optional auth: attaches req.user when a valid token is present, otherwise continues anonymously. */
export const optionalAuth = async (req, _res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return next();
    try {
      const decoded = verifyToken(token);
      if (isDbConnected()) {
        const user = await User.findById(decoded.sub).select('-password');
        if (user) req.user = { id: user._id.toString(), name: user.name, email: user.email };
      } else {
        const mem = memoryUsers.find((u) => u.id === decoded.sub);
        if (mem) req.user = { id: mem.id, name: mem.name, email: mem.email };
      }
    } catch {
      // ignore invalid token for optional routes
    }
    return next();
  } catch (err) {
    return next(err);
  }
};
