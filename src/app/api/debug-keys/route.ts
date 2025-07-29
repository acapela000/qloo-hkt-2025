import { NextResponse } from "next/server";

export async function GET() {
  const qlooKey = process.env.QLOO_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  return NextResponse.json({
    qloo: {
      present: !!qlooKey,
      length: qlooKey?.length || 0,
      first10: qlooKey?.substring(0, 10) || "MISSING",
      last5: qlooKey?.substring(qlooKey.length - 5) || "MISSING",
      hasSpaces: qlooKey?.includes(" ") || false,
      hasQuotes: qlooKey?.includes('"') || qlooKey?.includes("'") || false,
    },
    openai: {
      present: !!openaiKey,
      length: openaiKey?.length || 0,
      first10: openaiKey?.substring(0, 10) || "MISSING",
    },
    env: process.env.NODE_ENV,
  });
}
