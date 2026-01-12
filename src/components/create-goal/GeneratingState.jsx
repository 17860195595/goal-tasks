import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function GeneratingState({ progress = 0 }) {
  // 根据进度显示不同的提示文字
  const getProgressText = () => {
    if (progress < 30) return "正在分析您的目标...";
    if (progress < 60) return "正在制定任务计划...";
    if (progress < 90) return "正在优化任务细节...";
    return "即将完成...";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center justify-center h-full px-4"
    >
      <div className="text-center w-full max-w-md">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mb-6"
        >
          <Loader2 className="w-12 h-12 mx-auto text-primary" />
        </motion.div>
        
        <p className="text-gray-600 font-medium mb-4">正在为您生成任务...</p>
        
        {/* 进度条 */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{getProgressText()}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden relative">
            <motion.div
              className={`h-full bg-gradient-to-r from-primary via-purple-500 to-primary ${
                progress < 100 ? 'progress-bar-shimmer' : ''
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ 
                duration: 0.5,
                ease: "easeOut"
              }}
            />
          </div>
        </div>

        <p className="text-gray-400 text-sm">AI 正在分析您的目标并制定计划</p>
      </div>

    </motion.div>
  );
}

