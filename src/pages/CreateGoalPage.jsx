import { motion, AnimatePresence } from "framer-motion";
import { useGoalCreation } from "@/hooks/useGoalCreation";
import { useTaskManagement } from "@/hooks/useTaskManagement";
import CreateGoalHeader from "@/components/create-goal/CreateGoalHeader";
import EmptyState from "@/components/create-goal/EmptyState";
import GeneratingState from "@/components/create-goal/GeneratingState";
import SuccessState from "@/components/create-goal/SuccessState";
import TaskList from "@/components/create-goal/TaskList";
import GoalInputBar from "@/components/create-goal/GoalInputBar";

export default function CreateGoal() {
  const {
    goalInput,
    setGoalInput,
    goalPeriod,
    setGoalPeriod,
    isGenerating,
    goalInfo,
    goalCreated,
    error: generationError,
    progress: generationProgress,
    handleGenerate,
    handleCreateGoal,
    resetGoal,
  } = useGoalCreation();

  const {
    tasks,
    editingTaskId,
    editingTaskText,
    setEditingTaskText,
    toggleTask,
    startEditTask,
    saveEditTask,
    cancelEdit,
    deleteTask,
    // addNewTask,
    addNewTaskToStage,
    setTasksData,
  } = useTaskManagement();

  // 判断是否在初始页面（不包含 tasks.length，因为重置时 tasks 可能还没清空）
  const isInitialState = !goalInfo && !isGenerating && !goalCreated;

  // 处理返回按钮点击
  const handleBack = () => {
    // 重置所有状态到初始页面
    resetGoal();
    setTasksData([]);
    setEditingTaskText("");
    cancelEdit(); // 取消任何正在进行的编辑
  };

  const handleGenerateWithTasks = async () => {
    const newTasks = await handleGenerate();
    if (newTasks) {
      setTasksData(newTasks);
    }
  };

  const handleRegenerate = async () => {
    setTasksData([]);
    await handleGenerateWithTasks();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (editingTaskId) {
        saveEditTask();
      } else {
        handleGenerateWithTasks();
      }
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div
      className="bg-white flex flex-col relative overflow-hidden"
      style={{ height: "85vh" }}
    >
      <CreateGoalHeader showBackButton={!isInitialState} onBack={handleBack} />

      <div className="flex-1 overflow-hidden px-4">
        <div className="max-w-md mx-auto h-full">
          <AnimatePresence mode="wait">
            {!goalInfo && !isGenerating && !goalCreated && (
              <EmptyState key="empty" />
            )}

            {isGenerating && (
              <GeneratingState key="generating" progress={generationProgress} />
            )}

            {goalInfo && tasks.length > 0 && !goalCreated && (
              <TaskList
                key="tasks"
                goalInfo={goalInfo}
                tasks={tasks}
                completedCount={completedCount}
                totalCount={totalCount}
                editingTaskId={editingTaskId}
                editingTaskText={editingTaskText}
                onToggle={toggleTask}
                onStartEdit={startEditTask}
                onSaveEdit={saveEditTask}
                onCancelEdit={cancelEdit}
                onDelete={deleteTask}
                onTextChange={setEditingTaskText}
                onAddNewToStage={addNewTaskToStage}
                onRegenerate={handleRegenerate}
                onKeyPress={handleKeyPress}
                onCreateGoal={() => handleCreateGoal({ tasks })}
                error={generationError}
              />
            )}

            {goalCreated && <SuccessState key="success" />}
          </AnimatePresence>
        </div>
      </div>

      {!goalInfo && !goalCreated && (
        <GoalInputBar
          value={goalInput}
          onChange={(e) => setGoalInput(e.target.value)}
          period={goalPeriod}
          onPeriodChange={(e) => setGoalPeriod(e.target.value)}
          onKeyPress={handleKeyPress}
          onGenerate={handleGenerateWithTasks}
          isGenerating={isGenerating}
          disabled={isGenerating}
        />
      )}
    </div>
  );
}
