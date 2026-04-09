import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";

export const aiRouter = Router();

const LMSTUDIO_URL = process.env.LMSTUDIO_BASE_URL || "http://localhost:1234";

aiRouter.post("/chat", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "请提供消息内容" });
      return;
    }

    const response = await fetch(`${LMSTUDIO_URL}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "default",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      res.status(503).json({ error: "AI 服务暂不可用" });
      return;
    }

    const data = await response.json();
    res.json({ message: data.choices[0].message });
  } catch {
    res.status(503).json({ error: "AI 服务暂不可用" });
  }
});
