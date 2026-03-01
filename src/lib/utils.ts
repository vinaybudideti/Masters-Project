import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number, decimals = 1): string {
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(decimals);
}

export function getMacroColor(macro: "protein" | "carbs" | "fat" | "fiber") {
  switch (macro) {
    case "protein":
      return "#6366f1"; // indigo
    case "carbs":
      return "#f59e0b"; // amber
    case "fat":
      return "#f97316"; // orange
    case "fiber":
      return "#10b981"; // emerald
  }
}

export function getMacroPercent(value: number, calories: number, macro: "protein" | "carbs" | "fat"): number {
  const calsPerGram = macro === "fat" ? 9 : 4;
  return Math.round((value * calsPerGram / calories) * 100);
}

export function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export const DIET_LABELS: Record<string, string> = {
  none: "Any Diet",
  vegan: "Vegan",
  vegetarian: "Vegetarian",
  keto: "Keto",
  paleo: "Paleo",
  mediterranean: "Mediterranean",
  "gluten-free": "Gluten-Free",
  carnivore: "Carnivore",
  whole30: "Whole30",
  dash: "DASH",
};

export const DIET_EMOJIS: Record<string, string> = {
  none: "🍽️",
  vegan: "🌱",
  vegetarian: "🥗",
  keto: "🥑",
  paleo: "🥩",
  mediterranean: "🫒",
  "gluten-free": "🌾",
  carnivore: "🥩",
  whole30: "🥦",
  dash: "❤️",
};

export const GOAL_LABELS: Record<string, string> = {
  maintenance: "Maintain Weight",
  "weight-loss": "Lose Weight",
  "muscle-gain": "Build Muscle",
  "athletic-performance": "Athletic Performance",
  "heart-health": "Heart Health",
};
