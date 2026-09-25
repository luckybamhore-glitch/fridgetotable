import jwt from 'jsonwebtoken';

const getSecret = () => process.env.JWT_SECRET || '';

export const signToken = (userId) => {
  const secret = getSecret();
  if (!secret || secret.length < 16) {
    throw new Error('JWT_SECRET is not configured. Set a strong random value (>=16 chars) in backend/.env');
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ sub: userId }, secret, { expiresIn });
};

export const verifyToken = (token) => {
  const secret = getSecret();
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return jwt.verify(token, secret);
};
