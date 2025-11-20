// File: src/app/api/my/route.ts (리팩토링 버전)
import { NextRequest, NextResponse } from "next/server";
import { cookies as headerCookies } from "next/headers";
import { createServerSupabase } from "@/lib/supabaseClient";

// /api/my 응답에서 사용하는 타입
export type MyEntry = {
  id: string;
  title: string | null;
  score: number | null;
  tags: string[] | null;
  created_at: string;
  share_status: string[]; // 예: ["sns"]
};

export async function GET(req: NextRequest) {
  const supabase = createServerSupabase();

  // 로그인 사용자 정보 확인
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user ?? null;

  const limitParam = Number(req.nextUrl.searchParams.get("limit") ?? "30");
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 30;

  try {
    let rows: any[] = [];

    if (user) {
      // 로그인 사용자: user_id 기준 조회 (RLS 보호)
      const { data, error } = await supabase
        .from("entries")
        .select("id, title, score, tags, created_at, is_shareable")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      rows = data ?? [];
    } else {
      // 게스트: anon_id 쿠키 기반 조회 (뷰 또는 RPC 사용)
      const anon = headerCookies().get("anon_id")?.value;
      if (!anon) {
        return NextResponse.json({ records: [] }, { status: 200 });
      }

      const { data, error } = await supabase
        .from("entries_guest_view")
        .select("id, title, score, tags, created_at, is_shareable, anon_id")
        .eq("anon_id", anon)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      rows = data ?? [];
    }

    const records: MyEntry[] = rows.map(e => ({
      id: String(e.id),
      title: e.title ?? null,
      score: e.score ?? null,
      tags: e.tags ?? [],
      created_at: e.created_at,
      share_status: e.is_shareable ? ["sns"] : [],
    }));

    return NextResponse.json({ records }, { status: 200 });
  } catch (err: any) {
    console.error("/api/my ERROR", err);
    return NextResponse.json(
      { error: err?.message ?? "Unexpected error" },
      { status: 500 },
    );
  }
}
