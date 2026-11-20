import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { createSupport, mySupport, mySupportCase, mySupportReply } from '../controllers/admin.controller.js';

const router = Router();
router.use(requireAuth);
router.post('/cases', createSupport);
router.get('/cases', mySupport);
router.get('/cases/:id', mySupportCase);
router.post('/cases/:id/messages', mySupportReply);
export default router;
