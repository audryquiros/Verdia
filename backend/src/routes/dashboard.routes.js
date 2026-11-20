import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { getDashboard } from '../controllers/dashboard.controller.js';

const router = Router();
router.get('/summary', requireAuth, getDashboard);
export default router;
