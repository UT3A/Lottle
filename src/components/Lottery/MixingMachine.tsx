import React, { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LotteryBall } from "./LotteryBall";

interface MixingMachineProps {
  pool: string[];
  drawingPhase?: "idle" | "mixing" | "extracting" | "reveal";
  onBallExit?: (value: string) => void;
}

/* ================= 混合池球（隨機分布 + 穩定的key） ================= */
const ChaosBall = ({ text, ballKey }: { text: string; ballKey: string }) => {
  // 使用 ballKey 作為隨機種子，確保同一顆球的位置穩定
  const hash = useMemo(() => {
    let h = 0;
    for (let i = 0; i < ballKey.length; i++) {
      h = Math.imul(31, h) + ballKey.charCodeAt(i) | 0;
    }
    return Math.abs(h);
  }, [ballKey]);
  
  // 基於 hash 的偽隨機數生成器
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  // 完全隨機的位置（但對同一個 ballKey 是固定的）
  const baseX = useMemo(() => 5 + seededRandom(hash) * 90, [hash]);
  const baseY = useMemo(() => 5 + seededRandom(hash + 1000) * 90, [hash]);
  
  // 移動參數
  const moveRangeX = useMemo(() => (seededRandom(hash + 2000) - 0.5) * 40, [hash]);
  const moveRangeY = useMemo(() => (seededRandom(hash + 3000) - 0.5) * 40, [hash]);
  const duration = useMemo(() => 8 + seededRandom(hash + 4000) * 6, [hash]);
  const phaseX = useMemo(() => seededRandom(hash + 5000) * Math.PI * 2, [hash]);
  const phaseY = useMemo(() => seededRandom(hash + 6000) * Math.PI * 2, [hash]);
  const colorIndex = useMemo(() => Math.floor(seededRandom(hash + 7000) * 3), [hash]);

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${baseX}%`,
        top: `${baseY}%`,
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        x: [
          Math.sin(phaseX) * moveRangeX,
          Math.sin(phaseX + Math.PI * 0.5) * moveRangeX,
          Math.sin(phaseX + Math.PI) * moveRangeX,
          Math.sin(phaseX + Math.PI * 1.5) * moveRangeX,
          Math.sin(phaseX + Math.PI * 2) * moveRangeX,
        ],
        y: [
          Math.cos(phaseY) * moveRangeY,
          Math.cos(phaseY + Math.PI * 0.5) * moveRangeY,
          Math.cos(phaseY + Math.PI) * moveRangeY,
          Math.cos(phaseY + Math.PI * 1.5) * moveRangeY,
          Math.cos(phaseY + Math.PI * 2) * moveRangeY,
        ],
        rotate: [0, 360],
      }}
      transition={{
        x: { 
          duration, 
          repeat: Infinity, 
          ease: "linear",
        },
        y: { 
          duration: duration * 1.13, 
          repeat: Infinity, 
          ease: "linear",
        },
        rotate: { 
          duration: duration * 1.5, 
          repeat: Infinity, 
          ease: "linear",
        }
      }}
    >
      <LotteryBall
        value={text}
        size="md"
        color={colorIndex === 0 ? "yellow" : colorIndex === 1 ? "white" : "red"}
        className="scale-75 md:scale-90"
      />
    </motion.div>
  );
};

/* ================= 即將被抽中的球（靠近出口） ================= */
const WinnerBall = ({ value }: { value: string }) => {
  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 z-40"
      initial={{ bottom: "50%", opacity: 0, scale: 0.8 }}
      animate={{ 
        bottom: "15%", 
        opacity: 1, 
        scale: 1,
        x: [0, 5, -5, 3, -3, 0],
      }}
      transition={{ 
        duration: 0.8, 
        ease: "easeOut",
        x: { duration: 0.3, repeat: Infinity, repeatType: "reverse" }
      }}
    >
      <LotteryBall value={value} size="md" color="yellow" className="animate-pulse shadow-2xl" />
    </motion.div>
  );
};

/* ================= 吸球動畫 ================= */
const ExtractedBall = ({
  value,
  onComplete,
}: {
  value: string;
  onComplete: () => void;
}) => (
  <motion.div
    className="absolute left-1/2 -translate-x-1/2 z-50 bottom-[15%]"
    initial={{ scale: 1, opacity: 1 }}
    animate={{ bottom: "-10%", scale: 0.5, opacity: 0 }}
    transition={{ duration: 0.3, ease: "backIn" }}
    onAnimationComplete={onComplete}
  >
    <LotteryBall value={value} size="md" color="yellow" className="animate-spin" />
  </motion.div>
);

/* ================= 管子動畫 ================= */
const PipeBall = ({ value }: { value: string }) => (
  <motion.div
    className="absolute left-1/2 -translate-x-1/2 z-40"
    initial={{ top: "-20px", opacity: 1, scale: 0.8 }}
    animate={{ top: "120%", opacity: 1, scale: 0.8 }}
    transition={{ duration: 0.4, ease: "linear" }}
  >
    <LotteryBall value={value} size="md" color="yellow" className="animate-spin" />
  </motion.div>
);

/* ================= 主機器 ================= */
export const MixingMachine: React.FC<MixingMachineProps> = ({
  pool,
  drawingPhase,
  onBallExit,
}) => {
  // 預設10顆球
  const effectivePool = pool.length > 0 ? pool : Array.from({ length: 10 }, (_, i) => `Ball ${i + 1}`);
  
  // 固定顯示250個球
  const DISPLAY_COUNT = 250;

  const [displayBalls, setDisplayBalls] = useState<string[]>([]);
  const [currentWinner, setCurrentWinner] = useState<string | null>(null);
  const [showWinnerApproach, setShowWinnerApproach] = useState(false);
  const [showExtraction, setShowExtraction] = useState(false);
  const [showPipeBall, setShowPipeBall] = useState(false);
  
  // 追蹤上次的池子，避免不必要的更新
  const prevPoolRef = useRef<string[]>([]);

  /* 抽到誰 + 靠近出口 */
  useEffect(() => {
    if (drawingPhase === "extracting" && effectivePool.length > 0) {
      const random = effectivePool[Math.floor(Math.random() * effectivePool.length)];
      setCurrentWinner(random);
      setShowWinnerApproach(true);
      
      // 0.8秒後開始吸球
      setTimeout(() => {
        setShowWinnerApproach(false);
        setShowExtraction(true);
      }, 800);
    }
  }, [drawingPhase, effectivePool]);

  /* 吸球 → 管子 → 通知 App */
  const handleExtractionComplete = () => {
    setShowExtraction(false);
    setShowPipeBall(true);

    setTimeout(() => {
      setShowPipeBall(false);
      if (currentWinner && onBallExit) {
        onBallExit(currentWinner);
        
        // 只移除被抽中的球，不重新洗牌
        setDisplayBalls(prev => prev.filter(ball => ball !== currentWinner));
      }
    }, 400);
  };

  /* 
   * 初始化顯示球池
   * 重要：只在池子完全改變時才更新（例如重置或上傳新名單）
   */
  useEffect(() => {
    // 檢查是否是完全不同的池子（例如重置或上傳新名單）
    const isCompletelyDifferent = 
      prevPoolRef.current.length === 0 || // 初始化
      effectivePool.length > prevPoolRef.current.length || // 池子變大了（重置）
      !effectivePool.some(item => prevPoolRef.current.includes(item)); // 完全不同的內容
    
    if (isCompletelyDifferent) {
      console.log('Pool completely changed, updating display balls');
      if (effectivePool.length <= DISPLAY_COUNT) {
        setDisplayBalls([...effectivePool]);
      } else {
        const shuffled = [...effectivePool].sort(() => 0.5 - Math.random());
        setDisplayBalls(shuffled.slice(0, DISPLAY_COUNT));
      }
      prevPoolRef.current = [...effectivePool];
    }
  }, [effectivePool, DISPLAY_COUNT]);

  // 定期輪換球（只在池子大於250時）
  useEffect(() => {
    if (effectivePool.length > DISPLAY_COUNT && displayBalls.length > 0) {
      const interval = setInterval(() => {
        // 從剩餘池中隨機選250個
        const shuffled = [...effectivePool].sort(() => 0.5 - Math.random());
        setDisplayBalls(shuffled.slice(0, DISPLAY_COUNT));
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [effectivePool.length, DISPLAY_COUNT, displayBalls.length]);

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      {/* 攪拌機容器 */}
      <div className="relative w-full flex-1 rounded-[40px] border-[8px] border-white/20 bg-gradient-to-b from-slate-900/40 via-white/5 to-black/60 overflow-hidden">
        {/* 球的容器 */}
        <div className="relative w-full h-full">
          {displayBalls.map((item) => (
            <ChaosBall 
              key={item}
              text={item} 
              ballKey={item}
            />
          ))}
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 bg-black/60 blur-md rounded-t-full" />

        <AnimatePresence>
          {showWinnerApproach && currentWinner && (
            <WinnerBall value={currentWinner} />
          )}
          {showExtraction && currentWinner && (
            <ExtractedBall value={currentWinner} onComplete={handleExtractionComplete} />
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex flex-col items-center -mt-1">
        <div className="w-32 h-6 bg-gray-800 border-x-2 border-gray-600 rounded-b-lg" />

        <div className="w-20 h-24 bg-gradient-to-r from-white/10 via-white/20 to-white/10 border-x-2 border-white/30 backdrop-blur-md overflow-hidden relative shadow-inner">
          {showPipeBall && currentWinner && <PipeBall value={currentWinner} />}
        </div>
      </div>
    </div>
  );
};