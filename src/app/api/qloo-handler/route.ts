import { NextApiRequest, NextApiResponse } from "next";

const QLOO_API_BASE = "https://hackathon.api.qloo.com";
const QLOO_API_KEY = process.env.QLOO_API_KEY; // Server-side only, secure

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query, limit = 20 } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  if (!QLOO_API_KEY) {
    console.error("QLOO_API_KEY is not set in environment variables");
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    console.log("🔍 Server-side Qloo API call:", { query, limit });

    const searchUrl = `${QLOO_API_BASE}/search?query=${encodeURIComponent(
      query
    )}&limit=${limit}`;

    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        "X-API-Key": QLOO_API_KEY,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Qloo API error:", response.status, errorText);
      return res.status(response.status).json({
        error: "Qloo API error",
        details: errorText,
      });
    }

    const data = await response.json();
    console.log("✅ Qloo API success:", data.results?.length || 0, "results");

    return res.status(200).json(data);
  } catch (error) {
    console.error("❌ Server error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
