import { api } from './api';

export async function queryRag({ spaceId, query, limit = 5 }) {
  return api.post('/rag/query', {
    spaceId,
    query,
    limit,
  });
}
