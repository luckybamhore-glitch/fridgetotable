import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, me, registerValidation, loginValidation } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Brute-force protection for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again in 15 minutes.' }
});

router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.get('/me', protect, me);

export default router;
