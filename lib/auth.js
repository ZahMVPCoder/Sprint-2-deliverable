import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';

// Hashes a plaintext password and returns "salt:hash"
export function hashPassword(plaintext) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(plaintext, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

// Verifies a plaintext password against the stored "salt:hash" string
export function verifyPassword(plaintext, stored) {
  const [salt, hash] = stored.split(':');
  const hashBuffer = Buffer.from(hash, 'hex');
  const supplied = scryptSync(plaintext, salt, 64);
  return timingSafeEqual(hashBuffer, supplied);
}
