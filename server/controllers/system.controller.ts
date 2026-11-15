import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const checkDatabaseStatus = async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - startTime;

    const [storeCount, couponCount, tablesResult] = await Promise.all([
      prisma.store.count({ where: { deletedAt: null } }),
      prisma.coupon.count({ where: { deletedAt: null } }),
      prisma.$queryRaw`SHOW TABLES`
    ]);

    const dbUrl = process.env.DATABASE_URL || '';
    let dbHost = 'Hostinger MySQL';
    let dbName = 'unknown';
    try {
      const urlObj = new URL(dbUrl.replace(/^mysql:\/\//, 'http://'));
      dbHost = urlObj.hostname;
      dbName = urlObj.pathname.replace(/^\//, '');
    } catch (e) {}

    return res.json({
      success: true,
      status: 'connected',
      latency: `${latency}ms`,
      host: dbHost,
      database: dbName,
      stats: {
        stores: storeCount,
        coupons: couponCount,
        tablesCount: Array.isArray(tablesResult) ? tablesResult.length : 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Database connection check error:', err);
    return res.status(500).json({
      success: false,
      status: 'disconnected',
      error: err.message || 'تعذر الاتصال بقاعدة البيانات',
      timestamp: new Date().toISOString(),
    });
  }
};
