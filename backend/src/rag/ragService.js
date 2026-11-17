import { buildContext } from './contextBuilder.js';
import { GoogleCloudRagProvider } from './googleCloud.js';

export async function answerWithRag({
  query,
  spaceId,
  provider = new GoogleCloudRagProvider(),
}) {
  if (!query?.trim()) {
    throw new Error('query is required');
  }

  if (!spaceId) {
    throw new Error('spaceId is required');
  }

  const results = await provider.retrieve({
    query,
    spaceId,
  });

  const context = buildContext(results);

  const answer = await provider.generateAnswer({
    query,
    context,
    sources: results,
  });

  return {
    answer,
    sources: results,
    retrievedCount: results.length,
  };
}
