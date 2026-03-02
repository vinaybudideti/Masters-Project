"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PanelLeftOpen, RotateCcw, Sparkles } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { QuickActions } from "./QuickActions";
import { TypingIndicator } from "./TypingIndicator";
import { useChatStore } from "@/store/chatStore";
import { useNutritionChat } from "@/hooks/useNutritionChat";

export function ChatInterface() {
  const sidebarOpen = useChatStore((s) => s.sidebarOpen);
  const setSidebarOpen = useChatStore((s) => s.setSidebarOpen);
  const preferences = useChatStore((s) => s.preferences);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    setInput,
    sendMessage,
    handleSubmit,
    isLoading,
    error,
    stop,
    isEmpty,
  } = useNutritionChat();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleQuickAction = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-mesh">
      {/* Sidebar — always mounted, visibility controlled inside */}
      <div
        className={`
        flex-shrink-0 transition-all duration-300 ease-in-out
        ${sidebarOpen ? "w-72" : "w-0"}
        hidden lg:block overflow-hidden
      `}
      >
        <div className="w-72 h-full">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="lg:hidden">
        {sidebarOpen && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3 glass border-b border-glass-border flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-xl glass glass-hover text-text-muted hover:text-text-primary transition-colors"
            title="Toggle sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span className="text-sm font-semibold text-text-primary truncate">
                NutriBot
              </span>
              <span className="hidden sm:block text-xs text-text-muted">
                ·{" "}
                {preferences.dietType !== "none"
                  ? `${preferences.dietType} diet`
                  : "All diets"}
              </span>
            </div>
            <p className="text-[10px] text-text-muted leading-none mt-0.5">
              AI nutritionist
            </p>
          </div>

          {/* Error badge */}
          {error && (
            <div className="px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              Error · Check API key
            </div>
          )}

          {/* Actions */}
          {!isEmpty && (
            <button
              onClick={() => window.location.reload()}
              className="w-8 h-8 flex items-center justify-center rounded-xl glass glass-hover text-text-muted hover:text-text-primary transition-colors"
              title="New conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {isEmpty ? (
              /* Empty state */
              <motion.div
                key="empty"
                className="flex flex-col items-center justify-center h-full px-4 py-12 gap-8"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {/* Hero */}
                <div className="text-center space-y-3 max-w-sm">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-primary-gradient flex items-center justify-center mx-auto shadow-glow"
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(99,102,241,0.3)",
                        "0 0 35px rgba(99,102,241,0.5)",
                        "0 0 20px rgba(99,102,241,0.3)",
                      ],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <span className="text-3xl">🥗</span>
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold gradient-text">
                      {preferences.name
                        ? `Hey ${preferences.name}!`
                        : "Welcome to NutriBot"}
                    </h2>
                    <p className="text-sm text-text-muted mt-1 leading-relaxed">
                      Your AI nutrition assistant. Ask me about meals, macros,
                      meal planning, or anything diet-related.
                    </p>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="w-full max-w-lg">
                  <QuickActions
                    onSelect={handleQuickAction}
                    dietFilter={preferences.dietType}
                  />
                </div>
              </motion.div>
            ) : (
              /* Messages */
              <motion.div
                key="messages"
                className="p-4 space-y-4 pb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <AnimatePresence initial={false}>
                  {messages.map((message, i) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isStreaming={
                        isLoading &&
                        i === messages.length - 1 &&
                        message.role === "assistant"
                      }
                    />
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                <AnimatePresence>
                  {isLoading &&
                    (messages.length === 0 ||
                      messages[messages.length - 1]?.role === "user") && (
                      <TypingIndicator />
                    )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="flex-shrink-0 border-t border-glass-border">
          <MessageInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            onStop={stop}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
