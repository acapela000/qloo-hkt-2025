import { NextResponse } from "next/server";

export async function GET() {
  const qlooKey = process.env.QLOO_API_KEY;

  if (!qlooKey) {
    return NextResponse.json({ error: "No QLOO_API_KEY found" });
  }

  // Try different request formats
  const formats = [
    {
      name: "filter + type (singular)",
      body: {
        filter: {
          geo: {
            resolve_to: "locality",
            localities: ["New York"],
          },
          type: ["restaurant"],
          limit: 3,
        },
      },
    },
    {
      name: "filter + types (plural)",
      body: {
        filter: {
          geo: {
            resolve_to: "locality",
            localities: ["New York"],
          },
          types: ["restaurant"],
          limit: 3,
        },
      },
    },
    {
      name: "filters + type",
      body: {
        filters: {
          geo: {
            resolve_to: "locality",
            localities: ["New York"],
          },
          type: ["restaurant"],
          limit: 3,
        },
      },
    },
    {
      name: "Simple geo + type",
      body: {
        filter: {
          geo: "New York",
          type: "restaurant",
          limit: 3,
        },
      },
    },
  ];

  const results = [];

  for (const format of formats) {
    try {
      console.log(`Testing format: ${format.name}`);

      const response = await fetch("https://hackathon.api.qloo.com/insights", {
        method: "POST",
        headers: {
          "X-API-Key": qlooKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(format.body),
      });

      const responseText = await response.text();

      results.push({
        format: format.name,
        status: response.status,
        ok: response.ok,
        request: format.body,
        response: responseText.substring(0, 300),
        requestId: response.headers.get("x-qloo-request-id"),
      });

      if (response.ok) {
        console.log(`✅ SUCCESS: ${format.name}`);
      } else {
        console.log(`❌ FAILED: ${format.name} - ${response.status}`);
      }
    } catch (error) {
      results.push({
        format: format.name,
        error: error instanceof Error ? error.message : "Unknown error",
        request: format.body,
      });
    }
  }

  return NextResponse.json({ results });
}
