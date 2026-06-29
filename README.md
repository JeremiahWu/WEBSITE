# LABSOFT - 老吴咖啡实验室

软件基础服务平台，提供网站应用服务。

## 项目结构

```
LABSOFT/
├── src/              # Next.js 源代码
│   ├── app/          #   Next.js App Router 页面
│   ├── components/   #   React 组件
│   └── app/globals.css  #   全局样式
├── public/           # 静态资源
│   ├── images/       #   图片资源
│   └── videos/       #   视频资源
├── deploy/           # 部署配置
│   ├── caddy/        #   Caddy反向代理配置
│   ├── frpc/         #   FRPC内网穿透配置
│   └── README.md     #   部署文档
├── scripts/          # 部署脚本
│   ├── build-and-push.sh    # 构建并推送到Harbor
│   ├── deploy.sh           # 部署到服务器
│   └── jenkins-deploy.sh   # Jenkins部署脚本
├── next.config.mjs   # Next.js 配置
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── Dockerfile        # Docker镜像构建文件
├── Jenkinsfile       # Jenkins Pipeline配置
└── package.json
```

## 技术栈

| 技术 | 版本 |
|------|------|
| Next.js | 14 |
| React | 18 |
| Tailwind CSS | 3.4 |
| TypeScript | 5.4 |
| Docker | latest |
| Caddy | 2 |
| FRPC | latest |

## 前置条件

- Node.js 18+
- Docker 20+
- Docker Compose 2+

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 构建生产版本
npm run build

# 4. 启动生产服务器
npm run start
```

## Docker部署

### 构建镜像

```bash
docker build -t website:latest .
```

### 运行容器

```bash
docker run -d \
  --name website \
  -p 3000:3000 \
  -e NODE_ENV=production \
  website:latest
```

## CI/CD部署

### 方式一：使用Jenkins (推荐)

#### 1. 配置Jenkins凭据

在Jenkins中添加以下凭据：

- **Harbor凭据**
  - ID: `harbor-credentials`
  - 类型: Username with password
  - 用户名: admin
  - 密码: Harbor密码

- **SSH私钥凭据**
  - ID: `ssh-key`
  - 类型: SSH username with private key
  - Username: root
  - Private key: 服务器SSH私钥

#### 2. 修改Jenkinsfile

编辑 `Jenkinsfile` 中的配置：

```groovy
environment {
    REGISTRY = 'harbor.example.com'    // 替换为你的Harbor地址
    PROJECT = 'labsoft'
    IMAGE_NAME = 'website'
    HARBOR_USER = 'admin'
}

parameters {
    string(
        name: 'SERVER_IP',
        defaultValue: '192.168.124.100',  // 替换为你的服务器IP
        description: 'Target server IP address'
    )
    string(
        name: 'DOMAIN',
        defaultValue: 'example.com',       // 替换为你的域名
        description: 'Website domain name'
    )
    string(
        name: 'FRPC_DOMAIN',
        defaultValue: 'website.example.com', // 替换为你的FRPC域名
        description: 'FRPC custom domain'
    )
}
```

#### 3. 运行Pipeline

在Jenkins中触发构建，填写参数后点击"Build with Parameters"。

### 方式二：手动部署

#### 1. 构建并推送到Harbor

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

#### 2. 配置服务器

在Ubuntu服务器上执行以下命令：

```bash
# 安装Docker和Docker Compose
curl -fsSL https://get.docker.com -o install-docker.sh
sudo sh install-docker.sh
sudo usermod -aG docker $USER

# 下载FRPC
sudo mkdir -p /opt/frpc
sudo curl -L -o /opt/frpc/frpc https://github.com/fatedier/frp/releases/latest/download/frpc_linux_amd64
sudo chmod +x /opt/frpc/frpc

# 配置FRPC
sudo cat > /opt/frpc/frpc.toml << 'EOF'
serverAddr = "cloud-server-ip"    # 替换为云服务器FRPC地址
serverPort = 7000
auth.token = "your-frpc-token"    # 替换为FRPC token

[[proxies]]
name = "website-http"
type = "http"
localIP = "127.0.0.1"
localPort = 3000
customDomains = ["your-domain.com"]  # 替换为你的域名
EOF

# 配置Caddy
sudo cat > /etc/caddy/Caddyfile << 'EOF'
your-domain.com {                  # 替换为你的域名
    reverse_proxy http://127.0.0.1:3000
}

:80 {
    redir https://{host}{uri} 301
}
EOF

# 创建Docker Compose文件
sudo mkdir -p /opt/website
sudo cat > /opt/website/docker-compose.yml << 'EOF'
version: '3.8'

services:
  website:
    image: harbor.example.com/labsoft/website:latest  # 替换为你的镜像地址
    container_name: website
    restart: always
    environment:
      - NODE_ENV=production
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  frpc:
    image: snowdreamtech/frpc:latest
    container_name: frpc
    restart: always
    network_mode: host
    volumes:
      - /opt/frpc/frpc.toml:/frpc/frpc.toml:ro
EOF

# 启动服务
cd /opt/website
sudo docker-compose up -d
```

#### 3. 配置云服务器反向代理

在云服务器上安装Caddy，配置反向代理到内网服务器：

```bash
# 安装Caddy
sudo apt install -y caddy

# 配置反向代理
sudo cat > /etc/caddy/Caddyfile << 'EOF'
your-domain.com {                  # 替换为你的域名
    reverse_proxy http://192.168.124.100:80  # 替换为内网服务器IP
}
EOF

# 重启Caddy
sudo systemctl restart caddy
```

## 网站功能

- 首页展示
- 服务介绍
- 移动应用预告
- 价值观与目标
- 关于作者
- 联系方式

## npm 脚本

```bash
npm run dev      # 启动开发服务器 (http://localhost:3000)
npm run build    # 构建生产版本
npm run start    # 启动生产服务器
```

## 开发

项目使用 Tailwind CSS 进行样式管理，组件位于 `src/components/` 目录下，页面位于 `src/app/` 目录下。

## 环境变量

项目根目录提供 `.env.example` 文件作为环境变量模板，可根据需要创建 `.env` 文件。

## 部署 troubleshooting

### 查看容器日志
```bash
docker logs website
docker logs frpc
```

### 重启服务
```bash
docker-compose restart
```

### 清理部署
```bash
docker-compose down -v
```

### 常见问题

**Q: FRPC无法连接**
- 检查云服务器FRPC服务是否运行
- 验证token是否正确
- 确认防火墙允许7000端口

**Q: Caddy无法访问网站**
- 检查Next.js容器是否正常运行
- 验证端口3000是否可访问
- 查看Caddy日志定位问题

**Q: 域名无法解析**
- 确认DNS解析已配置
- 检查云服务器反向代理配置
- 验证FRPC自定义域名设置

---

## 云服务器反向代理 (Caddy)

在云服务器上安装 Caddy 并配置 `/etc/caddy/Caddyfile`：

```caddy
api.laowu.cafe {
    reverse_proxy http://192.168.124.23:8080
}

www.laowu.cafe {
    reverse_proxy http://192.168.124.23:3000
}

:80 {
    redir https://{host}{uri} 301
}
```

Caddy 会自动为两个域名申请 Let's Encrypt HTTPS 证书。

完整 Caddy 配置文件参见项目根目录 `CORE/deploy/caddy/Caddyfile`。

## 相关项目

| 项目 | 说明 | 路径 |
|------|------|------|
| CORE | 后端API (Spring Boot) | `../CORE` |
| LabApps | 跨平台APP (KMP) | `../LabApps` |
| WEBSITE | 官网 (Next.js) | 当前项目 |

## 内网服务器中间件

基于 `env.txt` 配置的内网中间件 (192.168.124.23)：

| 服务 | 端口 |
|------|------|
| MySQL | 3306 |
| Redis | 6379 |
| MongoDB | 27017 |
| Elasticsearch | 9200 |
| MinIO | 9000 (API) / 9001 (Console) |

---

© 2013-2026 老吴咖啡实验室 LABSOFT
