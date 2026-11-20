import { answerWithRag } from '../rag/ragService.js';
import { syncGoogleDrive } from '../rag/ingestService.js';

async function resolveSpaceId(req, requestedSpaceId) {
  const db = req.app.locals.db;
  if (req.auth.user.rol === 'ADMIN' && requestedSpaceId) return requestedSpaceId;
  const ownSpace = await db.EspacioFinanciero.findOne({ where: { usuario_id: req.auth.user.id, activo: true }, order: [['id', 'ASC']] });
  if (!ownSpace) throw Object.assign(new Error('No tienes un espacio financiero activo.'), { status: 400 });
  if (requestedSpaceId && Number(requestedSpaceId) !== Number(ownSpace.id)) throw Object.assign(new Error('No puedes consultar información de otro espacio financiero.'), { status: 403 });
  return ownSpace.id;
}

export async function queryRag(req, res, next) {
  try {
    const { query, spaceId, limit } = req.body;
    const safeSpaceId = await resolveSpaceId(req, spaceId);
    const result = await answerWithRag({ query, spaceId: safeSpaceId, limit });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function syncRagFromGoogleDrive(req, res, next) {
  try {
    const { spaceId, folderId } = req.body;
    const result = await syncGoogleDrive({ db: req.app.locals.db, spaceId, folderId });
    res.json(result);
  } catch (error) {
    next(error);
  }
}
