import { Router } from 'express';
import { getStores, getStoreById, createStore, updateStore, deleteStore } from '../controllers/stores.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getStores);
router.get('/:id', getStoreById);
router.post('/', requireAuth, createStore);
router.put('/:id', requireAuth, updateStore);
router.delete('/:id', requireAuth, deleteStore);

export default router;
