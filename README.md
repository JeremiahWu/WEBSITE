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
├── next.config.mjs   # Next.js 配置
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 技术栈

| 技术 | 版本 |
|------|------|
| Next.js | 14 |
| React | 18 |
| Tailwind CSS | 3.4 |
| TypeScript | 5.4 |

## 前置条件

- Node.js 18+

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

---

© 2013-2026 老吴咖啡实验室 LABSOFT
