"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { NutritionCard } from "./NutritionCard";
import type { ParsedMessage } from "@/hooks/useNutritionChat";

interface MessageBubbleProps {
  message: ParsedMessage;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${
          isUser
            ? "bg-primary-gradient shadow-glow-sm"
            : "glass border border-glass-border"
        }`}
      >
        <span className="text-sm">{isUser ? "👤" : "🥗"}</span>
      </div>

      {/* Content */}
      <div className={`flex flex-col gap-2 ${isUser ? "items-end" : "items-start"} max-w-[82%]`}>
        {/* Message bubble */}
        {message.content && (
          <div
            className={
              isUser
                ? "message-user"
                : `message-ai ${isStreaming ? "streaming-cursor" : ""}`
            }
          >
            {isUser ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            ) : (
              <div className="prose-nutribot text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {/* Nutrition card (only for AI messages) */}
        {!isUser && message.nutritionData && (
          <NutritionCard
            data={message.nutritionData}
            className="w-full max-w-xs"
          />
        )}
      </div>
    </motion.div>
  );
}
