import { Router } from 'express';
import { logClick, getClickLogs } from '../controllers/analytics.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/click', logClick);
router.get('/logs', requireAuth, getClickLogs);

export default router;
