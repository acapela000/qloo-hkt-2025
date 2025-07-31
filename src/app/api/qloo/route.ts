import { NextRequest, NextResponse } from "next/server";

const QLOO_API_BASE = "https://hackathon.api.qloo.com";
const QLOO_API_KEY = process.env.QLOO_API_KEY; // Server-side only, secure

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, limit = 0 } = body; // Changed default to 0 (no limit)

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    if (!QLOO_API_KEY) {
      console.error("QLOO_API_KEY is not set in environment variables");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    console.log("🔍 Server-side Qloo API call:", { query, limit });

    // Build URL without limit if it's 0, or with limit if specified
    let searchUrl = `${QLOO_API_BASE}/search?query=${encodeURIComponent(
      query
    )}`;
    if (limit > 0) {
      searchUrl += `&limit=${limit}`;
    }

    console.log("🔗 Qloo API URL:", searchUrl);

    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        "X-API-Key": QLOO_API_KEY,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Qloo API error:", response.status, errorText);
      return NextResponse.json(
        {
          error: "Qloo API error",
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ Qloo API success:", data.results?.length || 0, "results");
    console.log("🔍 First few results:", data.results?.slice(0, 3));

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Server error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET method for testing
export async function GET() {
  return NextResponse.json(
    { message: "Qloo API endpoint is working. Use POST to make queries." },
    { status: 200 }
  );
}
