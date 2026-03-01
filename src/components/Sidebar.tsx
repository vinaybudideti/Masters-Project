"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Flame, Leaf, Settings2 } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { cn, DIET_LABELS, DIET_EMOJIS, GOAL_LABELS } from "@/lib/utils";
import type { DietType, GoalType } from "@/lib/types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const DIET_OPTIONS: DietType[] = [
  "none",
  "vegan",
  "vegetarian",
  "keto",
  "paleo",
  "mediterranean",
  "gluten-free",
  "dash",
];

const GOAL_OPTIONS: GoalType[] = [
  "maintenance",
  "weight-loss",
  "muscle-gain",
  "athletic-performance",
  "heart-health",
];

const CALORIE_PRESETS = [1500, 1800, 2000, 2200, 2500, 3000];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const preferences = useChatStore((s) => s.preferences);
  const setDietType = useChatStore((s) => s.setDietType);
  const setGoal = useChatStore((s) => s.setGoal);
  const setCalorieTarget = useChatStore((s) => s.setCalorieTarget);
  const setName = useChatStore((s) => s.setName);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <motion.aside
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto",
          "w-72 flex flex-col glass border-r border-glass-border",
          "transition-all duration-300 ease-in-out",
          "lg:flex"
        )}
        initial={false}
        animate={{
          x: isOpen ? 0 : "-100%",
        }}
        style={{ x: undefined }}
        // On desktop always show:
        // use CSS for desktop visibility
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-glass-border flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-gradient flex items-center justify-center shadow-glow-sm">
              <span className="text-base">🥗</span>
            </div>
            <div>
              <h1 className="font-bold text-sm gradient-text">NutriBot</h1>
              <p className="text-[10px] text-text-muted">AI Nutrition Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg glass glass-hover text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
              <Settings2 className="w-3 h-3" />
              Your Name
            </label>
            <input
              type="text"
              value={preferences.name || ""}
              onChange={(e) => setName(e.target.value)}
              placeholder="Optional..."
              className="w-full glass rounded-xl px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/40 border border-transparent transition-colors"
            />
          </div>

          {/* Diet Type */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
              <Leaf className="w-3 h-3 text-health" />
              Diet Type
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DIET_OPTIONS.map((diet) => (
                <button
                  key={diet}
                  onClick={() => setDietType(diet)}
                  className={cn(
                    "diet-pill",
                    preferences.dietType === diet
                      ? "diet-pill-active"
                      : "diet-pill-inactive"
                  )}
                >
                  <span className="mr-1">{DIET_EMOJIS[diet]}</span>
                  {DIET_LABELS[diet]}
                </button>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
              <Target className="w-3 h-3 text-accent" />
              Goal
            </label>
            <div className="space-y-1.5">
              {GOAL_OPTIONS.map((goal) => (
                <button
                  key={goal}
                  onClick={() => setGoal(goal)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200",
                    preferences.goal === goal
                      ? "bg-accent/15 text-accent border border-accent/30"
                      : "glass text-text-secondary hover:text-text-primary border border-transparent hover:border-glass-border"
                  )}
                >
                  {GOAL_LABELS[goal]}
                </button>
              ))}
            </div>
          </div>

          {/* Calorie Target */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs font-semibold text-text-secondary uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <Flame className="w-3 h-3 text-orange-400" />
                Daily Calories
              </div>
              <span className="text-text-primary font-bold">
                {preferences.calorieTarget}
                <span className="text-text-muted font-normal ml-0.5 text-[10px]">
                  kcal
                </span>
              </span>
            </label>

            {/* Preset buttons */}
            <div className="flex flex-wrap gap-1.5">
              {CALORIE_PRESETS.map((cal) => (
                <button
                  key={cal}
                  onClick={() => setCalorieTarget(cal)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 border",
                    preferences.calorieTarget === cal
                      ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                      : "glass text-text-muted border-transparent hover:border-glass-border hover:text-text-secondary"
                  )}
                >
                  {cal}
                </button>
              ))}
            </div>
          </div>

          {/* Restrictions */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
              Restrictions / Allergies
            </label>
            <div className="flex flex-wrap gap-1.5">
              {["nuts", "dairy", "eggs", "soy", "shellfish", "gluten"].map(
                (item) => {
                  const active = preferences.restrictions.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => {
                        const current = preferences.restrictions;
                        const updated = active
                          ? current.filter((r) => r !== item)
                          : [...current, item];
                        useChatStore.getState().setRestrictions(updated);
                      }}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-200",
                        active
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "glass text-text-muted border-transparent hover:border-glass-border"
                      )}
                    >
                      {active ? "✕ " : ""}
                      No {item}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-glass-border flex-shrink-0">
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-[10px] text-text-muted leading-relaxed">
              Preferences are saved automatically and used to personalize your
              nutrition advice
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
