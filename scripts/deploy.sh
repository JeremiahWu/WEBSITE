#!/bin/bash
set -e

# ================================
# Server Deployment Script
# Deploy website to Ubuntu server with Caddy and FRPC
# ================================

# Configuration - Edit these for your environment
HARBOR_REGISTRY="${HARBOR_REGISTRY:-harbor.example.com}"      # Harbor地址
PROJECT="${PROJECT:-labsoft}"                                  # Harbor项目名
IMAGE_NAME="${IMAGE_NAME:-website}"                            # 镜像名称
TAG="${TAG:-latest}"                                           # 镜像标签
SERVER_IP="${SERVER_IP:-192.168.124.100}"                      # 目标服务器IP
SERVER_SSH_USER="${SERVER_SSH_USER:-root}"                     # SSH用户
SERVER_SSH_KEY="${SERVER_SSH_KEY:-~/.ssh/id_rsa}"              # SSH私钥路径
NGINX_SERVER_NAME="${NGINX_SERVER_NAME:-example.com}"          # 域名
FRPC_SERVER_ADDR="${FRPC_SERVER_ADDR:-frpc.example.com:7000}"  # FRPC服务器地址
FRPC_TOKEN="${FRPC_TOKEN:-your-frpc-token}"                    # FRPC认证token
FRPC_CUSTOM_DOMAIN="${FRPC_CUSTOM_DOMAIN:-website.example.com}" # FRPC自定义域名

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Deploying Website to Server ===${NC}"
echo "Registry: $HARBOR_REGISTRY"
echo "Image: $PROJECT/$IMAGE_NAME:$TAG"
echo "Server: $SERVER_IP"
echo "Domain: $NGINX_SERVER_NAME"
echo "FRPC Domain: $FRPC_CUSTOM_DOMAIN"
echo ""

# Check if docker is installed on local machine
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    exit 1
fi

# Login to Harbor
echo -e "${YELLOW}Login to Harbor...${NC}"
if [ -z "$HARBOR_PASSWORD" ]; then
    echo -e "${RED}Error: HARBOR_PASSWORD environment variable is not set${NC}"
    exit 1
fi
docker login "$HARBOR_REGISTRY" -u "${HARBOR_USER:-admin}" -p "$HARBOR_PASSWORD"

# Pull Docker image
echo -e "${YELLOW}Pulling Docker image...${NC}"
docker pull "$HARBOR_REGISTRY/$PROJECT/$IMAGE_NAME:$TAG"

# Create local deployment manifest
echo -e "${YELLOW}Creating deployment configuration...${NC}"
mkdir -p ./deploy/config

# Create docker-compose.yml
cat > ./deploy/docker-compose.yml << EOF
version: '3.8'

services:
  website:
    image: ${HARBOR_REGISTRY}/${PROJECT}/${IMAGE_NAME}:${TAG}
    container_name: website
    restart: always
    environment:
      - NODE_ENV=production
      - PORT=3000
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  frpc:
    image: snowdreamtech/frpc:latest
    container_name: frpc
    restart: always
    network_mode: host
    environment:
      - FRPC_SERVER_ADDR=${FRPC_SERVER_ADDR}
      - FRPC_TOKEN=${FRPC_TOKEN}
      - FRPC_CUSTOM_DOMAIN=${FRPC_CUSTOM_DOMAIN}
    volumes:
      - ./config/frpc.toml:/frpc/frpc.toml:ro

  caddy:
    image: caddy:2-alpine
    container_name: caddy
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./config/Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config

volumes:
  caddy_data:
  caddy_config:
EOF

# Create frpc.toml
cat > ./deploy/config/frpc.toml << EOF
serverAddr = "${FRPC_SERVER_ADDR%:*}"
serverPort = 7000
auth.token = "${FRPC_TOKEN}"

[[proxies]]
name = "website-http"
type = "http"
localIP = "127.0.0.1"
localPort = 3000
customDomains = ["${FRPC_CUSTOM_DOMAIN}"]
EOF

# Create Caddyfile
cat > ./deploy/config/Caddyfile << EOF
${NGINX_SERVER_NAME} {
    reverse_proxy http://127.0.0.1:3000 {
        # Enable HTTP/2
        transport http {
            versions 2
        }
    }

    # Security headers
    header {
        -Server
        X-Frame-Options "DENY"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
    }

    # Logging
    log {
        output file /var/log/caddy/access.log
        format json
    }
}

# Redirect HTTP to HTTPS
:80 {
    redir https://{host}{uri} 301
}
EOF

echo -e "${GREEN}Local configuration created in ./deploy/${NC}"

# Deploy to server via SSH
echo ""
echo -e "${YELLOW}Deploying to server via SSH...${NC}"

# Create deployment script for remote server
REMOTE_SCRIPT=$(cat << 'SCRIPT_EOF'
#!/bin/bash
set -e

HARBOR_REGISTRY="$1"
PROJECT="$2"
IMAGE_NAME="$3"
TAG="$4"
HARBOR_USER="$5"
HARBOR_PASSWORD="$6"
NGINX_SERVER_NAME="$7"
FRPC_SERVER_ADDR="$8"
FRPC_TOKEN="$9"
FRPC_CUSTOM_DOMAIN="${10}"

echo "=== Server-side Deployment ==="
echo "Registry: $HARBOR_REGISTRY"
echo "Image: $PROJECT/$IMAGE_NAME:$TAG"
echo "Domain: $NGINX_SERVER_NAME"
echo ""

# Update system
echo "Updating system packages..."
apt-get update -y
apt-get upgrade -y

# Install Docker if not exists
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o /tmp/install-docker.sh
    sh /tmp/install-docker.sh
    usermod -aG docker deploy 2>/dev/null || true
fi

# Install Docker Compose if not exists
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    curl -SL https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Create directories
mkdir -p /opt/website/config

# Pull Docker image
echo "Pulling Docker image..."
docker login "$HARBOR_REGISTRY" -u "$HARBOR_USER" -p "$HARBOR_PASSWORD"
docker pull "$HARBOR_REGISTRY/$PROJECT/$IMAGE_NAME:$TAG"

# Stop and remove existing containers
echo "Stopping existing containers..."
docker-compose -f /opt/website/docker-compose.yml down 2>/dev/null || true

# Deploy new containers
echo "Deploying new containers..."
cd /opt/website
docker-compose -f /opt/website/docker-compose.yml up -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 10

# Verify deployment
echo "Verifying deployment..."
docker-compose -f /opt/website/docker-compose.yml ps

echo ""
echo "=== Deployment Complete ==="
echo "Website should be available at: https://$NGINX_SERVER_NAME"
echo "FRPC domain: $FRPC_CUSTOM_DOMAIN"
SCRIPT_EOF
)

# Upload configuration files to server
echo "Uploading configuration files..."
ssh -i "$SERVER_SSH_KEY" -o StrictHostKeyChecking=no "${SERVER_SSH_USER}@${SERVER_IP}" << "UPLOAD_EOF"
mkdir -p /opt/website/config
UPLOAD_EOF

# Copy docker-compose.yml
scp -i "$SERVER_SSH_KEY" -o StrictHostKeyChecking=no ./deploy/docker-compose.yml \
    "${SERVER_SSH_USER}@${SERVER_IP}:/opt/website/docker-compose.yml"

# Copy frpc.toml
scp -i "$SERVER_SSH_KEY" -o StrictHostKeyChecking=no ./deploy/config/frpc.toml \
    "${SERVER_SSH_USER}@${SERVER_IP}:/opt/website/config/frpc.toml"

# Copy Caddyfile
scp -i "$SERVER_SSH_KEY" -o StrictHostKeyChecking=no ./deploy/config/Caddyfile \
    "${SERVER_SSH_USER}@${SERVER_IP}:/opt/website/config/Caddyfile"

# Execute remote deployment script
echo "Executing remote deployment..."
ssh -i "$SERVER_SSH_KEY" -o StrictHostKeyChecking=no -t "${SERVER_SSH_USER}@${SERVER_IP}" \
    "/bin/bash -c '$REMOTE_SCRIPT'" \
    "$HARBOR_REGISTRY" "$PROJECT" "$IMAGE_NAME" "$TAG" \
    "${HARBOR_USER:-admin}" "$HARBOR_PASSWORD" \
    "$NGINX_SERVER_NAME" "$FRPC_SERVER_ADDR" "$FRPC_TOKEN" "$FRPC_CUSTOM_DOMAIN"

echo ""
echo -e "${GREEN}=== All Done ===${NC}"
echo "Website deployed successfully!"
echo "Access your website at: https://${NGINX_SERVER_NAME}"
