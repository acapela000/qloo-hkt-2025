import { NextResponse } from "next/server";

// export async function GET() {
//   const qlooKey = process.env.QLOO_API_KEY;

//   if (!qlooKey) {
//     return NextResponse.json({ error: "No QLOO_API_KEY found" });
//   }

//   // Try different endpoints and formats
//   const tests = [
//     {
//       name: "Search endpoint - simple query",
//       endpoint: "https://hackathon.api.qloo.com/search",
//       body: {
//         query: "restaurants in New York",
//       },
//     },
//     {
//       name: "Search endpoint - with filter",
//       endpoint: "https://hackathon.api.qloo.com/search",
//       body: {
//         filter: {
//           geo: "New York",
//           type: "restaurant",
//         },
//       },
//     },
//     {
//       name: "Search endpoint - with filter.geo",
//       endpoint: "https://hackathon.api.qloo.com/search",
//       body: {
//         "filter.geo": "New York",
//         "filter.type": "restaurant",
//       },
//     },
//     {
//       name: "Insights - with filter.geo parameter",
//       endpoint: "https://hackathon.api.qloo.com/v2/insights",
//       body: {
//         "filter.geo": "New York",
//         "filter.type": "restaurant",
//       },
//     },
//     {
//       name: "Insights - URL parameters style",
//       endpoint: "https://hackathon.api.qloo.com/v2/insights",
//       body: {
//         geo: "New York",
//         type: "restaurant",
//       },
//     },
//     {
//       name: "Entities endpoint",
//       endpoint: "https://hackathon.api.qloo.com/entities",
//       body: {
//         query: "restaurants",
//         geo: "New York",
//       },
//     },
//   ];

//   const results = [];

//   for (const test of tests) {
//     try {
//       console.log(`Testing ${test.name}...`);
//       console.log("Endpoint:", test.endpoint);
//       console.log("Request:", JSON.stringify(test.body, null, 2));

//       const response = await fetch(test.endpoint, {
//         method: "POST",
//         headers: {
//           "X-API-Key": qlooKey,
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         body: JSON.stringify(test.body),
//       });

//       const responseText = await response.text();

//       console.log(`${test.name} - Status:`, response.status);
//       if (response.ok) {
//         console.log(`✅ SUCCESS: ${test.name}`);
//         console.log("Response:", responseText);
//       } else {
//         console.log(
//           `❌ FAILED: ${test.name} - ${responseText.substring(0, 150)}`
//         );
//       }

//       results.push({
//         name: test.name,
//         endpoint: test.endpoint,
//         status: response.status,
//         ok: response.ok,
//         request: test.body,
//         response: responseText.substring(0, 300),
//         requestId: response.headers.get("x-qloo-request-id"),
//       });

//       // If we find a working format, don't break - test all to see what works
//       await new Promise((resolve) => setTimeout(resolve, 200));
//     } catch (error) {
//       console.error(`Error testing ${test.name}:`, error);
//       results.push({
//         name: test.name,
//         endpoint: test.endpoint,
//         error: error instanceof Error ? error.message : "Unknown error",
//         request: test.body,
//       });
//     }
//   }

//   return NextResponse.json({
//     results,
//     summary: {
//       totalTested: tests.length,
//       successful: results.filter((r) => r.ok).length,
//       workingEndpoints: results
//         .filter((r) => r.ok)
//         .map((r) => ({ name: r.name, endpoint: r.endpoint })),
//     },
//   });
// }

/**
 Excellent! Now I can see the exact error messages. The /search endpoint is giving us a very specific clue:

"Missing required request parameters: either [query] or a valid filter. parameter"*

This suggests we need to use parameters like filter.geo, filter.type, etc. but as URL query parameters, not in the JSON body!

Let's try using GET requests with query parameters instead of POST requests:
 */

export async function GET() {
  const qlooKey = process.env.QLOO_API_KEY;

  if (!qlooKey) {
    return NextResponse.json({ error: "No QLOO_API_KEY found" });
  }

  // Try GET requests with URL parameters
  const tests = [
    {
      name: "Search - GET with query param",
      url: "https://hackathon.api.qloo.com/search?query=restaurants in New York",
    },
    {
      name: "Search - GET with filter params",
      url: "https://hackathon.api.qloo.com/search?filter.geo=New York&filter.type=restaurant",
    },
    {
      name: "Search - GET with filter.localities",
      url: "https://hackathon.api.qloo.com/search?filter.geo.localities=New York&filter.type=restaurant",
    },
    {
      name: "Insights - GET with filter params",
      url: "https://hackathon.api.qloo.com/v2/insights?filter.geo=New York&filter.type=restaurant",
    },
    {
      name: "Search - Multiple filter params",
      url: "https://hackathon.api.qloo.com/search?filter.geo=New York&filter.type=restaurant&limit=5",
    },
    {
      name: "Entities - GET with query",
      url: "https://hackathon.api.qloo.com/entities?query=restaurants&geo=New York",
    },
  ];

  const results = [];

  for (const test of tests) {
    try {
      console.log(`Testing ${test.name}...`);
      console.log("URL:", test.url);

      const response = await fetch(test.url, {
        method: "GET", // Changed to GET
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
