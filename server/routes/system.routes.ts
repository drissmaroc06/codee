import { Router } from 'express';
import { checkDatabaseStatus } from '../controllers/system.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/db-status', requireAuth, checkDatabaseStatus);

export default router;
