import { NextRequest, NextResponse } from "next/server";

const QLOO_API_BASE = "https://hackathon.api.qloo.com";
const QLOO_API_KEY = process.env.QLOO_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!QLOO_API_KEY) {
      console.error("QLOO_API_KEY is not configured");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const { entityId } = await request.json();

    if (!entityId) {
      return NextResponse.json(
        { error: "Entity ID is required" },
        { status: 400 }
      );
    }

    console.log("Making insights request to Qloo for entity:", entityId);

    const response = await fetch(`${QLOO_API_BASE}/insights/${entityId}`, {
      method: "GET",
      headers: {
        "X-API-Key": QLOO_API_KEY,
        Accept: "application/json",
      },
    });

    console.log("Qloo Insights response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Qloo Insights API error:", response.status, errorText);
      throw new Error(
        `Qloo Insights API error: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Qloo Insights response received:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Insights API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to get insights",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
