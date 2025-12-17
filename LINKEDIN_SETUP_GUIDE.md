# LinkedIn 智能解析功能配置指南

## 🚀 快速开始

### 1. 配置 Mulerun AI API

为了使用 LinkedIn 智能解析功能，您需要：

1. **获取 Mulerun API 密钥**
   - 访问 [Mulerun 平台](https://mulerun.ai)
   - 注册账户并获取 API 密钥

2. **配置环境变量**
   ```bash
   # 编辑 .env.local 文件
   MULERUN_API_BASE=https://api.mulerun.ai
   MULERUN_API_KEY=your_actual_api_key_here
   ```

3. **重启开发服务器**
   ```bash
   # 停止当前服务器 (Ctrl+C)
   # 重新启动
   npm run dev
   ```

### 2. 测试功能

#### 测试步骤：

1. **打开应用**
   - 访问 http://localhost:3000

2. **进入职位页面**
   - 点击 "2. 目标职位" 标签页

3. **粘贴 LinkedIn 链接**
   - 在 "LinkedIn 职位链接" 输入框粘贴职位链接
   - 例如：`https://www.linkedin.com/jobs/collections/unicorn-companies/?currentJobId=4317384752`

4. **等待自动解析**
   - 系统会自动提取 Job ID
   - 获取职位页面 HTML 内容
   - 使用 AI 解析关键信息
   - 自动填充表单字段

## 🔧 支持的链接格式

### ✅ 完全支持

- 标准格式：`https://www.linkedin.com/jobs/view/1234567890`
- 带参数格式：`https://www.linkedin.com/jobs/view/?currentJobId=1234567890`
- 搜索结果：`https://www.linkedin.com/jobs/search/?currentJobId=1234567890`
- **Collections 格式**：`https://www.linkedin.com/jobs/collections/unicorn-companies/?currentJobId=1234567890`
- 推荐职位：`https://www.linkedin.com/jobs/collections/recommended/?currentJobId=1234567890`

### 🌐 链接来源

- LinkedIn Jobs 搜索页面
- LinkedIn 公司职位页面
- LinkedIn 收藏夹 (Collections)
- LinkedIn 推荐职位
- 第三方网站上的 LinkedIn 职位链接

## 📊 解析结果

### 提取的信息

系统会智能提取以下信息：

| 字段 | 说明 | 示例 |
|------|------|------|
| 职位名称 | 职位的具体名称 | "Senior Software Engineer" |
| 公司名称 | 招聘公司名称 | "Google" |
| 职位描述 | 详细的职位要求 | "负责开发..." |
| 工作地点 | 工作城市/地区 | "Mountain View, CA" |
| 工作类型 | Full-time, Part-time 等 | "Full-time" |
| 资历级别 | Entry level, Senior 等 | "Mid-Senior level" |
| 行业分类 | 所属行业领域 | ["Internet", "Software"] |

### 自动填充

解析成功后，信息会自动填充到：

- ✅ 职位名称输入框
- ✅ 公司名称输入框
- ✅ 职位描述文本区域
- ✅ 显示成功提示信息

## 🔍 故障排除

### 常见问题

#### 1. "Mulerun API key not configured"

**解决方案**：
- 确保在 `.env.local` 文件中正确配置了 `MULERUN_API_KEY`
- 重启开发服务器使配置生效

#### 2. "无法从 LinkedIn 获取职位信息"

**可能原因**：
- LinkedIn API 在某些地区受限 (HTTP 451)
- 职位已过期或被移除
- 网络连接问题

**解决方案**：
- 系统会自动使用模拟数据进行测试
- 可以手动输入职位信息继续使用

#### 3. "AI 解析遇到了问题"

**可能原因**：
- Mulerun API 服务暂时不可用
- 职位页面 HTML 格式异常

**解决方案**：
- 系统会提供降级处理
- 可以手动输入职位信息
- 尝试重新解析按钮

#### 4. 链接格式不支持

**解决方案**：
- 确保链接是 LinkedIn 职位链接
- 检查链接是否包含 `currentJobId` 参数
- 尝试复制官方链接格式

### 调试技巧

#### 查看请求日志

打开浏览器开发者工具 (F12)，查看网络请求：

1. **LinkedIn API 请求**：
   - 检查 `/api/linkedin` 请求状态
   - 查看响应内容

2. **AI 解析请求**：
   - 检查 `/api/ai` 请求详情
   - 确认 API 密钥配置正确

#### 控制台日志

在开发者工具的 Console 标签页中查看：
- Job ID 提取日志
- API 调用状态
- 错误信息详情

## 🎯 最佳实践

### 链接选择

- **选择活跃职位**：选择最近发布的职位
- **官方链接**：使用 LinkedIn 官方页面链接
- **完整链接**：确保链接包含完整的参数信息

### 信息验证

- **检查提取结果**：验证 AI 提取的信息是否准确
- **补充信息**：可以手动补充缺失的信息
- **修正错误**：如发现错误可手动修改

### 性能优化

- **避免重复解析**：相同链接会缓存结果
- **网络环境**：确保网络连接稳定
- **浏览器兼容**：推荐使用 Chrome 或 Firefox

## 🔐 安全考虑

### API 密钥保护

- ✅ API 密钥仅存储在服务端
- ✅ 不会暴露到客户端代码中
- ✅ 使用 HTTPS 加密传输

### 隐私保护

- ✅ 职位信息不会永久存储
- ✅ 仅用于当前会话的简历生成
- ✅ 遵循数据保护法规

## 📞 技术支持

如果遇到问题，可以：

1. **查看错误信息**：仔细阅读错误提示
2. **检查配置**：确认环境变量设置正确
3. **重启服务**：重启开发服务器
4. **查看日志**：检查控制台和网络请求
5. **联系支持**：提供错误详情和环境信息

## 🚀 进阶功能

### 批量处理

未来将支持：
- 同时解析多个职位链接
- 批量职位信息导入
- 职位信息对比分析

### 自定义解析

- 自定义提取字段
- 调整 AI 解析策略
- 集成第三方数据源

---

**🎉 现在您已经掌握了 LinkedIn 智能解析功能的使用方法！开始体验智能简历优化的强大功能吧！**