# Website Deployment Guide

## 目录结构

```
deploy/
├── caddy/
│   └── Caddyfile          # Caddy反向代理配置
├── frpc/
│   └── frpc.toml          # FRPC内网穿透配置
└── docker-compose.yml     # Docker Compose编排文件
```

## 配置说明

### 1. 修改配置文件

#### `caddy/Caddyfile`
```caddy
example.com {                             # 替换为你的域名
    reverse_proxy http://127.0.0.1:3000
}

:80 {
    redir https://{host}{uri} 301
}
```

#### `frpc/frpc.toml`
```toml
serverAddr = "cloud-server-ip"           # 云服务器FRPC地址
serverPort = 7000
auth.token = "your-frpc-token"           # FRPC认证token

[[proxies]]
name = "website-http"
type = "http"
localIP = "127.0.0.1"
localPort = 3000
customDomains = ["your-domain.com"]      # 替换为你的域名
```

## 部署方式

### 方式一：使用Jenkins CI/CD

1. **配置Jenkins**
   - 安装Docker插件
   - 配置Harbor凭据（ID: `harbor-credentials`）
   - 配置SSH私钥凭据（ID: `ssh-key`）

2. **运行Jenkins Pipeline**
   ```bash
   # 参数说明
   TAG: 镜像标签（默认: latest）
   SERVER_IP: 目标服务器IP（默认: 192.168.124.100）
   DOMAIN: 网站域名
   FRPC_DOMAIN: FRPC自定义域名
   ```

### 方式二：手动部署

#### 1. 构建并推送镜像
```bash
# 设置环境变量
export HARBOR_REGISTRY=harbor.example.com
export HARBOR_USER=admin
export HARBOR_PASSWORD=your-password
export TAG=v1.0.0

# 登录Harbor
echo "$HARBOR_PASSWORD" | docker login "$HARBOR_REGISTRY" -u "$HARBOR_USER" --password-stdin

# 构建镜像
docker build -t "$HARBOR_REGISTRY/labsoft/website:$TAG" .

# 推送到Harbor
docker push "$HARBOR_REGISTRY/labsoft/website:$TAG"
```

#### 2. 部署到服务器
```bash
# 复制配置文件到服务器
scp -i your-key.pem deploy/docker-compose.yml root@192.168.124.100:/opt/website/
scp -i your-key.pem deploy/caddy/Caddyfile root@192.168.124.100:/opt/website/config/
scp -i your-key.pem deploy/frpc/frpc.toml root@192.168.124.100:/opt/website/config/

# SSH到服务器执行部署
ssh -i your-key.pem root@192.168.124.100 << 'EOF'
cd /opt/website
docker-compose up -d
EOF
```

#### 3. 配置云服务器反向代理

在云服务器上安装Caddy，并配置反向代理到内网服务器：

```caddy
your-domain.com {
    reverse_proxy http://192.168.124.100:80
}
```

## 服务说明

| 服务 | 端口 | 说明 |
|------|------|------|
| Next.js | 3000 | 网站应用 |
| Caddy | 80/443 | Web服务器和反向代理 |
| FRPC | - | 内网穿透客户端 |

## 故障排查

### 查看日志
```bash
# 查看网站日志
docker logs website

# 查看FRPC日志
docker logs frpc

# 查看Caddy日志
docker logs caddy
```

### 重启服务
```bash
docker-compose restart
```

### 清理部署
```bash
docker-compose down -v
```
