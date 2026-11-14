import { Request, Response, NextFunction } from 'express';

declare module 'express-session' {
  interface SessionData {
    adminId?: number;
    email?: string;
    role?: string;
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.adminId) {
    return next();
  }
  return res.status(401).json({ success: false, error: 'Unauthorized. Please log in as administrator.' });
};
