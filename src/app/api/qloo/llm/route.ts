import { NextRequest, NextResponse } from "next/server";

const QLOO_API_BASE = "https://hackathon.api.qloo.com";
const QLOO_API_KEY = process.env.QLOO_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!QLOO_API_KEY) {
      console.error("QLOO_API_KEY is not configured");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const { query, context } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    console.log("Making LLM request to Qloo:", { query, context });

    const response = await fetch(`${QLOO_API_BASE}/llm`, {
      method: "POST",
      headers: {
        "X-API-Key": QLOO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        context: context || "",
        max_results: 10,
      }),
    });

    console.log("Qloo LLM response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Qloo LLM API error:", response.status, errorText);
      throw new Error(`Qloo LLM API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Qloo LLM response received:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("LLM API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to get LLM recommendations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
