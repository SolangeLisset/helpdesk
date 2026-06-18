import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

export function signAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
  );
}

export function createResetToken() {
  return nanoid(48);
}
