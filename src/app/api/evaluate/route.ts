// File: src/app/api/evaluate/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_BYTES = 1250;

// ===============================
// 타입 정의 (문수림 미학 점수)
// ===============================
export type SurimEval = {
  firstSentence: number;
  freeze: number;
  space: number;
  linger: number;
  bleak: number;
  detour: number;
  microRecovery: number;
  rhythm: number;
  microParticles: number;

  narrativeCompression: number;
  narrativeTurn: number;
  narrativeClutter: number;
  narrativeRhythm: number;
  narrativeScore: number;

  layer: number;
  world: number;
  theme: number;
  creativityScore: number;

  totalScore: number;
};

// 안전 숫자
function clamp(num: any, min: number, max: number): number {
  const n = Number(num);
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, Math.round(n)));
}

// ===============================
// 1) 서사 구조 heuristic
// ===============================
function evaluateNarrativeStructure(body: string) {
  const sentences = body
    .split(/(?<=[\.!?…])\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  const sentenceCount = sentences.length;
  const words = body.split(/\s+/).filter(Boolean);

  // 구조 압축도
  let structureCompression = 4;
  if (sentenceCount >= 3 && sentenceCount <= 7) structureCompression = 8;
  else if (sentenceCount === 2 || sentenceCount === 8) structureCompression = 5;
  else if (sentenceCount === 1 || sentenceCount >= 9) structureCompression = 3;

  // 전환점
  const transitionWords = [
    "하지만", "그러나", "그런데", "다만", "그래서", "반면", "그러고는"
  ];
  let transitionScore = transitionWords.some(w => body.includes(w)) ? 2 : 0;

  if (sentenceCount > 1) {
    const lengths = sentences.map(s => s.length);
    const diff = Math.abs(lengths[0] - lengths[lengths.length - 1]);
    if (diff >= 15) transitionScore += 2;

    const starts = sentences.map(s => s.split(/\s+/)[0]);
    if (new Set(starts).size >= 2) transitionScore += 2;
  }
  transitionScore = Math.min(6, transitionScore);

  // 군더더기
  let clutterBase = 4;
  const repeated = words.filter((w, i, arr) => arr.indexOf(w) !== i);
  if (repeated.length > 3) clutterBase -= 1;
  if (["정말", "매우", "사실", "갑자기"].some(w => body.includes(w)))
    clutterBase -= 1;
  if (sentences.filter(s => s.length > 80).length >= 2) clutterBase -= 1;
  clutterBase = Math.max(0, clutterBase);

  // 리듬
  let rhythmScore = 4;
  if (sentenceCount >= 2) {
    const lens = sentences.map(s => s.length);
    const avg = lens.reduce((a, b) => a + b, 0) / lens.length;
    const variance =
      lens.reduce((sum, len) => sum + (len - avg) ** 2, 0) / lens.length;
    if (Math.sqrt(variance) > 40) rhythmScore -= 1;

    const count: Record<string, number> = {};
    sentences.map(s => s.split(/\s+/)[0]).forEach(w => {
      count[w] = (count[w] || 0) + 1;
    });
    if (Object.values(count).some(n => n >= 3)) rhythmScore -= 1;
  }
  rhythmScore = Math.max(0, rhythmScore);

  return {
    structureCompression,
    transitionScore,
    clutterBase,
    rhythmScore,
    total:
      structureCompression + transitionScore + clutterBase + rhythmScore,
  };
}

// ===============================
// 2) 휴리스틱 평가 (fallback)
// ===============================
function heuristicEval(title: string, body: string) {
  const bytes = new TextEncoder().encode(body).length;

  const firstSentence = clamp((bytes / MAX_BYTES) * 5, 1, 8);
  const freeze = clamp((bytes / MAX_BYTES) * 8, 1, 10);
  const space = clamp((body.match(/\n/g) || []).length * 2, 0, 10);
  const linger = clamp((body.match(/[.!?…]/g) || []).length * 2, 0, 10);
  const bleak = body.includes("죽") ? 4 : 2;
  const detour = body.includes("하지만") ? 6 : 3;
  const microRecovery = 3;
  const rhythm = clamp((body.match(/,/g) || []).length, 1, 4);
  const microParticles = 3;

  const narr = evaluateNarrativeStructure(body);

  const layer = 3, world = 3, theme = 3;
  const creativityScore = layer + world + theme;

  const aesthetic =
    firstSentence + freeze + space + linger + bleak + detour +
    microRecovery + rhythm + microParticles;

  const totalScore = clamp(aesthetic + narr.total + creativityScore, 0, 100);

  return {
    surim: {
      firstSentence,
      freeze,
      space,
      linger,
      bleak,
      detour,
      microRecovery,
      rhythm,
      microParticles,
      narrativeCompression: narr.structureCompression,
      narrativeTurn: narr.transitionScore,
      narrativeClutter: narr.clutterBase,
      narrativeRhythm: narr.rhythmScore,
      narrativeScore: narr.total,
      layer,
      world,
      theme,
      creativityScore,
      totalScore,
    },
    analysis: "OPENAI API 키 없음: 휴리스틱 평가 적용.",
  };
}

// ===============================
// 3) GPT 호출 (gpt-4.1-mini) — JSON Schema 강제
// ===============================
async function callOpenAI(title: string, body: string) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return heuristicEval(title, body);

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      temperature: 0.2,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "SurimEvalSchema",
          schema: {
            type: "object",
            properties: {
              firstSentence: { type: "number" },
              freeze: { type: "number" },
              space: { type: "number" },
              linger: { type: "number" },
              bleak: { type: "number" },
              detour: { type: "number" },
              microRecovery: { type: "number" },
              rhythm: { type: "number" },
              microParticles: { type: "number" },
              narrativeCompression: { type: "number" },
              narrativeTurn: { type: "number" },
              narrativeClutter: { type: "number" },
              narrativeRhythm: { type: "number" },
              layer: { type: "number" },
              world: { type: "number" },
              theme: { type: "number" },
              analysis: { type: "string" },
            },
            required: [
              "firstSentence",
              "freeze",
              "space",
              "linger",
              "bleak",
              "detour",
              "microRecovery",
              "rhythm",
              "microParticles",
              "narrativeCompression",
              "narrativeTurn",
              "narrativeClutter",
              "narrativeRhythm",
              "layer",
              "world",
              "theme",
              "analysis",
            ],
          },
          strict: true,
        },
      },
      messages: [
        {
          role: "system",
          content:
            "500~1250byte 초단편을 문수림 미학 기준으로 정량 평가하세요. 설명 없이 JSON만 반환.",
        },
        {
          role: "user",
          content: `제목: ${title}\n본문:\n${body}`,
        },
      ],
    }),
  });

  if (!resp.ok) return heuristicEval(title, body);

  let json;
  try {
    const out = await resp.json();
    json = JSON.parse(out.choices[0].message.content);
  } catch {
    return heuristicEval(title, body);
  }

  const narr = evaluateNarrativeStructure(body);

  // 점수 클램핑
  const firstSentence = clamp(json.firstSentence, 0, 8);
  const freeze = clamp(json.freeze, 0, 10);
  const space = clamp(json.space, 0, 10);
  const linger = clamp(json.linger, 0, 10);
  const bleak = clamp(json.bleak, 0, 6);
  const detour = clamp(json.detour, 0, 8);
  const microRecovery = clamp(json.microRecovery, 0, 6);
  const rhythm = clamp(json.rhythm, 0, 4);
  const microParticles = clamp(json.microParticles, 0, 6);

  const narrativeCompression = clamp(
    json.narrativeCompression ?? narr.structureCompression,
    0,
    8,
  );
  const narrativeTurn = clamp(json.narrativeTurn ?? narr.transitionScore, 0, 6);
  const narrativeClutter = clamp(json.narrativeClutter ?? narr.clutterBase, 0, 4);
  const narrativeRhythm = clamp(json.narrativeRhythm ?? narr.rhythmScore, 0, 4);

  const narrativeScore =
    narrativeCompression +
    narrativeTurn +
    narrativeClutter +
    narrativeRhythm;

  const layer = clamp(json.layer, 0, 4);
  const world = clamp(json.world, 0, 3);
  const theme = clamp(json.theme, 0, 3);
  const creativityScore = layer + world + theme;

  const aesthetic =
    firstSentence +
    freeze +
    space +
    linger +
    bleak +
    detour +
    microRecovery +
    rhythm +
    microParticles;

  const totalScore = clamp(aesthetic + narrativeScore + creativityScore, 0, 100);

  return {
    surim: {
      firstSentence,
      freeze,
      space,
      linger,
      bleak,
      detour,
      microRecovery,
      rhythm,
      microParticles,
      narrativeCompression,
      narrativeTurn,
      narrativeClutter,
      narrativeRhythm,
      narrativeScore,
      layer,
      world,
      theme,
      creativityScore,
      totalScore,
    },
    analysis: json.analysis || "문수림 미학 기준 평가.",
  };
}

// ===============================
// 4) MAIN ENDPOINT
// ===============================
export async function POST(req: NextRequest) {
  try {
    const { title, body } = await req.json();

    if (!body || typeof body !== "string") {
      return NextResponse.json(
        { error: "본문이 비어 있습니다." },
        { status: 400 }
      );
    }

    const safeTitle =
      typeof title === "string" && title.trim() ? title.trim() : "(제목 없음)";

    const byteCount = new TextEncoder().encode(body).length;

    const { surim, analysis } = await callOpenAI(safeTitle, body);

    const tags: string[] = [];
    if (surim.totalScore >= 85) tags.push("정교한서사");
    else if (surim.totalScore >= 70) tags.push("완성도높음");
    else if (surim.totalScore >= 50) tags.push("안정적실험");
    else tags.push("거친실험");

    if (surim.layer >= 3) tags.push("의미단층강함");
    if (surim.microParticles >= 4) tags.push("정서미립자");
    tags.push("수림봇");

    const reasons = [analysis];

    return NextResponse.json({
      title: safeTitle,
      byteCount,
      totalScore: surim.totalScore,
      surimEval: surim,
      tags,
      reasons,
    });
  } catch (e) {
    console.error("/api/evaluate ERROR", e);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
