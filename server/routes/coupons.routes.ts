import { Router } from 'express';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../controllers/coupons.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getCoupons);
router.post('/', requireAuth, createCoupon);
router.put('/:id', requireAuth, updateCoupon);
router.delete('/:id', requireAuth, deleteCoupon);

export default router;
