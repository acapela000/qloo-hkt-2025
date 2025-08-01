import { NextResponse } from "next/server";

export async function GET() {
  const qlooKey = process.env.QLOO_API_KEY;

  if (!qlooKey) {
    return NextResponse.json({ error: "No QLOO_API_KEY found in environment" });
  }

  try {
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

    console.log("Testing with API key:", qlooKey.substring(0, 10) + "...");
    console.log("Full key length:", qlooKey.length);
    console.log("Key starts with:", qlooKey.substring(0, 5));
    console.log("Key ends with:", qlooKey.substring(qlooKey.length - 5));

    const response = await fetch("https://hackathon.api.qloo.com/v2/insights", {
      method: "POST",
      headers: {
        "X-API-Key": qlooKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(testRequest),
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const responseText = await response.text();
    console.log("Response body:", responseText);

    return NextResponse.json({
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText,
      keyInfo: {
        length: qlooKey.length,
        first10: qlooKey.substring(0, 10),
        last5: qlooKey.substring(qlooKey.length - 5),
      },
    });
  } catch (error) {
    console.error("Test error:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
      keyPresent: !!qlooKey,
      keyLength: qlooKey?.length,
    });
  }
}
