# LLM 集成快速开始

## ✅ 已完成的集成

### 1. 核心文件
- ✅ `src/services/llmService.js` - LLM API 服务层
- ✅ `src/hooks/useLLMGeneration.js` - LLM 生成 Hook
- ✅ `src/hooks/useGoalCreation.js` - 已集成 LLM（带降级方案）
- ✅ `src/utils/errorHandler.js` - 错误处理工具

### 2. 功能特性
- ✅ 自动重试机制（最多 3 次，指数退避）
- ✅ 降级方案（LLM 失败时使用本地模板）
- ✅ 错误提示（在 UI 中显示）
- ✅ 功能开关（可通过环境变量控制）

## 🚀 使用步骤

### 步骤 1：配置环境变量

创建 `.env` 文件（在项目根目录）：

```env
# 必需：API 基础 URL
VITE_API_BASE_URL=http://localhost:3000/api
# 或生产环境
# VITE_API_BASE_URL=https://api.yourdomain.com/api

# 可选：功能开关（默认启用）
VITE_ENABLE_LLM=true
```

### 步骤 2：实现后端 API

后端需要实现以下接口：

**POST `/api/generate-tasks`**

请求体：
```json
{
  "goal": "学习 React",
  "period": 30,
  "startDate": "2026-01-10",
  "endDate": "2026-02-08",
  "prompt": "你是一个专业的任务规划助手..."
}
```

响应：
```json
{
  "tasks": [
    {
      "text": "第1-10天：了解 React 基础概念",
      "stage": 1,
      "stageName": "基础阶段",
      "dayRange": "第1-10天"
    }
  ]
}
```

### 步骤 3：测试

1. 启动开发服务器：`npm run dev`
2. 确保后端 API 运行
3. 在创建目标页面输入目标描述
4. 点击生成，观察是否调用 LLM API

## 🔧 配置说明

### 功能开关

- **启用 LLM**：设置 `VITE_ENABLE_LLM=true` 或设置 `VITE_API_BASE_URL`
- **禁用 LLM**：设置 `VITE_ENABLE_LLM=false`，将使用本地模板生成

### 降级方案

如果 LLM 调用失败，系统会自动：
1. 显示错误提示（不阻塞用户）
2. 使用本地模板生成任务
3. 继续正常流程

## 📝 提示词优化建议

当前提示词在 `llmService.js` 的 `generateTaskPrompt` 函数中。

**优化方向：**
1. 根据目标类型调整提示词
2. 添加更多上下文信息
3. 使用 few-shot 示例
4. 明确输出格式要求

## 🐛 调试

### 检查 LLM 是否启用
```javascript
console.log('LLM Enabled:', import.meta.env.VITE_ENABLE_LLM);
console.log('API URL:', import.meta.env.VITE_API_BASE_URL);
```

### 查看错误信息
- 打开浏览器控制台
- 查看 Network 标签页中的 API 请求
- 查看 Console 中的错误日志

## 📚 相关文档

- `LLM_INTEGRATION_GUIDE.md` - 详细集成指南
- `src/hooks/useGoalCreation.llm.example.js` - 集成示例

