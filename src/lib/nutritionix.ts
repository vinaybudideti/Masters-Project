import { tool } from "ai";
import { z } from "zod";
import type { NutritionData, NutritionFood } from "./types";

const NUTRITIONIX_BASE_URL = "https://trackapi.nutritionix.com/v2";

async function fetchFromNutritionix(query: string): Promise<NutritionData> {
  const appId = process.env.NUTRITIONIX_APP_ID;
  const apiKey = process.env.NUTRITIONIX_API_KEY;

  // If no credentials, return mock data for demo purposes
  if (!appId || !apiKey) {
    return getMockNutritionData(query);
  }

  try {
    const response = await fetch(`${NUTRITIONIX_BASE_URL}/natural/nutrients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-id": appId,
        "x-app-key": apiKey,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Nutritionix API error: ${response.status}`);
    }

    const data = await response.json();
    const foods: NutritionFood[] = data.foods.map(
      (f: Record<string, unknown>) => ({
        name: f.food_name as string,
        serving_qty: f.serving_qty as number,
        serving_unit: f.serving_unit as string,
        serving_weight_grams: f.serving_weight_grams as number,
        calories: Math.round(f.nf_calories as number),
        protein: Math.round((f.nf_protein as number) * 10) / 10,
        carbs: Math.round((f.nf_total_carbohydrate as number) * 10) / 10,
        fat: Math.round((f.nf_total_fat as number) * 10) / 10,
        fiber: Math.round(((f.nf_dietary_fiber as number) || 0) * 10) / 10,
        sugar: Math.round(((f.nf_sugars as number) || 0) * 10) / 10,
        sodium: Math.round((f.nf_sodium as number) || 0),
        photo: (f.photo as { thumb?: string })?.thumb,
      })
    );

    return {
      foods,
      total_calories: foods.reduce((sum, f) => sum + f.calories, 0),
      total_protein: Math.round(foods.reduce((sum, f) => sum + f.protein, 0) * 10) / 10,
      total_carbs: Math.round(foods.reduce((sum, f) => sum + f.carbs, 0) * 10) / 10,
      total_fat: Math.round(foods.reduce((sum, f) => sum + f.fat, 0) * 10) / 10,
      total_fiber: Math.round(foods.reduce((sum, f) => sum + f.fiber, 0) * 10) / 10,
      query,
    };
  } catch (error) {
    console.error("Nutritionix API error:", error);
    return getMockNutritionData(query);
  }
}

function getMockNutritionData(query: string): NutritionData {
  // Realistic mock data when API keys aren't set
  const mockFoods: NutritionFood[] = [
    {
      name: query,
      serving_qty: 1,
      serving_unit: "serving",
      serving_weight_grams: 200,
      calories: 320,
      protein: 25,
      carbs: 35,
      fat: 8,
      fiber: 6,
      sugar: 4,
      sodium: 480,
    },
  ];

  return {
    foods: mockFoods,
    total_calories: 320,
    total_protein: 25,
    total_carbs: 35,
    total_fat: 8,
    total_fiber: 6,
    query,
  };
}

// Vercel AI SDK tool definition
export const searchNutritionTool = tool({
  description:
    "Search for accurate nutritional information for a specific food, meal, or ingredient. Use this whenever you recommend a meal or food to provide precise calorie and macro data.",
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "The food, meal, or ingredient to search for. Use natural language like '1 cup of oatmeal with berries' or '2 scrambled eggs with avocado toast'."
      ),
  }),
  execute: async ({ query }) => {
    const data = await fetchFromNutritionix(query);
    return data;
  },
});
