"use client";

import { useChat } from "ai/react";
import { useMemo } from "react";
import { useChatStore } from "@/store/chatStore";
import type { NutritionData } from "@/lib/types";

export interface ParsedMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  nutritionData?: NutritionData;
  isStreaming?: boolean;
}

export function useNutritionChat() {
  const preferences = useChatStore((s) => s.preferences);

  const {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
    error,
    append,
    reload,
    stop,
  } = useChat({
    api: "/api/chat",
    body: { preferences },
    onError: (err) => {
      console.error("Chat error:", err);
    },
  });

  // Parse tool results embedded in messages to extract nutrition data
  const parsedMessages: ParsedMessage[] = useMemo(() => {
    return messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => {
        let nutritionData: NutritionData | undefined;

        // Extract nutrition data from tool invocations in the message
        if (m.role === "assistant" && m.toolInvocations) {
          for (const tool of m.toolInvocations) {
            if (
              tool.toolName === "searchNutrition" &&
              tool.state === "result" &&
              tool.result
            ) {
              nutritionData = tool.result as NutritionData;
              break;
            }
          }
        }

        // Get text content from message parts or content string
        let content = "";
        if (typeof m.content === "string") {
          content = m.content;
        } else if (Array.isArray(m.content)) {
          content = (m.content as Array<{ type: string; text?: string }>)
            .filter((p) => p.type === "text")
            .map((p) => p.text ?? "")
            .join("");
        }

        return {
          id: m.id,
          role: m.role as "user" | "assistant",
          content,
          nutritionData,
        };
      })
      .filter((m) => m.content.length > 0 || m.nutritionData);
  }, [messages]);

  const sendMessage = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    if (text) {
      append({ role: "user", content: text });
    } else {
      handleSubmit();
    }
  };

  return {
    messages: parsedMessages,
    input,
    setInput,
    sendMessage,
    handleSubmit,
    isLoading,
    error,
    append,
    reload,
    stop,
    isEmpty: messages.length === 0,
  };
}
