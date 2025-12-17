// File: src/app/api/entry-arcana/route.ts

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  ARCANA_META,
  getArcanaImagePath,
  type ArcanaId,
} from "@/lib/arcana/og";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { entryId, arcanaId, arcanaCode, arcanaKoName } = body ?? {};

    // 1) 기본 파라미터 체크
    if (!entryId || typeof entryId !== "string") {
      console.error("entry-arcana: invalid entryId", entryId);
      return NextResponse.json(
        { error: "entryId가 없습니다." },
        { status: 400 },
      );
    }

    if (typeof arcanaId !== "number") {
      console.error("entry-arcana: invalid arcanaId", arcanaId);
      return NextResponse.json(
        { error: "arcanaId가 유효하지 않습니다." },
        { status: 400 },
      );
    }

    const card = ARCANA_META.find(c => c.id === (arcanaId as ArcanaId));
    if (!card) {
      console.error("entry-arcana: card not found for id", arcanaId);
      return NextResponse.json(
        { error: "해당 아르카나 카드를 찾을 수 없습니다." },
        { status: 400 },
      );
    }

    // 2) OG 경로 및 라벨 결정
    const ogPath = getArcanaImagePath(card.id);
    const codeFromMeta = card.code;
    const finalLabel = arcanaKoName || card.krTitle;

    const updatePayload: Record<string, any> = {
      og_image: ogPath,
      arcana_id: card.id,
      arcana_code: codeFromMeta,
      arcana_label: finalLabel,
    };

    console.log("ARCANA API DEBUG /update start", {
      entryId,
      updatePayload,
    });

    // 3) DB UPDATE + 결과 바로 확인
    const { data, error } = await supabaseAdmin
      .from("entries")
      .update(updatePayload)
      .eq("id", entryId)
      .select("id, arcana_id, arcana_code, arcana_label, og_image")
      .single();

    if (error) {
      console.error("entry-arcana: update error", error);
      return NextResponse.json(
        { error: "아르카나 정보를 저장하는 중 오류가 발생했습니다." },
        { status: 500 },
      );
    }

    console.log("ARCANA API DEBUG /updated row", data);

    const { data: checkRow, error: checkErr } = await supabaseAdmin
      .from("entries")
      .select("id, arcana_id, arcana_code, arcana_label, og_image")
      .eq("id", entryId)
      .single();

    console.log("ARCANA API DEBUG /recheck row", { checkRow, checkErr });

    // 4) 프론트에 최종 값 반환
    return NextResponse.json({
      ok: true,
      entryId: data.id,
      arcana_id: data.arcana_id,
      arcana_code: data.arcana_code,
      arcana_label: data.arcana_label,
      og_image: data.og_image,
    });
  } catch (err) {
    console.error("entry-arcana: unhandled error", err);
    return NextResponse.json(
      { error: "요청 처리 중 알 수 없는 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
