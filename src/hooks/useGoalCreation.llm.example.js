/**
 * useGoalCreation.js 的 LLM 集成示例
 * 展示如何将现有的 useGoalCreation 与 LLM 服务集成
 */

import { useState } from "react";
import { useLLMGeneration } from "./useLLMGeneration";
import { generateTasksByPeriod } from "./generateTasksByPeriod"; // 降级方案

console.log("✅ REAL useGoalCreation LOADED");

// 【本次新增】toDailyTasks 用到了 format/addDays，所以必须 import
// ✅ 把“任务列表/阶段任务”变成真正按天的 dailyTasks（Keep 风格）
function toDailyTasks(rawTasks, startDate, period) {
  // 如果 LLM 已经按天返回：[{date, tasks:[...]}]
  if (
    Array.isArray(rawTasks) &&
    rawTasks.length > 0 &&
    rawTasks[0]?.date &&
    Array.isArray(rawTasks[0]?.tasks)
  ) {
    return rawTasks.map((d) => ({
      date: d.date,
      tasks: d.tasks.map((t, idx) => ({
        id: t.id ?? `${d.date}-${idx}`,
        title: t.title ?? t.text ?? "Task",
        minutes: t.minutes ?? 30,
        completed: !!t.completed,
      })),
    }));
  }

  // 否则 rawTasks 是一堆任务（比如阶段任务），我们按天分配
  const tasksPerDay = 3; // ✅ 每天显示几条任务（你可以改成 2）
  const daily = [];
  const start = new Date(startDate + "T00:00:00");

  for (let i = 0; i < period; i++) {
    const date = format(addDays(start, i), "yyyy-MM-dd");

    const dayTasks = [];
    for (let k = 0; k < tasksPerDay; k++) {
      const pick = rawTasks[(i * tasksPerDay + k) % rawTasks.length];
      dayTasks.push({
        id: pick?.id ?? `${date}-${k}`,
        title: pick?.title ?? pick?.text ?? "Task",
        minutes: pick?.minutes ?? 30,
        completed: false,
      });
    }

    daily.push({ date, tasks: dayTasks });
  }

  return daily;
}

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
    const startDate = today.toISOString().split("T")[0];
    const endDate = new Date(
      today.getTime() + (period - 1) * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0];

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
      console.warn("LLM 生成失败，使用本地模板:", error);

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

  const handleCreateGoal = async ({ tasks }) => {
    try {
      if (!goalInfo || !tasks?.length) return;

      // 【本次新增】构造要保存的 goal 数据（统一字段）

      const goal = {
        id: crypto.randomUUID(),
        title: goalInfo.description,
        description: goalInfo.description,
        period: goalInfo.period,
        startDate: goalInfo.startDate,
        endDate: goalInfo.endDate,

        // ✅ 关键：一定要有 dailyTasks
        dailyTasks: toDailyTasks(tasks, goalInfo.startDate, goalInfo.period),

        // 可选：保留原 tasks 也行
        tasks,

        createdAt: Date.now(),
      };

      const old = JSON.parse(localStorage.getItem("goals") || "[]");
      localStorage.setItem("goals", JSON.stringify([goal, ...old]));

      setGoalCreated(true);
      setTimeout(() => {
        window.location.href = "/goals";
      }, 800);
    } catch (e) {
      console.error(e);
    }
  };

  // const handleCreateGoal = async () => {
  //   // TODO: 保存目标到后端
  //   try {
  //     // const response = await fetch('/api/goals', {
  //     //   method: 'POST',
  //     //   body: JSON.stringify({
  //     //     description: goalInput,
  //     //     period: parseInt(goalPeriod),
  //     //     tasks: tasks,
  //     //   }),
  //     // });

  //     setGoalCreated(true);
  //     setTimeout(() => {
  //       window.location.href = "/today";
  //     }, 1500);
  //   } catch (error) {
  //     console.error("创建目标失败:", error);
  //     // 显示错误提示
  //   }
  // };

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
