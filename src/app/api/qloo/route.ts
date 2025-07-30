import { NextRequest, NextResponse } from "next/server";

const QLOO_API_KEY = process.env.QLOO_API_KEY;
// Use the hackathon-specific URL that was working in your tests
const QLOO_BASE_URL = "https://hackathon.api.qloo.com";

export async function GET() {
  console.log("API Key check:", {
    hasKey: !!QLOO_API_KEY,
    keyLength: QLOO_API_KEY?.length || 0,
    keyStart: QLOO_API_KEY?.substring(0, 8) + "..." || "undefined",
  });

  return NextResponse.json({
    status: "Qloo API route is ready",
    hasApiKey: !!QLOO_API_KEY,
    keyStatus: QLOO_API_KEY ? "configured" : "missing",
    baseUrl: QLOO_BASE_URL,
  });
}

export async function POST(request: NextRequest) {
  console.log("=== Qloo API Route Debug ===");
  console.log("Environment API Key:", {
    exists: !!QLOO_API_KEY,
    length: QLOO_API_KEY?.length || 0,
    preview: QLOO_API_KEY ? `${QLOO_API_KEY.substring(0, 10)}...` : "undefined",
  });

  if (!QLOO_API_KEY) {
    console.error("❌ No QLOO_API_KEY found in environment variables");
    return NextResponse.json(
      {
        error: "Qloo API key not configured",
        debug: "Check your .env.local file and restart the server",
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    console.log("📨 Request body:", body);

    const { destination, preferences, options } = body;

    if (!destination) {
      return NextResponse.json(
        { error: "Destination is required" },
        { status: 400 }
      );
    }

    // Use the working search endpoint that was successful in your tests
    const searchQuery = `${
      preferences || ""
    } places to visit in ${destination}`.trim();
    const searchUrl = `${QLOO_BASE_URL}/search?query=${encodeURIComponent(
      searchQuery
    )}&limit=${options?.limit || 20}`;

    console.log("🚀 Sending to Qloo Search API:", {
      url: searchUrl,
      method: "GET",
      hasAuth: true,
    });

    // Use the X-API-Key format that worked in your tests
    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        "X-API-Key": QLOO_API_KEY,
        Accept: "application/json",
      },
    });

    console.log("📡 Qloo API Response:", {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Qloo API Error Response:", errorText);

      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = { message: errorText };
      }

      return NextResponse.json(
        {
          error: `Qloo API error: ${response.status}`,
          details: errorDetails,
          debug: {
            status: response.status,
            statusText: response.statusText,
            hasApiKey: !!QLOO_API_KEY,
            apiKeyFormat: QLOO_API_KEY
              ? `${QLOO_API_KEY.substring(0, 8)}...`
              : "missing",
            endpoint: searchUrl,
            suggestion: "Using hackathon search endpoint with X-API-Key",
          },
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ Qloo API Success:", {
      dataKeys: Object.keys(data),
      resultCount: data.results?.length || 0,
      sampleResult: data.results?.[0]
        ? {
            entity_id: data.results[0].entity_id,
            name: data.results[0].name,
            types: data.results[0].types,
          }
        : null,
    });

    // Transform the search results to match your expected format
    const transformedData = {
      results:
        data.results?.map((item: any, index: number) => ({
          id: item.entity_id || `qloo-${Date.now()}-${index}`,
          name: item.name || "Unknown Place",
          type: item.types?.[0]?.replace("urn:tag:", "") || "General",
          description:
            item.summary || `Discover this popular spot in ${destination}`,
          image:
            item.image_url ||
            "https://via.placeholder.com/300x200/e2e8f0/64748b?text=Travel+Spot",
          rating: item.popularity ? (item.popularity * 5).toFixed(1) : "4.0",
          address: `${destination}`,
          tags: item.tags || ["Travel", "Popular"],
          metadata: item,
        })) || [],
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("💥 API Route Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch recommendations",
        details: error instanceof Error ? error.message : "Unknown error",
        debug: {
          hasApiKey: !!QLOO_API_KEY,
          errorType:
            error instanceof Error ? error.constructor.name : "Unknown",
        },
      },
      { status: 500 }
    );
  }
}
