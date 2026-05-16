#!/bin/bash
set -e

# ================================
# CI/CD Build and Push Script
# Build Next.js app and push to Harbor/Docker Hub
# ================================

# Configuration
REGISTRY="${REGISTRY:-harbor.example.com}"      # Harbor地址或Docker Hub
PROJECT="${PROJECT:-labsoft}"                   # Harbor项目名或Docker Hub用户名
IMAGE_NAME="${IMAGE_NAME:-website}"             # 镜像名称
TAG="${TAG:-latest}"                            # 镜像标签，CI中通常用commit SHA
TARGET_SERVER="${TARGET_SERVER:-192.168.124.100}"  # 目标服务器IP

# Login to registry
echo "Login to registry: $REGISTRY"
echo "$REGISTRY_PASSWORD" | docker login "$REGISTRY" -u "$REGISTRY_USER" --password-stdin

# Get commit information
COMMIT_SHA="${GIT_COMMIT:-$(git rev-parse HEAD)}"
SHORT_COMMIT="${COMMIT_SHA:0:8}"
BUILD_TIME=$(date '+%Y-%m-%d %H:%M:%S')

# Tag the image
IMAGE_PATH="${REGISTRY}/${PROJECT}/${IMAGE_NAME}"
FULL_IMAGE="${IMAGE_PATH}:${TAG}"
FULL_IMAGE_SHA="${IMAGE_PATH}:${SHORT_COMMIT}"

echo "Building image: $FULL_IMAGE"

# Build the Docker image
docker build \
    --build-arg BUILD_NUMBER="${BUILD_NUMBER:-1}" \
    --build-arg COMMIT_SHA="${COMMIT_SHA}" \
    --build-arg BUILD_TIME="${BUILD_TIME}" \
    -t "$FULL_IMAGE" \
    -t "$FULL_IMAGE_SHA" \
    .

# Push to registry
echo "Pushing image to registry..."
docker push "$FULL_IMAGE"
docker push "$FULL_IMAGE_SHA"

# Create deployment manifest
cat > deployment-manifest.yaml << EOF
apiVersion: v1
kind: Secret
metadata:
  name: harbor-credentials
  namespace: default
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: ${DOCKER_CONFIG_BASE64:-}
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: website
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: website
  template:
    metadata:
      labels:
        app: website
    spec:
      containers:
      - name: website
        image: ${FULL_IMAGE_SHA}
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: production
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: website-service
  namespace: default
spec:
  selector:
    app: website
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP
EOF

echo "Deployment manifest created: deployment-manifest.yaml"

# Create deploy script for target server
cat > server-deploy.sh << 'DEPLOY_EOF'
#!/bin/bash
set -e

# Configuration
HARBOR_REGISTRY="${HARBOR_REGISTRY:-harbor.example.com}"
PROJECT="${PROJECT:-labsoft}"
IMAGE_NAME="${IMAGE_NAME:-website}"
TAG="${TAG:-latest}"
SERVER_IP="${SERVER_IP:-192.168.124.100}"
NGINX_SERVER_NAME="${NGINX_SERVER_NAME:-your-domain.com}"
FRPC_SERVER_ADDR="${FRPC_SERVER_ADDR:-frpc.example.com:7000}"
FRPC_TOKEN="${FRPC_TOKEN:-your-frpc-token}"
FRPC_CUSTOM_DOMAIN="${FRPC_CUSTOM_DOMAIN:-website.your-domain.com}"

echo "=== Deploying Website to Server ==="
echo "Registry: $HARBOR_REGISTRY"
echo "Image: $PROJECT/$IMAGE_NAME:$TAG"
echo "Server: $SERVER_IP"

# SSH to server and deploy
echo "Connecting to server: $SERVER_IP..."
ssh -o StrictHostKeyChecking=no -o ConnectTimeout=30 "root@$SERVER_IP" << 'SSH_EOF'
#!/bin/bash
set -e

# Configuration (passed from script)
HARBOR_REGISTRY="\${HARBOR_REGISTRY}"
PROJECT="\${PROJECT}"
IMAGE_NAME="\${IMAGE_NAME}"
TAG="\${TAG}"
NGINX_SERVER_NAME="\${NGINX_SERVER_NAME}"
FRPC_SERVER_ADDR="\${FRPC_SERVER_ADDR}"
FRPC_TOKEN="\${FRPC_TOKEN}"
FRPC_CUSTOM_DOMAIN="\${FRPC_CUSTOM_DOMAIN}"

echo "=== Server-side Deployment ==="

# Create directories
mkdir -p /opt/website
mkdir -p /opt/frpc

# Pull Docker image
echo "Pulling Docker image..."
docker login "\$HARBOR_REGISTRY" -u "\${HARBOR_USER:-admin}" -p "\${HARBOR_PASSWORD}"
docker pull "\$HARBOR_REGISTRY/\$PROJECT/\$IMAGE_NAME:\$TAG"

# Stop and remove existing container
echo "Stopping existing container..."
docker stop website 2>/dev/null || true
docker rm website 2>/dev/null || true

# Download frpc if not exists
if [ ! -f /opt/frpc/frpc ]; then
    echo "Downloading frpc..."
    curl -L -o /opt/frpc/frpc https://github.com/fatedier/frp/releases/latest/download/frpc_linux_amd64
    chmod +x /opt/frpc/frpc
fi

# Create frpc config
cat > /opt/frpc/frpc.toml << FRPC_EOF
serverAddr = "$FRPC_SERVER_ADDR"
serverPort = 7000
auth.token = "$FRPC_TOKEN"

[[proxies]]
name = "website-http"
type = "http"
localIP = "127.0.0.1"
localPort = 3000
customDomains = ["$FRPC_CUSTOM_DOMAIN"]
plugin = "proxy_pool"
plugin_mode = "random"
FRPC_EOF

# Create Caddy config
cat > /etc/caddy/Caddyfile << CADDY_EOF
$NGINX_SERVER_NAME {
    reverse_proxy http://127.0.0.1:3000
}

:80 {
    redir https://{host}{uri} 301
}
CADDY_EOF

# Run frpc in background
echo "Starting frpc..."
pkill frpc 2>/dev/null || true
cd /opt/frpc
nohup ./frpc -c ./frpc.toml > /var/log/frpc.log 2>&1 &
echo "frpc started"

# Start new container
echo "Starting website container..."
docker run -d \
    --name website \
    --restart=always \
    -p 3000:3000 \
    -e NODE_ENV=production \
    "\$HARBOR_REGISTRY/\$PROJECT/\$IMAGE_NAME:\$TAG"

echo "=== Deployment Complete ==="
echo "Website should be available at: https://$FRPC_CUSTOM_DOMAIN"
SSH_EOF

echo "=== Deployment finished ==="
DEPLOY_EOF

chmod +x server-deploy.sh

echo ""
echo "=== Build and Push Complete ==="
echo "Image pushed to: $FULL_IMAGE"
echo ""
echo "To deploy to server, run:"
echo "  ./server-deploy.sh"
echo ""
echo "Or copy deployment-manifest.yaml to your Kubernetes cluster"
