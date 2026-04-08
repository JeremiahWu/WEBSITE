#!/usr/bin/env bash
# 启动网站（Next.js）开发服务器
# 访问地址: http://localhost:3000

set -e
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[LABSOFT] Starting website (Next.js) on port 3000..."
npm run dev --workspace=HOME
