import express from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { analyzeFridgePhoto, getSampleFridges } from '../controllers/visionController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

const visionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many image analyses. Please try again later.' }
});

// Configure Multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 12 * 1024 * 1024 // 12MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are supported (JPEG, PNG, WEBP, etc.)'));
    }
  }
});

// Routes (optionalAuth lets us attribute scans to a user later if needed)
router.get('/samples', getSampleFridges);
router.post('/analyze', visionLimiter, optionalAuth, upload.single('image'), analyzeFridgePhoto);

export default router;
