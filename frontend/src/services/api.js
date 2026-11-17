const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    let message = `Error en la API (${response.status})`;
    try {
      const body = await response.json();
      message = body?.message || body?.error || message;
    } catch {
      // Keep the generic HTTP error when the server does not return JSON.
    }
    throw new Error(message);
  }

  return response.json();
}

export const api = {
  post(path, body) {
    return apiFetch(path, { method: 'POST', body: JSON.stringify(body) });
  },
};
