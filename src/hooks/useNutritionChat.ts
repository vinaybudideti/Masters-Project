"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useMemo, useCallback } from "react";
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
  const [input, setInput] = useState("");

  const {
    messages,
    sendMessage: chatSendMessage,
    status,
    error,
    stop,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { preferences },
    }),
    onError: (err) => {
      console.error("Chat error:", err);
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Parse messages to extract text content and nutrition data from parts
  const parsedMessages: ParsedMessage[] = useMemo(() => {
    return messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => {
        let nutritionData: NutritionData | undefined;
        let content = "";

        for (const part of m.parts) {
          if (part.type === "text") {
            content += part.text;
          }
          // In AI SDK v6, tool parts have type "tool-<name>" with state "output-available"
          if (
            "toolName" in part &&
            part.toolName === "searchNutrition" &&
            "state" in part &&
            part.state === "output-available" &&
            "output" in part
          ) {
            nutritionData = part.output as NutritionData;
          }
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

  const sendMessage = useCallback(
    (text?: string) => {
      const messageText = text || input;
      if (!messageText.trim()) return;
      chatSendMessage({ text: messageText });
      setInput("");
    },
    [input, chatSendMessage]
  );

  const handleSubmit = useCallback(() => {
    sendMessage();
  }, [sendMessage]);

  return {
    messages: parsedMessages,
    input,
    setInput,
    sendMessage,
    handleSubmit,
    isLoading,
    error,
    stop,
    isEmpty: messages.length === 0,
  };
}
