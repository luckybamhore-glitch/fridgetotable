import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  return res.status(400).json({
    success: false,
    message: errors.array()[0]?.msg || 'Validation failed',
    errors: errors.array().map((e) => ({ field: e.path, message: e.msg }))
  });
};

export const notFound = (req, res, _next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  if (process.env.NODE_ENV !== 'test') {
    console.error('Server error:', err);
  }
  // Mongoose duplicate key
  if (err?.code === 11000) {
    return res.status(409).json({ success: false, message: 'Email is already registered.' });
  }
  // Mongoose validation
  if (err?.name === 'ValidationError') {
    const msg = Object.values(err.errors || {})[0]?.message || 'Validation failed';
    return res.status(400).json({ success: false, message: msg });
  }
  // Multer file errors
  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, message: 'Image too large. Max 12MB.' });
  }
  res.status(status).json({
    success: false,
    message: status === 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error'
  });
};
