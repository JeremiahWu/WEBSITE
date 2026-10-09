# Website 部署指南

## 新架构（高可用）

```
用户浏览器
  ├─ https://laowu.cafe / www  → 云服务器 Caddy → website 容器 (3000)
  │                                   （官网直接跑在云服务器上，不经过 FRP）
  └─ https://api.laowu.cafe    → 云服务器 Caddy → frps vhost → frp 隧道
                                        → 私有服务器 CORE 后端 (8080)
```

- **官网（本项目）**：由云服务器上的 `CLOUD` 仓库统一编排（compose 中 `website` 服务，build context `../WEBSITE`）。
- **后端（CORE 项目）**：跑在私有服务器上，通过 `deploy/frpc/frpc.toml` 隧道透出。
- 私有服务器上不再需要 Caddy，也不需要 website 容器。

## 部署位置

| 机器 | 部署内容 |
|------|----------|
| 云服务器 | CLOUD 栈（Caddy + frps + 邮件）+ website 容器 |
| 私有服务器 | CORE 后端 + frpc（`deploy/frpc/frpc.toml`） |

## 更新官网

### 方式一：直接在云服务器上构建（当前）

```bash
# 云服务器上，两个仓库同级目录（如 /opt/CLOUD 与 /opt/WEBSITE）
cd /opt/WEBSITE && git pull
cd /opt/CLOUD && docker compose up -d --build website
```

### 方式二：Jenkins CI/CD（后续接入 Harbor 后）

Jenkins 构建并推送镜像到 Harbor，云服务器 pull 后滚动更新（见 `Jenkinsfile`）。

## 私有服务器（CORE 后端 + frpc）配置

```bash
# 1. 下载 frpc 并安装为 systemd 服务（或容器方式运行）
sudo mkdir -p /opt/frpc
sudo cp deploy/frpc/frpc.toml /opt/frpc/frpc.toml

# 2. 修改 frpc.toml
#    serverAddr: 云服务器公网 IP
#    auth.token: 与云服务器 CLOUD 仓库 .env 中 FRPS_AUTH_TOKEN 一致
#    localPort:  CORE 后端端口（默认 8080）
```

## 故障排查

### 官网无法访问
- 云服务器：`docker compose -f /opt/CLOUD/docker-compose.yml logs -f website caddy`
- 确认 website 容器健康：`docker ps | grep website`

### API 无法访问（frp 隧道问题）
- 云服务器：查看 frps 日志 `docker compose -f /opt/CLOUD/docker-compose.yml logs -f cloud | grep frps`
- 私有服务器：`sudo journalctl -u frpc -f` 或 frpc 日志
- 确认 7000 端口可达：`nc -vz <云服务器IP> 7000`
- 确认 token 与云服务器 `.env` 一致
- 确认 CORE 后端在私有服务器 8080 端口正常监听
