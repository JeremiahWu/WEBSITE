#!/usr/bin/env bash
# 启动移动 App（Expo + React Native）开发服务器
# 会在终端显示二维码，用 Expo Go 扫码即可在真机预览
# 或按 w 在浏览器中打开，按 a 打开 Android 模拟器，按 i 打开 iOS 模拟器

set -e
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR/APPS"

echo "[LABSOFT] Starting Expo dev server..."
npx expo start
