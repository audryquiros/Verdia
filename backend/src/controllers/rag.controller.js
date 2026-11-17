import { answerWithRag } from '../rag/ragService.js';

export async function queryRag(req, res, next) {
  try {
    const { query, spaceId } = req.body;

    const result = await answerWithRag({
      query,
      spaceId,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}
