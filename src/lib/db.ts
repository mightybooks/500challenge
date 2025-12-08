// File: src/lib/db.ts
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type EntryRow = {
  id: string;
  title: string | null;
  body: string | null;

  mode: "novel" | "essay" | null; // ← 이거 추가

  // 점수
  score: number | null;          // 예전 점수
  total_score: number | null;    // 문수림 100점 체계

  // OG / 공유 카드
  og_image: string | null;

  // 아르카나 정보
  arcana_id: number | null;
  arcana_code: string | null;
  arcana_label: string | null;

  // 미학 68점
  freeze: number | null;
  space: number | null;
  linger: number | null;
  micro_particles: number | null;
  bleak: number | null;
  rhythm: number | null;

  // 서사 22점
  narrative_turn: number | null;
  narrative_compression: number | null;
  narrative_clutter: number | null;
  narrative_rhythm: number | null;
  narrative_score: number | null;

  // OG 10점
  layer_score: number | null;
  world_score: number | null;
  theme_score: number | null;
  creativity_score: number | null;

  // 기타 메타
  tags: string[] | null;
  reasons: string[] | null;
  created_at: string | null;
  byte_count: number | null;
};

export async function getEntryById(id: string): Promise<EntryRow | null> {
  console.log("DB DEBUG getEntryById input:", id);

  const { data, error } = await supabaseAdmin
    .from("entries")
    .select(`
      id,
      title,
      body,
      score,
      total_score,
      og_image,
      arcana_id,
      arcana_code,
      arcana_label,
      freeze,
      space,
      linger,
      micro_particles,
      bleak,
      rhythm,
      narrative_turn,
      narrative_compression,
      narrative_clutter,
      narrative_rhythm,
      narrative_score,
      layer_score,
      world_score,
      theme_score,
      creativity_score,
      tags,
      reasons,
      created_at,
      byte_count,
      mode,
      anon_id
    `)
    .eq("id", id)
    .single();

  console.log("DB DEBUG getEntryById raw:", {
    id,
    data,
    error,
    arcana_id: data?.arcana_id ?? null,
    arcana_type: data ? typeof data.arcana_id : "no-data",
  });

  if (error) {
    console.error("getEntryById error:", error);
    return null;
  }

  if (!data) {
    console.warn("getEntryById: no data for id", id);
    return null;
  }

  // arcana_id를 한 번 더 숫자로 정규화 (문자열로 들어오는 경우 방지)
  const normalized: EntryRow = {
    ...(data as any),
    arcana_id:
      data.arcana_id === null || data.arcana_id === undefined
        ? null
        : Number(data.arcana_id),
  };

  console.log("DB DEBUG getEntryById normalized:", {
    id,
    arcana_id: normalized.arcana_id,
    arcana_type: typeof normalized.arcana_id,
  });

  return normalized;
}
