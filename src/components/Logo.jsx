// import { motion } from "framer-motion";
import { Flag, CheckCircle2, TrendingUp } from "lucide-react";

export default function Logo({
  size = "lg",
  animated = true,
  showTitle = false,
}) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const iconSize = {
    sm: 20,
    md: 28,
    lg: 36,
    xl: 48,
  };

  const containerVariants = {
    initial: { scale: 0, rotateX: -90, rotateY: -90 },
    animate: {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  };

  // Logo整体3D旋转动画
  const logo3DRotate = {
    rotateX: [0, 15, -15, 0],
    rotateY: [0, 360],
    rotateZ: [0, 10, -10, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  // 旗帜动画
  const flagVariants = {
    animate: {
      y: [0, -8, 0],
      rotateZ: [0, 5, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // 完成标记动画 - 围绕旗帜旋转
  const checkCircleVariants = (delay = 0) => ({
    animate: {
      rotateZ: [0, 360],
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 4 + delay,
        repeat: Infinity,
        ease: "linear",
      },
    },
  });

  // 趋势上升动画
  const trendingVariants = {
    animate: {
      y: [0, -10, 0],
      rotateZ: [0, 15, -15, 0],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className={`relative ${sizeClasses[size]} flex items-center justify-center`}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
        variants={animated ? containerVariants : {}}
        initial="initial"
        animate={animated ? ["animate", logo3DRotate] : "animate"}
      >
        {/* 3D 背景圆形渐变 - 多层旋转 */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary via-purple-500 to-pink-500 rounded-full blur-xl opacity-30"
          style={{
            transform: "translateZ(-20px)",
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateZ: [0, 360],
            rotateX: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 rounded-full blur-2xl opacity-20"
          style={{
            transform: "translateZ(-40px)",
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateZ: [360, 0],
            rotateY: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* 旗帜 - 中心，3D旋转 */}
        <motion.div
          className="absolute z-10"
          style={{
            transformStyle: "preserve-3d",
          }}
          variants={animated ? flagVariants : {}}
          animate={animated ? "animate" : ""}
        >
          <motion.div
            style={{
              transform: "translateZ(10px)",
            }}
            animate={{
              rotateX: [0, 360],
              rotateY: [0, 360],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Flag
              size={iconSize[size]}
              className="text-primary drop-shadow-2xl"
              strokeWidth={2.5}
              fill="currentColor"
            />
          </motion.div>
        </motion.div>

        {/* 完成标记 - 围绕旗帜旋转（右上） */}
        <motion.div
          className="absolute -top-2 -right-2 z-20"
          style={{
            transformStyle: "preserve-3d",
            transform: "translateZ(20px)",
          }}
          variants={animated ? checkCircleVariants(0) : {}}
          animate={animated ? "animate" : ""}
        >
          <CheckCircle2
            size={iconSize[size] * 0.35}
            className="text-green-500 drop-shadow-lg"
            fill="currentColor"
          />
        </motion.div>

        {/* 完成标记 - 围绕旗帜旋转（左下） */}
        <motion.div
          className="absolute -bottom-2 -left-2 z-20"
          style={{
            transformStyle: "preserve-3d",
            transform: "translateZ(15px)",
          }}
          variants={animated ? checkCircleVariants(1) : {}}
          animate={animated ? "animate" : ""}
        >
          <CheckCircle2
            size={iconSize[size] * 0.35}
            className="text-green-500 drop-shadow-lg"
            fill="currentColor"
          />
        </motion.div>

        {/* 趋势上升 - 左上角 */}
        <motion.div
          className="absolute -top-2 -left-2 z-20"
          style={{
            transformStyle: "preserve-3d",
            transform: "translateZ(18px)",
          }}
          variants={animated ? trendingVariants : {}}
          animate={animated ? "animate" : ""}
        >
          <TrendingUp
            size={iconSize[size] * 0.4}
            className="text-orange-500 drop-shadow-lg"
            strokeWidth={2.5}
          />
        </motion.div>

        {/* 3D 光晕效果 */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(79,70,229,0.3) 0%, transparent 70%)",
            transform: "translateZ(-30px)",
            transformStyle: "preserve-3d",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotateX: [0, 180, 360],
            rotateY: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* App 标题 */}
      {showTitle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center w-full"
        >
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{
              background:
                "linear-gradient(to right, hsl(220, 90%, 56%), hsl(270, 60%, 50%), hsl(330, 70%, 60%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Goal Tracker
          </h1>
        </motion.div>
      )}
    </div>
  );
}
