import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { connectDatabase } from "./config/database";
import "./config/redis";
import "./models"; // init associations
import { apiRouter } from "./routes/api";
import { authRouter } from "./routes/auth";
import { postsRouter } from "./routes/posts";
import { aiRouter } from "./routes/ai";
import { blogRouter } from "./routes/blog";
import { userRouter } from "./routes/user";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:8081",
      "http://localhost:19006",
    ],
  })
);
app.use(express.json());

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", apiRouter);
app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/ai", aiRouter);
app.use("/blog", blogRouter);
app.use("/user", userRouter);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "labsoft-core", timestamp: new Date().toISOString() });
});

(async () => {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`[CORE] Backend running at http://localhost:${PORT}`);
  });
})();
