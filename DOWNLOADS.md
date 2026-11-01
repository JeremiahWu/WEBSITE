# 客户端下载与部署

网站下载区大标题分别为“桌面端”和“移动端”，项目标识保留 LabStudio 和 LabApps；安装后的应用名称统一为“老吴咖啡实验室”。`/download` 是独立下载页，首页应用下载区使用同一份配置。

已同步五个安装包到 `public/downloads/`：Windows x64 EXE、macOS arm64/Intel DMG、Linux x64 AppImage、Android APK。各平台的文件大小和 SHA-256 位于 `src/config/download-artifacts.json`；公开清单位于 `public/downloads/manifest.json` 和 `SHA256SUMS.txt`。

## 重新生成

1. LabStudio 执行 `npm run package:mac`、`npm run package:win`、`npm run package:linux`。脚本固定正式 API 和 WebSocket 地址。
2. LabApps 执行 `python3 scripts/package-android.py`。使用本机 Android SDK、JDK 和 `scripts/.run/` 下的持久发布签名。
3. WEBSITE 执行：

```sh
npm run downloads:sync
npm run build
```

默认从同级 GitHub 项目目录查找 LabStudio/LabApps，也可设置 `LABSTUDIO_DIR` 和 `LABAPPS_DIR`。构建前会检查全部安装包和校验和，缺失或不匹配会中止，避免发布无效下载链接。

安装包超过 GitHub 普通 Git 文件大小限制，已加入 gitignore。源码 clone 不包含这些二进制文件；请在构建机器上先同步安装包，再构建 Docker 镜像。现有 Dockerfile 会将 `public/` 完整装入镜像，`.dockerignore` 未排除安装包。可在当前 Mac 使用 `scripts/build-and-push.sh` 生成包含全部下载文件的部署镜像，随后按现有部署流程更新服务器。仅提交网站源码不会使线上服务器获得这些安装包。

## 签名与连接状态

Android 发布密钥和密码分别保存在 LabApps 的 `scripts/.run/android-release.p12` 和 `android-release-password.txt`，权限 600，目录权限 700，均被 Git 忽略。应私下备份并在后续版本持续使用同一密钥；不要将它们放入网站目录或镜像。桌面包尚无发布者证书签名／Apple 公证，Windows/Linux 原生 GUI 安装运行需对应设备复核。

所有发布包固定连接 `https://api.laowu.cafe`。2026-11-01 本次检查该域名的 `/api/v1/blog/articles` 返回 HTTP 404 HTML，未返回 CORE JSON；正式账号、博客、AI 与聊天还需服务器的 CORE 和 FRP 转发恢复。下载文件和网站部署与 API 转发是独立步骤。

生产预览若使用 standalone，请复制 public 和 .next/static 到输出目录，不要创建指回源码目录的软链接。Next.js 14 的构建清理会跟随目录软链接；scripts/prepare-build.mjs 会在构建前移除这类危险连接，构建后还会再次检查全部安装包校验值。
