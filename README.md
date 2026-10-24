# 老吴咖啡实验室 | LAOWU-CAFE Labs

## 项目结构

```text
WEBSITE/
├── src/
│   ├── app/
│   │   ├── page.tsx           # 首页区块编排
│   │   ├── layout.tsx         # 元信息与全局样式
│   │   ├── globals.css        # 全局及 Logo 样式
│   │   ├── home.css           # 首页与响应式样式
│   │   └── api/health/route.ts
│   ├── components/           # 首页组件及概念图
│   └── config/
│       ├── research.ts       # 研究方向
│       ├── values.ts         # 价值观
│       ├── downloads.ts      # 应用下载配置
│       └── contact.ts        # GitHub、博客与邮箱
├── public/
│   ├── images/
│   ├── videos/
│   └── downloads/
├── scripts/
│   ├── build-and-push.sh     # 构建并推送 Docker Hub
│   └── deploy.sh             # 在当前机器拉取并部署
├── .dockerignore
├── Dockerfile
├── next.config.mjs
├── tsconfig.json
└── package.json
```

生产构建以仓库根目录应用为准。`sites/laowu-cafe` 是独立的本地副本，已从根项目 TypeScript 检查及 Docker 构建上下文排除，不随本项目发布。

## 本地开发

技术栈为 Next.js 14、React 18、TypeScript 5、Tailwind CSS 3。建议使用 Node.js 20，与 Dockerfile 保持一致。

```bash
npm ci
npm run dev
```

访问 [本地首页](http://localhost:3000)。

| 命令 | 用途 |
|------|------|
| `npm run dev` | 启动 3000 端口开发服务 |
| `npm run build` | 构建生产版本，执行类型检查 |
| `npm run start` | 在 3000 端口启动生产服务，需先构建 |

开发产物使用 `.next-dev`，生产产物使用 `.next`，避免生产构建覆盖运行中的开发资源。若删除路由后类型检查仍引用旧页面，可停止开发服务、删除对应生成目录后重新启动。

## 应用安装包与下载入口

LabStudio 面向 Windows、macOS；LabApps 面向 Android、iOS。配置位于 `src/config/downloads.ts`。当前所有 `url` 均为 `null`，显示禁用的“即将提供”按钮；设备画面为概念示意。

| 应用 | 平台 | 预留文件位置 | 发布后的 URL |
|------|------|--------------|-------------|
| LabStudio | Windows | `public/downloads/labstudio/windows/LabStudio-Setup.exe` | `/downloads/labstudio/windows/LabStudio-Setup.exe` |
| LabStudio | macOS | `public/downloads/labstudio/macos/LabStudio.dmg` | `/downloads/labstudio/macos/LabStudio.dmg` |
| LabApps | Android | `public/downloads/labapps/android/LabApps.apk` | `/downloads/labapps/android/LabApps.apk` |
| LabApps | iOS | `public/downloads/labapps/ios/` | 根据实际分发方式填写 |

发布步骤：

1. 将安装包复制到预留目录，文件名也可自行调整。
2. 将对应平台的 `url: null as string | null` 改为实际 URL。`path` 仅记录预留位置，不会自动启用入口。
3. 重新构建、推送镜像并部署；Dockerfile 会将 `public` 中的安装包复制到镜像。
4. 验证入口与文件下载。

iOS 的入口应使用实际可用的 App Store、TestFlight 或已配置的签名分发地址；网页下载 IPA 本身不等于可以安装。

## Docker Hub 构建与发布

镜像仓库为 `wuruihao629/website`。构建机器需安装并启动 Docker，且具备支持目标架构的 Buildx builder。

```bash
docker login -u wuruihao629
bash scripts/build-and-push.sh
```

每次构建同时推送：

- 日期标签：`wuruihao629/website:YYYYMMDD-HHMMSS`，按北京时间生成，例如 `20261024-153000`。
- 最新标签：`wuruihao629/website:latest`，指向本次发布的镜像。

请按时间顺序发布，避免同时运行多个发布进程；不要复用历史日期标签，以便保留版本供回退。

| 构建变量 | 默认值 | 说明 |
|----------|--------|------|
| `IMAGE` | `wuruihao629/website` | 镜像仓库 |
| `TAG` | 当前北京时间 | 必须符合 `YYYYMMDD-HHMMSS`，不能设为 latest |
| `PLATFORMS` | `linux/amd64,linux/arm64` | 目标架构列表 |

```bash
# 仅构建 Intel/AMD 云服务器版本
PLATFORMS=linux/amd64 bash scripts/build-and-push.sh

# 显式指定日期标签，仍同时发布 latest
TAG=20261024-153000 bash scripts/build-and-push.sh
```

Dockerfile 使用 Node.js 20 Alpine 多阶段构建，运行 Next.js standalone 服务，以非 root 用户启动并检查 `/api/health`。`.dockerignore` 排除依赖、构建缓存、独立站点副本和本地环境配置等文件。

## 一键部署

### Docker 单命令部署（无需克隆仓库）

在已安装并启动 Docker 的服务器上执行，自动拉取最新镜像并后台运行：

```bash
docker run -d --pull always --name website --restart unless-stopped -p 3000:3000 -e NODE_ENV=production -e HOSTNAME=0.0.0.0 -e PORT=3000 -e TZ=Asia/Shanghai wuruihao629/website:latest
```

部署后访问 `http://服务器IP:3000`，本机访问 [http://localhost:3000](http://localhost:3000)。服务器防火墙需允许 3000 端口；私有镜像需先执行 `docker login -u wuruihao629`。容器名 `website` 和宿主机 3000 端口需未被占用。固定版本时将 `latest` 替换为日期标签，例如 `20261024-153000`。

该命令用于独立容器首次部署，不自动加入 CLOUD 网络。已有 CLOUD 环境请使用下方 Compose 部署流程；已有独立容器的更新可使用下方独立容器脚本。

部署脚本在执行它的机器上部署，不会自动 SSH 到其他服务器。请先将仓库或部署脚本放到目标服务器；私有镜像需先在目标服务器登录 Docker Hub。

### CLOUD Compose 模式（默认）

```text
用户浏览器 → 云服务器 Caddy (HTTPS) → website 容器 (3000)
```

生产环境由 CLOUD 仓库 Compose 管理，Caddy 将 `laowu.cafe`、`www.laowu.cafe` 反代到 `website:3000`。首次部署前按 CLOUD 仓库说明准备环境变量、网络和反向代理服务。

```bash
# CLOUD 与 WEBSITE 仓库同级时
bash scripts/deploy.sh

# 指定服务器上 CLOUD 仓库位置
CLOUD_DIR=/opt/CLOUD bash scripts/deploy.sh

# 部署或回退到指定日期版本
TAG=20261024-153000 CLOUD_DIR=/opt/CLOUD bash scripts/deploy.sh
```

脚本设置 `WEBSITE_IMAGE`，拉取镜像后执行 `docker compose up -d --no-deps --no-build website`，仅更新官网服务，沿用 Compose 的网络配置。CLOUD 的 `docker-compose.yml` 需支持 `WEBSITE_IMAGE` 环境变量覆盖镜像，当前同级 CLOUD 仓库已支持。

`WEBSITE_IMAGE` 只在本次脚本进程中设置，不写入 CLOUD 的 `.env`。后续更新请继续使用此脚本；直接运行其他 Compose 更新命令时，需自行指定相同的镜像变量。

### 独立容器模式

```bash
DEPLOY_MODE=standalone HOST_PORT=3000 bash scripts/deploy.sh
```

先拉取镜像，再停止并删除同名旧容器，启动新容器。默认绑定 `127.0.0.1:3000`，通过本机访问或由本机反向代理访问；此模式不会自动加入 CLOUD 网络。

| 部署变量 | 默认值 | 说明 |
|----------|--------|------|
| `IMAGE` | `wuruihao629/website` | 镜像仓库 |
| `TAG` | `latest` | latest 或日期标签 |
| `DEPLOY_MODE` | `compose` | compose / standalone |
| `CLOUD_DIR` | WEBSITE 同级 CLOUD 目录 | 包含 `docker-compose.yml`，仅 Compose 模式使用 |
| `CONTAINER_NAME` | `website` | 独立模式容器名 |
| `HOST_PORT` | `3000` | 独立模式本机端口 |

两种模式都会等待 Docker 健康检查，最多约 120 秒；失败时退出并输出最近 80 行日志。替换容器期间可能短暂中断，失败不会自动回滚，可指定上一个日期标签重新部署。

### 旧 CI 配置

`Jenkinsfile` 和 `.github/workflows/cicd.yml` 仍是旧 Harbor 流程模板，尚未同步至 Docker Hub，也未验证可用。当前发布以 `scripts/build-and-push.sh` 与 `scripts/deploy.sh` 为准。

## 运维与验证

```bash
# 官网容器状态和日志
docker compose -f /opt/CLOUD/docker-compose.yml ps website
docker compose -f /opt/CLOUD/docker-compose.yml logs -f website

# Caddy 日志
docker compose -f /opt/CLOUD/docker-compose.yml logs -f caddy

# 容器内健康检查
docker exec website wget -qO- http://localhost:3000/api/health

# 脚本语法与补丁空白检查
bash -n scripts/build-and-push.sh scripts/deploy.sh
git diff --check
```

若 Caddy 无法访问官网，检查容器健康状态、CLOUD 网络及 Caddy 的 `website:3000` 配置；域名解析应指向实际部署服务器。

本轮网站改动已通过生产构建；发布与部署脚本已通过 Bash 语法检查及模拟 Docker 流程验证，包括日期标签、latest、两种部署模式和失败退出。尚未执行真实镜像构建、Docker Hub 推送或服务器部署。

## 内容维护

| 内容 | 修改位置 |
|------|----------|
| 首页区块顺序 | `src/app/page.tsx` |
| 开屏标题与欢迎语 | `src/components/Hero.tsx` |
| 区块中英文标题 | 对应的 `src/components/*.tsx` |
| 研究方向文案 | `src/config/research.ts` |
| 价值观文案 | `src/config/values.ts` |
| 应用与下载地址 | `src/config/downloads.ts` |
| GitHub、博客、邮箱 | `src/config/contact.ts` |
| Logo 与首页样式 | `src/app/globals.css`、`src/app/home.css` |
| 网站标题与描述 | `src/app/layout.tsx` |

相关项目包括 CLOUD 云服务器服务栈、LabStudio 桌面应用、LabApps 移动应用；后端 API 独立部署，不在本仓库范围内。

© 2013–2026 老吴咖啡实验室 LAOWU-CAFE Labs
