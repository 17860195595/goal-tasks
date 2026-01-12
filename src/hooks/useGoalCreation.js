import { useState } from "react";
import { useLLMGeneration } from "./useLLMGeneration";
import { format, startOfDay, addDays } from "date-fns";

// 功能开关：是否启用 LLM（可通过环境变量控制）
const ENABLE_LLM =
  import.meta.env.VITE_ENABLE_LLM !== "false" &&
  import.meta.env.VITE_API_BASE_URL;

// 根据周期生成任务列表（分阶段）- 降级方案
const generateTasksByPeriod = (goalDescription, period) => {
  const tasks = [];
  let taskId = 1;

  if (period >= 9) {
    // 分成3个阶段，层层递进
    const stage1Days = Math.ceil(period / 3);
    const stage2Days = Math.ceil(period / 3);
    const stage3Days = period - stage1Days - stage2Days;

    // 第一阶段：基础入门（第1-阶段1天）
    tasks.push({
      id: taskId++,
      text: `第1-${stage1Days}天：了解${goalDescription}的基础概念和理论`,
      completed: false,
      stage: 1,
      stageName: "基础阶段",
      dayRange: `第1-${stage1Days}天`,
    });
    tasks.push({
      id: taskId++,
      text: `第1-${stage1Days}天：完成基础理论学习，每天阅读30分钟`,
      completed: false,
      stage: 1,
      stageName: "基础阶段",
      dayRange: `第1-${stage1Days}天`,
    });
    tasks.push({
      id: taskId++,
      text: `第1-${stage1Days}天：整理学习笔记，建立知识框架`,
      completed: false,
      stage: 1,
      stageName: "基础阶段",
      dayRange: `第1-${stage1Days}天`,
    });

    // 第二阶段：实践应用（第阶段1+1-阶段1+阶段2天）
    const stage2Start = stage1Days + 1;
    const stage2End = stage1Days + stage2Days;
    tasks.push({
      id: taskId++,
      text: `第${stage2Start}-${stage2End}天：开始实践练习，完成小项目`,
      completed: false,
      stage: 2,
      stageName: "实践阶段",
      dayRange: `第${stage2Start}-${stage2End}天`,
    });
    tasks.push({
      id: taskId++,
      text: `第${stage2Start}-${stage2End}天：每天完成代码练习，巩固基础知识`,
      completed: false,
      stage: 2,
      stageName: "实践阶段",
      dayRange: `第${stage2Start}-${stage2End}天`,
    });
    tasks.push({
      id: taskId++,
      text: `第${stage2Start}-${stage2End}天：复习前面学习的内容，查漏补缺`,
      completed: false,
      stage: 2,
      stageName: "实践阶段",
      dayRange: `第${stage2Start}-${stage2End}天`,
    });

    // 第三阶段：进阶提升（剩余天数）
    const stage3Start = stage2End + 1;
    tasks.push({
      id: taskId++,
      text: `第${stage3Start}-${period}天：完成综合项目，整合所学知识`,
      completed: false,
      stage: 3,
      stageName: "进阶阶段",
      dayRange: `第${stage3Start}-${period}天`,
    });
    tasks.push({
      id: taskId++,
      text: `第${stage3Start}-${period}天：深入理解高级概念，提升技能水平`,
      completed: false,
      stage: 3,
      stageName: "进阶阶段",
      dayRange: `第${stage3Start}-${period}天`,
    });
    tasks.push({
      id: taskId++,
      text: `第${stage3Start}-${period}天：总结学习成果，准备下一步计划`,
      completed: false,
      stage: 3,
      stageName: "进阶阶段",
      dayRange: `第${stage3Start}-${period}天`,
    });
  } else {
    // 小于9天，生成常规任务
    const baseTasks = [
      `阅读相关技术文档 30 分钟`,
      `完成第一个小项目练习`,
      `复习昨天学习的内容`,
      `整理学习笔记`,
      `完成每日代码练习`,
    ];
    baseTasks.forEach((text, index) => {
      tasks.push({
        id: taskId++,
        text: text,
        completed: false,
        stage: 0,
        stageName: "常规任务",
        dayRange: `第1-${period}天`,
      });
    });
  }

  return tasks;
};

// ✅ 新增：把 tasks（阶段任务/普通任务）转换成真正按天的 dailyTasks（Keep 风格）
function toDailyTasks(rawTasks, startDate, period) {
  // 如果 LLM 已经按天返回：[{date, tasks:[...]}] 就直接标准化
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

  // 否则 rawTasks 是一堆任务（比如阶段任务），按天分配
  const tasksPerDay = 3; // 你想每天显示几条就改这里
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
  const [llmError, setLlmError] = useState(null);
  const [localProgress, setLocalProgress] = useState(0);

  // 使用 LLM 生成 Hook
  const {
    generateTasks: generateTasksWithLLM,
    isGenerating,
    error: llmGenerationError,
    progress: llmProgress,
    clearError: clearLLMError,
  } = useLLMGeneration();

  const handleGenerate = async () => {
    if (!goalInput.trim()) return;

    setGoalInfo(null);
    setLlmError(null);
    clearLLMError();

    const period = parseInt(goalPeriod) || 30;

    // 计算日期范围
    const today = startOfDay(new Date());
    const startDate = format(today, "yyyy-MM-dd");
    const endDate = format(addDays(today, period - 1), "yyyy-MM-dd");

    // 保存目标信息
    const newGoalInfo = {
      description: goalInput,
      period: period,
      startDate,
      endDate,
    };

    // 如果启用了 LLM，尝试使用 LLM 生成
    if (ENABLE_LLM) {
      try {
        const tasks = await generateTasksWithLLM(
          goalInput,
          period,
          startDate,
          endDate
        );
        setGoalInfo(newGoalInfo);
        setLocalProgress(0); // 重置本地进度
        return tasks;
      } catch (error) {
        // LLM 生成失败，使用降级方案
        console.warn("LLM 生成失败，使用本地模板:", error);
        setLlmError(error.message || "LLM 生成失败，已使用默认模板");
        setGoalInfo(newGoalInfo);
        // 返回本地生成的任务（降级方案）
        setLocalProgress(0); // 重置本地进度
        return generateTasksByPeriod(goalInput, period);
      }
    } else {
      // 未启用 LLM，直接使用本地生成（模拟进度，匹配约 1500ms）
      setLocalProgress(0);
      let currentLocalProgress = 0;
      const startTime = Date.now();
      const targetDuration = 1500; // 目标 1500ms 到达 98%

      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progressRatio = Math.min(elapsed / targetDuration, 0.98);
        const easedProgress = 1 - Math.pow(1 - progressRatio, 3); // cubic ease-out
        const targetProgress = easedProgress * 98;

        setLocalProgress((prev) => {
          const newProgress = Math.max(prev, Math.min(targetProgress, 98));
          currentLocalProgress = newProgress;
          return newProgress;
        });
      }, 50);

      // 模拟生成延迟（1-1.5秒）
      const delay = 1000 + Math.random() * 500;
      await new Promise((resolve) => setTimeout(resolve, delay));

      clearInterval(progressInterval);

      // 快速完成到100%
      if (currentLocalProgress < 98) {
        setLocalProgress(98);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      setLocalProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 150));

      setGoalInfo(newGoalInfo);
      setLocalProgress(0);
      return generateTasksByPeriod(goalInput, period);
    }
  };

  // const handleCreateGoal = () => {
  //   // TODO: 保存目标到后端
  //   setGoalCreated(true);
  //   setTimeout(() => {
  //     // 跳转到今日任务页面
  //     window.location.href = "/today";
  //   }, 1500);
  // };
  const handleCreateGoal = ({ tasks }) => {
    if (!goalInfo || !tasks?.length) return;

    const goal = {
      id: crypto.randomUUID(),
      title: goalInfo.description,
      description: goalInfo.description,
      period: goalInfo.period,
      startDate: goalInfo.startDate,
      endDate: goalInfo.endDate,

      // ✅ 关键：存按天任务（Today/Calendar 都靠它）
      dailyTasks: toDailyTasks(tasks, goalInfo.startDate, goalInfo.period),

      // 可选：保留原 tasks 也行（以后调试用）
      tasks,

      createdAt: Date.now(),
    };

    const old = JSON.parse(localStorage.getItem("goals") || "[]");
    localStorage.setItem("goals", JSON.stringify([goal, ...old]));

    setGoalCreated(true);
    setTimeout(() => {
      window.location.href = "/goals";
    }, 800);
  };

  const resetGoal = () => {
    setGoalCreated(false);
    setGoalInfo(null);
    setGoalInput("");
    setGoalPeriod("30");
    setLlmError(null);
    clearLLMError();
  };

  // 合并进度：优先使用 LLM 进度，否则使用本地进度
  const currentProgress = ENABLE_LLM ? llmProgress : localProgress;

  return {
    goalInput,
    setGoalInput,
    goalPeriod,
    setGoalPeriod,
    isGenerating,
    goalInfo,
    goalCreated,
    error: llmError || llmGenerationError, // 暴露错误信息
    progress: currentProgress, // 暴露进度信息
    handleGenerate,
    handleCreateGoal,
    resetGoal,
  };
}
