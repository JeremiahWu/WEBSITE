import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { redis } from "../config/redis";
import { User } from "../models";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "未提供认证令牌" });
    return;
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as { userId: number };
    const session = await redis.get(`session:${payload.userId}`);
    if (!session || session !== token) {
      res.status(401).json({ error: "会话已过期" });
      return;
    }

    const user = await User.findByPk(payload.userId, {
      attributes: { exclude: ["password_hash"] },
    });
    if (!user) {
      res.status(401).json({ error: "用户不存在" });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "无效的令牌" });
  }
}
