import { api } from './api';

export async function queryRag({ spaceId, query, limit = 5 }) {
  const response = await api.post('/rag/query', {
    spaceId,
    query,
    limit,
  });
  return response.data;
}
