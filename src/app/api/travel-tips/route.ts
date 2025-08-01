import { NextRequest, NextResponse } from "next/server";
import { getTravelTips } from "@/services/QlooApiService";

export async function POST(request: NextRequest) {
  try {
    const { destination }: { destination: string } = await request.json();

    const tips = await getTravelTips(destination);

    return NextResponse.json({ tips });
  } catch (error) {
    console.error("Error getting travel tips:", error);
    return NextResponse.json(
      { error: "Failed to get travel tips" },
      { status: 500 }
    );
  }
}
