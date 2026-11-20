export function requireAdmin(req, res, next) {
  if (req.auth?.user?.rol !== 'ADMIN') {
    return res.status(403).json({ message: 'Acceso administrativo requerido.' });
  }
  return next();
}
