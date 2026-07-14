#!/bin/bash
set -e

# ================================
# Cafelab Website - Local Deploy
# Deploy website container on this machine
# ================================

# Configuration
REGISTRY="${REGISTRY:-localhost:5000}"
IMAGE_NAME="${IMAGE_NAME:-cafelab-website}"
TAG="${TAG:-latest}"
CONTAINER_NAME="${CONTAINER_NAME:-cafelab-website}"
HOST_PORT="${HOST_PORT:-3000}"

# FRP Configuration (for tunnel to cloud server)
FRPS_SERVER="${FRPS_SERVER:-}"           # Cloud server IP/domain
FRPS_PORT="${FRPS_PORT:-7000}"
FRP_TOKEN="${FRP_TOKEN:-}"
FRP_CUSTOM_DOMAIN="${FRP_CUSTOM_DOMAIN:-laowu.cafe}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${TAG}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Cafelab Website - Local Deploy${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Image:        ${YELLOW}${FULL_IMAGE}${NC}"
echo -e "Container:    ${YELLOW}${CONTAINER_NAME}${NC}"
echo -e "Host Port:    ${YELLOW}${HOST_PORT}${NC}"
echo ""

# Ensure we're in the WEBSITE directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEBSITE_DIR="$(dirname "$SCRIPT_DIR")"
cd "$WEBSITE_DIR"

# ─── Step 1: Pull latest image ──────────────────────────────────────────
echo -e "${YELLOW}[1/5] Pulling latest image...${NC}"
docker pull "$FULL_IMAGE"
echo -e "${GREEN}  ✓ Image pulled${NC}"

# ─── Step 2: Stop and remove existing container ─────────────────────────
echo -e "${YELLOW}[2/5] Stopping existing container...${NC}"
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    docker stop "$CONTAINER_NAME" 2>/dev/null || true
    docker rm "$CONTAINER_NAME" 2>/dev/null || true
    echo -e "${GREEN}  ✓ Old container removed${NC}"
else
    echo -e "${GREEN}  ✓ No existing container${NC}"
fi

# ─── Step 3: Start new container ────────────────────────────────────────
echo -e "${YELLOW}[3/5] Starting website container...${NC}"
docker run -d \
    --name "$CONTAINER_NAME" \
    --restart=always \
    -p "${HOST_PORT}:3000" \
    -e NODE_ENV=production \
    -e PORT=3000 \
    "$FULL_IMAGE"

echo -e "${GREEN}  ✓ Container started${NC}"

# ─── Step 4: Setup FRPC tunnel ──────────────────────────────────────────
echo -e "${YELLOW}[4/5] Setting up FRPC tunnel...${NC}"

if [ -n "$FRPS_SERVER" ] && [ -n "$FRP_TOKEN" ]; then
    FRPC_DIR="/opt/frpc-website"
    mkdir -p "$FRPC_DIR"

    # Stop existing frpc-website container if any
    docker stop frpc-website 2>/dev/null || true
    docker rm frpc-website 2>/dev/null || true

    # Generate frpc config
    cat > "$FRPC_DIR/frpc.toml" << FRPC_EOF
serverAddr = "${FRPS_SERVER}"
serverPort = ${FRPS_PORT}
auth.token = "${FRP_TOKEN}"

[[proxies]]
name = "website-http"
type = "http"
localIP = "127.0.0.1"
localPort = 3000
customDomains = ["${FRP_CUSTOM_DOMAIN}", "www.${FRP_CUSTOM_DOMAIN}"]
FRPC_EOF

    # Start frpc as a Docker container (network=host to reach localhost:3000)\
    docker run -d \
        --name frpc-website \
        --restart=always \
        --entrypoint frpc \
        --network=host \
        -v "$FRPC_DIR/frpc.toml":/frpc/frpc.toml:ro \
        snowdreamtech/frpc:latest \
        -c /frpc/frpc.toml

    echo -e "${GREEN}  ✓ FRPC tunnel configured${NC}"
    echo -e "    FRPS Server: ${YELLOW}${FRPS_SERVER}:${FRPS_PORT}${NC}"
else
    echo -e "${YELLOW}  ⚠ FRPS_SERVER and FRP_TOKEN not set — skipping FRPC setup${NC}"
    echo "    Set them to auto-configure the tunnel:"
    echo "      export FRPS_SERVER=<your-cloud-server-ip>"
    echo "      export FRP_TOKEN=<your-frp-token>"
fi

# ─── Step 5: Verify deployment ──────────────────────────────────────────
echo -e "${YELLOW}[5/5] Verifying deployment...${NC}"
sleep 3

if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${GREEN}  ✓ Container is running${NC}"
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Deploy Complete!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "Website:      ${GREEN}http://localhost:${HOST_PORT}${NC}"
    echo -e "Container:    ${GREEN}${CONTAINER_NAME}${NC}"
    echo ""
    echo -e "Useful commands:"
    echo -e "  View logs:    ${YELLOW}docker logs -f ${CONTAINER_NAME}${NC}"
    echo -e "  Restart:      ${YELLOW}docker restart ${CONTAINER_NAME}${NC}"
    echo -e "  Stop:         ${YELLOW}docker stop ${CONTAINER_NAME}${NC}"
else
    echo -e "${RED}  ✗ Container failed to start!${NC}"
    echo ""
    echo "Check logs:"
    docker logs "$CONTAINER_NAME" 2>/dev/null || echo "  No logs available"
    exit 1
fi
