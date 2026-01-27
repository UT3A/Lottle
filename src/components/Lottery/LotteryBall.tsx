import React from "react";
import { cn } from "@/components/ui/utils";
import { motion } from "motion/react";

interface LotteryBallProps {
  value: string | number | null;
  isRolling?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  theme?: "red" | "yellow";
}

export const LotteryBall: React.FC<LotteryBallProps> = ({
  value,
  isRolling = false,
  size = "md",
  className,
  theme = "yellow",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-xl",
    lg: "w-20 h-20 text-4xl",
  };

  const themeClasses = {
    red: "bg-gradient-to-br from-red-500 to-red-700 text-white border-red-300",
    yellow: "bg-gradient-to-br from-yellow-300 to-yellow-500 text-red-900 border-yellow-100",
  };

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold shadow-lg border-2",
        sizeClasses[size],
        themeClasses[theme],
        className
      )}
    >
      <motion.div
        key={value?.toString() || "empty"}
        initial={isRolling ? { y: -20, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {isRolling ? "?" : value || ""}
      </motion.div>
    </div>
  );
};
