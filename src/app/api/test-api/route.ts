import { NextResponse } from "next/server";
import { testQlooAPI } from "@/services/QlooApiService";

// export async function GET() {
//   try {
//     const result = await testQlooAPI();
//     return NextResponse.json({ success: result });
//   } catch (error) {
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : "Unknown error" },
//       { status: 500 }
//     );
//   }
// }

export async function GET() {
  return NextResponse.json({
    message: "API is working",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      message: "POST is working",
      received: body,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid JSON",
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }
}
