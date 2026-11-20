import { api } from './api.js';
import { getSession } from './auth.js';

export async function queryRag({ spaceId, query, limit = 5 }) {
  return api.post('/rag/query', { spaceId, query, limit }, { token: getSession()?.token });
}
