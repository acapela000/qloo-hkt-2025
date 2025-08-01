import { NextResponse } from "next/server";

export async function GET() {
  const qlooKey = process.env.QLOO_API_KEY;

  if (!qlooKey) {
    return NextResponse.json({ error: "No QLOO_API_KEY found" });
  }

  // Try multiple formats based on Qloo documentation
  const testFormats = [
    {
      name: "Format 1: Simple geo string",
      body: {
        filter: {
          geo: "New York",
          type: "restaurant",
        },
      },
    },
    {
      name: "Format 2: With country parameter",
      body: {
        filter: {
          geo: {
            localities: ["New York"],
          },
          type: "restaurant",
          country: "US",
        },
      },
    },
    {
      name: "Format 3: Without filter wrapper",
      body: {
        geo: {
          localities: ["New York"],
        },
        type: "restaurant",
      },
    },
    {
      name: "Format 4: Basic search format",
      body: {
        filter: {
          geo: {
            resolve_to: "locality",
            localities: ["New York, NY"],
          },
          type: "restaurant",
        },
      },
    },
    {
      name: "Format 5: Entity type array",
      body: {
        filter: {
          geo: {
            localities: ["New York"],
          },
          types: ["restaurant"],
        },
      },
    },
    {
      name: "Format 6: Simple with limit",
      body: {
        filter: {
          geo: "New York",
          type: "restaurant",
          limit: 5,
        },
      },
    },
  ];

  const results = [];

  for (const format of testFormats) {
    try {
      console.log(`Testing ${format.name}...`);
      console.log("Request:", JSON.stringify(format.body, null, 2));

      const response = await fetch(
        "https://hackathon.api.qloo.com/v2/insights",
        {
          method: "POST",
          headers: {
            "X-API-Key": qlooKey,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(format.body),
        }
      );

      const responseText = await response.text();

      console.log(`${format.name} - Status:`, response.status);
      if (response.ok) {
        console.log(`✅ SUCCESS: ${format.name}`);
      } else {
        console.log(
          `❌ FAILED: ${format.name} - ${responseText.substring(0, 100)}`
        );
      }

      results.push({
        format: format.name,
        status: response.status,
        ok: response.ok,
        request: format.body,
        response: responseText.substring(0, 200),
        requestId: response.headers.get("x-qloo-request-id"),
      });

      // If we find a working format, break
      if (response.ok) {
        break;
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error testing ${format.name}:`, error);
      results.push({
        format: format.name,
        error: error instanceof Error ? error.message : "Unknown error",
        request: format.body,
      });
    }
  }

  return NextResponse.json({
    results,
    summary: {
      totalTested: testFormats.length,
      successful: results.filter((r) => r.ok).length,
      workingFormats: results.filter((r) => r.ok).map((r) => r.format),
    },
  });
}

/**
Great! This is very helpful. I can see different error messages which gives us clues:

"No path matching request parameters" - Most formats
"filter.type is required" - Format 5 (when using types array)
Deprecation warning - "The type parameter is deprecated, please update your query with filter.type"
This suggests the hackathon API might be expecting different parameters entirely. Looking at the Qloo documentation you shared, let me try a different approach based on the search endpoint instead of insights:
  
 */
