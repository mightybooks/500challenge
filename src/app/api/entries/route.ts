// File: src/app/api/entries/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // /editor 페이지에서 보내는 payload 기준: { title, body }
    const title = (body.title ?? "").toString().trim();
    const text = (body.body ?? "").toString().trim();

    if (!title || !text) {
      return NextResponse.json(
        { error: "EMPTY_FIELDS" },
        { status: 400 }
      );
    }

    // UTF-8 바이트 계산
    const encoder = new TextEncoder();
    const byteLength = encoder.encode(text).length;

    // anon_id 쿠키 읽기 (ensureAnonId가 브라우저에서 먼저 심어준다고 가정)
    const anonId = cookies().get("anon_id")?.value ?? null;

    // Supabase INSERT
    const { data, error } = await supabaseAdmin
      .from("entries")
      .insert({
        // ⚠️ 컬럼명은 실제 스키마에 맞게 수정
        title,          // entries.title
        body: text,     // entries.body (content 등으로 되어 있으면 거기에 맞게 변경)
        anon_id: anonId,
        byte_length: byteLength,
      })
      .select()
      .single();

    if (error) {
      console.error("INSERT_ENTRY_ERROR", error);
      return NextResponse.json(
        { error: "INSERT_FAILED" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { record: data },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/entries error", err);
    return NextResponse.json(
      { error: "UNKNOWN" },
      { status: 500 }
    );
  }
}
