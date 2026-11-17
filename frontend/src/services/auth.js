const SESSION_KEY = 'verdia_session';
export function startSession(user = { name: 'Audry Quiros', email: 'audry@correo.com' }) { localStorage.setItem(SESSION_KEY, JSON.stringify({ user, startedAt: new Date().toISOString() })); }
export function endSession() { localStorage.removeItem(SESSION_KEY); }
export function getSession() { try { const value = localStorage.getItem(SESSION_KEY); return value ? JSON.parse(value) : null; } catch { endSession(); return null; } }
export function isAuthenticated() { return Boolean(getSession()); }
