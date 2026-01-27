import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LotteryBall } from "@/components/Lottery/LotteryBall";
import { Sidebar } from "@/components/Lottery/Sidebar";
import { Marquee } from "@/components/Lottery/Marquee";
import { SettingsModal } from "@/components/Lottery/SettingsModal";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Toaster } from "@/components/ui/sonner";

// Default pool: 1-39 padded with 0
const DEFAULT_POOL = Array.from({ length: 39 }, (_, i) =>
  (i + 1).toString().padStart(2, "0")
);

export default function App() {
  const [customPool, setCustomPool] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>(Array(5).fill(null));
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<string[][]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Use custom pool if available, otherwise default
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-TW', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).replace(/\//g, '-');
  };

  const handleDraw = async () => {
    if (isDrawing) return;
    
    // Check if pool is large enough
    if (currentPool.length < 5) {
      toast.error("抽獎池數量不足 (至少需要 5 個選項)");
      return;
    }

    setIsDrawing(true);
    setResults(Array(5).fill(null)); // Reset current display

    // Determine winners
    const shuffled = [...currentPool].sort(() => 0.5 - Math.random());
    const winners = shuffled.slice(0, 5);

    // Animate reveal one by one
    for (let i = 0; i < 5; i++) {
        // Delay for suspense
        await new Promise(resolve => setTimeout(resolve, 800)); 
        
        setResults(prev => {
            const next = [...prev];
            next[i] = winners[i];
            return next;
        });
    }

    setIsDrawing(false);
    setHistory(prev => [winners, ...prev]);
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
        toast.info("已重置為預設數字池 (1-39)");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8B0000] to-[#500000] text-white font-sans overflow-hidden flex flex-col">
      <Toaster />
      
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
             {/* Logo Placeholder */}
             <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-red-900 font-black text-2xl border-4 border-white shadow-lg">
                539
             </div>
             <div>
                <h1 className="text-2xl font-black tracking-wider text-yellow-400 drop-shadow-md">今彩 539 模擬開獎</h1>
                <p className="text-xs text-white/70">公平 • 公正 • 公開</p>
             </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
                <p className="text-2xl font-mono font-bold text-white leading-none">
                    {formatTime(currentTime)}
                </p>
                <p className="text-xs text-white/60">
                    {formatDate(currentTime)}
                </p>
            </div>
            <SettingsModal onPoolUpdate={handlePoolUpdate} currentPoolSize={customPool.length} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Draw Area (Left 3 cols) */}
        <div className="lg:col-span-3 flex flex-col justify-center">
            
            {/* Display Boxes */}
            <div className="grid grid-cols-5 gap-2 md:gap-4 mb-12">
                {results.map((val, idx) => (
                    <div key={idx} className="aspect-[3/4] relative">
                         <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.5)] border-2 border-red-400 flex flex-col items-center justify-center overflow-hidden">
                             {/* Label */}
                             <div className="absolute top-2 left-0 w-full text-center text-xs font-bold text-red-300 uppercase tracking-widest">
                                第 {idx + 1} 球
                             </div>
                             
                             {/* Number Animation */}
                             <AnimatePresence mode="wait">
                                {val ? (
                                    <motion.div 
                                        key={val}
                                        initial={{ scale: 0.5, opacity: 0, rotateX: 90 }}
                                        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                                        className="text-4xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-xl"
                                    >
                                        {val}
                                    </motion.div>
                                ) : (
                                    <div className="animate-pulse opacity-20 text-6xl font-black text-red-900">
                                        ?
                                    </div>
                                )}
                             </AnimatePresence>

                             {/* Bottom Decor */}
                             <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-black/30 to-transparent"></div>
                         </div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-6">
                <Button 
                    size="lg" 
                    onClick={handleDraw} 
                    disabled={isDrawing}
                    className="h-20 px-12 text-2xl bg-yellow-500 hover:bg-yellow-400 text-red-900 font-black rounded-full shadow-[0_0_30px_rgba(234,179,8,0.4)] border-4 border-yellow-200 transition-all active:scale-95"
                >
                    {isDrawing ? "開獎中..." : (
                        <>
                            <Play className="mr-2 h-8 w-8 fill-current" /> 開始開獎
                        </>
                    )}
                </Button>

                {!isDrawing && results.some(r => r !== null) && (
                    <Button 
                        size="lg" 
                        variant="outline" 
                        onClick={handleReset}
                        className="h-20 px-8 bg-black/30 text-white border-white/20 hover:bg-black/50 hover:text-white rounded-full"
                    >
                        <RotateCcw className="mr-2" /> 重置
                    </Button>
                )}
            </div>

        </div>

        {/* Sidebar (Right 1 col) */}
        <div className="hidden lg:block">
            <Sidebar />
        </div>
      </main>

      {/* Footer Area */}
      <div className="bg-black/40 backdrop-blur-md border-t border-white/10">
          <div className="container mx-auto p-4 flex flex-col md:flex-row items-center justify-between gap-4">
               {/* Result Balls (Small) */}
               <div className="flex items-center gap-3">
                    <span className="text-yellow-500 font-bold mr-2">本期號碼:</span>
                    <div className="flex gap-2">
                        {results.map((val, idx) => (
                            <LotteryBall 
                                key={idx} 
                                value={val} 
                                size="sm" 
                                className={val ? "opacity-100" : "opacity-30"} 
                            />
                        ))}
                    </div>
               </div>

               {/* Stats or Info */}
               <div className="text-sm text-white/50">
                    下期開獎時間: 明日 20:30
               </div>
          </div>
          
          {/* Marquee */}
          <Marquee text={`歡迎收看今彩539開獎實況... 本期頭獎上看新台幣 800 萬元！ ... 下載官方 APP 隨時掌握最新獎號 ... 請理性投注，未滿18歲不得購買或兌領彩券 ... 開獎號碼以主辦單位公告為準 ...`} />
      </div>

    </div>
  );
}
