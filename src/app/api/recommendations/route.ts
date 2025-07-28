import { NextRequest, NextResponse } from "next/server";
import { getRecommendations } from "@/services/QlooApiService";
import type { UserPreferences } from "@/services/QlooApiService";

export async function POST(request: NextRequest) {
  try {
    console.log("=== Recommendations API Route Called ===");

    const preferences: UserPreferences = await request.json();
    console.log("Received preferences:", preferences);

    // Validate the preferences
    if (!preferences.destination?.trim()) {
      return NextResponse.json(
        { error: "Destination is required" },
        { status: 400 }
      );
    }

    const recommendations = await getRecommendations(preferences);
    console.log("Generated recommendations:", recommendations.length);

    return NextResponse.json({
      recommendations,
      success: true,
      count: recommendations.length,
    });
  } catch (error) {
    console.error("Error in recommendations API route:", error);
    return NextResponse.json(
      {
        error: "Failed to get recommendations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Add GET method for testing
export async function GET() {
  return NextResponse.json({
    message: "Recommendations API is working",
    method: "Use POST to get recommendations",
    timestamp: new Date().toISOString(),
  });
}
