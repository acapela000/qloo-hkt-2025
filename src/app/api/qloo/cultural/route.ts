import { NextRequest, NextResponse } from "next/server";

const QLOO_API_KEY = process.env.QLOO_API_KEY;
const QLOO_BASE_URL = "https://api.qloo.com/v1";

export async function POST(request: NextRequest) {
  if (!QLOO_API_KEY) {
    return NextResponse.json(
      { error: "Qloo API key not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { destination, culturalContext, userTasteProfile } = body;

    // Use Qloo's taste analysis API for cultural recommendations
    const qlooRequest = {
      input: {
        context: {
          domain: "travel",
          location: destination,
          cultural_context: culturalContext,
          ...(userTasteProfile && { taste_profile: userTasteProfile }),
        },
      },
      filters: {
        limit: 15,
        cultural_relevance_threshold: 0.7,
      },
      options: {
        explainability: true,
        include_cultural_context: true,
        prioritize_cultural_fit: true,
      },
    };

    console.log(
      "Cultural recommendations request:",
      JSON.stringify(qlooRequest, null, 2)
    );

    const response = await fetch(`${QLOO_BASE_URL}/taste-analysis`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${QLOO_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(qlooRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Qloo Cultural API Error:", errorText);
      return NextResponse.json(
        { error: `Cultural API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Cultural recommendations response:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Cultural API Route Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cultural recommendations" },
      { status: 500 }
    );
  }
}
