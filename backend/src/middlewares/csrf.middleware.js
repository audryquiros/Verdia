import crypto from 'node:crypto';

function getCookie(req, name) {
  const raw = req.get('cookie') || '';
  const entry = raw.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : null;
}

export function issueCsrfCookie(_req, res, next) {
  if (!getCookie(_req, 'verdia_csrf')) {
    const token = crypto.randomBytes(24).toString('hex');
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    res.append('Set-Cookie', `verdia_csrf=${token}; Max-Age=86400; Path=/; SameSite=Lax${secure}`);
  }
  next();
}

export function verifyCsrf(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method) || req.path.endsWith('/auth/login')) return next();
  const cookie = getCookie(req, 'verdia_csrf');
  const header = req.get('x-csrf-token');
  if (!cookie || !header || cookie !== header) {
    return res.status(403).json({ message: 'Solicitud no válida.' });
  }
  return next();
}
