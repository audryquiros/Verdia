import { answerWithRag } from '../rag/ragService.js';

export async function queryRag(req, res, next) {
  try {
    const { query, spaceId, limit } = req.body;

    const result = await answerWithRag({
      query,
      spaceId,
      limit,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}
