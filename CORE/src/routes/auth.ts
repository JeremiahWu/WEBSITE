import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { redis } from "../config/redis";
import { User } from "../models";
import { authMiddleware } from "../middleware/auth";

export const authRouter = Router();

// Register
authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const errors: string[] = [];

    if (!username || username.length < 3 || username.length > 20) {
      errors.push("用户名需要 3-20 个字符");
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("请提供有效的邮箱地址");
    }
    if (!password || password.length < 6) {
      errors.push("密码至少需要 6 个字符");
    }
    if (errors.length > 0) {
      res.status(400).json({ error: errors.join("; "), errors });
      return;
    }

    const existing = await User.findOne({ where: { username } });
    if (existing) {
      res.status(400).json({ error: "用户名已被注册" });
      return;
    }
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      res.status(400).json({ error: "邮箱已被注册" });
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);
    await User.create({ username, email, password_hash });
    res.status(201).json({ success: true, message: "注册成功" });
  } catch (err: any) {
    res.status(500).json({ error: "服务器错误" });
  }
});

// Login
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: "请填写用户名和密码" });
      return;
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(401).json({ error: "用户名或密码错误" });
      return;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: "用户名或密码错误" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "24h" }
    );

    await redis.set(`session:${user.id}`, token, "EX", 86400);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: "服务器错误" });
  }
});

// Logout
authRouter.post("/logout", authMiddleware, async (req: Request, res: Response) => {
  try {
    await redis.del(`session:${req.user!.id}`);
    res.json({ success: true, message: "已退出登录" });
  } catch {
    res.status(500).json({ error: "服务器错误" });
  }
});
