import { NextRequest, NextResponse } from "next/server";

const NUTRITIONIX_BASE_URL = "https://trackapi.nutritionix.com/v2";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  const appId = process.env.NUTRITIONIX_APP_ID;
  const apiKey = process.env.NUTRITIONIX_API_KEY;

  if (!appId || !apiKey) {
    // Return mock data for demo
    return NextResponse.json(getMockData(query));
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
      throw new Error(`Nutritionix error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Nutrition API error:", error);
    return NextResponse.json(getMockData(query));
  }
}

function getMockData(query: string) {
  return {
    foods: [
      {
        food_name: query,
        serving_qty: 1,
        serving_unit: "serving",
        serving_weight_grams: 200,
        nf_calories: 320,
        nf_protein: 25,
        nf_total_carbohydrate: 35,
        nf_total_fat: 8,
        nf_dietary_fiber: 6,
        nf_sugars: 4,
        nf_sodium: 480,
      },
    ],
  };
}
