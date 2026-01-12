import { useState } from "react";

export function useTaskManagement(initialTasks = []) {
  const [tasks, setTasks] = useState(initialTasks);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState("");

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };

  const saveEditTask = () => {
    if (!editingTaskText.trim()) return;
    setTasks(tasks.map(task => 
      task.id === editingTaskId ? { ...task, text: editingTaskText } : task
    ));
    setEditingTaskId(null);
    setEditingTaskText("");
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingTaskText("");
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const addNewTask = () => {
    const newTask = {
      id: Date.now(),
      text: "新任务",
      completed: false,
      stage: 0,
      stageName: "常规任务",
      dayRange: "",
    };
    setTasks([...tasks, newTask]);
    setEditingTaskId(newTask.id);
    setEditingTaskText("新任务");
  };

  const addNewTaskToStage = (stage, dayRange) => {
    const stageName = {
      1: "基础阶段",
      2: "实践阶段",
      3: "进阶阶段",
    }[stage] || `阶段 ${stage}`;

    const newTask = {
      id: Date.now(),
      text: "新任务",
      completed: false,
      stage: stage,
      stageName: stageName,
      dayRange: dayRange,
    };
    setTasks([...tasks, newTask]);
    setEditingTaskId(newTask.id);
    setEditingTaskText("新任务");
  };

  const setTasksData = (newTasks) => {
    setTasks(newTasks);
  };

  return {
    tasks,
    editingTaskId,
    editingTaskText,
    setEditingTaskText,
    toggleTask,
    startEditTask,
    saveEditTask,
    cancelEdit,
    deleteTask,
    addNewTask,
    addNewTaskToStage,
    setTasksData,
  };
}

