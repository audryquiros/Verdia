import { api } from './api.js';
const SESSION_KEY = 'verdia_session';
function saveSession(data) { localStorage.setItem(SESSION_KEY, JSON.stringify(data)); return data; }
export async function login(email, password) { return saveSession(await api.post('/auth/login', { email, password })); }
export async function logout() { const session = getSession(); try { if (session?.token) await api.post('/auth/logout', {}, { token: session.token }); } finally { endSession(); } }
export async function getCurrentUser() { const session = getSession(); if (!session?.token) return null; try { return (await api.get('/auth/me', { token: session.token })).user; } catch { endSession(); return null; } }
export function endSession() { localStorage.removeItem(SESSION_KEY); }
export function getSession() { try { const value = localStorage.getItem(SESSION_KEY); return value ? JSON.parse(value) : null; } catch { endSession(); return null; } }
export function isAuthenticated() { return Boolean(getSession()?.token); }
