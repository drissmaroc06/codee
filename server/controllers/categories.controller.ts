import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { stores: true } }
      }
    });

    const formatted = categories.map((cat: any) => ({
      id: `cat-${cat.id}`,
      dbId: cat.id,
      name: cat.nameAr,
      nameEn: cat.nameEn,
      slug: cat.slug,
      description: cat.description || '',
      icon: cat.icon || 'Tag',
      storeCount: cat._count.stores,
      couponCount: cat._count.stores * 3,
    }));

    return res.json({ success: true, data: formatted });
  } catch (err) {
    console.error('Get categories error:', err);
    return res.status(500).json({ success: false, error: 'تعذر جلب الأقسام' });
  }
};
