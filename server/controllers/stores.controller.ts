import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const getStores = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 24;
    const search = (req.query.search as string) || '';
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;

    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { nameAr: { contains: search } },
        { nameEn: { contains: search } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        include: { category: true, _count: { select: { coupons: true } } },
        skip,
        take: limit,
        orderBy: { priority: 'desc' },
      }),
      prisma.store.count({ where }),
    ]);

    const formattedStores = stores.map((s: any) => ({
      id: `store-${s.id}`,
      dbId: s.id,
      name: s.nameAr,
      nameEn: s.nameEn,
      slug: s.slug,
      url: s.url,
      logo: s.logoUrl || '/public/assets/aistudio/____-logo_da95592c.jpg',
      banner: s.bannerUrl,
      shortDesc: s.shortDescAr || '',
      fullDesc: s.fullDescAr || '',
      categoryId: `cat-${s.categoryId}`,
      dbCategoryId: s.categoryId,
      countries: ['SA', 'AE', 'KW', 'QA', 'BH', 'OM'],
      isFeatured: s.isFeatured,
      priority: s.priority,
      status: s.status,
      seoTitle: s.seoTitle,
      seoDescription: s.seoDesc,
      focusKeyword: s.focusKeyword,
      createdAt: s.createdAt.toISOString().split('T')[0],
      couponCount: s._count.coupons,
    }));

    return res.json({
      success: true,
      data: formattedStores,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (err) {
    console.error('Get stores error:', err);
    return res.status(500).json({ success: false, error: 'تعذر جلب المتاجر' });
  }
};

export const getStoreById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const store = await prisma.store.findUnique({
      where: { id },
      include: { category: true, coupons: true }
    });

    if (!store) {
      return res.status(404).json({ success: false, error: 'المتجر غير موجود' });
    }

    return res.json({ success: true, data: store });
  } catch (err) {
    console.error('Get store by ID error:', err);
    return res.status(500).json({ success: false, error: 'تعذر جلب تفاصيل المتجر' });
  }
};

export const createStore = async (req: Request, res: Response) => {
  try {
    const { name, nameEn, slug, url, logo, shortDesc, fullDesc, categoryId, isFeatured, status } = req.body;
    
    const catStr = categoryId ? categoryId.toString() : '1';
    const catIdNum = parseInt(catStr.replace('cat-', ''));
    const catNum = isNaN(catIdNum) ? 1 : catIdNum;

    const newStore = await prisma.store.create({
      data: {
        nameAr: name,
        nameEn: nameEn || name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        url: url || 'https://www.google.com',
        logoUrl: logo,
        shortDescAr: shortDesc,
        fullDescAr: fullDesc,
        categoryId: catNum,
        isFeatured: !!isFeatured,
        status: status || 'published',
      }
    });

    return res.json({ success: true, data: newStore });
  } catch (err) {
    console.error('Create store error:', err);
    return res.status(500).json({ success: false, error: 'تعذر إنشاء المتجر' });
  }
};

export const updateStore = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, nameEn, slug, url, logo, shortDesc, fullDesc, isFeatured, status } = req.body;

    const updated = await prisma.store.update({
      where: { id },
      data: {
        nameAr: name,
        nameEn: nameEn,
        slug: slug,
        url: url,
        logoUrl: logo,
        shortDescAr: shortDesc,
        fullDescAr: fullDesc,
        isFeatured: isFeatured,
        status: status,
      }
    });

    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Update store error:', err);
    return res.status(500).json({ success: false, error: 'تعذر تحديث المتجر' });
  }
};

export const deleteStore = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.store.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    return res.json({ success: true, message: 'تم حذف المتجر بنجاح' });
  } catch (err) {
    console.error('Delete store error:', err);
    return res.status(500).json({ success: false, error: 'تعذر حذف المتجر' });
  }
};
