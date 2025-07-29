import { NextResponse } from "next/server";

export async function GET() {
  const qlooKey = process.env.QLOO_API_KEY;

  console.log("=== Detailed Qloo Debug ===");
  console.log("API Key present:", !!qlooKey);
  console.log("API Key length:", qlooKey?.length);
  console.log("API Key first 10:", qlooKey?.substring(0, 10));

  if (!qlooKey) {
    return NextResponse.json({ error: "No QLOO_API_KEY found" });
  }

  // Test different endpoints and formats
  const tests = [
    {
      endpoint: "https://hackathon.api.qloo.com/v2/insights",
      body: {
        filter: {
          geo: "New York",
          type: "restaurant",
          limit: 3,
        },
      },
    },
    {
      endpoint: "https://hackathon.api.qloo.com/insights",
      body: {
        filter: {
          geo: "New York",
          type: "restaurant",
          limit: 3,
        },
      },
    },
    {
      endpoint: "https://hackathon.api.qloo.com/v2/insights",
      body: {
        geo: "New York",
        type: "restaurant",
        limit: 3,
      },
    },
  ];

  const results = [];

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.endpoint}`);
      console.log(`Body: ${JSON.stringify(test.body)}`);

      const response = await fetch(test.endpoint, {
        method: "POST",
        headers: {
          "X-API-Key": qlooKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(test.body),
      });

      const responseText = await response.text();

      console.log(`Status: ${response.status}`);
      console.log(`Response: ${responseText.substring(0, 200)}`);

      results.push({
        endpoint: test.endpoint,
        requestBody: test.body,
        status: response.status,
        ok: response.ok,
        responsePreview: responseText.substring(0, 300),
        headers: Object.fromEntries(response.headers.entries()),
        requestId: response.headers.get("x-qloo-request-id"),
      });
    } catch (error) {
      console.error(`Error testing ${test.endpoint}:`, error);
      results.push({
        endpoint: test.endpoint,
        requestBody: test.body,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    // Delay between requests
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return NextResponse.json({
    results,
    keyInfo: {
      present: !!qlooKey,
      length: qlooKey?.length,
      first10: qlooKey?.substring(0, 10),
    },
  });
}
