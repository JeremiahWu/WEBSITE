import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { authMiddleware } from "../middleware/auth";
import { User } from "../models";
import { redis } from "../config/redis";

export const userRouter = Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

// Get profile
userRouter.get("/profile", authMiddleware, async (req: Request, res: Response) => {
  res.json({
    id: req.user!.id,
    username: req.user!.username,
    email: req.user!.email,
    avatar: req.user!.avatar,
    bio: req.user!.bio,
  });
});

// Update profile
userRouter.put("/profile", authMiddleware, upload.single("avatar"), async (req: Request, res: Response) => {
  try {
    const updates: any = {};
    if (req.body.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
        res.status(400).json({ error: "邮箱格式不正确" });
        return;
      }
      updates.email = req.body.email;
    }
    if (req.body.bio !== undefined) updates.bio = req.body.bio;
    if (req.file) updates.avatar = `/uploads/${req.file.filename}`;

    await User.update(updates, { where: { id: req.user!.id } });
    const user = await User.findByPk(req.user!.id, {
      attributes: { exclude: ["password_hash"] },
    });

    res.json(user);
  } catch {
    res.status(500).json({ error: "服务器错误" });
  }
});

// Change password
userRouter.put("/password", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "请填写当前密码和新密码" });
      return;
    }
    if (newPassword.length < 6) {
      res.status(400).json({ error: "新密码至少需要 6 个字符" });
      return;
    }

    const user = await User.findByPk(req.user!.id);
    const valid = await bcrypt.compare(currentPassword, user!.password_hash);
    if (!valid) {
      res.status(401).json({ error: "当前密码不正确" });
      return;
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    await User.update({ password_hash }, { where: { id: req.user!.id } });

    // Invalidate session to force re-login
    await redis.del(`session:${req.user!.id}`);

    res.json({ success: true, message: "密码已更新，请重新登录" });
  } catch {
    res.status(500).json({ error: "服务器错误" });
  }
});
