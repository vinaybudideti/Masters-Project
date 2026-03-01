"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <motion.div
      className="flex items-start gap-3 max-w-[85%]"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Bot avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-gradient flex items-center justify-center shadow-glow-sm mt-1">
        <span className="text-sm">🥗</span>
      </div>

      {/* Bubble */}
      <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 border-l-2 border-primary">
        <div className="flex items-center gap-1.5 h-5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary-glow"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
