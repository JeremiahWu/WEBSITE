import { Router, Request, Response } from "express";

export const blogRouter = Router();

const WP_URL = process.env.WORDPRESS_BASE_URL || "http://localhost/wp-json";

blogRouter.get("/posts", async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const perPage = Math.min(20, Number(req.query.per_page) || 10);

    const response = await fetch(
      `${WP_URL}/wp/v2/posts?page=${page}&per_page=${perPage}&_embed`
    );

    if (!response.ok) {
      res.status(503).json({ error: "博客服务暂不可用" });
      return;
    }

    const posts = await response.json();
    const data = posts.map((p: any) => ({
      id: p.id,
      title: p.title?.rendered || "",
      excerpt: (p.excerpt?.rendered || "").replace(/<[^>]*>/g, "").trim(),
      content: p.content?.rendered || "",
      date: p.date,
      featuredImage: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
      author: p._embedded?.author?.[0]?.name || "Unknown",
    }));

    res.json({ data });
  } catch {
    res.status(503).json({ error: "博客服务暂不可用" });
  }
});
