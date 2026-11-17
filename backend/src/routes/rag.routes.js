import { Router } from 'express';
import { queryRag, syncRagFromGoogleDrive } from '../controllers/rag.controller.js';

const router = Router();

router.post('/query', queryRag);
router.post('/sync-drive', syncRagFromGoogleDrive);

export default router;
