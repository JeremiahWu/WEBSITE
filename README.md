# LABSOFT - 老吴咖啡实验室

软件基础服务平台，包含网站、后端 API、移动应用三端。

## 项目结构

```
LABSOFT/
├── HOME/               # 网站前端 (Next.js + TypeScript + Tailwind CSS)
│   ├── src/app/        #   Next.js App Router 页面
│   ├── src/components/ #   React 组件
│   └── public/         #   静态资源（图片、视频）
│
├── CORE/               # 后端 API (Express.js + TypeScript)
│   └── src/
│       ├── index.ts    #   服务入口
│       ├── config/     #   数据库 & Redis 配置
│       ├── models/     #   Sequelize 数据模型（User, Post, PostImage）
│       ├── middleware/  #   JWT + Redis 认证中间件
│       ├── routes/     #   API 路由
│       │   ├── api.ts      # /api/* 原有接口
│       │   ├── auth.ts     # /auth/* 注册、登录、登出
│       │   ├── posts.ts    # /posts/* 动态发布与查看
│       │   ├── ai.ts       # /ai/* AI 聊天（代理 LMStudio）
│       │   ├── blog.ts     # /blog/* 博客（代理 WordPress）
│       │   └── user.ts     # /user/* 个人信息与密码
│       └── uploads/    #   用户上传的图片文件
│
├── APPS/               # 移动应用 (React Native + Expo + TypeScript)
│   ├── app/
│   │   ├── login.tsx       # 登录页（半透明背景图）
│   │   ├── register.tsx    # 注册页
│   │   └── (tabs)/         # 主界面 4 个标签页
│   │       ├── feed.tsx        # 动态（类 Twitter/X）
│   │       ├── ai.tsx          # AI 问答（接 LMStudio）
│   │       ├── blog.tsx        # 博客（接 WordPress）
│   │       └── settings.tsx    # 设置（个人信息、密码、偏好）
│   ├── components/     #   PostCard, CreatePostModal, ChatBubble, BlogCard
│   ├── services/       #   API 请求封装、认证服务
│   ├── contexts/       #   AuthContext 全局认证状态
│   └── constants/      #   主题配色、API 地址
│
├── scripts/            # 启动脚本
├── docker-compose.yml  # MySQL 8 + Redis 7 容器
├── .env.example        # 环境变量模板
└── package.json        # Monorepo (npm workspaces)
```

## 技术栈

| 端 | 技术 | 端口 |
|-----|------|------|
| 网站 (HOME) | Next.js 14, React 18, Tailwind CSS, TypeScript | 3000 |
| 后端 (CORE) | Express.js, Sequelize, JWT, bcrypt, TypeScript | 4000 |
| 移动 App (APPS) | React Native, Expo 52, Expo Router, TypeScript | Expo CLI |
| 数据库 | MySQL 8 (Docker) | 3306 |
| 缓存/会话 | Redis 7 (Docker) | 6379 |

## 前置条件

- Node.js 18+
- Docker & Docker Compose

## 快速开始

```bash
# 1. 安装所有依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env，填写 JWT_SECRET、LMStudio / WordPress 地址等

# 3. 启动 MySQL + Redis
docker compose up -d

# 4. 启动（三选一）
bash scripts/start-api.sh    # 只启动后端（自动拉起 Docker）
bash scripts/start-web.sh    # 只启动网站
bash scripts/start-all.sh    # 同时启动全部（推荐）

# 5. 启动移动 App
bash scripts/start-app.sh
```

## 环境变量 (.env)

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `DB_HOST` | MySQL 地址 | localhost |
| `DB_PORT` | MySQL 端口 | 3306 |
| `DB_USER` | MySQL 用户名 | labsoft |
| `DB_PASSWORD` | MySQL 密码 | labsoft_secret |
| `DB_NAME` | 数据库名 | labsoft |
| `REDIS_HOST` | Redis 地址 | localhost |
| `REDIS_PORT` | Redis 端口 | 6379 |
| `JWT_SECRET` | JWT 签名密钥 | （请修改） |
| `LMSTUDIO_BASE_URL` | LMStudio API 地址 | http://localhost:1234 |
| `WORDPRESS_BASE_URL` | WordPress REST API 地址 | http://localhost/wp-json |

## API 接口

后端运行在 `http://localhost:4000`，提供以下接口：

### 公开接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/health` | 健康检查 |
| GET | `/api` | 接口列表 |
| GET | `/api/services` | 服务列表 |
| GET | `/api/about` | 关于信息 |
| GET | `/api/goals` | 目标列表 |
| POST | `/api/contact` | 提交联系表单 |
| GET | `/blog/posts` | 博客文章列表（代理 WordPress） |

### 认证接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/auth/register` | 注册（用户名 + 邮箱 + 密码 → MySQL） |
| POST | `/auth/login` | 登录（返回 JWT，会话存 Redis） |
| POST | `/auth/logout` | 登出（清除 Redis 会话） |

### 需要认证的接口（Header: `Authorization: Bearer <token>`）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/posts` | 获取动态列表（分页） |
| POST | `/posts` | 发布动态（支持多图上传） |
| DELETE | `/posts/:id` | 删除自己的动态 |
| POST | `/ai/chat` | AI 聊天（代理 LMStudio） |
| GET | `/user/profile` | 获取个人信息 |
| PUT | `/user/profile` | 修改个人信息 / 头像 |
| PUT | `/user/password` | 修改密码 |

## npm 脚本

```bash
npm run dev:web      # 启动网站
npm run dev:api      # 启动后端
npm run dev:app      # 启动移动 App
npm run dev:docker   # 启动 MySQL + Redis 容器
npm run build:web    # 构建网站
npm run build:api    # 构建后端
```

## 移动 App 使用

1. 安装 [Expo Go](https://expo.dev/go) 到手机
2. 运行 `bash scripts/start-app.sh`
3. 扫描终端中的二维码即可预览
4. 打开后进入登录页面，注册账号后即可使用
5. 底部 4 个标签页：动态、AI、博客、设置

---

&copy; 2013-2026 老吴咖啡实验室 LABSOFT
