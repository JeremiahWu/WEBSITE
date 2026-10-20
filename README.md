# LABSOFT - 老吴咖啡实验室

软件基础服务平台，提供网站应用服务。

## 架构（高可用）

```
用户浏览器 → 云服务器 Caddy (HTTPS) → website 容器 (3000)
```

- **官网（本项目）**：部署在云服务器上，由 `CLOUD` 仓库的 compose 统一编排，保证高可用。
- 后端 API（CORE 项目）独立部署，不在本仓库范围内。

## 项目结构

```
LABSOFT/
├── src/              # Next.js 源代码
│   ├── app/          #   Next.js App Router 页面
│   │   └── api/health/  # 健康检查路由（容器 HEALTHCHECK 用）
│   ├── components/   #   React 组件
│   └── app/globals.css  #   全局样式
├── public/           # 静态资源
│   ├── images/       #   图片资源
│   └── videos/       #   视频资源
├── scripts/          # 部署脚本
│   ├── build-and-push.sh    # 构建并推送到Harbor
│   └── deploy.sh           # 部署到服务器
├── next.config.mjs   # Next.js 配置（standalone 输出）
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

## 前置条件

- Node.js 18+
- Docker 20+
- Docker Compose 2+

## 快速开始（本地开发）

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

官网容器由云服务器上的 **CLOUD** 仓库统一编排（compose 中的 `website` 服务，build context 为 `../WEBSITE`），Caddy 反代 `laowu.cafe`/`www.laowu.cafe` 到 `website:3000`，容器端口不对公网暴露。

### 本地构建/运行（调试用）

```bash
docker build -t website:latest .

docker run -d \
  --name website \
  -p 3000:3000 \
  -e NODE_ENV=production \
  website:latest
```

### 生产部署（云服务器）

```bash
# 云服务器上，CLOUD 与 WEBSITE 仓库同级目录（如 /opt/CLOUD、/opt/WEBSITE）
cd /opt/WEBSITE && git pull
cd /opt/CLOUD && docker compose up -d --build website
```

## CI/CD部署

### 方式一：使用Jenkins（后续接入 Harbor 后）

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
  - Private key: 云服务器SSH私钥

#### 2. 修改Jenkinsfile

编辑 `Jenkinsfile` 中的配置：

```groovy
environment {
    REGISTRY = 'harbor.example.com'    // 替换为你的Harbor地址
    PROJECT = 'labsoft'
    IMAGE_NAME = 'website'
    HARBOR_USER = 'admin'
    CLOUD_DIR = '/opt/CLOUD'           // 云服务器上 CLOUD 仓库目录
}

parameters {
    string(
        name: 'TAG',
        defaultValue: 'latest',
        description: 'Docker image tag'
    )
    string(
        name: 'SERVER_IP',
        defaultValue: '<云服务器公网IP>',  // 官网部署目标为云服务器
        description: 'Cloud server IP address'
    )
}
```

> 官网直接跑在云服务器上：pipeline 推送镜像到 Harbor 后，
> SSH 到云服务器 pull 并 `docker compose up -d website` 滚动更新。

#### 3. 运行Pipeline

在Jenkins中触发构建，填写参数后点击"Build with Parameters"。

### 方式二：手动部署

#### 1. 云服务器上部署官网（与 CLOUD 栈统一编排）

```bash
# 两个仓库同级目录
cd /opt
git clone <CLOUD仓库地址>
git clone <WEBSITE仓库地址>

# 准备 CLOUD 环境变量（见 CLOUD 仓库 README）
cd /opt/CLOUD && cp .env.example .env && vi .env

# 构建并启动（cloud + website 两个镜像）
bash scripts/build.sh
bash scripts/deploy.sh
```

## 网站功能

- 首页展示
- 服务介绍
- LabStudio 桌面端下载（Windows / macOS）
- LabApps 移动端下载（Android / iOS）
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

### 查看容器日志（云服务器）
```bash
docker compose -f /opt/CLOUD/docker-compose.yml logs -f website   # 官网
docker compose -f /opt/CLOUD/docker-compose.yml logs -f caddy     # 反代
docker compose -f /opt/CLOUD/docker-compose.yml logs -f cloud     # 邮件服务
```

### 重启服务
```bash
docker compose -f /opt/CLOUD/docker-compose.yml restart
```

### 常见问题

**Q: Caddy无法访问网站**
- 检查 website 容器是否正常运行：`docker compose ps`
- 验证健康检查状态（容器内 `wget -qO- http://localhost:3000/api/health`）
- 查看 Caddy 日志定位问题

**Q: 域名无法解析**
- 确认 DNS 解析已配置（laowu.cafe / www 两条 A 记录指向云服务器）
- 检查云服务器 Caddy 配置（CLOUD 仓库 `config/caddy/Caddyfile`）

---

## 云服务器反向代理 (Caddy)

云服务器上由 CLOUD 仓库的 Caddy 统一反代（证书由 certbot 管理）：

```caddy
laowu.cafe, www.laowu.cafe {
    reverse_proxy website:3000    # 官网容器（本机）
}
```

完整 Caddy 配置参见 CLOUD 仓库 `config/caddy/Caddyfile`。

## 相关项目

| 项目 | 说明 | 路径 |
|------|------|------|
| CORE | 后端API (Spring Boot) | `../CORE` |
| LabApps | 跨平台APP (KMP) | `../LabApps` |
| CLOUD | 云服务器服务栈 | `../CLOUD` |
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

## 应用安装包与下载入口

网站的“应用下载”区展示 LabStudio（Windows / macOS）和 LabApps（Android / iOS）。
下载配置统一位于 `src/config/downloads.ts`；当前所有 `url` 均为 `null`，页面显示禁用的“即将提供”按钮，不会产生无效下载请求。

| 应用 | 平台 | 预留文件位置 | 发布后的 URL |
|------|------|--------------|-------------|
| LabStudio | Windows | `public/downloads/labstudio/windows/LabStudio-Setup.exe` | `/downloads/labstudio/windows/LabStudio-Setup.exe` |
| LabStudio | macOS | `public/downloads/labstudio/macos/LabStudio.dmg` | `/downloads/labstudio/macos/LabStudio.dmg` |
| LabApps | Android | `public/downloads/labapps/android/LabApps.apk` | `/downloads/labapps/android/LabApps.apk` |
| LabApps | iOS | `public/downloads/labapps/ios/` | 根据实际分发方式填写 |

发布步骤：

1. 将安装包复制到上表对应位置；文件名和扩展名也可以自定义。
2. 编辑 `src/config/downloads.ts`，将对应平台的 `url: null as string | null` 改为实际 URL，例如 `url: "/downloads/labstudio/windows/LabStudio-Setup.exe"`。`path` 仅记录预留位置，不会自动启用按钮。
3. 重新执行 `npm run build` 并部署。Docker 部署时需要重新构建镜像，现有 Dockerfile 会将 `public` 中的安装包复制到镜像。
4. 打开下载入口，确认文件可下载后完成发布。

iOS 预留目录用于存放后续分发所需文件；普通网页直接下载 IPA 并不等于可以安装。iOS 的 `url` 应使用实际可用的 App Store、TestFlight 或已配置的签名分发入口。

当前生产 Dockerfile 构建的是仓库根目录应用；`sites/laowu-cafe` 是另一份独立副本，本节所述修改和目录均以根目录为准。
