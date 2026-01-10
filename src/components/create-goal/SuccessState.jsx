import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center h-full"
    >
      <div className="text-center w-full">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-4"
        >
          <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
        </motion.div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          目标创建成功！
        </h2>
        <p className="text-gray-500">正在跳转到今日任务...</p>
      </div>
    </motion.div>
  );
}

