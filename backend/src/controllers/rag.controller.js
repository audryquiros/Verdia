import { answerWithRag } from '../rag/ragService.js';
import { syncGoogleDrive } from '../rag/ingestService.js';

export async function queryRag(req, res, next) {
  try {
    const { query, spaceId, limit } = req.body;
    const result = await answerWithRag({ query, spaceId, limit });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function syncRagFromGoogleDrive(req, res, next) {
  try {
    const { spaceId, folderId } = req.body;
    const result = await syncGoogleDrive({
      db: req.app.locals.db,
      spaceId,
      folderId,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
}
