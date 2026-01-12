import { motion } from "framer-motion";
import { CheckCircle2, Circle, Edit2, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function TaskItem({
  task,
  index,
  isEditing,
  editingText,
  onToggle,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onTextChange,
  onKeyPress,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      {isEditing ? (
        <Card className="p-3 border-primary/30">
          <div className="flex items-start gap-2">
            <Input
              value={editingText}
              onChange={(e) => onTextChange(e.target.value)}
              onKeyPress={onKeyPress}
              className="flex-1"
              autoFocus
            />
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={onSaveEdit}
                className="h-8 w-8 text-green-600"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={onCancelEdit}
                className="h-8 w-8 text-gray-500"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className={`p-3 transition-all ${
          task.completed ? 'bg-gray-50 opacity-75' : ''
        }`}>
          <div className="flex items-start gap-3">
            <button
              onClick={() => onToggle(task.id)}
              className="mt-0.5 flex-shrink-0"
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300" />
              )}
            </button>
            <p
              className={`flex-1 text-gray-800 ${
                task.completed ? 'line-through text-gray-500' : ''
              }`}
            >
              {task.text}
            </p>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onStartEdit(task)}
                className="h-7 w-7"
              >
                <Edit2 className="w-3.5 h-3.5 text-gray-500" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(task.id)}
                className="h-7 w-7"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  );
}

