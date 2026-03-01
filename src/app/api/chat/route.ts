import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { searchNutritionTool } from "@/lib/nutritionix";
import { buildSystemPrompt } from "@/lib/system-prompt";
import type { UserPreferences } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages, preferences } = (await req.json()) as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
      preferences: UserPreferences;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = streamText({
      model: anthropic("claude-sonnet-4-6"),
      system: buildSystemPrompt(preferences || getDefaultPreferences()),
      messages,
      tools: {
        searchNutrition: searchNutritionTool,
      },
      maxSteps: 3, // Allow up to 3 tool-use cycles (agentic loop)
      maxTokens: 1024,
      temperature: 0.7,
    });

    return result.toDataStreamResponse({
      headers: {
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

function getDefaultPreferences(): UserPreferences {
  return {
    dietType: "none",
    goal: "maintenance",
    calorieTarget: 2000,
    restrictions: [],
    name: "",
  };
}
