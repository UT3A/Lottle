import React from "react";
import { cn } from "@/components/ui/utils";
import { motion } from "motion/react";

interface LotteryBallProps {
  value: string | number | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: "yellow" | "white" | "red";
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
    xl: "w-24 h-24 text-2xl",
  };

  // Realistic Ping Pong Ball Gradients
  const colorStyles = {
    yellow: "bg-[radial-gradient(circle_at_35%_35%,_#fef08a_0%,_#eab308_50%,_#a16207_100%)] text-red-950 border-yellow-600/30",
    white: "bg-[radial-gradient(circle_at_35%_35%,_#ffffff_0%,_#e2e8f0_50%,_#94a3b8_100%)] text-slate-900 border-slate-300/30",
    red: "bg-[radial-gradient(circle_at_35%_35%,_#fca5a5_0%,_#dc2626_50%,_#7f1d1d_100%)] text-white border-red-900/30",
  };

  // 根據文字長度和球的大小動態調整字體
  const getDynamicFontSize = () => {
    const textLength = String(value || "").length;
    
    // 針對不同球的尺寸有不同的縮放策略
    const fontScaleMap = {
      sm: {
        base: "text-[10px]",
        medium: "text-[8px]",
        long: "text-[6px]",
        veryLong: "text-[5px]",
      },
      md: {
        base: "text-sm",
        medium: "text-xs",
        long: "text-[10px]",
        veryLong: "text-[8px]",
      },
      lg: {
        base: "text-lg",
        medium: "text-base",
        long: "text-sm",
        veryLong: "text-xs",
      },
      xl: {
        base: "text-2xl",
        medium: "text-xl",
        long: "text-lg",
        veryLong: "text-base",
      },
    };

    const scales = fontScaleMap[size];
    
    if (textLength <= 2) return scales.base;
    if (textLength <= 4) return scales.medium;
    if (textLength <= 6) return scales.long;
    return scales.veryLong;
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
      
      {/* The Number/Text - 支援多行與自動換行 */}
      <span 
        className={cn(
          "relative z-10 drop-shadow-sm px-1 text-center leading-tight",
          getDynamicFontSize()
        )}
        style={{
          wordBreak: "break-word",
          overflowWrap: "break-word",
          maxWidth: "90%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          hyphens: "auto",
        }}
      >
        {value}
      </span>
    </div>
  );
};