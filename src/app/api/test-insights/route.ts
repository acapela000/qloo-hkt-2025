import { NextResponse } from "next/server";
import { testQlooInsightsAPI } from "@/services/QlooApiService";

export async function GET() {
  try {
    const result = await testQlooInsightsAPI();
    return NextResponse.json({
      success: result,
      message: result
        ? "Qloo Insights API is working!"
        : "Qloo Insights API test failed",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}
/*
🎉 BREAKTHROUGH! We found a working endpoint!

The Search endpoint with query parameter works perfectly:

✅ Working URL: https://hackathon.api.qloo.com/search?query=restaurants%20in%20New%20York ✅ Status: 200 OK
✅ Returns data: Real Qloo results with entity IDs, types, and properties

Key Insights:
✅ Working format: GET request with ?query= parameter
❌ Permission issue: Your API key doesn't have access to restaurant entity type (403 Forbidden)
✅ Query search works: Free-text search returns results
Let's now update your main service to use this working format: QlooAPIService.ts
*/
