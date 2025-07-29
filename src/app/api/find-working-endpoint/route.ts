import { NextResponse } from "next/server";

export async function GET() {
  const qlooKey = process.env.QLOO_API_KEY;

  if (!qlooKey) {
    return NextResponse.json({ error: "No QLOO_API_KEY found" });
  }

  // Test ALL possible endpoints to find the one that gave 400 error
  const endpoints = [
    "https://hackathon.api.qloo.com/insights",
    "https://hackathon.api.qloo.com/v1/insights",
    "https://hackathon.api.qloo.com/v2/insights",
    "https://hackathon.api.qloo.com/recommend",
    "https://hackathon.api.qloo.com/v1/recommend",
    "https://hackathon.api.qloo.com/v2/recommend",
    "https://hackathon.api.qloo.com/recommendations",
    "https://hackathon.api.qloo.com/search",
    "https://hackathon.api.qloo.com/places",
  ];

  const testRequest = {
    filters: {
      geo: {
        resolve_to: "locality",
        localities: ["New York"],
      },
      types: ["restaurant"],
      limit: 3,
    },
  };

  const results = [];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "X-API-Key": qlooKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(testRequest),
      });

      const responseText = await response.text();

      results.push({
        endpoint,
        status: response.status,
        ok: response.ok,
        responsePreview: responseText.substring(0, 200),
        isTarget400:
          response.status === 400 && responseText.includes("filter.type"),
      });
    } catch (error) {
      results.push({
        endpoint,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    // Add small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return NextResponse.json({
    results,
    summary: {
      target400Endpoints: results
        .filter((r) => r.isTarget400)
        .map((r) => r.endpoint),
      successfulEndpoints: results.filter((r) => r.ok).map((r) => r.endpoint),
    },
  });
}

/* 
The working endpoint is: https://hackathon.api.qloo.com/v2/insights

It gave us the 400 error with "filter.type is required" which means:

✅ The endpoint exists and works
✅ Your API key is valid
❌ We just need to fix the request format

*/
