/**
 * LLM 服务层
 * 负责与 LLM API 交互，生成任务列表
 */

// API 配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_TIMEOUT = 30000; // 30秒超时

/**
 * 生成任务列表的提示词模板
 */
const generateTaskPrompt = (goalDescription, period, startDate, endDate) => {
  return `你是一个专业的任务规划助手。请根据用户的目标和周期，生成详细的分阶段任务列表。

用户目标：${goalDescription}
目标周期：${period} 天
起始日期：${startDate}
结束日期：${endDate}

要求：
1. 如果周期 >= 9 天，请将任务分成 3 个阶段（基础阶段、实践阶段、进阶阶段），每个阶段的任务数量要合理
2. 如果周期 < 9 天，生成常规任务列表
3. 每个任务要具体、可执行
4. 任务要符合阶段性递进的学习规律
5. 返回 JSON 格式，包含任务列表

请返回以下格式的 JSON：
{
  "tasks": [
    {
      "text": "任务描述",
      "stage": 1,
      "stageName": "基础阶段",
      "dayRange": "第1-10天"
    }
  ]
}`;
};

/**
 * 调用 LLM API 生成任务
 */
export async function generateTasksWithLLM(goalDescription, period, startDate, endDate) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        goal: goalDescription,
        period: period,
        startDate: startDate,
        endDate: endDate,
        prompt: generateTaskPrompt(goalDescription, period, startDate, endDate),
      }),
      signal: AbortSignal.timeout(API_TIMEOUT),
    });

    if (!response.ok) {
      // 尝试解析错误响应
      let errorMessage = `API 错误: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // 如果无法解析错误响应，使用默认消息
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // 验证返回数据格式
    if (!data.tasks || !Array.isArray(data.tasks)) {
      throw new Error('返回数据格式错误：缺少 tasks 数组');
    }

    // 转换数据格式，添加 id 和 completed 字段
    return data.tasks.map((task, index) => ({
      id: Date.now() + index,
      text: task.text,
      completed: false,
      stage: task.stage || 0,
      stageName: task.stageName || '常规任务',
      dayRange: task.dayRange || '',
    }));
  } catch (error) {
    // 处理不同类型的错误
    if (error.name === 'AbortError') {
      throw new Error('请求超时，请稍后重试');
    }
    if (error.name === 'NetworkError' || !navigator.onLine) {
      throw new Error('网络连接失败，请检查网络设置');
    }
    throw error;
  }
}

/**
 * 流式生成任务（如果 LLM 支持流式响应）
 */
export async function* generateTasksStream(goalDescription, period, startDate, endDate) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-tasks-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        goal: goalDescription,
        period: period,
        startDate: startDate,
        endDate: endDate,
        prompt: generateTaskPrompt(goalDescription, period, startDate, endDate),
      }),
    });

    if (!response.ok) {
      throw new Error(`API 错误: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            yield data;
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }
  } catch (error) {
    throw error;
  }
}

/**
 * 重试机制
 */
export async function generateTasksWithRetry(
  goalDescription,
  period,
  startDate,
  endDate,
  maxRetries = 3
) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await generateTasksWithLLM(goalDescription, period, startDate, endDate);
    } catch (error) {
      lastError = error;
      // 指数退避
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  
  throw lastError;
}

