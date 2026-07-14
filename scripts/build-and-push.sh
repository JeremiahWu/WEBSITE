#!/bin/bash
set -e

# ================================
# Cafelab Website - Build & Push
# Build Docker image and push to local registry (localhost:5000)
# ================================

# Configuration
REGISTRY="${REGISTRY:-localhost:5000}"
IMAGE_NAME="${IMAGE_NAME:-cafelab-website}"
TAG="${TAG:-latest}"
TIMESTAMP_TAG=$(date '+%Y%m%d-%H%M%S')

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${TAG}"
FULL_IMAGE_TS="${REGISTRY}/${IMAGE_NAME}:${TIMESTAMP_TAG}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Cafelab Website - Build & Push${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Registry:     ${YELLOW}${REGISTRY}${NC}"
echo -e "Image:        ${YELLOW}${IMAGE_NAME}${NC}"
echo -e "Tag:          ${YELLOW}${TAG}${NC}"
echo -e "Timestamp:    ${YELLOW}${TIMESTAMP_TAG}${NC}"
echo ""

# Ensure we're in the WEBSITE directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEBSITE_DIR="$(dirname "$SCRIPT_DIR")"
cd "$WEBSITE_DIR"

echo -e "${YELLOW}[1/4] Checking local registry...${NC}"
if ! curl -s "http://${REGISTRY}/v2/_catalog" > /dev/null 2>&1; then
    echo -e "${RED}Error: Local registry at ${REGISTRY} is not accessible${NC}"
    echo ""
    echo "Start it with:"
    echo "  docker run -d --name registry --restart=always -p 5000:5000 registry:2"
    exit 1
fi
echo -e "${GREEN}  ✓ Registry is reachable${NC}"

echo -e "${YELLOW}[2/4] Building Docker image...${NC}"
docker build \
    -t "$FULL_IMAGE" \
    -t "$FULL_IMAGE_TS" \
    -t "${IMAGE_NAME}:${TAG}" \
    .

echo -e "${GREEN}  ✓ Build complete${NC}"

echo -e "${YELLOW}[3/4] Pushing to local registry...${NC}"
docker push "$FULL_IMAGE"
docker push "$FULL_IMAGE_TS"

echo -e "${GREEN}  ✓ Push complete${NC}"

echo -e "${YELLOW}[4/4] Verifying...${NC}"
docker pull "$FULL_IMAGE" > /dev/null 2>&1
echo -e "${GREEN}  ✓ Image verify OK${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Done!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Images pushed:"
echo -e "  ${GREEN}${FULL_IMAGE}${NC}"
echo -e "  ${GREEN}${FULL_IMAGE_TS}${NC}"
echo ""
echo -e "To deploy locally, run:"
echo -e "  ${YELLOW}./scripts/deploy-local.sh${NC}"
