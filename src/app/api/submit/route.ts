// File: src/app/api/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createServerSupabase } from "@/lib/supabaseClient";
import { getOgCardDetail } from "@/lib/og500";

// ================================
// 타입 정의
// ================================

type SurimEval = {
  // 미학 68점
  firstSentence: number;   // 0~8
  freeze: number;          // 0~10
  space: number;           // 0~10
  linger: number;          // 0~10
  bleak: number;           // 0~6
  detour: number;          // 0~8
  microRecovery: number;   // 0~6
  rhythm: number;          // 0~4
  microParticles: number;  // 0~6

  // 서사 22점(휴리스틱)
  narrativeCompression: number; // 0~8
  narrativeTurn: number;        // 0~6
  narrativeClutter: number;     // 0~4
  narrativeRhythm: number;      // 0~4
  narrativeScore: number;       // 0~22

  // 창의성·OG 10점
  layer: number;           // 0~4
  world: number;           // 0~3
  theme: number;           // 0~3
  creativityScore: number; // 0~10

  // 총점
  totalScore: number;      // 0~100
};

type EvalResult = {
  score: number;        // 총점 0~100
  tags: string[];
  reasons: string[];
  byteCount: number;
  surimEval: SurimEval;
};

// 안전한 숫자 변환 + 클램프
function toScore(raw: any, min: number, max: number): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, Math.round(n)));
}

// ================================
// 1) 서사 구조 heuristic (22점)
// ================================
function evaluateNarrativeStructure(body: string) {
  const sentences = body
    .split(/(?<=[\.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const sentenceCount = sentences.length;
  const words = body.split(/\s+/).filter(Boolean);

  // (1) 구조 압축도 (8)
  let structureCompression = 0;
  if (sentenceCount >= 3 && sentenceCount <= 7) structureCompression = 8;
  else if (sentenceCount === 2 || sentenceCount === 8) structureCompression = 5;
  else if (sentenceCount === 1 || sentenceCount >= 9) structureCompression = 3;
  else structureCompression = 4;

  // (2) 전환점 (6)
  const transitionWords = [
    "하지만",
    "그러나",
    "그런데",
    "다만",
    "그래서",
    "반면",
    "그러고는",
  ];
  let transitionScore = 0;

  if (transitionWords.some((w) => body.includes(w))) transitionScore += 2;

  if (sentenceCount > 1) {
    const lengths = sentences.map((s) => s.length);
    const diff = Math.abs(lengths[0] - lengths[lengths.length - 1]);
    if (diff >= 15) transitionScore += 2;
  }

  if (sentenceCount > 1) {
    const starts = sentences.map((s) => s.split(/\s+/)[0] || "");
    const unique = new Set(starts);
    if (unique.size >= 2) transitionScore += 2;
  }

  if (transitionScore > 6) transitionScore = 6;

  // (3) 군더더기 (4)
  let clutterBase = 4;
  const repeated = words.filter((w, i, arr) => arr.indexOf(w) !== i);
  if (repeated.length > 3) clutterBase -= 1;

  const adverbs = ["정말", "매우", "갑자기", "사실", "마침", "살짝"];
  if (adverbs.some((w) => body.includes(w))) clutterBase -= 1;

  const longSentences = sentences.filter((s) => s.length > 80).length;
  if (longSentences >= 2) clutterBase -= 1;
  if (clutterBase < 0) clutterBase = 0;

  // (4) 리듬 패턴 (4)
  let rhythmScore = 4;
  if (sentenceCount >= 2) {
    const lens = sentences.map((s) => s.length);
    const avg = lens.reduce((a, b) => a + b, 0) / lens.length;

    const variance =
      lens.reduce((sum, len) => sum + (len - avg) ** 2, 0) / lens.length;
    const std = Math.sqrt(variance);

    if (std > 40) rhythmScore -= 1;

    const startWords = sentences.map((s) => s.split(/\s+/)[0] || "");
    const count: Record<string, number> = {};
    startWords.forEach((w) => (count[w] = (count[w] || 0) + 1));
    if (Object.values(count).some((n) => n >= 3)) rhythmScore -= 1;
  }

  if (rhythmScore < 0) rhythmScore = 0;

  const total =
    structureCompression + transitionScore + clutterBase + rhythmScore;

  return {
    structureCompression,
    transitionScore,
    clutterBase,
    rhythmScore,
    total,
  };
}

// ================================
// 2) Fallback heuristic (키 없거나 GPT 실패)
// ================================
function fallbackEvaluate(body: string): EvalResult {
  const byteCount = new TextEncoder().encode(body).length;

  // 길이 기반 대충 점수
  const lenScore = Math.max(
    0,
    Math.min(68, Math.round((byteCount / 1250) * 68)),
  );

  const punctuation = (body.match(/[.!?…]/g) || []).length;
  const hasLine = /\n/.test(body) ? 1 : 0;

  const {
    structureCompression,
    transitionScore,
    clutterBase,
    rhythmScore,
    total: narrativeTotal,
  } = evaluateNarrativeStructure(body);

  // 미학 68점 대충 분배
  const firstSentence = Math.min(8, Math.round(lenScore * 0.1));
  const freeze = Math.min(10, Math.round(lenScore * 0.15));
  const space = Math.min(10, Math.round(lenScore * 0.12));
  const linger = Math.min(10, Math.round(lenScore * 0.12));
  const bleak = Math.min(6, punctuation >= 2 ? 4 : 2);
  const detour = Math.min(8, hasLine ? 5 : 3);
  const microRecovery = Math.min(6, 3);
  const rhythm = Math.min(4, punctuation >= 2 ? 3 : 2);
  const microParticles = Math.min(6, 3);

  const aestheticTotal =
    firstSentence +
    freeze +
    space +
    linger +
    bleak +
    detour +
    microRecovery +
    rhythm +
    microParticles;

  // OG 10점 대충
  const layer = 3;
  const world = 3;
  const theme = 2;
  const creativityScore = Math.min(10, layer + world + theme);

  const totalScore = Math.max(
    0,
    Math.min(100, aestheticTotal + narrativeTotal + creativityScore),
  );

  const surimEval: SurimEval = {
    firstSentence,
    freeze,
    space,
    linger,
    bleak,
    detour,
    microRecovery,
    rhythm,
    microParticles,
    narrativeCompression: structureCompression,
    narrativeTurn: transitionScore,
    narrativeClutter: clutterBase,
    narrativeRhythm: rhythmScore,
    narrativeScore: narrativeTotal,
    layer,
    world,
    theme,
    creativityScore,
    totalScore,
  };

  const tags = ["fallback", "기계평가"];
  const reasons = [
    "OPENAI API 키 부재 또는 분석 실패로 휴리스틱 평가를 사용했습니다.",
  ];

  return {
    score: totalScore,
    tags,
    reasons,
    byteCount,
    surimEval,
  };
}

// ================================
// 3) GPT 기반 평가 (chat.completions + JSON)
// ================================
async function evaluateWithGPT(
  title: string,
  body: string,
  key: string,
): Promise<EvalResult> {
  const byteCount = new TextEncoder().encode(body).length;

  const system = `
당신은 '수림봇'입니다.
입력된 500~1250바이트 한글 초단편을
1) 문수림 미학 68점
2) 창의성·OG 10점
체계로 정량 평가합니다.

각 항목의 최대치는 다음과 같습니다.

[미학 점수: 68점 만점]
- firstSentence: 0~8          (첫 문장 흡입력)
- freeze: 0~10                (정지)
- space: 0~10                 (공간화)
- linger: 0~10                (여운)
- bleak: 0~6                  (암담 인식)
- detour: 0~8                 (우회)
- microRecovery: 0~6          (미세 회복)
- rhythm: 0~4                 (문장·리듬)
- microParticles: 0~6         (정서적 미립자)

[창의성·OG 점수: 10점 만점]
- layer: 0~4                  (의미 단층)
- world: 0~3                  (세계관 매칭력)
- theme: 0~3                  (주제적 선명도)

주의:
- 각 항목은 지정된 범위 안의 정수.
- 반드시 JSON 객체로만 답합니다. 설명 문장 금지.
`;

  const user =
    `제목: ${title || "(제목 없음)"}\n본문:\n${body}\n\n` +
    `위 글에 대해 다음 형식의 JSON으로만 출력하세요:\n` +
    `{\n` +
    `  "firstSentence": number,\n` +
    `  "freeze": number,\n` +
    `  "space": number,\n` +
    `  "linger": number,\n` +
    `  "bleak": number,\n` +
    `  "detour": number,\n` +
    `  "microRecovery": number,\n` +
    `  "rhythm": number,\n` +
    `  "microParticles": number,\n` +
    `  "layer": number,\n` +
    `  "world": number,\n` +
    `  "theme": number,\n` +
    `  "totalScore": number,\n` +
    `  "tags": string[],\n` +
    `  "reasons": string[]\n` +
    `}`;

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    }),
  });

  if (!resp.ok) {
    throw new Error("OpenAI 응답 오류");
  }

  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    throw new Error("OpenAI 응답 구조 오류");
  }

  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("JSON 파싱 실패");
  }

  // 미학 68 + OG 10 파싱
  const firstSentence = toScore(parsed.firstSentence, 0, 8);
  const freeze = toScore(parsed.freeze, 0, 10);
  const space = toScore(parsed.space, 0, 10);
  const linger = toScore(parsed.linger, 0, 10);
  const bleak = toScore(parsed.bleak, 0, 6);
  const detour = toScore(parsed.detour, 0, 8);
  const microRecovery = toScore(parsed.microRecovery, 0, 6);
  const rhythm = toScore(parsed.rhythm, 0, 4);
  const microParticles = toScore(parsed.microParticles, 0, 6);

  const layer = toScore(parsed.layer, 0, 4);
  const world = toScore(parsed.world, 0, 3);
  const theme = toScore(parsed.theme, 0, 3);

  const og10 = Math.min(10, layer + world + theme);

  const aestheticTotal =
    firstSentence +
    freeze +
    space +
    linger +
    bleak +
    detour +
    microRecovery +
    rhythm +
    microParticles;

  // 서사 구조 22점은 휴리스틱으로
  const {
    structureCompression,
    transitionScore,
    clutterBase,
    rhythmScore,
    total: narrativeTotal,
  } = evaluateNarrativeStructure(body);

  // 총점
  let totalScore = aestheticTotal + narrativeTotal + og10;
  totalScore = Math.max(0, Math.min(100, totalScore));

  const tags: string[] = Array.isArray(parsed.tags)
    ? parsed.tags.map(String).slice(0, 5)
    : [];
  const reasons: string[] = Array.isArray(parsed.reasons)
    ? parsed.reasons.map(String).slice(0, 3)
    : [];

  if (!tags.includes("수림봇")) tags.push("수림봇");

  const surimEval: SurimEval = {
    firstSentence,
    freeze,
    space,
    linger,
    bleak,
    detour,
    microRecovery,
    rhythm,
    microParticles,
    narrativeCompression: structureCompression,
    narrativeTurn: transitionScore,
    narrativeClutter: clutterBase,
    narrativeRhythm: rhythmScore,
    narrativeScore: narrativeTotal,
    layer,
    world,
    theme,
    creativityScore: og10,
    totalScore,
  };

  return {
    score: totalScore,
    tags,
    reasons,
    byteCount,
    surimEval,
  };
}

// ================================
// 4) 평가 엔트리 포인트 (키 유무 판단)
// ================================
async function evaluate(title: string, body: string): Promise<EvalResult> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return fallbackEvaluate(body);
  }

  try {
    return await evaluateWithGPT(title, body, key);
  } catch (err) {
    console.error("evaluateWithGPT 실패, fallback으로 전환:", err);
    return fallbackEvaluate(body);
  }
}

// ================================
// 5) 날짜 유틸 (KST 기준)
// ================================
function getKstYmd(): string {
  const now = new Date();
  const kstString = now.toLocaleString("en-US", { timeZone: "Asia/Seoul" });
  const kst = new Date(kstString);
  return kst.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

// ================================
// 6) MAIN: POST /api/submit
// ================================
export async function POST(req: NextRequest) {
  try {
    const { title, body } = await req.json();

    if (typeof title !== "string" || typeof body !== "string" || !body.trim()) {
      return NextResponse.json({ error: "잘못된 입력" }, { status: 400 });
    }

    // Supabase 환경변수 체크
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        {
          error:
            "서버 환경변수 누락(NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY)",
        },
        { status: 500 },
      );
    }

    // 로그인 사용자 정보
    const supabase = createServerSupabase();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user ?? null;

    // anon_id 쿠키
    const anonCookie = cookies().get("anon_id");
    const anonId = anonCookie?.value ?? null;

    // ✅ 오늘 날짜(KST 기준)
    const submitYmd = getKstYmd();

    // ✅ 하루 1회 선 체크 (anon_id가 있는 경우에만)
    if (anonId) {
      const { data: existing, error: checkError } = await supabaseAdmin
        .from("entries")
        .select("id")
        .eq("anon_id", anonId)
        .eq("submit_ymd", submitYmd)
        .limit(1)
        .maybeSingle();

      if (checkError) {
        console.error("daily-check error", checkError);
        return NextResponse.json(
          {
            error:
              "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
          },
          { status: 500 },
        );
      }

      if (existing) {
        return NextResponse.json(
          { error: "오늘은 이미 제출하셨습니다." },
          { status: 429 },
        );
      }
    }

    // 평가 수행 (문수림 미학 기반)
    const evalRes = await evaluate(title, body);
    const ev = evalRes.surimEval;

    // insert payload
    const payload: Record<string, any> = {
      title,
      body,
      score: evalRes.score,       // 기존 점수(총점)
      total_score: ev.totalScore, // total_score 컬럼

      submit_ymd: submitYmd,      // ✅ 오늘 날짜 (KST 기준)

      // 미학 68점
      first_sentence: ev.firstSentence,
      freeze: ev.freeze,
      space: ev.space,
      linger: ev.linger,
      bleak: ev.bleak,
      detour: ev.detour,
      micro_recovery: ev.microRecovery,
      rhythm: ev.rhythm,
      micro_particles: ev.microParticles,

      // 서사 22점
      narrative_compression: ev.narrativeCompression,
      narrative_turn: ev.narrativeTurn,
      narrative_clutter: ev.narrativeClutter,
      narrative_rhythm: ev.narrativeRhythm,
      narrative_score: ev.narrativeScore,

      // 창의성·OG 10점
      layer_score: ev.layer,
      world_score: ev.world,
      theme_score: ev.theme,
      creativity_score: ev.creativityScore,

      tags: evalRes.tags,
      reasons: evalRes.reasons,
      byte_count: evalRes.byteCount,
      
    };

    // 🔽🔽🔽 여기서 OG 이미지 경로 생성 후 payload에 주입 🔽🔽🔽
   // OG 세부 정보 생성
    const og = getOgCardDetail({
    totalScore: ev.totalScore ?? null,
    aesthetic: {
      freeze: ev.freeze,
      space: ev.space,
      linger: ev.linger,
      microParticles: ev.microParticles,
      bleak: ev.bleak,
      rhythm: ev.rhythm,
      narrativeTurn: ev.narrativeTurn,
      aggroToArt: (ev as any).aggroToArt ?? 0,
    },
    entryId: null, // 글 생성 시점이라 없음
  });

  // payload에 기록
  payload.og_image = og.path;
  payload.og_creature = og.creature;
  payload.og_color = og.color;

  // 제목 처리 (GPT가 title 반환 안 함)
  payload.title = title || "제목 없음";

    if (anonId) {
      payload.anon_id = anonId;
    }
    if (user) {
      payload.user_id = user.id;
    }

    const { data, error } = await supabaseAdmin
      .from("entries")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      if ((error as any).code === "23505") {
        // 하루 1회 제한 위반 (anon_id + 날짜 중복)
        return NextResponse.json(
          { error: "오늘은 이미 제출하셨습니다." },
          { status: 429 },
        );
      }

    console.error("insert error", error);
    return NextResponse.json({ error: "INSERT_FAILED" }, { status: 500 });
  }

    // 클라이언트에는 기존 형태 유지
    return NextResponse.json({
      id: data.id,
      title,
      eval: {
        title,
        score: evalRes.score,
        tags: evalRes.tags,
        reasons: evalRes.reasons,
        byteCount: evalRes.byteCount,
      },
    });
  } catch (err) {
    console.error("SUBMIT_HANDLER_ERROR", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
