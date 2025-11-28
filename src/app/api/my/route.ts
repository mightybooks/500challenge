// File: src/app/api/my/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("entries")
      .select(`
        id,
        title,
        score,
        tags,
        created_at,
        og_image,
        arcana_id,
        arcana_code,
        arcana_label,
        byte_count
      `)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) throw error;

    // /my에서 요구하는 최소 필드로만 재조합
    const records = (data ?? []).map(e => ({
      id: String(e.id),
      title: e.title ?? null,
      score: e.score ?? null,
      tags: e.tags ?? [],
      created_at: e.created_at,
      og_image: e.og_image ?? null,
      score_band: null, // 기존 로직 그대로
      byte_count: e.byte_count ?? null,
    }));

    return NextResponse.json({ records }, { status: 200 });
  } catch (err) {
    console.error("/api/my ERROR", err);
    return NextResponse.json({ records: [] }, { status: 500 });
  }
}
