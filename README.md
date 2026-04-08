# LABSOFT - 老吴咖啡实验室

软件基础服务平台，包含网站、后端 API、移动应用三端。

## 项目结构

```
LABSOFT/
├── HOME/               # 网站前端 (Next.js + TypeScript + Tailwind CSS)
│   ├── src/app/        #   Next.js App Router 页面
│   ├── src/components/ #   React 组件
│   ├── public/         #   静态资源
│   └── _legacy/        #   旧版静态 HTML 站点（备份）
│
├── CORE/               # 后端 API (Express.js + TypeScript)
│   └── src/
│       ├── index.ts    #   服务入口
│       └── routes/     #   API 路由
│           └── api.ts  #   /api/* 接口
│
├── APPS/               # 移动应用 (React Native + Expo + TypeScript)
│   ├── app/            #   Expo Router 页面
│   │   └── (tabs)/     #   Tab 导航：首页、服务、关于、联系
│   └── constants/      #   主题配色、API 地址
│
├── scripts/            # 启动脚本
│   ├── install.sh      #   一键安装依赖
│   ├── start-web.sh    #   启动网站       → http://localhost:3000
│   ├── start-api.sh    #   启动后端 API   → http://localhost:4000
│   ├── start-app.sh    #   启动移动 App   → Expo CLI
│   └── start-all.sh    #   同时启动全部
│
└── package.json        # Monorepo (npm workspaces)
```

## 技术栈

| 端 | 技术 | 端口 |
|-----|------|------|
| 网站 (HOME) | Next.js 14, React 18, Tailwind CSS, TypeScript | 3000 |
| 后端 (CORE) | Express.js, TypeScript, tsx (热重载) | 4000 |
| 移动 App (APPS) | React Native, Expo 52, Expo Router, TypeScript | Expo CLI |

## 快速开始

```bash
# 1. 安装所有依赖
npm install

# 2. 启动（三选一）
bash scripts/start-web.sh    # 只启动网站
bash scripts/start-api.sh    # 只启动后端
bash scripts/start-all.sh    # 同时启动全部

# 3. 启动移动 App（需要先安装 Expo CLI）
bash scripts/start-app.sh
```

## API 接口

后端运行在 `http://localhost:4000`，提供以下接口：

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/health` | 健康检查 |
| GET | `/api` | 接口列表 |
| GET | `/api/services` | 服务列表 |
| GET | `/api/about` | 关于信息 |
| GET | `/api/goals` | 目标列表 |
| POST | `/api/contact` | 提交联系表单 |

## npm 脚本

```bash
npm run dev:web    # 启动网站
npm run dev:api    # 启动后端
npm run dev:app    # 启动移动 App
npm run build:web  # 构建网站
npm run build:api  # 构建后端
```

## 移动 App 预览

- 安装 [Expo Go](https://expo.dev/go) 到手机
- 运行 `bash scripts/start-app.sh`
- 扫描终端中的二维码即可预览
- 或按 `w` 在浏览器中打开 Web 版

---

&copy; 2013-2026 老吴咖啡实验室 LABSOFT
