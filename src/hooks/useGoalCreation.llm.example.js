/**
 * useGoalCreation.js 的 LLM 集成示例
 * 展示如何将现有的 useGoalCreation 与 LLM 服务集成
 */

import { useState } from "react";
import { useLLMGeneration } from "./useLLMGeneration";
import { generateTasksByPeriod } from "./generateTasksByPeriod"; // 降级方案

export function useGoalCreation() {
  const [goalInput, setGoalInput] = useState("");
  const [goalPeriod, setGoalPeriod] = useState("30");
  const [goalInfo, setGoalInfo] = useState(null);
  const [goalCreated, setGoalCreated] = useState(false);
  
  // 使用 LLM 生成 Hook
  const {
    generateTasks,
    isGenerating,
    error: llmError,
    clearError,
  } = useLLMGeneration();

  const handleGenerate = async () => {
    if (!goalInput.trim()) return;

    setGoalInfo(null);
    clearError();

    const period = parseInt(goalPeriod) || 30;
    
    // 计算日期范围
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    const endDate = new Date(today.getTime() + (period - 1) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    try {
      // 尝试使用 LLM 生成任务
      const tasks = await generateTasks(goalInput, period, startDate, endDate);
      
      // 保存目标信息
      const newGoalInfo = {
        description: goalInput,
        period: period,
        startDate,
        endDate,
      };
      setGoalInfo(newGoalInfo);

      return tasks;
    } catch (error) {
      // LLM 生成失败，使用降级方案
      console.warn('LLM 生成失败，使用本地模板:', error);
      
      // 保存目标信息
      const newGoalInfo = {
        description: goalInput,
        period: period,
        startDate,
        endDate,
      };
      setGoalInfo(newGoalInfo);

      // 返回本地生成的任务
      return generateTasksByPeriod(goalInput, period);
    }
  };

  const handleCreateGoal = async () => {
    // TODO: 保存目标到后端
    try {
      // const response = await fetch('/api/goals', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     description: goalInput,
      //     period: parseInt(goalPeriod),
      //     tasks: tasks,
      //   }),
      // });
      
      setGoalCreated(true);
      setTimeout(() => {
        window.location.href = "/today";
      }, 1500);
    } catch (error) {
      console.error('创建目标失败:', error);
      // 显示错误提示
    }
  };

  const resetGoal = () => {
    setGoalCreated(false);
    setGoalInfo(null);
    setGoalInput("");
    setGoalPeriod("30");
    clearError();
  };

  return {
    goalInput,
    setGoalInput,
    goalPeriod,
    setGoalPeriod,
    isGenerating,
    goalInfo,
    goalCreated,
    error: llmError, // 暴露 LLM 错误
    handleGenerate,
    handleCreateGoal,
    resetGoal,
  };
}

