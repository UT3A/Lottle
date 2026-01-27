import React from "react";
import { motion } from "motion/react";

interface MarqueeProps {
  text: string;
  speed?: number; // seconds for one full loop
}

export const Marquee: React.FC<MarqueeProps> = ({ text, speed = 20 }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap bg-black text-yellow-400 py-2 border-t-2 border-yellow-600 font-mono text-lg flex items-center">
      <motion.div
        className="inline-block"
        animate={{ x: ["100%", "-100%"] }}
        transition={{
          repeat: Infinity,
          duration: speed,
          ease: "linear",
        }}
      >
        {text}
      </motion.div>
    </div>
  );
};
