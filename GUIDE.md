# Cafelab Website — 部署指南

## 架构概览

```
用户浏览器
    │
    ▼
┌──────────────────────────────────────────────────┐
│  云服务器 (Caddy + FRPS)                          │
│  - Caddy: HTTPS 反向代理 + 自动证书                │
│  - FRPS: 接收来自内网机器的隧道连接                  │
│  域名: laowu.cafe / www.laowu.cafe                │
└────────────┬─────────────────────────────────────┘
             │ FRP Tunnel (加密)
             ▼
┌──────────────────────────────────────────────────┐
│  本地服务器 (192.168.124.23)                       │
│  - cafelab-website Docker 容器 (端口 3000)          │
│  - FRPC: 连接到云服务器 FRPS，建立隧道               │
│  - 本地 Docker Registry (端口 5000)                │
└──────────────────────────────────────────────────┘
```

**流量路径**: 用户 → 云服务器 Caddy (HTTPS) → FRPS → FRPC → 本地 Docker 容器 (Next.js:3000)

---

## 一、本地服务器操作 (192.168.124.23)

### 1.1 确认本地 Registry 运行

```bash
docker ps | grep registry
```

如果未运行，启动它：

```bash
docker run -d \
    --name registry \
    --restart=always \
    -p 5000:5000 \
    registry:2
```

### 1.2 构建镜像并推送到本地 Registry

```bash
cd /home/wrh/code/WEBSITE

# 构建并推送
./scripts/build-and-push-local.sh

# 或指定版本标签
TAG=v1.0.0 ./scripts/build-and-push-local.sh
```

这个脚本会：
- 使用 `next.config.mjs` 中配置的 `output: 'standalone'` 模式构建 Next.js
- 生成精简的生产镜像（只包含运行时所需的文件）
- 推送 `localhost:5000/cafelab-website:latest` 和时间戳标签到本地 Registry

### 1.3 部署容器

```bash
# 仅部署网站（如果已手动配置 FRPC）
./scripts/deploy-local.sh

# 同时配置 FRPC 隧道（推荐：一条命令部署全部）
FRPS_SERVER=<云服务器IP或域名> \
FRP_TOKEN=<你的FRP密钥> \
./scripts/deploy-local.sh
```

这个脚本会：
- 从本地 Registry 拉取镜像
- 停止并移除旧容器
- 启动新的 `cafelab-website` 容器（映射到宿主机 3000 端口）
- （可选）自动配置并启动 FRPC 容器 — 建立到云服务器的隧道

### 1.4 常用管理命令

```bash
# 查看日志
docker logs -f cafelab-website

# 重启
docker restart cafelab-website

# 停止
docker stop cafelab-website

# 查看 FRPC 状态
docker logs frpc-website

# 更新部署（重新构建 + 部署）
./scripts/build-and-push-local.sh && ./scripts/deploy-local.sh
```

---

## 二、云服务器操作

> 以下操作在**云服务器**上执行。

### 2.1 安装 FRPS（FRP Server）

```bash
# 下载 FRP
cd /opt
FRP_VERSION=$(curl -s https://api.github.com/repos/fatedier/frp/releases/latest | grep tag_name | cut -d '"' -f 4)
curl -L -o frp.tar.gz "https://github.com/fatedier/frp/releases/download/${FRP_VERSION}/frp_${FRP_VERSION#v}_linux_amd64.tar.gz"
tar xzf frp.tar.gz
mv frp_*/frps /usr/local/bin/frps
rm -rf frp_* frp.tar.gz

# 创建配置目录
mkdir -p /etc/frp
```

### 2.2 配置 FRPS

创建 `/etc/frp/frps.toml`：

```toml
bindPort = 7000
auth.token = "你的安全密钥-请替换为随机字符串"
```

创建 systemd 服务 `/etc/systemd/system/frps.service`：

```ini
[Unit]
Description=FRP Server
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/frps -c /etc/frp/frps.toml
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

启动 FRPS：

```bash
systemctl daemon-reload
systemctl enable --now frps
systemctl status frps
```

### 2.3 安装 Caddy

```bash
# 使用官方安装脚本
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/setup.deb.sh' | sudo -E bash
apt-get install -y caddy
```

### 2.4 配置 Caddy 反向代理

编辑 `/etc/caddy/Caddyfile`：

```caddy
# laowu.cafe — 反向代理到本地 FRPS（FRP 隧道出口）
laowu.cafe, www.laowu.cafe {
    # FRP 隧道在本地的出口端口
    # 注意：需要配置 FRPS 将隧道流量转发到本地端口
    # 方案 A：使用 FRP 的 vhost HTTP 代理（推荐）
    reverse_proxy 127.0.0.1:8080 {
        header_up Host {host}
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-For {remote_host}
        header_up X-Forwarded-Proto {scheme}
    }

    header {
        -Server
        X-Frame-Options "DENY"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
        Referrer-Policy "strict-origin-when-cross-origin"
        Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    }

    log {
        output file /var/log/caddy/laowu.cafe.log
        format json
    }
}
```

> **端口说明**：如果你使用 FRP 的 `type = "http"` 代理，FRPS 会监听一个 vhost HTTP 端口（需要配置 `vhostHTTPPort`），Caddy 将请求反向代理到这个端口。

### 2.5 完整 FRPS 配置（支持 HTTP 虚拟主机代理）

如果需要 FRPS 直接处理 HTTP 代理（让 Caddy 反向代理更简单），编辑 `/etc/frp/frps.toml`：

```toml
bindPort = 7000
vhostHTTPPort = 8080
auth.token = "你的安全密钥-请替换为随机字符串"
```

重启 FRPS：

```bash
systemctl restart frps
```

### 2.6 启动 Caddy

```bash
systemctl enable --now caddy
systemctl status caddy
```

### 2.7 防火墙配置

```bash
# 开放 HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# 开放 FRPS 端口（仅限本地服务器 IP）
ufw allow from 192.168.124.23 to any port 7000 proto tcp
```

---

## 三、DNS 配置

在域名 DNS 管理面板中添加以下记录：

| 类型 | 主机记录 | 记录值 | TTL |
|------|---------|--------|-----|
| A | @ | `云服务器公网IP` | 600 |
| A | www | `云服务器公网IP` | 600 |

---

## 四、验证部署

### 4.1 本地验证

```bash
# 确认容器运行
docker ps | grep cafelab-website

# 测试本地访问
curl -s http://localhost:3000 | head -20

# 确认 FRPC 连接状态
docker logs frpc-website --tail 20
```

### 4.2 远程验证

```bash
# 在任意能上网的机器上
curl -I https://laowu.cafe
curl -I https://www.laowu.cafe
```

---

## 五、故障排查

### 网站无法访问

```bash
# 1. 检查容器是否运行
docker ps -a | grep cafelab-website

# 2. 查看容器日志
docker logs cafelab-website --tail 50

# 3. 检查 FRPC 隧道
docker logs frpc-website --tail 20
# 看是否有 "start proxy success" 或连接错误
```

### FRP 隧道不通

```bash
# 在本地机器测试到云服务器的 FRPS 端口
nc -zv <云服务器IP> 7000

# 在云服务器检查 FRPS 状态
systemctl status frps
journalctl -u frps -f
```

### Caddy 证书问题

```bash
# 检查 Caddy 日志
journalctl -u caddy -f

# Caddy 会自动申请 Let's Encrypt 证书
# 确保域名 DNS 已正确解析到云服务器 IP
# 确保云服务器 80 和 443 端口可从公网访问
```

### 容器启动失败

```bash
# 查看详细日志
docker logs cafelab-website

# 手动运行检查
docker run --rm -it localhost:5000/cafelab-website:latest sh
```

---

## 六、一键更新脚本

在本地服务器上，创建一个用于日常更新的脚本：

```bash
#!/bin/bash
# 保存为 /home/wrh/code/WEBSITE/scripts/update.sh

set -e

echo "=== 更新 Cafelab Website ==="

cd /home/wrh/code/WEBSITE

# 拉取最新代码（如果使用 Git）
git pull origin main 2>/dev/null || echo "跳过 git pull"

# 构建并推送
./scripts/build-and-push-local.sh

# 重新部署
FRPS_SERVER="${FRPS_SERVER}" FRP_TOKEN="${FRP_TOKEN}" ./scripts/deploy-local.sh

echo "=== 更新完成 ==="
```

```bash
chmod +x /home/wrh/code/WEBSITE/scripts/update.sh
```

---

## 七、配置汇总

| 机器 | 组件 | 端口 | 说明 |
|------|------|------|------|
| 本地 | Docker Registry | 5000 | 镜像仓库 |
| 本地 | cafelab-website | 3000 | Next.js 网站 |
| 本地 | FRPC | - | 隧道客户端 |
| 云服务器 | Caddy | 80/443 | HTTPS 反向代理 |
| 云服务器 | FRPS | 7000/8080 | 隧道服务端 |
