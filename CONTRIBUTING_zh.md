# 贡献指南

感谢你对 Mofei Life Web 项目的关注！本指南将帮助你开始为这个项目做出贡献。

**请注意**：这是一个个人博客项目，主要用于代码参考和学习目的。虽然欢迎贡献，但请理解这个项目是为作者的特定需求和后端服务定制的。

## 📋 目录

- [行为准则](#行为准则)
- [开始贡献](#开始贡献)
- [开发环境设置](#开发环境设置)
- [进行修改](#进行修改)
- [提交修改](#提交修改)
- [代码风格指南](#代码风格指南)
- [问题反馈](#问题反馈)

## 📜 行为准则

本项目遵循标准的开源社区准则。请在所有互动中保持尊重、建设性和包容性。

## 🚀 开始贡献

### 前置要求

- Node.js 18 或更高版本
- npm, yarn, 或 pnpm
- Git

### Fork 和克隆

1. 在 GitHub 上 Fork 这个仓库
2. 在本地克隆你的 fork：
   ```bash
   git clone https://github.com/your-username/mofei-life-web.git
   cd mofei-life-web
   ```

### 贡献者重要提示

- **API 依赖**：项目连接到作者的个人后端服务。某些功能在你的本地环境中可能无法完全运行。
- **内容管理**：博客内容和评论通过作者的 API 端点管理。
- **重点领域**：最有价值的贡献将是 UI/UX 改进、代码优化、错误修复和文档增强。

## 🛠️ 开发环境设置

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 打开浏览器访问 `http://localhost:3000`

### 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── [lang]/            # 国际化路由
│   └── actions/           # 服务器操作
├── components/            # React 组件
│   ├── Comments/          # 评论系统
│   ├── Common/            # 共享组件
│   ├── Home/              # 首页组件
│   └── ui/                # UI 组件
├── lib/                   # 工具函数
└── styles/               # 全局样式
```

## 🔄 进行修改

### 创建分支

为你的功能或错误修复创建一个新分支：

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/issue-description
```

### 分支命名约定

- `feature/description` - 新功能
- `fix/description` - 错误修复
- `docs/description` - 文档更新
- `style/description` - 样式修改
- `refactor/description` - 代码重构

### 提交消息

编写清晰、描述性的提交消息：

```
feat: 添加微信二维码集成
fix: 解决移动端响应式问题
docs: 更新 API 文档
style: 改进评论区样式
refactor: 优化图片加载性能
```

使用约定式提交格式：
- `feat:` - 新功能
- `fix:` - 错误修复
- `docs:` - 文档更改
- `style:` - 格式化更改
- `refactor:` - 代码重构
- `test:` - 添加测试
- `chore:` - 维护任务

## 📤 提交修改

### 提交前检查

1. **测试你的修改**：确保你的代码按预期工作
2. **运行代码检查**：`npm run lint`
3. **检查 TypeScript 错误**：`npm run build`
4. **在不同浏览器中测试**：Chrome, Firefox, Safari, Edge
5. **测试移动端响应式**：使用浏览器开发者工具

### 创建拉取请求

1. 将你的修改推送到你的 fork：
   ```bash
   git push origin your-branch-name
   ```

2. 在 GitHub 上创建拉取请求，包含：
   - **清晰的标题**：简要描述修改内容
   - **详细描述**：说明修改了什么以及为什么修改
   - **截图**：如果进行了 UI 修改
   - **测试说明**：如何测试这些修改

### 拉取请求模板

```markdown
## 描述
修改内容的简要描述

## 修改类型
- [ ] 错误修复
- [ ] 新功能
- [ ] 文档更新
- [ ] 样式/UI 改进
- [ ] 代码重构

## 测试
- [ ] 本地测试
- [ ] 移动端测试
- [ ] 多浏览器测试
- [ ] 无 TypeScript 错误
- [ ] 代码检查通过

## 截图
（如适用）

## 补充说明
任何额外的信息或上下文
```

## 📝 代码风格指南

### 代码风格

- **TypeScript**：对所有新文件使用 TypeScript
- **ESLint**：遵循现有的 ESLint 配置
- **Prettier**：代码格式由 Prettier 处理
- **导入**：使用 `@/` 前缀的绝对导入
- **组件**：使用带 hooks 的函数组件

### 组件指南

```typescript
// 良好的组件结构
import React from 'react';
import { ComponentProps } from '@/types';

interface Props extends ComponentProps {
  title: string;
  isActive?: boolean;
}

export default function MyComponent({ title, isActive = false }: Props) {
  return (
    <div className="component-wrapper">
      <h1>{title}</h1>
    </div>
  );
}
```

### CSS/样式

- **Tailwind CSS**：使用 Tailwind 类进行样式设置
- **响应式设计**：移动端优先的方法
- **深色主题**：确保与深色主题兼容
- **无障碍**：遵循 Web 无障碍内容指南

### 命名约定

- **文件**：使用 kebab-case 文件名
- **组件**：使用 PascalCase 组件名
- **变量**：使用 camelCase 变量名
- **常量**：使用 UPPER_SNAKE_CASE 常量名

## 🐛 问题反馈

### 错误报告

请包含以下信息：

1. **描述**：错误的清晰描述
2. **重现步骤**：重现问题的详细步骤
3. **期望行为**：应该发生什么
4. **实际行为**：实际发生了什么
5. **环境**：浏览器、操作系统、设备类型
6. **截图**：如适用

### 功能请求

1. **问题**：这解决了什么问题？
2. **解决方案**：提议的解决方案
3. **替代方案**：考虑过的其他解决方案
4. **上下文**：额外的上下文或截图

## 🏷️ 标签

我们使用以下标签：

- `bug` - 有问题的功能
- `enhancement` - 新功能或请求
- `documentation` - 文档改进
- `good first issue` - 适合新手的问题
- `help wanted` - 需要额外关注
- `priority: high` - 高优先级问题
- `priority: medium` - 中等优先级问题
- `priority: low` - 低优先级问题

## 🤝 社区

- 保持尊重和包容
- 帮助新手
- 分享知识和最佳实践
- 提供建设性反馈

## 📞 获取帮助

如果你需要帮助或有疑问：

1. 查看现有的 issues 和讨论
2. 创建一个带有 `question` 标签的新 issue
3. 参与社区讨论

## 🙏 致谢

贡献者将在以下地方获得认可：
- README.md 贡献者部分
- 发布说明
- 社区致谢

感谢为 Mofei Life Web 做出贡献！🎉