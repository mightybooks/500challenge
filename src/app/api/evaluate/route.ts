// File: src/app/api/evaluate/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function heuristic(body: string) {
  const bytes = new TextEncoder().encode(body).length;
  const lenScore = Math.max(0, Math.min(100, Math.round((bytes / 500) * 100)));
  const punct = (body.match(/[.!?…]/g) || []).length;
  const lines = (body.match(/\n/g) || []).length;
  const digits = /\d/.test(body) ? 5 : 0;
  const proper = /[A-Z가-힣][a-z가-힣]{1,}/.test(body) ? 5 : 0;
  const score = Math.max(0, Math.min(100, Math.round(0.6 * lenScore + 3 * punct + 2 * lines + digits + proper)));
  const tags = [bytes > 480 ? "밀도" : "여백", punct >= 2 ? "리듬" : "평면", lines >= 1 ? "장면전환" : "단문"].slice(0, 3);
  const reasons = [
    `바이트 ${bytes}/500`,
    punct >= 2 ? "문장부호가 리듬 형성" : "문장부호 다양성 낮음",
    lines >= 1 ? "줄바꿈으로 장면 전환 시도" : "한 덩어리 문장",
  ];
  return { score, tags, reasons, byteCount: bytes };
}

export async function POST(req: Request) {
  try {
    const { title, body } = await req.json();
    if (typeof body !== "string" || body.trim().length === 0) {
      return NextResponse.json({ error: "본문이 비어 있습니다." }, { status: 400 });
    }
    const byteCount = new TextEncoder().encode(body).length;

    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return NextResponse.json(heuristic(body));
    }

    const system = `너는 500바이트 이내 초단편을 평가하는 편집자다. 다음 본문을 0~100점으로 채점하고, 2~4개의 요약 태그와 2~3줄의 간단한 사유를 한국어로 제공하라. 점수는 너무 박하지도, 후하지도 않게 균형적으로.`;
    const user = `제목: ${title ?? "(제목 없음)"}\n본문:\n${body}\n\n요구 형식(JSON): {"score": number, "tags": string[], "reasons": string[], "byteCount": number}`;

    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.4,
      }),
    });

    if (!resp.ok) {
      return NextResponse.json(heuristic(body));
    }

    const data = await resp.json();
    const text = data?.output_text || data?.choices?.[0]?.message?.content || data?.content?.[0]?.text;
    if (!text) return NextResponse.json(heuristic(body));

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json({
        score: Number(parsed.score) || heuristic(body).score,
        tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 4) : heuristic(body).tags,
        reasons: Array.isArray(parsed.reasons) ? parsed.reasons.slice(0, 3) : heuristic(body).reasons,
        byteCount,
      });
    } catch {
      return NextResponse.json(heuristic(body));
    }
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}