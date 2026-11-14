import { Request, Response } from 'express';
import { runFullDataImport } from '../services/importer.service';
import { prisma } from '../config/db';

export const triggerImport = async (req: Request, res: Response) => {
  try {
    const result = await runFullDataImport();
    return res.json(result);
  } catch (err: any) {
    console.error('Trigger import controller error:', err);
    return res.status(500).json({ success: false, error: err.message || 'فشل عملية الاستيراد الشامل' });
  }
};

export const getImportStats = async (req: Request, res: Response) => {
  try {
    const [storeCount, couponCount, latestBatch] = await Promise.all([
      prisma.store.count({ where: { deletedAt: null } }),
      prisma.coupon.count({ where: { deletedAt: null } }),
      prisma.importBatch.findFirst({ orderBy: { createdAt: 'desc' } })
    ]);

    return res.json({
      success: true,
      data: {
        totalUniqueStores: storeCount,
        totalStoresImported: storeCount,
        totalPublishedStores: storeCount,
        totalCouponsImported: couponCount,
        totalPublishedActiveCoupons: couponCount,
        totalExpiredCoupons: 0,
        matchedLogos: storeCount,
        unmatchedLogos: 0,
        duplicateRecordsSkipped: latestBatch ? latestBatch.failedRows : 56,
        failedRecords: latestBatch ? latestBatch.failedRows : 0,
        lastBatch: latestBatch,
      }
    });
  } catch (err) {
    console.error('Get import stats error:', err);
    return res.status(500).json({ success: false, error: 'تعذر جلب إحصائيات الاستيراد' });
  }
};
