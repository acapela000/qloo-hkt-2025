import { NextRequest, NextResponse } from "next/server";
import { getRecommendations } from "@/services/QlooApiService";
import type { UserPreferences } from "@/services/QlooApiService";

export async function POST(request: NextRequest) {
  try {
    console.log("=== Recommendations API Route Called ===");
    console.log("Request method:", request.method);
    console.log("Request URL:", request.url);
    console.log("Content-Type:", request.headers.get("content-type"));

    // Parse the JSON with better error handling
    let preferences: UserPreferences;
    try {
      preferences = await request.json();
      console.log("Successfully parsed JSON preferences:", preferences);
    } catch (jsonError) {
      console.error("JSON parsing failed:", jsonError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // More detailed validation
    console.log("Validating preferences...");

    if (!preferences) {
      console.error("Preferences is null/undefined");
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    if (!preferences.destination?.trim()) {
      console.error("Destination validation failed:", preferences.destination);
      return NextResponse.json(
        { error: "Destination is required" },
        { status: 400 }
      );
    }

    if (!preferences.numberOfDays || preferences.numberOfDays < 1) {
      console.error(
        "NumberOfDays validation failed:",
        preferences.numberOfDays
      );
      return NextResponse.json(
        { error: "Number of days must be at least 1" },
        { status: 400 }
      );
    }

    if (!preferences.budget) {
      console.error("Budget validation failed:", preferences.budget);
      return NextResponse.json(
        { error: "Budget is required" },
        { status: 400 }
      );
    }

    if (!preferences.travelStyle) {
      console.error("TravelStyle validation failed:", preferences.travelStyle);
      return NextResponse.json(
        { error: "Travel style is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(preferences.interests)) {
      console.error("Interests validation failed:", preferences.interests);
      return NextResponse.json(
        { error: "Interests must be an array" },
        { status: 400 }
      );
    }

    console.log("✅ All validations passed");
    console.log("Calling getRecommendations with:", preferences);

    const recommendations = await getRecommendations(preferences);
    console.log("✅ Generated recommendations:", recommendations.length);

    return NextResponse.json({
      recommendations,
      success: true,
      count: recommendations.length,
    });
  } catch (error) {
    console.error("❌ Error in recommendations API route:", error);
    console.error("Error type:", typeof error);
    console.error("Error name:", error?.constructor?.name);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack"
    );

    return NextResponse.json(
      {
        error: "Failed to get recommendations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET method for testing
export async function GET() {
  return NextResponse.json({
    message: "Recommendations API is working",
    method: "Use POST to get recommendations",
    timestamp: new Date().toISOString(),
  });
}
