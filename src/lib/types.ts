export type DietType =
  | "none"
  | "vegan"
  | "vegetarian"
  | "keto"
  | "paleo"
  | "mediterranean"
  | "gluten-free"
  | "carnivore"
  | "whole30"
  | "dash";

export type GoalType =
  | "maintenance"
  | "weight-loss"
  | "muscle-gain"
  | "athletic-performance"
  | "heart-health";

export interface UserPreferences {
  dietType: DietType;
  goal: GoalType;
  calorieTarget: number;
  restrictions: string[];
  name?: string;
}

export interface NutritionFood {
  name: string;
  serving_qty: number;
  serving_unit: string;
  serving_weight_grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar?: number;
  sodium?: number;
  photo?: string;
}

export interface NutritionData {
  foods: NutritionFood[];
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  total_fiber: number;
  query: string;
}

export interface ConversationStarter {
  text: string;
  icon: string;
  category: DietType | "general";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  nutritionData?: NutritionData;
}
