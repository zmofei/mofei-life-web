# Mofei Life Web

[![Cloudflare Pages](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Pages-orange?style=flat-square&logo=cloudflare)](https://www.mofei.life/)
[![Deployment Status](https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square)](#)
[![Last Updated](https://img.shields.io/badge/Last%20Updated-$(date%20+%25Y%25m%25d)-blue?style=flat-square)](#)

个人博客网站 [mofei.life](https://www.mofei.life/) 的开源代码，基于 Next.js 构建的现代化多语言个人博客平台。

**[English Documentation](README.md)**

**注意：本项目主要用于代码参考和学习目的。API 接口连接的是作者的个人后端服务。如需部署自己的版本，请参考 [自定义部署](#自定义部署) 部分。**

## 🤖 开发理念

这个项目展现了 Mofei 在现代开发实践中的成长历程：

- **2025年之前**: 所有代码都是 Mofei 手写完成，代表了传统的开发方式
- **2025年之后**: Mofei 积极拥抱AI辅助开发，现在的代码库体现了人类创造力与AI效率的协作结合

这种演进展示了开发者如何有效地整合AI工具，同时保持代码质量和个人愿景。

## 🌟 主要特性

- **多语言支持**: 完整的中英文双语支持
- **现代化UI**: 美观的响应式设计，流畅的动画效果
- **交互式评论**: 实时评论系统，支持用户头像
- **微信集成**: 微信公众号二维码分享
- **博客系统**: 动态博客文章，支持丰富内容
- **RSS订阅**: 自动生成RSS订阅源
- **SEO优化**: 完整的SEO元数据和站点地图
- **移动端适配**: 针对所有设备尺寸优化
- **深色主题**: 优雅的深色主题设计

## 🚀 技术栈

- **框架**: Next.js 15.2.4 with App Router
- **语言**: TypeScript
- **样式**: Tailwind CSS 4.1.3
- **动画**: Framer Motion
- **图标**: Heroicons
- **部署**: Cloudflare Workers with OpenNext
- **评论**: 自定义评论系统，支持 Gravatar 头像

## 🛠️ 快速开始

### 前置要求

- Node.js 18+ 
- npm, yarn, 或 pnpm

### 安装

1. 克隆仓库：
```bash
git clone https://github.com/zmofei/mofei-life-web.git
cd mofei-life-web
```

2. 安装依赖：
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. 设置环境变量（可选）：
```bash
# 创建 .env.local 用于本地开发
# 项目使用默认 API 端点可直接运行
```

4. 启动开发服务器：
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

应用将在 `http://localhost:3000` 可用（或在开发环境中使用 HTTPS 的 `https://local.mofei.life:3000`）。

## 📝 可用脚本

- `npm run dev` - 启动 HTTPS 开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行 ESLint
- `npm run deploy` - 部署到 Cloudflare Workers
- `npm run preview` - 本地预览 Cloudflare 部署

## 🏗️ 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── [lang]/            # 国际化路由
│   │   ├── blog/          # 博客页面
│   │   ├── message/       # 消息/评论页面
│   │   └── rss/           # RSS 订阅生成
│   └── actions/           # 服务器操作
├── components/            # 可复用组件
│   ├── Comments/          # 评论系统
│   ├── Common/            # 共享组件
│   ├── Home/              # 首页组件
│   └── ui/                # UI 组件
├── lib/                   # 工具函数
└── styles/               # 全局样式
```

## 🌐 API 集成

项目集成了自定义 API 用于：
- 博客内容管理
- 评论系统
- 用户认证
- RSS 订阅生成

API 端点在 `src/app/actions/blog.ts` 中配置。

## 🎨 自定义

### 样式
- 修改 `src/styles/globals.css` 设置全局样式
- 更新 `tailwind.config.js` 自定义主题
- 组件样式使用 Tailwind 类名

### 内容
- 博客内容通过 API 获取
- 静态资源存储在 `public/` 目录
- 微信二维码位于 `public/img/` 目录

### 语言
- 语言路由由 `src/middleware.ts` 处理
- 语言上下文在 `src/components/Context/LanguageContext.tsx` 中

## 🚀 部署

### Cloudflare Workers（推荐）

1. 构建并部署：
```bash
npm run deploy
```

2. 如需要，在 Cloudflare 控制面板中配置环境变量

### 其他平台

项目可部署到任何支持 Next.js 的平台：
- Vercel
- Netlify
- AWS
- Google Cloud

## 🔧 自定义部署

本项目是个人博客，API 端点指向作者的后端服务。要部署自己的版本：

1. **后端设置**：你需要设置自己的后端 API 提供：
   - 博客内容管理
   - 评论系统
   - 用户认证
   - RSS 订阅数据

2. **API 配置**：更新 `src/app/actions/blog.ts` 和 `src/app/actions/blog-server.ts` 中的 API 端点指向你的后端。

3. **环境变量**：根据你的后端设置配置环境变量。

4. **微信集成**：如果使用微信集成，请替换 `public/img/` 中的微信二维码为你自己的。

## 🤝 贡献

欢迎贡献！请阅读我们的 [贡献指南](CONTRIBUTING.md) 了解行为准则和提交拉取请求的流程。

## 📄 许可证

本项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 基于 [Next.js](https://nextjs.org/) 构建
- 部署在 [Cloudflare Workers](https://workers.cloudflare.com/)
- 图标来自 [Heroicons](https://heroicons.com/)
- 动画由 [Framer Motion](https://www.framer.com/motion/) 提供

## 📧 联系

如有问题或需要支持，请创建 issue 或通过网站上的微信公众号联系。

---

**免责声明**：这是一个个人博客项目，分享用于参考和学习目的。API 端点配置为作者的特定后端服务。虽然欢迎你 fork 和修改这个项目，但请注意它不是为通用部署设计的即用模板。