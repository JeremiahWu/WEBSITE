import express from "express";
import cors from "cors";
import { apiRouter } from "./routes/api";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:8081"] }));
app.use(express.json());

// Routes
app.use("/api", apiRouter);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "labsoft-core", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[CORE] Backend running at http://localhost:${PORT}`);
  console.log(`[CORE] API docs at http://localhost:${PORT}/api`);
});
