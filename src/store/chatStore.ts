"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { DietType, GoalType, UserPreferences, ConversationStarter } from "@/lib/types";

interface ChatStore {
  // User preferences
  preferences: UserPreferences;
  setDietType: (diet: DietType) => void;
  setGoal: (goal: GoalType) => void;
  setCalorieTarget: (calories: number) => void;
  setRestrictions: (restrictions: string[]) => void;
  setName: (name: string) => void;

  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Session
  sessionId: string;
}

const CONVERSATION_STARTERS: ConversationStarter[] = [
  { text: "Give me a high-protein breakfast idea", icon: "🍳", category: "general" },
  { text: "What should I eat for muscle gain?", icon: "💪", category: "general" },
  { text: "Suggest a quick 15-minute lunch", icon: "⚡", category: "general" },
  { text: "What are good pre-workout snacks?", icon: "🏃", category: "general" },
  { text: "Help me plan a vegan meal prep", icon: "🌱", category: "vegan" },
  { text: "Best keto dinner options?", icon: "🥑", category: "keto" },
  { text: "Mediterranean diet meal ideas", icon: "🫒", category: "mediterranean" },
  { text: "Healthy snacks under 200 calories", icon: "🍎", category: "general" },
];

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      preferences: {
        dietType: "none",
        goal: "maintenance",
        calorieTarget: 2000,
        restrictions: [],
        name: "",
      },
      setDietType: (diet) =>
        set((state) => ({
          preferences: { ...state.preferences, dietType: diet },
        })),
      setGoal: (goal) =>
        set((state) => ({
          preferences: { ...state.preferences, goal },
        })),
      setCalorieTarget: (calories) =>
        set((state) => ({
          preferences: { ...state.preferences, calorieTarget: calories },
        })),
      setRestrictions: (restrictions) =>
        set((state) => ({
          preferences: { ...state.preferences, restrictions },
        })),
      setName: (name) =>
        set((state) => ({
          preferences: { ...state.preferences, name },
        })),
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      sessionId: generateSessionId(),
    }),
    {
      name: "nutribot-store",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      partialize: (state) => ({
        preferences: state.preferences,
        sidebarOpen: state.sidebarOpen,
        sessionId: state.sessionId,
      }),
    }
  )
);

export { CONVERSATION_STARTERS };
