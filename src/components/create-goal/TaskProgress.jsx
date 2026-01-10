import { motion } from "framer-motion";

export default function TaskProgress({ completedCount, totalCount }) {
  if (totalCount === 0) return null;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-600">
        <span>完成进度</span>
        <span>{completedCount} / {totalCount}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-purple-600"
          initial={{ width: 0 }}
          animate={{ width: `${(completedCount / totalCount) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}

