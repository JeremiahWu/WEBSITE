#!/bin/bash
set -e

# ================================
# Jenkins Deployment Script
# Deploy website to Docker server with Caddy and FRPC
# ================================

# Configuration
REGISTRY="${REGISTRY:-harbor.example.com}"
PROJECT="${PROJECT:-labsoft}"
IMAGE_NAME="${IMAGE_NAME:-website}"
TAG="${TAG:-${BUILD_NUMBER}}"
SERVER_IP="${SERVER_IP:-192.168.124.100}"
SERVER_USER="${SERVER_USER:-root}"
SERVER_SSH_KEY="${SERVER_SSH_KEY:-}"
NGINX_SERVER_NAME="${NGINX_SERVER_NAME:-example.com}"
FRPC_SERVER_ADDR="${FRPC_SERVER_ADDR:-frpc.example.com:7000}"
FRPC_TOKEN="${FRPC_TOKEN:-your-token}"
FRPC_CUSTOM_DOMAIN="${FRPC_CUSTOM_DOMAIN:-website.example.com}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== Jenkins CI/CD Deployment ===${NC}"
echo "Build Number: ${BUILD_NUMBER}"
echo "Commit: ${GIT_COMMIT}"
echo "Image: ${REGISTRY}/${PROJECT}/${IMAGE_NAME}:${TAG}"
echo "Server: ${SERVER_IP}"
echo ""

# Step 1: Build Docker image
echo -e "${YELLOW}Step 1: Building Docker image...${NC}"
docker build \
    --build-arg BUILD_NUMBER="${BUILD_NUMBER}" \
    --build-arg COMMIT_SHA="${GIT_COMMIT}" \
    -t "${REGISTRY}/${PROJECT}/${IMAGE_NAME}:${TAG}" \
    -t "${REGISTRY}/${PROJECT}/${IMAGE_NAME}:latest" \
    .

# Step 2: Push to Harbor
echo -e "${YELLOW}Step 2: Pushing to Harbor...${NC}"
echo "${HARBOR_PASSWORD}" | docker login "${REGISTRY}" -u "${HARBOR_USER}" --password-stdin
docker push "${REGISTRY}/${PROJECT}/${IMAGE_NAME}:${TAG}"
docker push "${REGISTRY}/${PROJECT}/${IMAGE_NAME}:latest"

# Step 3: Deploy to server
echo -e "${YELLOW}Step 3: Deploying to server...${NC}"

# Create deployment script
cat > deploy-server.sh << 'DEPLOY_SCRIPT'
#!/bin/bash
set -e

HARBOR_REGISTRY="$1"
PROJECT="$2"
IMAGE_NAME="$3"
TAG="$4"
SERVER_IP="$5"
SERVER_USER="$6"
NGINX_SERVER_NAME="$7"
FRPC_SERVER_ADDR="$8"
FRPC_TOKEN="$9"
FRPC_CUSTOM_DOMAIN="${10}"

# SSH to server and deploy
ssh -o StrictHostKeyChecking=no -o ConnectTimeout=30 "${SERVER_USER}@${SERVER_IP}" << 'SSH_CMD'
#!/bin/bash
set -e

HARBOR_REGISTRY="$1"
PROJECT="$2"
IMAGE_NAME="$3"
TAG="$4"
NGINX_SERVER_NAME="$5"
FRPC_SERVER_ADDR="$6"
FRPC_TOKEN="$7"
FRPC_CUSTOM_DOMAIN="$8"

echo "=== Server Deployment ==="

# Create directories
mkdir -p /opt/website/{config,logs}
mkdir -p /opt/frpc

# Pull Docker image
echo "Pulling image..."
docker login "$HARBOR_REGISTRY" -u "${HARBOR_USER:-admin}" -p "${HARBOR_PASSWORD}"
docker pull "$HARBOR_REGISTRY/$PROJECT/$IMAGE_NAME:$TAG"

# Stop old containers
echo "Stopping old containers..."
docker stop website 2>/dev/null || true
docker rm website 2>/dev/null || true
docker stop frpc 2>/dev/null || true
docker rm frpc 2>/dev/null || true

# Download frpc if needed
if [ ! -f /opt/frpc/frpc ]; then
    echo "Downloading frpc..."
    curl -L -o /opt/frpc/frpc https://github.com/fatedier/frp/releases/latest/download/frpc_linux_amd64
    chmod +x /opt/frpc/frpc
fi

# Create frpc config
cat > /opt/frpc/frpc.toml << FRPC_EOF
serverAddr = "${FRPC_SERVER_ADDR%:*}"
serverPort = 7000
auth.token = "$FRPC_TOKEN"

[[proxies]]
name = "website-http"
type = "http"
localIP = "127.0.0.1"
localPort = 3000
customDomains = ["$FRPC_CUSTOM_DOMAIN"]
FRPC_EOF

# Create Caddyfile
cat > /etc/caddy/Caddyfile << CADDY_EOF
$NGINX_SERVER_NAME {
    reverse_proxy http://127.0.0.1:3000
}

:80 {
    redir https://{host}{uri} 301
}
CADDY_EOF

# Start frpc
echo "Starting frpc..."
pkill frpc 2>/dev/null || true
cd /opt/frpc
nohup ./frpc -c ./frpc.toml > /opt/frpc/frpc.log 2>&1 &
echo "frpc started with PID: \$!"

# Start website container
echo "Starting website container..."
docker run -d \
    --name website \
    --restart=always \
    -p 3000:3000 \
    -e NODE_ENV=production \
    "$HARBOR_REGISTRY/$PROJECT/$IMAGE_NAME:$TAG"

echo "=== Deployment Complete ==="
echo "Website: https://$NGINX_SERVER_NAME"
echo "FRPC Domain: $FRPC_CUSTOM_DOMAIN"
SSH_CMD
DEPLOY_SCRIPT

# Execute deployment
chmod +x deploy-server.sh
./deploy-server.sh "$REGISTRY" "$PROJECT" "$IMAGE_NAME" "$TAG" \
    "$SERVER_IP" "$SERVER_USER" "$NGINX_SERVER_NAME" \
    "$FRPC_SERVER_ADDR" "$FRPC_TOKEN" "$FRPC_CUSTOM_DOMAIN"

echo ""
echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo "Build Number: ${BUILD_NUMBER}"
echo "Image: ${REGISTRY}/${PROJECT}/${IMAGE_NAME}:${TAG}"
echo "Access: https://${NGINX_SERVER_NAME}"
