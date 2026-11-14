import { Request, Response } from 'express';
import { prisma } from '../config/db';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' });
    }

    // Check if admin user exists, else seed default admin if none exist
    let admin = await prisma.adminUser.findUnique({ where: { email }, include: { role: true } });
    
    if (!admin && email === 'admin@aqwacode.com') {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      let adminRole = await prisma.role.findUnique({ where: { name: 'SuperAdmin' } });
      if (!adminRole) {
        adminRole = await prisma.role.create({ data: { name: 'SuperAdmin', description: 'Full system access' } });
      }
      admin = await prisma.adminUser.create({
        data: {
          email: 'admin@aqwacode.com',
          passwordHash: hashedPassword,
          name: 'مدير النظام',
          roleId: adminRole.id,
        },
        include: { role: true }
      });
    }

    if (!admin) {
      return res.status(401).json({ success: false, error: 'بيانات الاعتماد غير صحيحة' });
    }

    const passwordMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: 'كلمة المرور غير صحيحة' });
    }

    req.session.adminId = admin.id;
    req.session.email = admin.email;
    req.session.role = admin.role.name;

    return res.json({
      success: true,
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role.name,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: 'حدث خطأ أثناء تسجيل الدخول' });
  }
};

export const logout = async (req: Request, res: Response) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, error: 'تعذر تسجيل الخروج' });
    }
    res.clearCookie('connect.sid');
    return res.json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
  });
};

export const getMe = async (req: Request, res: Response) => {
  if (!req.session || !req.session.adminId) {
    return res.status(401).json({ success: false, error: 'غير مسجل الدخول' });
  }

  const admin = await prisma.adminUser.findUnique({
    where: { id: req.session.adminId },
    include: { role: true }
  });

  if (!admin) {
    return res.status(401).json({ success: false, error: 'المستخدم غير موجود' });
  }

  return res.json({
    success: true,
    data: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role.name,
    }
  });
};
