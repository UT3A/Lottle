import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LotteryBall } from "./LotteryBall";

interface MixingMachineProps {
  pool: string[];
  isDrawing: boolean;
  drawingPhase?: "idle" | "mixing" | "extracting";
}

// Chaotic Ball: Moves randomly in X and Y, simulating air turbulence
const ChaosBall = ({ text, index }: { text: string; index: number }) => {
  // Random duration for movement to make it unpredictable
  const duration = 0.5 + Math.random() * 0.5; // Fast movement
  
  return (
    <motion.div
      className="absolute"
      // Start at random position
      initial={{ 
        left: `${Math.random() * 90}%`, 
        top: `${Math.random() * 90}%` 
      }}
      animate={{
        // Move to random positions repeatedly
        left: [
            `${Math.random() * 90}%`, 
            `${Math.random() * 90}%`, 
            `${Math.random() * 90}%`, 
            `${Math.random() * 90}%`
        ],
        top: [
            `${Math.random() * 90}%`, 
            `${Math.random() * 90}%`, 
            `${Math.random() * 90}%`, 
            `${Math.random() * 90}%`
        ],
        rotate: [0, 180, 360, -180],
        scale: [0.9, 1.1, 0.9] // Pulsing size for 3D effect
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "linear",
      }}
    >
      <LotteryBall 
        value={text} 
        size="md" 
        color={index % 3 === 0 ? "yellow" : index % 3 === 1 ? "white" : "red"} 
        className="text-xs shadow-md border-opacity-50 transform scale-75 md:scale-90" 
      />
    </motion.div>
  );
};

// The Extraction Ball (Sucked down)
const ExtractedBall = ({ onComplete }: { onComplete: () => void }) => {
    return (
        <motion.div
            className="absolute left-1/2 -translate-x-1/2 z-50 bottom-[10%]"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ 
                bottom: "-10%", // Suck down
                scale: 0.5,
                opacity: 0
            }}
            transition={{ duration: 0.3, ease: "backIn" }}
            onAnimationComplete={onComplete}
        >
             <LotteryBall value="" size="md" color="yellow" className="animate-spin" />
        </motion.div>
    );
};

// The Pipe Passing Ball (Moving through the tube)
const PipeBall = () => {
    return (
        <motion.div
            className="absolute left-1/2 -translate-x-1/2 z-40"
            initial={{ top: "-20px", opacity: 1, scale: 0.8 }}
            animate={{ top: "120%", opacity: 1, scale: 0.8 }}
            transition={{ duration: 0.4, ease: "linear" }}
        >
             <LotteryBall value="" size="md" color="yellow" className="animate-spin" />
        </motion.div>
    );
};

export const MixingMachine: React.FC<MixingMachineProps> = ({ pool, isDrawing, drawingPhase }) => {
  const displayCount = Math.min(pool.length, 60); // Show many balls
  const [displayBalls, setDisplayBalls] = useState<string[]>([]);
  const [showExtraction, setShowExtraction] = useState(false);
  const [showPipeBall, setShowPipeBall] = useState(false);

  useEffect(() => {
    if (drawingPhase === 'extracting') {
        setShowExtraction(true);
    }
  }, [drawingPhase]);

  const handleExtractionComplete = () => {
      setShowExtraction(false);
      setShowPipeBall(true);
      setTimeout(() => setShowPipeBall(false), 400); 
  };

  // Logic to refresh balls so everyone has a chance to appear
  useEffect(() => {
    const shuffle = () => {
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        setDisplayBalls(shuffled.slice(0, displayCount));
    };
    shuffle();

    if (pool.length > displayCount) {
        const interval = setInterval(() => {
             setDisplayBalls(prev => {
                 const next = [...prev];
                 // Replace 5 balls randomly every 2 seconds
                 const newCandidates = [...pool].sort(() => 0.5 - Math.random()).slice(0, 5);
                 for(let i=0; i<5; i++) {
                     const replaceIdx = Math.floor(Math.random() * next.length);
                     next[replaceIdx] = newCandidates[i];
                 }
                 return next;
             });
        }, 2000);
        return () => clearInterval(interval);
    }
  }, [pool, displayCount]);

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      
      {/* 1. The Machine Body (Expands to fill available space) */}
      <div className="relative w-full flex-1 rounded-[40px] border-[8px] border-white/20 bg-gradient-to-b from-slate-900/40 via-white/5 to-black/60 backdrop-blur-sm shadow-[inset_0_0_60px_rgba(255,255,255,0.05)] overflow-hidden z-20 min-h-[150px]">
        
        {/* Glass Glare */}
        <div className="absolute top-4 left-4 right-4 h-1/3 bg-gradient-to-b from-white/10 to-transparent rounded-[30px] pointer-events-none z-30 blur-sm"></div>

        {/* The Chaotic Swarm */}
        <div className="absolute inset-2 md:inset-8">
             {displayBalls.map((item, idx) => (
                <ChaosBall key={`${item}-${idx}`} text={item} index={idx} />
            ))}
        </div>

        {/* The Extraction Hole (Visual at bottom center) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 bg-black/60 blur-md rounded-t-full z-10"></div>
        
        {/* Extraction Animation */}
        <AnimatePresence>
            {showExtraction && (
                <ExtractedBall onComplete={handleExtractionComplete} />
            )}
        </AnimatePresence>
      </div>

      {/* 2. Connection Pipe (Fixed height between Machine and Rail) */}
      <div className="relative z-10 flex flex-col items-center -mt-1">
          {/* Funnel Neck */}
          <div className="w-32 h-6 bg-gray-800 border-x-2 border-gray-600 rounded-b-lg"></div>
          
          {/* Glass Tube */}
          <div className="w-20 h-24 bg-gradient-to-r from-white/10 via-white/20 to-white/10 border-x-2 border-white/30 backdrop-blur-md overflow-hidden relative shadow-inner">
               {/* Passing Ball Animation */}
               {showPipeBall && <PipeBall />}
          </div>
      </div>

    </div>
  );
};
