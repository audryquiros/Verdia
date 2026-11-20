import { getSessionUser, login, logout } from '../services/auth.service.js';
function getBearerToken(req) { const header = req.get('authorization') || ''; return header.startsWith('Bearer ') ? header.slice(7).trim() : null; }
export async function loginController(req, res, next) { try { res.status(200).json(await login({ email: req.body?.email, password: req.body?.password, ip: req.ip, userAgent: req.get('user-agent') }, req.app.locals.db)); } catch (error) { next(error); } }
export async function meController(req, res, next) { try { const auth = await getSessionUser(getBearerToken(req), req.app.locals.db); if (!auth) return res.status(401).json({ message: 'Sesión inválida o expirada.' }); return res.json({ user: auth.user, expiresAt: auth.session.expira_at }); } catch (error) { next(error); } }
export async function logoutController(req, res, next) { try { await logout(getBearerToken(req), req.app.locals.db); res.status(204).send(); } catch (error) { next(error); } }
