import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const getCoupons = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 24;
    const search = (req.query.search as string) || '';
    const storeId = req.query.storeId ? parseInt(req.query.storeId as string) : undefined;

    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { titleAr: { contains: search } },
        { code: { contains: search } },
      ];
    }

    if (storeId) {
      where.storeId = storeId;
    }

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        include: { store: true },
        skip,
        take: limit,
        orderBy: { priority: 'desc' },
      }),
      prisma.coupon.count({ where }),
    ]);

    const formattedCoupons = coupons.map((c: any) => ({
      id: `coup-${c.id}`,
      dbId: c.id,
      title: c.titleAr,
      code: c.code,
      description: c.descriptionAr || '',
      storeId: `store-${c.storeId}`,
      dbStoreId: c.storeId,
      discountValue: c.discountValue,
      offerType: c.offerType as any,
      expiryDate: c.expiryDate || '2026-12-31',
      country: 'SA',
      status: c.status as any,
      isFeatured: c.isFeatured,
      isVerified: c.isVerified,
      isExclusive: c.isExclusive,
      priority: c.priority,
      affiliateUrl: c.affiliateUrl || c.store.url,
      usageCount: c.usageCount,
      successRate: c.successRate,
      createdAt: c.createdAt.toISOString().split('T')[0],
    }));

    return res.json({
      success: true,
      data: formattedCoupons,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (err) {
    console.error('Get coupons error:', err);
    return res.status(500).json({ success: false, error: 'تعذر جلب الكوبونات' });
  }
};

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const { title, code, description, storeId, discountValue, offerType, expiryDate, status, isVerified, isExclusive, affiliateUrl } = req.body;
    
    const storeIdNum = parseInt(storeId?.toString().replace('store-', '') || '1');

    const newCoupon = await prisma.coupon.create({
      data: {
        titleAr: title,
        code: code.toUpperCase(),
        descriptionAr: description,
        storeId: isNaN(storeIdNum) ? 1 : storeIdNum,
        discountValue: discountValue || 'خصم خاص',
        offerType: offerType || 'discount_code',
        expiryDate: expiryDate || '2026-12-31',
        status: status || 'published',
        isVerified: isVerified !== undefined ? isVerified : true,
        isExclusive: !!isExclusive,
        affiliateUrl: affiliateUrl,
      }
    });

    return res.json({ success: true, data: newCoupon });
  } catch (err) {
    console.error('Create coupon error:', err);
    return res.status(500).json({ success: false, error: 'تعذر إنشاء الكوبون' });
  }
};

export const updateCoupon = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { title, code, description, discountValue, offerType, expiryDate, status, isVerified, isExclusive, affiliateUrl } = req.body;

    const updated = await prisma.coupon.update({
      where: { id },
      data: {
        titleAr: title,
        code: code ? code.toUpperCase() : undefined,
        descriptionAr: description,
        discountValue: discountValue,
        offerType: offerType,
        expiryDate: expiryDate,
        status: status,
        isVerified: isVerified,
        isExclusive: isExclusive,
        affiliateUrl: affiliateUrl,
      }
    });

    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Update coupon error:', err);
    return res.status(500).json({ success: false, error: 'تعذر تحديث الكوبون' });
  }
};

export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.coupon.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    return res.json({ success: true, message: 'تم حذف الكوبون بنجاح' });
  } catch (err) {
    console.error('Delete coupon error:', err);
    return res.status(500).json({ success: false, error: 'تعذر حذف الكوبون' });
  }
};
