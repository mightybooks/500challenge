export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const res = await fetch(
      "https://surimstudio.com/api/archive/500-fiction",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const text = await res.text();
    
    if (!res.ok) {
      return NextResponse.json(
        { error: text || "Surim API error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
  return NextResponse.json(
    { error: "Proxy error" },
    { status: 500 }
  );
 }
}
