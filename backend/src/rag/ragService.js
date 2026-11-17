import db from '../models/index.js';
import { buildContext } from './contextBuilder.js';
import { retrieveFragments } from './retriever.js';

function buildAnswer(results = []) {
  if (!results.length) {
    return 'No encontré información relevante en los documentos disponibles para este espacio financiero.';
  }

  const context = buildContext(results.slice(0, 5));
  return `Encontré información relevante en tus documentos. Esta es la información recuperada para que Vera la utilice como contexto:\n\n${context}`;
}

export async function answerWithRag({ query, spaceId, limit = 5 }) {
  if (!query?.trim()) throw new Error('query is required');
  if (!spaceId) throw new Error('spaceId is required');

  const results = await retrieveFragments({
    Fragmento: db.Fragmento,
    query,
    limit,
    spaceId,
  });

  return {
    answer: buildAnswer(results),
    sources: results.map(({ id, title, uri, content, score }) => ({
      id,
      title,
      uri,
      content,
      score: score == null ? null : Number(score),
    })),
    retrievedCount: results.length,
    provider: 'mysql-full-text-search',
  };
}
