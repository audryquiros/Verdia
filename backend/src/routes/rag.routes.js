import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/admin.middleware.js';
import { queryRag, syncRagFromGoogleDrive } from '../controllers/rag.controller.js';

const router = Router();
router.post('/query', requireAuth, queryRag);
router.post('/sync-drive', requireAuth, requireAdmin, syncRagFromGoogleDrive);
export default router;
