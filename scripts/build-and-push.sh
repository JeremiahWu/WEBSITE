#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
IMAGE="${IMAGE:-wuruihao629/website}"
TAG="${TAG:-$(TZ=Asia/Shanghai date '+%Y%m%d-%H%M%S')}"
PLATFORMS="${PLATFORMS:-linux/amd64,linux/arm64}"

if [[ ! "$TAG" =~ ^[0-9]{8}-[0-9]{6}$ ]]; then
    echo "TAG 必须为北京时间日期格式 YYYYMMDD-HHMMSS。" >&2
    exit 1
fi

command -v docker >/dev/null
docker info >/dev/null
docker buildx version >/dev/null

echo "构建并推送 ${IMAGE}:${TAG} 和 ${IMAGE}:latest"
docker buildx build \
    --platform "$PLATFORMS" \
    --tag "${IMAGE}:${TAG}" \
    --tag "${IMAGE}:latest" \
    --push \
    "$PROJECT_DIR"

echo "推送完成：${IMAGE}:${TAG}"
echo "最新版本：${IMAGE}:latest"
