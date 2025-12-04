// File: src/app/api/my/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const DEFAULT_LIMIT = 100;

export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  try {
    // 1) anon_id 쿠키로 "개인별 구분" 유지
    const anon = cookies().get("anon_id")?.value;

    // anon_id가 없으면 기록도 없음
    if (!anon) {
      return NextResponse.json({ records: [] }, { status: 200 });
    }

    // 2) limit 파라미터 (없으면 100으로)
    const limitParam = Number(
      req.nextUrl.searchParams.get("limit") ?? String(DEFAULT_LIMIT),
    );

    const limit =
      Number.isFinite(limitParam) && limitParam > 0 && limitParam <= 500
        ? limitParam
        : DEFAULT_LIMIT;

    // 3) 최신 순으로, 해당 anon_id 것만 가져오기
    const { data, error } = await supabaseAdmin
      .from("entries")
      .select(
        `
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
      `,
      )
      .eq("anon_id", anon)
      .order("created_at", { ascending: false }) // 최신 먼저
      .limit(limit);

    if (error) throw error;

    const records = (data ?? []).map(e => ({
      id: String(e.id),
      title: e.title ?? null,
      score: e.score ?? null,
      tags: e.tags ?? [],
      created_at: e.created_at,
      og_image: e.og_image ?? null,
      score_band: null,
      byte_count: e.byte_count ?? null,
    }));

    return NextResponse.json({ records }, { status: 200 });
  } catch (err) {
    console.error("/api/my ERROR", err);
    return NextResponse.json({ records: [] }, { status: 500 });
  }
}
