// src/lib/db.ts
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type EntryRow = {
  id: string;
  title: string | null;
  body: string | null;
  score: number | null;
  total_score?: number | null;
  tags: string[] | null;
  reasons: string[] | null;
  created_at: string | null;
  byte_count: number | null;
};

export async function getEntryById(rawId: string): Promise<EntryRow | null> {
  // id가 숫자형(pk int/bigint)일 가능성과
  // 문자열(uuid/text)일 가능성을 모두 고려
  const numId = Number(rawId);
  const isNumericId = Number.isFinite(numId);

  let query = supabaseAdmin
    .from("entries")
    .select(
      `
      id,
      title,
      body,
      score,
      total_score,
      tags,
      reasons,
      created_at,
      byte_count
    `
    );

  if (isNumericId) {
    query = query.eq("id", numId);
  } else {
    query = query.eq("id", rawId);
  }

  const { data, error } = await query.single();

  if (error) {
    console.error("getEntryById error:", error);
    return null;
  }

  return data as EntryRow;
}
