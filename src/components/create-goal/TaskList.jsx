import { motion } from "framer-motion";
import { Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import GoalInfoCard from "./GoalInfoCard";
import TaskItem from "./TaskItem";

export default function TaskList({
  goalInfo,
  tasks,
  completedCount,
  totalCount,
  editingTaskId,
  editingTaskText,
  onToggle,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onTextChange,
  onAddNewToStage,
  onRegenerate,
  onKeyPress,
  onCreateGoal,
  error,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4 py-6 overflow-y-auto max-h-full hide-scrollbar"
    >
      <GoalInfoCard goalInfo={goalInfo} totalTasks={totalCount} />

      {/* 错误提示（如果使用了降级方案） */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">提示</p>
            <p className="text-xs text-amber-600 mt-0.5">{error}</p>
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">
          每日任务清单
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRegenerate}
          className="text-xs"
        >
          重新生成
        </Button>
      </div>

      {/* 按阶段分组显示任务 */}
      {(() => {
        const hasStages = tasks.some(t => t.stage > 0);
        if (hasStages) {
          // 有阶段的任务，按阶段分组
          const stages = [1, 2, 3].filter(stage => tasks.some(t => t.stage === stage));
          return (
            <div className="space-y-4">
              {stages.map((stage) => {
                const stageTasks = tasks.filter(t => t.stage === stage);
                const stageName = stageTasks[0]?.stageName || `阶段 ${stage}`;
                const stageColor = {
                  1: "from-blue-500/10 to-blue-100",
                  2: "from-purple-500/10 to-purple-100",
                  3: "from-pink-500/10 to-pink-100",
                }[stage] || "from-gray-500/10 to-gray-100";

                return (
                  <div key={stage} className="space-y-2">
                    <div className={`px-3 py-2 rounded-lg bg-gradient-to-r ${stageColor} border border-gray-200 flex items-center justify-between`}>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{stageName}</h4>
                        {stageTasks[0]?.dayRange && (
                          <p className="text-xs text-gray-500 mt-0.5">{stageTasks[0].dayRange}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAddNewToStage(stage, stageTasks[0]?.dayRange || `阶段${stage}`)}
                        className="text-xs h-7 px-2"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        添加
                      </Button>
                    </div>
                    <div className="space-y-2 pl-2">
                      {stageTasks.map((task, index) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          index={index}
                          isEditing={editingTaskId === task.id}
                          editingText={editingTaskText}
                          onToggle={onToggle}
                          onStartEdit={onStartEdit}
                          onSaveEdit={onSaveEdit}
                          onCancelEdit={onCancelEdit}
                          onDelete={onDelete}
                          onTextChange={onTextChange}
                          onKeyPress={onKeyPress}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        } else {
          // 没有阶段的任务，直接显示
          return (
            <div className="space-y-2">
              {tasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  index={index}
                  isEditing={editingTaskId === task.id}
                  editingText={editingTaskText}
                  onToggle={onToggle}
                  onStartEdit={onStartEdit}
                  onSaveEdit={onSaveEdit}
                  onCancelEdit={onCancelEdit}
                  onDelete={onDelete}
                  onTextChange={onTextChange}
                  onKeyPress={onKeyPress}
                />
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddNewToStage(0, "")}
                className="w-full text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                添加任务
              </Button>
            </div>
          );
        }
      })()}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="pt-4"
      >
        <Button
          onClick={onCreateGoal}
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg"
        >
          创建目标并开始
        </Button>
      </motion.div>
    </motion.div>
  );
}

