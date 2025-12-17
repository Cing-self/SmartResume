# SmartResume - AI 智能简历构建器

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Mulerun-AI-purple" alt="Mulerun AI" />
</div>

## 📖 项目简介

SmartResume 是一个基于 Next.js 16 构建的智能简历优化平台，通过集成 **Mulerun AI** 统一模型调用平台，为求职者提供全方位的简历优化和职位匹配服务。

### ✨ 核心功能

- 🤖 **AI 简历润色** - 使用 AI 优化工作经历描述和语言表达
- 🎯 **职位匹配分析** - 深度分析简历与目标职位的匹配度
- 📄 **求职信生成** - 根据职位描述自动生成个性化求职信
- 🧠 **面试辅导** - 预测面试问题并提供回答建议
- 📊 **技能差距分析** - 识别技能优势和需要提升的领域
- 🤝 **社交助手** - 生成 LinkedIn 连接请求和求职邮件
- 🔗 **LinkedIn 智能解析** - 自动解析 LinkedIn 职位链接，支持 Collections 格式，AI 驱动的职位信息提取
- 📱 **响应式设计** - 支持桌面和移动设备
- 🖨️ **PDF 导出** - 一键导出专业格式的简历

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm, yarn, pnpm 或 bun

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd SmartResume
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.local.example .env.local
   ```

   编辑 `.env.local` 文件，配置 Mulerun API 密钥：
   ```env
   MULERUN_API_BASE=https://api.mulerun.ai
   MULERUN_API_KEY=your_mulerun_api_key_here
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**

   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

6. **体验 LinkedIn 智能解析**

   粘贴 LinkedIn 职位链接（支持 Collections 格式）：
   ```bash
   https://www.linkedin.com/jobs/collections/unicorn-companies/?currentJobId=4317384752&discover=true
   ```

   系统将自动提取职位信息并填充到表单中。

## 🎯 LinkedIn 智能解析功能

### ✨ 核心特性

- **🔗 智能链接解析**: 支持所有 LinkedIn 职位链接格式，包括 Collections
- **🤖 AI 驱动提取**: 使用 Mulerun AI 智能解析职位页面 HTML
- **📊 结构化数据**: 自动提取职位名称、公司、描述、地点等信息
- **🔄 实时解析**: 粘贴链接后 2-5 秒内完成解析
- **🛡️ 优雅降级**: API 不可用时提供友好降级处理

### 🌐 支持的链接格式

```bash
# Collections 格式 (新增支持)
https://www.linkedin.com/jobs/collections/unicorn-companies/?currentJobId=4317384752

# 标准格式
https://www.linkedin.com/jobs/view/4317384752

# 搜索结果格式
https://www.linkedin.com/jobs/search/?currentJobId=4317384752&keywords=software

# 推荐职位格式
https://www.linkedin.com/jobs/collections/recommended/?currentJobId=4317384752
```

### 📋 提取的信息

| 信息类型 | 说明 |
|---------|------|
| 职位名称 | 准确提取职位具体名称 |
| 公司名称 | 招聘公司信息 |
| 职位描述 | 完整的职位要求和描述 |
| 工作地点 | 城市和地区信息 |
| 工作类型 | Full-time, Part-time 等 |
| 资历级别 | Entry level, Senior 等 |
| 行业分类 | 所属行业领域 |

### 🚀 使用方法

1. 复制 LinkedIn 职位链接
2. 粘贴到 "LinkedIn 职位链接" 输入框
3. 等待自动解析完成
4. 确认自动填充的信息
5. 继续使用 AI 优化功能

### 📖 详细文档

- [LinkedIn 配置指南](./LINKEDIN_SETUP_GUIDE.md) - 完整配置和使用说明
- [演示指南](./DEMO_GUIDE.md) - 功能演示和测试方法

## 🏗️ 技术架构

### 技术栈

- **前端框架**: Next.js 16 + React 19
- **类型系统**: TypeScript
- **样式方案**: Tailwind CSS v4
- **AI 集成**: Mulerun 统一模型调用平台
- **部署方式**: 静态导出 (Cloudflare Pages)

### 项目结构

```
src/
├── app/
│   ├── api/
│   │   ├── ai/          # Mulerun AI API 路由
│   │   └── linkedin/    # LinkedIn 职位解析 API
│   ├── globals.css      # 全局样式
│   ├── layout.tsx       # 根布局组件
│   └── page.tsx         # 主页面组件
├── components/
│   ├── ui/              # 基础 UI 组件
│   └── ResumeEditor.tsx # 主要的简历编辑器
├── hooks/
│   └── useResume.ts     # 状态管理 Hook
├── lib/
│   ├── ai.ts            # Mulerun AI 服务端集成
│   ├── ai-client.ts     # AI 客户端服务
│   └── utils.ts         # 工具函数
└── types/
    └── resume.ts        # TypeScript 类型定义
```

## 🔧 开发指南

### 可用脚本

```bash
# 开发服务器
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

### 添加新功能

1. **AI 功能扩展**:
   - 在 `src/lib/ai.ts` 中定义新的 prompt 构建器
   - 在 `src/app/api/ai/route.ts` 中添加路由处理逻辑
   - 在 `src/lib/ai-client.ts` 中添加客户端调用方法

2. **UI 组件开发**:
   - 在 `src/components/` 目录下创建新组件
   - 使用 Tailwind CSS 进行样式开发
   - 遵循现有的设计规范

3. **状态管理**:
   - 使用 `src/hooks/useResume.ts` 管理应用状态
   - 确保状态的类型安全

## 🚀 部署

### Cloudflare Pages 部署

项目已配置为静态导出，可直接部署到 Cloudflare Pages：

1. **构建项目**
   ```bash
   npm run build
   ```

2. **部署到 Cloudflare Pages**
   - 连接 Git 仓库或上传 `out/` 目录
   - 配置环境变量 `MULERUN_API_KEY`
   - 设置构建输出目录为 `out`

详细部署指南请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🤝 贡献指南

我们欢迎所有形式的贡献！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🆘 支持

如果您遇到问题或有功能建议，请：

1. 查看 [常见问题](./DEPLOYMENT.md#故障排除)
2. 搜索现有的 [Issues](../../issues)
3. 创建新的 Issue 描述问题

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Lucide](https://lucide.dev/) - 图标库
- [Mulerun](https://mulerun.ai/) - AI 模型调用平台

---

<div align="center">
  <p> Made with ❤️ for job seekers everywhere </p>
</div>
