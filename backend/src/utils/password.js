import crypto from 'node:crypto';
const N = 16384, r = 8, p = 1, keyLength = 64, saltLength = 16;
export function hashPassword(password) {
  const salt = crypto.randomBytes(saltLength);
  const derivedKey = crypto.scryptSync(password, salt, keyLength, { N, r, p });
  return `scrypt$${N}$${r}$${p}$${salt.toString('base64url')}$${derivedKey.toString('base64url')}`;
}
export function verifyPassword(password, storedHash) {
  if (!password || !storedHash) return false;
  const parts = storedHash.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [, n, rValue, pValue, saltValue, hashValue] = parts;
  const salt = Buffer.from(saltValue, 'base64url');
  const expected = Buffer.from(hashValue, 'base64url');
  const actual = crypto.scryptSync(password, salt, expected.length, { N: Number(n), r: Number(rValue), p: Number(pValue) });
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}
export function createSessionToken() { return crypto.randomBytes(32).toString('base64url'); }
export function hashSessionToken(token) { return crypto.createHash('sha256').update(token).digest('hex'); }
