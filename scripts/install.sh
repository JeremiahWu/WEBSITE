#!/usr/bin/env bash
# 一键安装所有子项目的依赖

set -e
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[LABSOFT] Installing dependencies for HOME/ CORE/ APPS/..."
npm install

echo ""
echo "[LABSOFT] Done. Next steps:"
echo "  scripts/start-web.sh   # 启动网站"
echo "  scripts/start-api.sh   # 启动后端"
echo "  scripts/start-app.sh   # 启动移动 App"
echo "  scripts/start-all.sh   # 同时启动全部"
