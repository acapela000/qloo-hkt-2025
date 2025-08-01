import { NextRequest, NextResponse } from "next/server";
import { createItinerary } from "@/services/QlooApiService";
import type {
  UserPreferences,
  Recommendation,
} from "@/services/QlooApiService";

export async function POST(request: NextRequest) {
  try {
    const {
      preferences,
      selectedSpots,
    }: {
      preferences: UserPreferences;
      selectedSpots: Recommendation[];
    } = await request.json();

    const itinerary = await createItinerary(preferences, selectedSpots);

    return NextResponse.json({ itinerary });
  } catch (error) {
    console.error("Error creating itinerary:", error);
    return NextResponse.json(
      { error: "Failed to create itinerary" },
      { status: 500 }
    );
  }
}
