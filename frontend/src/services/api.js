const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
export async function apiFetch(path, options = {}) {
  const { token, headers, ...fetchOptions } = options;
  const response = await fetch(`${API_URL}${path}`, { ...fetchOptions, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(headers || {}) } });
  if (!response.ok) { let message = `Error en la API (${response.status})`; try { const body = await response.json(); message = body?.message || body?.error || message; } catch {} throw new Error(message); }
  if (response.status === 204) return null;
  return response.json();
}
export const api = { get(path, options = {}) { return apiFetch(path, { method: 'GET', ...options }); }, post(path, body, options = {}) { return apiFetch(path, { method: 'POST', body: JSON.stringify(body), ...options }); } };
