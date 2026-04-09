#!/usr/bin/env bash
# 启动后端 API 服务（Express.js）
# 访问地址: http://localhost:4000

set -e
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[LABSOFT] Ensuring Docker services (MySQL + Redis) are running..."
docker compose up -d 2>&1 | grep -v "^$"

echo "[LABSOFT] Starting backend API (Express) on port 4000..."
npm run dev --workspace=CORE
