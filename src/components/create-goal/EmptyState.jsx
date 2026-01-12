import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center justify-center h-full"
    >
      <div className="text-center w-full">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-6"
        >
          <Sparkles className="w-16 h-16 mx-auto text-primary/60" />
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
          设定您的阶段性目标
        </h2>
        <p className="text-gray-500 text-sm">
          描述您的目标，AI 将为您自动生成每日任务清单
        </p>
      </div>
    </motion.div>
  );
}

