import { Op } from 'sequelize';
import { hashSessionToken, verifyPassword, createSessionToken } from '../utils/password.js';
const SESSION_DAYS = 30;
function publicUser(user) { return { id: user.id, email: user.email, nombre: user.nombre, apellido: user.apellido, foto_url: user.foto_url, email_verificado_at: user.email_verificado_at }; }
export async function login({ email, password, ip, userAgent }, db) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail || !password) { const error = new Error('Correo y contraseña son obligatorios.'); error.status = 400; throw error; }
  const user = await db.Usuario.findOne({ where: { email: normalizedEmail } });
  if (!user || user.estado !== 'ACTIVO' || !verifyPassword(password, user.password_hash)) { const error = new Error('Correo o contraseña incorrectos.'); error.status = 401; throw error; }
  const token = createSessionToken();
  const expiraAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.Sesion.create({ usuario_id: user.id, token_hash: hashSessionToken(token), ip: ip || null, user_agent: userAgent || null, expira_at: expiraAt });
  return { token, expiresAt: expiraAt.toISOString(), user: publicUser(user) };
}
export async function getSessionUser(token, db) {
  if (!token) return null;
  const session = await db.Sesion.findOne({ where: { token_hash: hashSessionToken(token), revocada_at: null, expira_at: { [Op.gt]: new Date() } }, include: [{ model: db.Usuario }] });
  if (!session || !session.Usuario || session.Usuario.estado !== 'ACTIVO') return null;
  return { session, user: publicUser(session.Usuario) };
}
export async function logout(token, db) {
  if (!token) return;
  await db.Sesion.update({ revocada_at: new Date() }, { where: { token_hash: hashSessionToken(token), revocada_at: null } });
}
