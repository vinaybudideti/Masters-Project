"use client";

import { useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Square, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function MessageInput({
  value,
  onChange,
  onSubmit,
  onStop,
  isLoading,
  disabled,
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && value.trim()) {
        onSubmit();
      }
    }
  };

  const canSubmit = !isLoading && value.trim().length > 0 && !disabled;

  return (
    <div className="px-4 pb-4 pt-2">
      <div className="relative glass rounded-2xl border border-glass-border focus-within:border-primary/40 transition-all duration-200">
        {/* Input row */}
        <div className="flex items-end gap-2 p-3">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about nutrition, meal ideas, diet advice..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none leading-relaxed min-h-[24px] max-h-[200px]"
            rows={1}
            disabled={disabled}
          />

          {/* Action button */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.button
                key="stop"
                onClick={onStop}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all duration-200"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                title="Stop generating"
              >
                <Square className="w-3.5 h-3.5" />
              </motion.button>
            ) : (
              <motion.button
                key="send"
                onClick={onSubmit}
                disabled={!canSubmit}
                className={cn(
                  "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200",
                  canSubmit
                    ? "bg-primary hover:bg-primary-dark text-white shadow-glow-sm hover:shadow-glow"
                    : "bg-white/5 text-text-muted cursor-not-allowed"
                )}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                title="Send message (Enter)"
              >
                <Send className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Footer hint */}
        <div className="px-3 pb-2 flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-primary/60" />
          <span className="text-[10px] text-text-muted">
            Press{" "}
            <kbd className="px-1 py-0.5 rounded bg-white/5 text-[9px] font-mono border border-white/10">
              Enter
            </kbd>{" "}
            to send ·{" "}
            <kbd className="px-1 py-0.5 rounded bg-white/5 text-[9px] font-mono border border-white/10">
              Shift+Enter
            </kbd>{" "}
            for new line
          </span>
        </div>
      </div>
    </div>
  );
}
