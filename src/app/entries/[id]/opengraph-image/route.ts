// File: src/app/entries/[id]/opengraph-image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import path from "path";
import fs from "fs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const entryId = params.id;

  if (!entryId) {
    return NextResponse.json(
      { error: "entry id가 없습니다." },
      { status: 400 },
    );
  }

  try {
    // 1) 엔트리에서 og_image 경로 조회
    const { data: entry, error } = await supabaseAdmin
      .from("entries")
      .select("og_image")
      .eq("id", entryId)
      .maybeSingle();

    if (error) {
      console.error("opengraph-image: entry fetch error", error);
      return NextResponse.json(
        { error: "엔트리 조회 중 오류가 발생했습니다." },
        { status: 500 },
      );
    }

    // 2) 카드 선택 전이면 기본 카드(0번)로
    const ogPath =
      entry?.og_image && typeof entry.og_image === "string"
        ? entry.og_image
        : "/og/arcana/ogdefault.png";

    // 3) public 디렉토리의 실제 파일 경로로 변환
    const safeRel = ogPath.replace(/^\/+/, ""); // "/..." → "..."
    const filePath = path.join(process.cwd(), "public", safeRel);

    // 4) PNG 파일 읽어서 그대로 응답
    const fileBuffer = await fs.promises.readFile(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        // OG 카드는 바뀔 일이 거의 없으니 강캐싱
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("opengraph-image: file read error", err);
    return new NextResponse("OG image not found", { status: 404 });
  }
}
