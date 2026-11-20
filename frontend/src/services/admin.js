import { api } from './api.js';
import { getSession } from './auth.js';

function token() { return getSession()?.token; }

export const adminApi = {
  dashboard: () => api.get('/admin/dashboard', { token: token() }),
  ragOverview: () => api.get('/admin/rag/overview', { token: token() }),
  users: (search = '') => api.get(`/admin/users${search ? `?search=${encodeURIComponent(search)}` : ''}`, { token: token() }),
  documents: () => api.get('/admin/rag/documents', { token: token() }),
  uploadDocument: (payload) => api.post('/admin/rag/documents', payload, { token: token() }),
  publishDocument: (id) => api.post(`/admin/rag/documents/${id}/publish`, {}, { token: token() }),
  unpublishDocument: (id) => api.post(`/admin/rag/documents/${id}/unpublish`, {}, { token: token() }),
  supportCases: (status = '') => api.get(`/admin/support/cases${status ? `?status=${encodeURIComponent(status)}` : ''}`, { token: token() }),
  supportCase: (id) => api.get(`/admin/support/cases/${id}`, { token: token() }),
  supportReply: (id, content) => api.post(`/admin/support/cases/${id}/messages`, { content }, { token: token() }),
  supportUpdate: (id, payload) => apiFetchPatch(`/admin/support/cases/${id}`, payload),
  ragQuery: (query, limit = 5) => api.post('/admin/rag/query', { query, limit }, { token: token() }),
};

async function apiFetchPatch(path, body) {
  return apiFetchRaw(path, { method: 'PATCH', body: JSON.stringify(body), token: token() });
}

async function apiFetchRaw(path, options = {}) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
  const response = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${options.token}` } });
  if (!response.ok) { let message = `Error en la API (${response.status})`; try { const body = await response.json(); message = body?.message || message; } catch {} throw new Error(message); }
  return response.status === 204 ? null : response.json();
}

export const supportApi = {
  create: (asunto, mensaje, origen = 'USUARIO') => api.post('/support/cases', { asunto, mensaje, origen }, { token: token() }),
  list: () => api.get('/support/cases', { token: token() }),
  get: (id) => api.get(`/support/cases/${id}`, { token: token() }),
  reply: (id, content) => api.post(`/support/cases/${id}/messages`, { content }, { token: token() }),
};
