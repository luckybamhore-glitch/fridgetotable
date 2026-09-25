import express from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import {
  generateRecipes,
  askChefAssistant,
  saveRecipe,
  getSavedRecipes,
  deleteSavedRecipe
} from '../controllers/recipeController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many AI requests. Please wait a few minutes.' }
});

// Public (rate-limited) AI endpoints
router.post(
  '/generate',
  aiLimiter,
  [body('ingredients').isArray({ min: 1 }).withMessage('Provide at least 1 ingredient'), validate],
  generateRecipes
);
router.post(
  '/chef-assistant',
  aiLimiter,
  [body('question').trim().notEmpty().withMessage('Question is required'), validate],
  askChefAssistant
);

// Private — require login, scoped per user
router.get('/saved', protect, getSavedRecipes);
router.post('/save', protect, saveRecipe);
router.delete('/saved/:id', protect, deleteSavedRecipe);

export default router;
