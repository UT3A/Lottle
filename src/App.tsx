import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LotteryBall } from "@/components/Lottery/LotteryBall";
import { MixingMachine } from "@/components/Lottery/MixingMachine";
import { Sidebar } from "@/components/Lottery/Sidebar";
import { Marquee } from "@/components/Lottery/Marquee";
import { SettingsModal } from "@/components/Lottery/SettingsModal";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Toaster } from "@/components/ui/sonner";

const DEFAULT_POOL = Array.from({ length: 39 }, (_, i) =>
  (i + 1).toString().padStart(2, "0")
);

export default function App() {
  const [customPool, setCustomPool] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>(Array(5).fill(null));
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [drawingPhase, setDrawingPhase] = useState<"idle" | "mixing" | "extracting">("idle");

  const currentPool = customPool.length > 0 ? customPool : DEFAULT_POOL;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const handleDraw = async () => {
    if (isDrawing) return;
    if (currentPool.length < 5) {
      toast.error("抽獎池數量不足");
      return;
    }

    setIsDrawing(true);
    setDrawingPhase("mixing");
    setResults(Array(5).fill(null)); 

    const shuffled = [...currentPool].sort(() => 0.5 - Math.random());
    const winners = shuffled.slice(0, 5);

    for (let i = 0; i < 5; i++) {
        setDrawingPhase("extracting");
        await new Promise(resolve => setTimeout(resolve, 600)); 
        
        setResults(prev => {
            const next = [...prev];
            next[i] = winners[i];
            return next;
        });

        setDrawingPhase("mixing");
        await new Promise(resolve => setTimeout(resolve, 1000)); 
    }

    setDrawingPhase("idle");
    setIsDrawing(false);
    toast.success("開獎完成！");
  };

  const handleReset = () => {
    setResults(Array(5).fill(null));
    setIsDrawing(false);
  };

  const handlePoolUpdate = (newPool: string[]) => {
    setCustomPool(newPool);
    setResults(Array(5).fill(null));
    if (newPool.length > 0) {
        toast.success(`已更新抽獎池，共 ${newPool.length} 筆資料`);
    } else {
        toast.info("已重置為預設數字池");
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-[#8B0000] to-[#500000] text-white font-sans overflow-hidden flex flex-col">
      <Toaster />
      
      {/* Header - Fixed Height (64px) */}
      <header className="h-16 px-4 flex items-center justify-between bg-black/20 backdrop-blur-sm z-50 shrink-0 shadow-lg border-b border-white/10">
        <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-red-900 font-black text-xl border-2 border-white shadow-md">
                539
             </div>
             <div>
                <h1 className="text-xl font-black tracking-wider text-yellow-400 drop-shadow-sm">今彩 539 模擬開獎</h1>
             </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
                <p className="text-xl font-mono font-bold text-white leading-none">
                    {formatTime(currentTime)}
                </p>
            </div>
            <SettingsModal onPoolUpdate={handlePoolUpdate} currentPoolSize={customPool.length} />
        </div>
      </header>

      {/* Main Content - Takes Remaining Height */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 min-h-0">
        
        {/* Left Area (Machine + Controls) */}
        <div className="lg:col-span-3 flex flex-col h-full relative">
            
            {/* Top: Machine (Flexible Height) */}
            <div className="flex-1 min-h-0 p-4 pb-0 flex flex-col relative z-20">
                 <MixingMachine pool={currentPool} isDrawing={isDrawing} drawingPhase={drawingPhase} />
            </div>

            {/* Bottom: Rail & Controls (Fixed Height Section) */}
            {/* Using a fixed height ensures buttons are always visible and layout is stable */}
            <div className="h-[220px] shrink-0 relative flex flex-col items-center justify-end pb-4 z-30">
                
                {/* The Rail */}
                <div className="absolute top-4 left-4 right-4 h-4 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full shadow-xl border-t border-gray-300"></div>

                {/* Balls Container */}
                <div className="absolute top-[-30px] left-0 right-0 flex justify-center gap-2 md:gap-6 px-4 pointer-events-none h-24 items-end">
                     {results.map((val, idx) => (
                          <div key={idx} className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center relative shrink-0">
                              <AnimatePresence>
                                 {val && (
                                     <motion.div 
                                         key={val}
                                         initial={{ y: -150, opacity: 0 }} 
                                         animate={{ y: 0, opacity: 1 }}
                                         transition={{ type: "spring", stiffness: 180, damping: 18 }}
                                         className="relative z-30"
                                     >
                                         <LotteryBall 
                                             value={val} 
                                             size="xl" 
                                             color="yellow"
                                             className="shadow-2xl scale-75 md:scale-100"
                                         />
                                     </motion.div>
                                 )}
                              </AnimatePresence>
                          </div>
                     ))}
                </div>

                {/* Controls Area */}
                <div className="mt-auto flex gap-6 z-50 pointer-events-auto">
                    <Button 
                        size="lg" 
                        onClick={handleDraw} 
                        disabled={isDrawing}
                        className="h-16 px-10 text-2xl bg-yellow-500 hover:bg-yellow-400 text-red-900 font-black rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)] border-4 border-yellow-200 transition-all active:scale-95"
                    >
                        {isDrawing ? "開獎中..." : (
                            <>
                                <Play className="mr-2 h-8 w-8 fill-current" /> 啟動搖獎
                            </>
                        )}
                    </Button>

                    {!isDrawing && results.some(r => r !== null) && (
                        <Button 
                            size="lg" 
                            variant="outline" 
                            onClick={handleReset}
                            className="h-16 px-8 bg-black/30 text-white border-white/20 hover:bg-black/50 hover:text-white rounded-full"
                        >
                            <RotateCcw className="mr-2" /> 重置
                        </Button>
                    )}
                </div>
            </div>
        </div>

        {/* Right Sidebar (Desktop Only) */}
        <div className="hidden lg:block h-full border-l border-white/10 bg-black/10 overflow-y-auto p-4">
            <Sidebar />
        </div>

      </main>

      {/* Footer Marquee - Fixed Height (40px) */}
      <div className="h-10 shrink-0 z-50">
          <Marquee text={`歡迎收看今彩539開獎實況... 本期頭獎上看新台幣 800 萬元！ ... 下載官方 APP 隨時掌握最新獎號 ... 請理性投注，未滿18歲不得購買或兌領彩券 ...`} />
      </div>

    </div>
  );
}
