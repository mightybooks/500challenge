// File: src/app/api/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createServerSupabase } from "@/lib/supabaseClient";

const DAILY_LIMIT_ENABLED = process.env.NEXT_PUBLIC_DAILY_LIMIT === "true";

// ================================
// 타입 정의
// ================================

type SurimEval = {
  // 미학 45점 (각 항목 0~5)
  firstSentence: number;   // 0~5
  freeze: number;          // 0~5
  space: number;           // 0~5
  linger: number;          // 0~5
  bleak: number;           // 0~5
  detour: number;          // 0~5
  microRecovery: number;   // 0~5
  rhythm: number;          // 0~5
  microParticles: number;  // 0~5

  // 서사 구조 (최대 45점 = base 0/10/20 + 구조 0~25)
  narrativeCompression: number; // 0~10
  narrativeTurn: number;        // 0~8
  narrativeClutter: number;     // 0~4
  narrativeRhythm: number;      // 0~3
  narrativeScore: number;       // 0~45 (base + 구조)

  // 창의성·OG 10점
  layer: number;           // 0~4
  world: number;           // 0~3
  theme: number;           // 0~3
  creativityScore: number; // 0~10

  // 총점 0~100
  totalScore: number;
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

function getKstYmdDevSafe() {
  const base = getKstYmd();

  if (process.env.NODE_ENV !== "production") {
    return `${base}-${Date.now()}`; 
  }

  return base;
}

// ================================
// 1) 서사 구조 heuristic (v2.1)
// ================================

function splitSentences(body: string): string[] {
  return body
    .split(/[\n\r]+|(?<=[\.!?…])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function tokenizeKo(body: string): string[] {
  // 아주 거친 토크나이즈: 공백 기준 + 기호 제거
  return body
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean)
    .map((w) =>
      w
        .replace(/[0-9\p{P}\p{S}]+/gu, "")
        .toLowerCase()
        .trim(),
    )
    .filter((w) => w.length > 0);
}

function evaluateNarrativeStructure(body: string) {
  const sentences = splitSentences(body);
  const sentenceCount = sentences.length;

  const tokens = tokenizeKo(body);
  const tokenCount = tokens.length;
  const uniqueTokens = new Set(tokens);
  const diversity = tokenCount > 0 ? uniqueTokens.size / tokenCount : 0;

  // 사건 힌트 단어들 (손으로 고른 몇 개)
  const eventVerbs = [
    "터졌",
    "터진",
    "열렸",
    "닫혔",
    "죽었",
    "죽는",
    "살아났",
    "살아난",
    "만났",
    "마주쳤",
    "사라졌",
    "사라진",
    "나갔",
    "들어왔",
    "떨어졌",
    "부서졌",
    "울었",
    "웃었",
    "뛰었",
    "왔다",
    "갔다",
    "흘렀",
    "흘러",
    "흘렀다",
  ];
  const hasEvent = eventVerbs.some((v) => body.includes(v));

  // -----------------------------
  // (1) 압축도: narrativeCompression (0~10)
  // -----------------------------
  let compressionBase = 0;
  if (sentenceCount === 0) {
    compressionBase = 0;
  } else if (sentenceCount === 1) {
    compressionBase = 4;
  } else if (sentenceCount >= 2 && sentenceCount <= 4) {
    compressionBase = 8;
  } else if (sentenceCount >= 5 && sentenceCount <= 7) {
    compressionBase = 6;
  } else {
    compressionBase = 3;
  }

  let narrativeCompression = compressionBase;
  if (tokenCount < 5 || diversity < 0.5) {
    // 의미 밀도가 너무 낮으면 0점
    narrativeCompression = 0;
  }
  if (narrativeCompression > 10) narrativeCompression = 10;

  // -----------------------------
  // (2) 전환: narrativeTurn (0~8)
  // -----------------------------
  const transitionWords = [
    "하지만",
    "그러나",
    "그런데",
    "다만",
    "그래서",
    "반면",
    "그러고는",
    "그러자",
    "그래도",
    "그러니까",
  ];

  let transitionHits = 0;
  for (const w of transitionWords) {
    const parts = body.split(w);
    if (parts.length > 1) {
      transitionHits += parts.length - 1;
    }
  }

  let narrativeTurn = 0;
  if (hasEvent) {
    if (transitionHits === 0) {
      narrativeTurn = 0;
    } else if (transitionHits === 1) {
      narrativeTurn = 3;
    } else if (transitionHits === 2) {
      narrativeTurn = 5;
    } else if (transitionHits === 3) {
      narrativeTurn = 6;
    } else {
      // 전환어가 과도하게 많으면 오히려 0점 처리
      narrativeTurn = 0;
    }

    // 첫 문장 / 마지막 문장 길이 차이로 구조적 전환 보너스
    if (sentenceCount > 1 && narrativeTurn > 0) {
      const firstLen = sentences[0].length;
      const lastLen = sentences[sentences.length - 1].length;
      const diff = Math.abs(firstLen - lastLen);
      if (diff >= 20) {
        narrativeTurn = Math.min(8, narrativeTurn + 1);
      }
    }
  } else {
    // 사건이 아예 없으면 전환 점수 의미 없음
    narrativeTurn = 0;
  }

  // -----------------------------
  // (3) 군더더기: narrativeClutter (0~4)
  // -----------------------------
  let narrativeClutter = 4;

  // 같은 단어 반복이 많으면 군더더기 증가 → 점수 감소
  if (tokenCount > 0) {
    const counts: Record<string, number> = {};
    for (const t of tokens) {
      counts[t] = (counts[t] || 0) + 1;
    }
    const repeated = Object.values(counts).filter((n) => n >= 3).length;
    if (repeated >= 2) {
      narrativeClutter -= 2;
    } else if (repeated === 1) {
      narrativeClutter -= 1;
    }
  }

  // 너무 긴 문장이 많으면 군더더기 취급
  const longSentences = sentences.filter((s) => s.length > 120).length;
  if (longSentences >= 2) {
    narrativeClutter -= 2;
  } else if (longSentences === 1) {
    narrativeClutter -= 1;
  }

  // 부사 과다
  const adverbs = ["정말", "매우", "갑자기", "사실", "마침", "살짝"];
  if (adverbs.some((w) => body.includes(w))) {
    narrativeClutter -= 1;
  }

  if (narrativeClutter < 0) narrativeClutter = 0;
  if (narrativeClutter > 4) narrativeClutter = 4;

  // -----------------------------
  // (4) 리듬: narrativeRhythm (0~3)
  // -----------------------------
  let narrativeRhythm = 2;

  if (sentenceCount <= 1) {
    narrativeRhythm = 1;
  } else {
    const lens = sentences.map((s) => s.length);
    const avg = lens.reduce((a, b) => a + b, 0) / lens.length;
    const variance =
      lens.reduce((sum, len) => sum + (len - avg) ** 2, 0) / lens.length;
    const std = Math.sqrt(variance);

    if (std >= 10 && std <= 60) {
      narrativeRhythm = 3; // 적당한 변주
    } else if (std < 5 || std > 80) {
      narrativeRhythm = 1; // 너무 균질하거나 난장판
    } else {
      narrativeRhythm = 2;
    }
  }

  // -----------------------------
  // 구조 합산 (0~25), 사건 없으면 상한 8
  // -----------------------------
  let structureScore =
    narrativeCompression + narrativeTurn + narrativeClutter + narrativeRhythm;

  if (!hasEvent && structureScore > 8) {
    structureScore = 8;
  }

  if (structureScore < 0) structureScore = 0;
  if (structureScore > 25) structureScore = 25;

  return {
    narrativeCompression,
    narrativeTurn,
    narrativeClutter,
    narrativeRhythm,
    structureScore,
  };
}

// ================================
// 2) Fallback heuristic (키 없거나 GPT 실패)
// ================================

function fallbackEvaluate(body: string): EvalResult {
  const byteCount = new TextEncoder().encode(body).length;

  // 미학 0~5 대충 분배 (길이에 따른 대략값)
  const lengthRatio = Math.min(1, byteCount / 1250);
  const base = Math.round(2 + lengthRatio * 2); // 2~4 근처
  const clamp5 = (n: number) => Math.max(0, Math.min(5, n));

  const firstSentence = clamp5(base);
  const freeze = clamp5(base + 1);
  const space = clamp5(base);
  const linger = clamp5(base);
  const bleak = clamp5(base - 1);
  const detour = clamp5(base);
  const microRecovery = clamp5(base - 1);
  const rhythm = clamp5(base);
  const microParticles = clamp5(base);

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

  // 서사 구조 휴리스틱
  const {
    narrativeCompression,
    narrativeTurn,
    narrativeClutter,
    narrativeRhythm,
    structureScore,
  } = evaluateNarrativeStructure(body);

  // 바이트 기반 베이스
  const narrativeBase =
    byteCount < 700 ? 0 : byteCount <= 1149 ? 10 : 20;

  const narrativeScore = narrativeBase + structureScore;

  // OG / 창의성 대충 (0~10)
  const layer = 3;
  const world = 3;
  const theme = 2;
  const creativityScore = Math.min(10, layer + world + theme);

  const totalScoreRaw = aestheticTotal + narrativeScore + creativityScore;
  const totalScore = Math.max(0, Math.min(100, totalScoreRaw));

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
1) 문수림 미학 45점
2) 창의성·OG 10점
체계로 정량 평가합니다.

각 항목의 최대치는 다음과 같습니다.

[미학 점수: 45점 만점]
- firstSentence: 0~5          (첫 문장 흡입력)
- freeze: 0~5                 (정지)
- space: 0~5                  (공간화)
- linger: 0~5                 (여운)
- bleak: 0~5                  (암담 인식)
- detour: 0~5                 (우회)
- microRecovery: 0~5          (미세 회복)
- rhythm: 0~5                 (문장·리듬)
- microParticles: 0~5         (정서적 미립자)

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

  // 미학 45점 (각 0~5)
  const firstSentence = toScore(parsed.firstSentence, 0, 5);
  const freeze = toScore(parsed.freeze, 0, 5);
  const space = toScore(parsed.space, 0, 5);
  const linger = toScore(parsed.linger, 0, 5);
  const bleak = toScore(parsed.bleak, 0, 5);
  const detour = toScore(parsed.detour, 0, 5);
  const microRecovery = toScore(parsed.microRecovery, 0, 5);
  const rhythm = toScore(parsed.rhythm, 0, 5);
  const microParticles = toScore(parsed.microParticles, 0, 5);

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

  // 창의성 10점
  const layer = toScore(parsed.layer, 0, 4);
  const world = toScore(parsed.world, 0, 3);
  const theme = toScore(parsed.theme, 0, 3);
  const creativityScore = Math.min(10, layer + world + theme);

  // 서사 구조 25점 휴리스틱
  const {
    narrativeCompression,
    narrativeTurn,
    narrativeClutter,
    narrativeRhythm,
    structureScore,
  } = evaluateNarrativeStructure(body);

  // 바이트 기반 베이스 (0 / 10 / 20)
  const narrativeBase =
    byteCount < 700 ? 0 : byteCount <= 1149 ? 10 : 20;

  const narrativeScore = narrativeBase + structureScore;

  // 총점 (0~100)
  let totalScore = aestheticTotal + narrativeScore + creativityScore;
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
    const { title, body, mode } = await req.json();

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

    const IS_PROD = process.env.NODE_ENV === "production";

    // 한국 시간(Asia/Seoul) 기준 "YYYY-MM-DD" 문자열 반환 (로컬 전용 복붙 버전)
  function getKstYmdLocal(): string {
    const now = new Date();
    const kstString = now.toLocaleString("en-US", { timeZone: "Asia/Seoul" });
    const kst = new Date(kstString);
    return kst.toISOString().slice(0, 10); // "2025-11-21"
  }

   // anon_id 쿠키
    const anonCookie = cookies().get("anon_id");
    const anonId = anonCookie?.value ?? null;

    // ✅ 오늘 날짜(KST 기준) – 프로덕션에서만 사용
    const submitYmd =
  IS_PROD && DAILY_LIMIT_ENABLED ? getKstYmdLocal() : null;


    // ✅ 하루 1회 선 체크 (프로덕션 + anon_id + submit_ymd 있을 때만)
    if (IS_PROD && DAILY_LIMIT_ENABLED && anonId && submitYmd) {
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

    console.log("DAILY_LIMIT_ENABLED:", DAILY_LIMIT_ENABLED);

    // 평가 수행 (문수림 미학 기반 v2.1)
    const evalRes = await evaluate(title, body);
    const ev = evalRes.surimEval;

    // insert payload
    const payload: Record<string, any> = {
      title: title || "제목 없음",
      body,
      score: evalRes.score,       // 총점
      total_score: ev.totalScore, // total_score 컬럼

      mode: mode === "essay" ? "essay" : "novel",

      // 미학 45점 (0~5)
      first_sentence: ev.firstSentence,
      freeze: ev.freeze,
      space: ev.space,
      linger: ev.linger,
      bleak: ev.bleak,
      detour: ev.detour,
      micro_recovery: ev.microRecovery,
      rhythm: ev.rhythm,
      micro_particles: ev.microParticles,

      // 서사 구조 점수
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

      // 🔮 아르카나/OG 관련 컬럼은 이후 별도 API에서 update 예정
      // arcana_id: null,
      // arcana_code: null,
      // og_image: null,
    };

    if (IS_PROD && submitYmd) {
      payload.submit_ymd = submitYmd;
    }

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
      console.error("insert error", error);
      return NextResponse.json(
        { error: "INSERT_FAILED" },
        { status: 500 },
      );
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
