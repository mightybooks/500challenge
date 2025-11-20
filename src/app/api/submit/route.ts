// File: src/app/api/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createServerSupabase } from "@/lib/supabaseClient";

// 평가 로직 재사용 (키 없으면 휴리스틱)
async function evaluate(title: string, body: string) {
  const byteCount = new TextEncoder().encode(body).length;
  const key = process.env.OPENAI_API_KEY;

  if (!key) return heuristic(body);

  const system =
    `너는 500바이트 이내 초단편을 평가하는 편집자다. ` +
    `다음 본문을 0~100점으로 채점하고, 2~4개의 요약 태그와 2~3줄의 간단한 사유를 한국어로 제공하라.`;

  const user =
    `제목: ${title ?? "(제목 없음)"}\n본문:\n${body}\n\n` +
    `JSON: {"score": number, "tags": string[], "reasons": string[], "byteCount": number}`;

  try {
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

    const data = await resp.json();
    const text =
      data?.output_text ||
      data?.choices?.[0]?.message?.content ||
      data?.content?.[0]?.text;

    const parsed = JSON.parse(text);
    return {
      score: Number(parsed.score) || 0,
      tags: parsed.tags || [],
      reasons: parsed.reasons || [],
      byteCount,
    };
  } catch {
    return heuristic(body);
  }
}

function heuristic(body: string) {
  const bytes = new TextEncoder().encode(body).length;
  const lenScore = Math.max(0, Math.min(100, Math.round((bytes / 500) * 100)));
  const punct = (body.match(/[.!?…]/g) || []).length;
  const lines = (body.match(/\n/g) || []).length;
  const digits = /\d/.test(body) ? 5 : 0;
  const proper = /[A-Z가-힣][a-z가-힣]{1,}/.test(body) ? 5 : 0;
  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(0.6 * lenScore + 3 * punct + 2 * lines + digits + proper),
    ),
  );
  const tags = [
    bytes > 480 ? "밀도" : "여백",
    punct >= 2 ? "리듬" : "평면",
    lines >= 1 ? "장면전환" : "단문",
  ].slice(0, 3);
  const reasons = [
    `바이트 ${bytes}/500`,
    punct >= 2 ? "문장부호가 리듬 형성" : "문장부호 다양성 낮음",
    lines >= 1 ? "줄바꿈으로 장면 전환 시도" : "한 덩어리 문장",
  ];
  return { score, tags, reasons, byteCount: bytes };
}

function getClientIp(req: NextRequest) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return "127.0.0.1"; // 로컬 개발용 기본값
}

async function ipHash(ip: string) {
  const secret = process.env.IP_SALT || "salt";
  const data = new TextEncoder().encode(ip + secret);
  const buf = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(buf));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(req: NextRequest) {
  try {
    const { title, body } = await req.json();

    if (typeof title !== "string" || typeof body !== "string" || !body.trim()) {
      return NextResponse.json({ error: "잘못된 입력" }, { status: 400 });
    }

    // Supabase 환경변수 체크 (supabaseAdmin도 내부에서 한 번 체크하지만, 여기서도 방어)
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

    // 로그인 사용자 정보 가져오기
    const supabase = createServerSupabase();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user ?? null;

    // anon_id 쿠키 가져오기
    const anonCookie = cookies().get("anon_id");
    const anonId = anonCookie?.value ?? null;

    // 하루 1회 제한: ip_hash + ymd 유니크
    const ip = getClientIp(req);
    const hash = await ipHash(ip);

    // 평가 먼저 수행
    const evalRes = await evaluate(title, body);

    // insert payload 구성
    const payload: Record<string, any> = {
      title,
      body,
      score: evalRes.score,
      tags: evalRes.tags,
      reasons: evalRes.reasons,
      byte_count: evalRes.byteCount,
      ip_hash: hash,
      // ymd는 DB default가 있다면 생략 가능
    };

    if (anonId) {
      payload.anon_id = anonId;
    }
    if (user) {
      payload.user_id = user.id;
    }

    // 저장 시도 (id를 돌려받기 위해 select("id").single())
    const { data, error } = await supabaseAdmin
      .from("entries")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      // 중복(유니크 위반) 판단
      if (String(error.message).includes("entries_ip_date_unique")) {
        return NextResponse.json(
          { error: "오늘은 이미 제출하셨습니다." },
          { status: 429 },
        );
      }
      return NextResponse.json({ error: "DB 오류" }, { status: 500 });
    }

    return NextResponse.json({
      id: data.id,
      eval: evalRes,
    });
  } catch (err) {
    console.error("SUBMIT_HANDLER_ERROR", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
