import { getSessionUser } from '../services/auth.service.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.get('authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null;
    const auth = await getSessionUser(token, req.app.locals.db);

    if (!auth) return res.status(401).json({ message: 'Sesión inválida o expirada.' });

    req.auth = auth;
    return next();
  } catch (error) {
    return next(error);
  }
}
