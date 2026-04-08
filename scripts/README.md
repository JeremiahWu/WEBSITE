# LABSOFT 启动脚本

| 脚本 | 作用 | 端口 |
|------|------|------|
| `install.sh` | 一键安装所有依赖 | - |
| `start-web.sh` | 启动网站 (Next.js) | 3000 |
| `start-api.sh` | 启动后端 API (Express) | 4000 |
| `start-app.sh` | 启动移动 App (Expo) | - |
| `start-all.sh` | 同时启动网站 + 后端 + App | 全部 |

## 使用方法

```bash
# 首次安装依赖
bash scripts/install.sh

# 启动单个服务
bash scripts/start-web.sh
bash scripts/start-api.sh
bash scripts/start-app.sh

# 或一键启动全部
bash scripts/start-all.sh
```
