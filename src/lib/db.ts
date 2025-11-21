// File: src/lib/db.ts
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type EntryRow = {
  id: string;
  title: string | null;
  body: string | null;

  // 점수
  score: number | null;          // 예전 점수
  total_score: number | null;    // 문수림 100점 체계

  // OG / 공유 카드
  og_image: string | null;
  og_creature: string | null;
  og_color: string | null;

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
  const { data, error } = await supabaseAdmin
    .from("entries")
    .select(`
      id,
      title,
      body,

      score,
      total_score,

      og_image,
      og_creature,
      og_color,

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
      byte_count
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("getEntryById error:", error);
    return null;
  }

  return data as EntryRow;
}
