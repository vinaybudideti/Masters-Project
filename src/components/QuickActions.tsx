"use client";

import { motion } from "framer-motion";
import { CONVERSATION_STARTERS } from "@/store/chatStore";

interface QuickActionsProps {
  onSelect: (text: string) => void;
  dietFilter?: string;
}

export function QuickActions({ onSelect, dietFilter }: QuickActionsProps) {
  const starters = CONVERSATION_STARTERS.filter(
    (s) => s.category === "general" || s.category === dietFilter
  ).slice(0, 6);

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <p className="text-xs text-text-muted text-center mb-3 uppercase tracking-wider font-medium">
        Quick start
      </p>
      <div className="grid grid-cols-1 gap-2">
        {starters.map((starter, i) => (
          <motion.button
            key={starter.text}
            onClick={() => onSelect(starter.text)}
            className="flex items-center gap-3 px-4 py-3 glass glass-hover rounded-xl text-left text-sm text-text-secondary hover:text-text-primary transition-all duration-200 group"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-base flex-shrink-0">{starter.icon}</span>
            <span className="flex-1 leading-snug">{starter.text}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary text-xs">
              →
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
