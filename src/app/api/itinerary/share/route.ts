import { NextRequest, NextResponse } from "next/server";
import { shareItinerary } from "@/services/QlooApiService";

export async function POST(request: NextRequest) {
  try {
    const {
      itineraryId,
      email,
    }: {
      itineraryId: string;
      email: string;
    } = await request.json();

    const success = await shareItinerary(itineraryId, email);

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Itinerary shared successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to share itinerary" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sharing itinerary:", error);
    return NextResponse.json(
      { success: false, error: "Failed to share itinerary" },
      { status: 500 }
    );
  }
}
