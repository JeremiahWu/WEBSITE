#!/usr/bin/env bash
# 同时启动 网站 + 后端 API + 移动 App（三个进程并行运行）
# 按 Ctrl+C 可一次性停止所有服务

set -e
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[LABSOFT] Starting Docker services (MySQL + Redis)..."
docker compose up -d 2>&1 | grep -v "^$"
echo ""

echo "[LABSOFT] Starting all services..."
echo "  - MySQL:  localhost:3306"
echo "  - Redis:  localhost:6379"
echo "  - Website (Next.js): http://localhost:3000"
echo "  - Backend API (Express): http://localhost:4000"
echo "  - Mobile App (Expo): see Expo CLI output"
echo ""

# 捕获退出信号，清理所有子进程
trap 'echo ""; echo "[LABSOFT] Stopping all services..."; kill 0' EXIT INT TERM

# 并行启动三个服务，日志前缀区分
(npm run dev --workspace=CORE 2>&1 | sed 's/^/[API] /') &
(npm run dev --workspace=HOME 2>&1 | sed 's/^/[WEB] /') &
(cd APPS && npx expo start 2>&1 | sed 's/^/[APP] /') &

wait
