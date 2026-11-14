import { Router } from 'express';
import { triggerImport, getImportStats } from '../controllers/import.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/run', requireAuth, triggerImport);
router.get('/stats', requireAuth, getImportStats);

export default router;
