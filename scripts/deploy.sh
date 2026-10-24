#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
IMAGE="${IMAGE:-wuruihao629/website}"
TAG="${TAG:-latest}"
DEPLOY_MODE="${DEPLOY_MODE:-compose}"
CLOUD_DIR="${CLOUD_DIR:-$(dirname "$PROJECT_DIR")/CLOUD}"
CONTAINER_NAME="${CONTAINER_NAME:-website}"
HOST_PORT="${HOST_PORT:-3000}"
FULL_IMAGE="${IMAGE}:${TAG}"

if [[ "$TAG" != latest && ! "$TAG" =~ ^[0-9]{8}-[0-9]{6}$ ]]; then
    echo "TAG 必须为 latest 或日期格式 YYYYMMDD-HHMMSS。" >&2
    exit 1
fi

command -v docker >/dev/null
docker info >/dev/null

case "$DEPLOY_MODE" in
    compose)
        docker compose version >/dev/null
        if [[ ! -f "$CLOUD_DIR/docker-compose.yml" ]]; then
            echo "未找到 $CLOUD_DIR/docker-compose.yml，请设置 CLOUD_DIR。" >&2
            exit 1
        fi
        cd "$CLOUD_DIR"
        export WEBSITE_IMAGE="$FULL_IMAGE"
        docker compose pull website
        docker compose up -d --no-deps --no-build website
        CONTAINER_ID="$(docker compose ps -q website)"
        ;;
    standalone)
        docker pull "$FULL_IMAGE"
        if docker container inspect "$CONTAINER_NAME" >/dev/null 2>&1; then
            docker stop "$CONTAINER_NAME"
            docker rm "$CONTAINER_NAME"
        fi
        CONTAINER_ID="$(docker run -d \
            --name "$CONTAINER_NAME" \
            --restart unless-stopped \
            -p "127.0.0.1:${HOST_PORT}:3000" \
            -e NODE_ENV=production \
            -e HOSTNAME=0.0.0.0 \
            -e PORT=3000 \
            -e TZ=Asia/Shanghai \
            "$FULL_IMAGE")"
        ;;
    *)
        echo "DEPLOY_MODE 必须为 compose 或 standalone。" >&2
        exit 1
        ;;
esac

if [[ -z "$CONTAINER_ID" ]]; then
    echo "部署失败：未找到运行中的 website 容器。" >&2
    exit 1
fi

echo "等待 ${FULL_IMAGE} 健康检查通过……"
for ((attempt=1; attempt<=60; attempt++)); do
    STATUS="$(docker inspect --format '{{.State.Status}}' "$CONTAINER_ID")"
    HEALTH="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}missing{{end}}' "$CONTAINER_ID")"
    if [[ "$STATUS" == running && "$HEALTH" == healthy ]]; then
        echo "部署成功：${FULL_IMAGE}"
        if [[ "$DEPLOY_MODE" == standalone ]]; then
            echo "访问地址：http://localhost:${HOST_PORT}"
        fi
        exit 0
    fi
    if [[ "$STATUS" != running || "$HEALTH" == unhealthy || "$HEALTH" == missing ]]; then
        break
    fi
    sleep 2
done

echo "部署失败：容器未通过健康检查。" >&2
docker logs --tail 80 "$CONTAINER_ID" >&2
exit 1
