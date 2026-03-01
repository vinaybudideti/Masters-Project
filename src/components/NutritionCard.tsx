"use client";

import { motion } from "framer-motion";
import { Flame, Beef, Wheat, Droplets, Leaf } from "lucide-react";
import { cn, formatNumber, getMacroColor } from "@/lib/utils";
import type { NutritionData } from "@/lib/types";

interface NutritionCardProps {
  data: NutritionData;
  className?: string;
}

interface MacroBarProps {
  label: string;
  value: number;
  unit: string;
  color: string;
  maxValue: number;
  icon: React.ReactNode;
}

function MacroBar({ label, value, unit, color, maxValue, icon }: MacroBarProps) {
  const percent = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-text-secondary">
          <span style={{ color }}>{icon}</span>
          <span>{label}</span>
        </div>
        <span className="font-medium text-text-primary">
          {formatNumber(value)}
          <span className="text-text-muted ml-0.5">{unit}</span>
        </span>
      </div>
      <div className="macro-bar">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}

export function NutritionCard({ data, className }: NutritionCardProps) {
  const maxCalories = 800;
  const maxProtein = 60;
  const maxCarbs = 100;
  const maxFat = 50;
  const maxFiber = 30;

  const food = data.foods[0];

  return (
    <motion.div
      className={cn("nutrition-card mt-3", className)}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-health font-semibold uppercase tracking-wider mb-0.5">
            Nutrition Facts
          </p>
          <h4 className="text-sm font-semibold text-text-primary capitalize">
            {food?.name || data.query}
          </h4>
          {food && (
            <p className="text-xs text-text-muted mt-0.5">
              {food.serving_qty} {food.serving_unit}
              {food.serving_weight_grams
                ? ` · ${food.serving_weight_grams}g`
                : ""}
            </p>
          )}
        </div>

        {/* Calorie circle */}
        <div className="flex flex-col items-center">
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r="22"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="4"
              />
              <motion.circle
                cx="28"
                cy="28"
                r="22"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 22}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 22 }}
                animate={{
                  strokeDashoffset:
                    2 *
                    Math.PI *
                    22 *
                    (1 - Math.min(data.total_calories / maxCalories, 1)),
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-bold text-text-primary leading-none">
                {data.total_calories}
              </span>
              <span className="text-[9px] text-text-muted leading-none mt-0.5">
                kcal
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Macro bars */}
      <div className="space-y-3">
        <MacroBar
          label="Protein"
          value={data.total_protein}
          unit="g"
          color={getMacroColor("protein")}
          maxValue={maxProtein}
          icon={<Beef className="w-3 h-3" />}
        />
        <MacroBar
          label="Carbs"
          value={data.total_carbs}
          unit="g"
          color={getMacroColor("carbs")}
          maxValue={maxCarbs}
          icon={<Wheat className="w-3 h-3" />}
        />
        <MacroBar
          label="Fat"
          value={data.total_fat}
          unit="g"
          color={getMacroColor("fat")}
          maxValue={maxFat}
          icon={<Droplets className="w-3 h-3" />}
        />
        <MacroBar
          label="Fiber"
          value={data.total_fiber}
          unit="g"
          color={getMacroColor("fiber")}
          maxValue={maxFiber}
          icon={<Leaf className="w-3 h-3" />}
        />
      </div>

      {/* Macro summary pills */}
      <div className="flex gap-2 mt-4 flex-wrap">
        {[
          { label: "P", value: data.total_protein, color: getMacroColor("protein") },
          { label: "C", value: data.total_carbs, color: getMacroColor("carbs") },
          { label: "F", value: data.total_fat, color: getMacroColor("fat") },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30` }}
          >
            <span className="text-[10px] font-semibold" style={{ color }}>
              {label}
            </span>
            <span className="text-[10px] text-text-secondary">
              {formatNumber(value)}g
            </span>
          </div>
        ))}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
          <Flame className="w-2.5 h-2.5 text-orange-400" />
          <span className="text-[10px] text-text-secondary">
            {data.total_calories} cal
          </span>
        </div>
      </div>

      {data.foods.length > 1 && (
        <p className="text-[10px] text-text-muted mt-2 pt-2 border-t border-white/5">
          Totals for {data.foods.length} items
        </p>
      )}
    </motion.div>
  );
}
