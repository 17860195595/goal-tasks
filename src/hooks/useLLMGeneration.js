import { useState, useCallback } from "react";
import { generateTasksWithLLM, generateTasksWithRetry } from "@/services/llmService";

/**
 * LLM 任务生成 Hook
 * 封装 LLM 调用逻辑，提供状态管理和错误处理
 */
export function useLLMGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0); // 用于流式响应

  /**
   * 生成任务列表
   */
  const generateTasks = useCallback(async (goalDescription, period, startDate, endDate) => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);

    // 模拟进度更新 - 匹配约 2000ms 的 API 响应时间
    let currentProgress = 0;
    const startTime = Date.now();
    const targetDuration = 20000; // 目标 2000ms 到达 98%
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressRatio = Math.min(elapsed / targetDuration, 0.98); // 最多到 98%
      
      // 使用缓动函数让进度更自然（ease-out）
      const easedProgress = 1 - Math.pow(1 - progressRatio, 3); // cubic ease-out
      const targetProgress = easedProgress * 98;
      
      setProgress((prev) => {
        // 确保进度只增不减，且不超过目标进度
        const newProgress = Math.max(prev, Math.min(targetProgress, 98));
        currentProgress = newProgress;
        return newProgress;
      });
    }, 50); // 更频繁的更新，让进度更平滑

    try {
      // 使用重试机制
      const tasks = await generateTasksWithRetry(
        goalDescription,
        period,
        startDate,
        endDate
      );
      
      // 清除进度更新
      clearInterval(progressInterval);
      
      // 确保到达98%（如果还没到）
      if (currentProgress < 98) {
        setProgress(98);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // 快速完成到100%
      setProgress(100);
      
      // 短暂显示100%后返回
      await new Promise(resolve => setTimeout(resolve, 150));
      
      return tasks;
    } catch (err) {
      clearInterval(progressInterval);
      const errorMessage = err.message || '生成任务失败，请稍后重试';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  /**
   * 流式生成任务（可选）
   */
  const generateTasksStream = useCallback(async function* (
    goalDescription,
    period,
    startDate,
    endDate
  ) {
    setIsGenerating(true);
    setError(null);
    setProgress(0);

    try {
      // 这里需要实现流式处理逻辑
      // 暂时使用普通生成
      const tasks = await generateTasksWithRetry(
        goalDescription,
        period,
        startDate,
        endDate
      );
      
      setProgress(100);
      yield tasks;
    } catch (err) {
      const errorMessage = err.message || '生成任务失败，请稍后重试';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    generateTasks,
    generateTasksStream,
    isGenerating,
    error,
    progress,
    clearError: () => setError(null),
  };
}

