import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const logClick = async (req: Request, res: Response) => {
  try {
    const { couponId, storeId, type } = req.body;
    
    const coupNum = couponId ? parseInt(couponId.toString().replace('coup-', '')) : null;
    const storeNum = storeId ? parseInt(storeId.toString().replace('store-', '')) : null;

    await prisma.clickLog.create({
      data: {
        couponId: isNaN(coupNum!) ? null : coupNum,
        storeId: isNaN(storeNum!) ? null : storeNum,
        type: type || 'copy_code',
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
      }
    });

    if (coupNum && !isNaN(coupNum)) {
      await prisma.coupon.update({
        where: { id: coupNum },
        data: { usageCount: { increment: 1 } }
      }).catch(() => {});
    }

    return res.json({ success: true, message: 'تم تسجيل النقرة بنجاح' });
  } catch (err) {
    console.error('Log click error:', err);
    return res.status(500).json({ success: false, error: 'تعذر تسجيل النقرة' });
  }
};

export const getClickLogs = async (req: Request, res: Response) => {
  try {
    const logs = await prisma.clickLog.findMany({
      take: 100,
      orderBy: { timestamp: 'desc' }
    });

    const formatted = logs.map((l: any) => ({
      id: `log-${l.id}`,
      couponId: l.couponId ? `coup-${l.couponId}` : '',
      storeId: l.storeId ? `store-${l.storeId}` : '',
      timestamp: l.timestamp.toISOString(),
      type: l.type,
    }));

    return res.json({ success: true, data: formatted });
  } catch (err) {
    console.error('Get click logs error:', err);
    return res.status(500).json({ success: false, error: 'تعذر جلب سجل النقرات' });
  }
};
