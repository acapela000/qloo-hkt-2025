// filepath: /d:/Projects/qloo-hkt-2025/src/app/api/test-qloo-get/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const qlooKey = process.env.QLOO_API_KEY;

  if (!qlooKey) {
    return NextResponse.json({ error: "No QLOO_API_KEY found" });
  }

  // Try GET requests with URL parameters
  const tests = [
    {
      name: "Search - GET with query param",
      url: "https://hackathon.api.qloo.com/search?query=restaurants%20in%20New%20York",
    },
    {
      name: "Search - GET with filter params",
      url: "https://hackathon.api.qloo.com/search?filter.geo=New%20York&filter.type=restaurant",
    },
    {
      name: "Search - GET with filter.localities",
      url: "https://hackathon.api.qloo.com/search?filter.geo.localities=New%20York&filter.type=restaurant",
    },
    {
      name: "Insights - GET with filter params",
      url: "https://hackathon.api.qloo.com/v2/insights?filter.geo=New%20York&filter.type=restaurant",
    },
    {
      name: "Search - Multiple filter params",
      url: "https://hackathon.api.qloo.com/search?filter.geo=New%20York&filter.type=restaurant&limit=5",
    },
    {
      name: "Entities - GET with query",
      url: "https://hackathon.api.qloo.com/entities?query=restaurants&geo=New%20York",
    },
  ];

  const results = [];

  for (const test of tests) {
    try {
      console.log(`Testing ${test.name}...`);
      console.log("URL:", test.url);

      const response = await fetch(test.url, {
        method: "GET",
        headers: {
          "X-API-Key": qlooKey,
          Accept: "application/json",
        },
      });

      const responseText = await response.text();

      console.log(`${test.name} - Status:`, response.status);
      if (response.ok) {
        console.log(`✅ SUCCESS: ${test.name}`);
        console.log("Response:", responseText.substring(0, 500));
      } else {
        console.log(
          `❌ FAILED: ${test.name} - ${responseText.substring(0, 150)}`
        );
      }

      results.push({
        name: test.name,
        url: test.url,
        status: response.status,
        ok: response.ok,
        response: responseText.substring(0, 300),
        requestId: response.headers.get("x-qloo-request-id"),
      });

      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Error testing ${test.name}:`, error);
      results.push({
        name: test.name,
        url: test.url,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return NextResponse.json({
    results,
    summary: {
      totalTested: tests.length,
      successful: results.filter((r) => r.ok).length,
      workingUrls: results
        .filter((r) => r.ok)
        .map((r) => ({ name: r.name, url: r.url })),
    },
  });
}
