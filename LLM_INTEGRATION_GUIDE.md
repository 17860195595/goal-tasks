# LLM 集成指南

## 📋 目录
1. [架构建议](#架构建议)
2. [API 设计](#api-设计)
3. [错误处理](#错误处理)
4. [用户体验优化](#用户体验优化)
5. [提示词工程](#提示词工程)
6. [性能优化](#性能优化)
7. [安全考虑](#安全考虑)

## 🏗️ 架构建议

### 1. 服务层分离
```
src/
  services/
    llmService.js          # LLM API 调用
    apiClient.js           # 通用 API 客户端
    errorHandler.js        # 错误处理
  hooks/
    useLLMGeneration.js    # LLM 生成逻辑 Hook
    useGoalCreation.js     # 目标创建逻辑（已存在）
```

### 2. 数据流设计
```
用户输入 → useGoalCreation → useLLMGeneration → llmService → LLM API
                ↓
        任务列表返回 → useTaskManagement → UI 显示
```

## 🔌 API 设计

### 推荐的后端 API 接口

```javascript
// POST /api/generate-tasks
{
  "goal": "学习 React",
  "period": 30,
  "startDate": "2026-01-10",
  "endDate": "2026-02-08"
}

// 响应
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

### 流式响应（可选）
```javascript
// POST /api/generate-tasks-stream
// 使用 Server-Sent Events (SSE) 或 WebSocket
data: {"type": "progress", "value": 30}
data: {"type": "task", "task": {...}}
data: {"type": "done"}
```

## ⚠️ 错误处理

### 错误类型分类
1. **网络错误**：超时、连接失败
2. **API 错误**：4xx、5xx 状态码
3. **数据格式错误**：返回数据不符合预期
4. **LLM 错误**：生成失败、内容不符合要求

### 错误处理策略
- ✅ 自动重试（指数退避）
- ✅ 用户友好的错误提示
- ✅ 降级方案（使用本地生成）
- ✅ 错误日志记录

## 🎨 用户体验优化

### 1. 加载状态
- ✅ 显示生成进度（如果支持流式）
- ✅ 显示预计等待时间
- ✅ 允许取消操作

### 2. 错误恢复
- ✅ 提供"重试"按钮
- ✅ 提供"使用默认模板"降级方案
- ✅ 保存用户输入，避免重新输入

### 3. 优化建议
```javascript
// 在 useGoalCreation.js 中
const handleGenerate = async () => {
  try {
    const tasks = await generateTasksWithLLM(...);
    return tasks;
  } catch (error) {
    // 降级到本地生成
    console.warn('LLM 生成失败，使用本地模板', error);
    return generateTasksByPeriod(goalInput, period);
  }
};
```

## 📝 提示词工程

### 提示词模板优化建议

1. **明确输出格式**
   - 使用 JSON Schema 约束
   - 提供示例输出

2. **上下文信息**
   - 用户目标描述
   - 时间周期
   - 阶段划分规则

3. **质量控制**
   - 任务具体性要求
   - 可执行性检查
   - 递进性要求

### 示例提示词结构
```
角色定义 + 任务描述 + 输入参数 + 输出格式 + 质量要求
```

## ⚡ 性能优化

### 1. 缓存策略
- 缓存相似目标的生成结果
- 使用 localStorage 缓存用户历史

### 2. 请求优化
- 防抖处理（避免频繁请求）
- 请求去重
- 取消未完成的请求

### 3. 代码示例
```javascript
// 防抖处理
const debouncedGenerate = useMemo(
  () => debounce(generateTasks, 500),
  [generateTasks]
);
```

## 🔒 安全考虑

### 1. API 安全
- ✅ 使用 HTTPS
- ✅ API Key 存储在环境变量
- ✅ 请求签名验证
- ✅ 速率限制

### 2. 数据安全
- ✅ 敏感信息不发送到 LLM
- ✅ 用户数据加密
- ✅ 输入验证和清理

### 3. 环境变量配置
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_API_KEY=your_api_key_here
```

## 🚀 实施步骤

### 阶段 1：基础集成
1. ✅ 创建 `llmService.js`
2. ✅ 创建 `useLLMGeneration.js` Hook
3. ✅ 修改 `useGoalCreation.js` 使用 LLM

### 阶段 2：错误处理
1. ✅ 添加错误处理逻辑
2. ✅ 实现重试机制
3. ✅ 添加降级方案

### 阶段 3：用户体验
1. ✅ 优化加载状态
2. ✅ 添加进度显示
3. ✅ 优化错误提示

### 阶段 4：性能优化
1. ✅ 实现缓存
2. ✅ 优化请求频率
3. ✅ 添加流式响应（可选）

## 📚 推荐工具和库

- **API 客户端**: `axios` 或原生 `fetch`
- **错误处理**: `react-error-boundary`
- **状态管理**: 现有 hooks 或考虑 `zustand`/`jotai`
- **流式处理**: `EventSource` (SSE) 或 `WebSocket`
- **提示词管理**: 单独的配置文件

## 💡 最佳实践

1. **渐进式增强**：先实现基础功能，再优化
2. **降级方案**：LLM 失败时使用本地生成
3. **用户反馈**：及时显示生成状态和错误信息
4. **测试覆盖**：Mock LLM 响应进行测试
5. **监控日志**：记录 API 调用和错误信息

