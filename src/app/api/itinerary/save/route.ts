import { NextRequest, NextResponse } from "next/server";
import { saveItinerary } from "@/services/QlooApiService";
import type { Itinerary } from "@/services/QlooApiService";

export async function POST(request: NextRequest) {
  try {
    const { itinerary }: { itinerary: Itinerary } = await request.json();

    const success = await saveItinerary(itinerary);

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Itinerary saved successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to save itinerary" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error saving itinerary:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save itinerary" },
      { status: 500 }
    );
  }
}
