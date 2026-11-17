import { Router } from 'express';
import healthRoutes from './health.routes.js';
import ragRoutes from './rag.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/rag', ragRoutes);

export default router;
