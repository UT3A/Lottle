import React from "react";
import { cn } from "@/components/ui/utils";
import { motion } from "motion/react";

interface LotteryBallProps {
  value: string | number | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: "yellow" | "white" | "red"; // Added colors common in lottery
}

export const LotteryBall: React.FC<LotteryBallProps> = ({
  value,
  size = "md",
  className,
  color = "yellow",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-[10px]",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-lg",
    xl: "w-24 h-24 text-2xl", // Result ball size
  };

  // Realistic Ping Pong Ball Gradients
  const colorStyles = {
    yellow: "bg-[radial-gradient(circle_at_35%_35%,_#fef08a_0%,_#eab308_50%,_#a16207_100%)] text-red-950 border-yellow-600/30",
    white: "bg-[radial-gradient(circle_at_35%_35%,_#ffffff_0%,_#e2e8f0_50%,_#94a3b8_100%)] text-slate-900 border-slate-300/30",
    red: "bg-[radial-gradient(circle_at_35%_35%,_#fca5a5_0%,_#dc2626_50%,_#7f1d1d_100%)] text-white border-red-900/30",
  };

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-black shadow-[0_4px_8px_rgba(0,0,0,0.3)] relative border",
        sizeClasses[size],
        colorStyles[color],
        className
      )}
    >
      {/* Highlight reflection for plastic look */}
      <div className="absolute top-[10%] left-[10%] w-[25%] h-[20%] bg-gradient-to-br from-white/90 to-transparent rounded-full blur-[1px]"></div>
      
      {/* The Number/Text */}
      <span className="relative z-10 drop-shadow-sm truncate max-w-[80%] px-1">
        {value}
      </span>
    </div>
  );
};
