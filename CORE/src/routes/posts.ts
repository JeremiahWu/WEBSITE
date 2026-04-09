import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authMiddleware } from "../middleware/auth";
import { Post, PostImage, User } from "../models";
import { Op } from "sequelize";

export const postsRouter = Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    cb(null, allowed.includes(file.mimetype));
  },
});

// Get feed
postsRouter.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const { count, rows } = await Post.findAndCountAll({
      where: {
        [Op.or]: [
          { visibility: "public" },
          { user_id: req.user!.id },
        ],
      },
      include: [
        { model: User, as: "author", attributes: ["id", "username", "avatar"] },
        { model: PostImage, as: "images" },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    res.json({ data: rows, page, totalPages: Math.ceil(count / limit) });
  } catch {
    res.status(500).json({ error: "服务器错误" });
  }
});

// Create post
postsRouter.post("/", authMiddleware, upload.array("images", 5), async (req: Request, res: Response) => {
  try {
    const { content, visibility } = req.body;
    if (!content || content.trim().length === 0) {
      res.status(400).json({ error: "动态内容不能为空" });
      return;
    }

    const post = await Post.create({
      user_id: req.user!.id,
      content: content.trim(),
      visibility: visibility || "public",
    });

    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      await PostImage.bulkCreate(
        files.map((f) => ({ post_id: post.id, image_url: `/uploads/${f.filename}` }))
      );
    }

    const result = await Post.findByPk(post.id, {
      include: [
        { model: User, as: "author", attributes: ["id", "username", "avatar"] },
        { model: PostImage, as: "images" },
      ],
    });

    res.status(201).json({ data: result });
  } catch {
    res.status(500).json({ error: "服务器错误" });
  }
});

// Delete post
postsRouter.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.id, user_id: req.user!.id },
      include: [{ model: PostImage, as: "images" }],
    });
    if (!post) {
      res.status(404).json({ error: "动态不存在" });
      return;
    }

    // Remove image files
    const images = (post as any).images as PostImage[];
    for (const img of images) {
      const filePath = path.join(__dirname, "..", img.image_url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await post.destroy();
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "服务器错误" });
  }
});
