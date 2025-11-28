// File: src/app/entries/[id]/page.tsx

export const dynamic = "force-dynamic";
export const revalidate = 0;

import type { Metadata } from "next";
import Link from "next/link";
import { getEntryById } from "@/lib/db";
import {
  ARCANA_META,
  ARCANA_BACK_IMAGE,
  getArcanaImagePath,
  type ArcanaId,
} from "@/lib/arcana/og";
import { EntryShareBar } from "@/components/EntryShareBar";
import { ArcanaSection } from "@/components/arcana/ArcanaSection";

type PageProps = {
  params: { id: string };
};

// ================================
// OG 메타데이터
// ================================
export async function generateMetadata(
  { params }: PageProps,
): Promise<Metadata> {
  const entry = await getEntryById(params.id);
  
  // 1차: 엔트리 자체를 먼저 확인
  console.log("ARCANA META ENTRY DEBUG:", params.id, entry);

  if (!entry) {
    return {
      title: "500자 소설",
      description: "내가 쓴 500자 소설을 기록하고 평가하는 서비스",
      openGraph: {
        title: "500자 소설",
        description: "내가 쓴 500자 소설을 기록하고 평가하는 서비스",
        images: [
          {
            url: ARCANA_BACK_IMAGE,
            width: 1200,
            height: 630,
          },
        ],
      },
    };
  }

  const t = entry.title || "500자 소설";

  const rawArcanaId = entry.arcana_id;
  const rawArcanaCode = entry.arcana_code;

   // 2차: 아르카나 값만 따로 찍어서 확인
  console.log("ARCANA DEBUG:", {
    id: entry.id,
    rawArcanaId,
    rawArcanaCode,
    arcanaIdType: typeof rawArcanaId,
  });

  const arcanaId: ArcanaId | null =
    rawArcanaId === null || rawArcanaId === undefined
      ? null
      : (Number(rawArcanaId) as ArcanaId);

  const arcanaMeta =
    (rawArcanaCode
      ? ARCANA_META.find(c => c.code === rawArcanaCode)
      : null) ??
    (arcanaId !== null
      ? ARCANA_META.find(c => c.id === arcanaId) ?? null
      : null);

  const ogImage =
    arcanaMeta
      ? getArcanaImagePath(arcanaMeta.id)
      : entry.og_image ?? ARCANA_BACK_IMAGE;

  return {
    title: `500자 소설 – ${t}`,
    description: "내가 직접 쓴 500자 소설, 점수와 함께 확인해보세요.",
    openGraph: {
      title: t,
      description: "내가 직접 쓴 500자 소설, 점수와 함께 확인해보세요.",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t,
      description: "내가 직접 쓴 500자 소설, 점수와 함께 확인해보세요.",
      images: [ogImage],
    },
  };
}

// ================================
// 결과 페이지 본문
// ================================
export default async function EntryPage({ params }: PageProps) {
  const entry = await getEntryById(params.id);

  // 404 대체 화면
  if (!entry) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">존재하지 않는 기록입니다.</p>
        </div>
      </main>
    );
  }

  // ---------- 기본 데이터 ----------
  const title: string = entry.title ?? "500자 소설";

  const totalScore: number | null =
    (entry.total_score as number | null) ??
    (entry.score as number | null) ??
    null;

  const tags: string[] = Array.isArray(entry.tags) ? entry.tags : [];
  const reasons: string[] = Array.isArray(entry.reasons) ? entry.reasons : [];
  const bodyText: string = (entry.body as string | null | undefined) ?? "";

  const byteCount: number | null =
    typeof entry.byte_count === "number" ? entry.byte_count : null;

  const createdAt =
    entry.created_at &&
    new Date(entry.created_at).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

 // ---------- 아르카나 / OG 이미지 ----------

  // 1) 코드/아이디 둘 다 가져오되, 코드 우선
  const rawArcanaId = (entry as any).arcana_id;
  const rawArcanaCode = (entry as any).arcana_code as string | null;

  // 숫자 ID는 있을 수도 있고, 0일 수도 있으니 그대로 숫자 변환만
  const arcanaId: ArcanaId | null =
    rawArcanaId === null || rawArcanaId === undefined
      ? null
      : (Number(rawArcanaId) as ArcanaId);

  // 메타는 "code → 우선", 안 되면 "id → 보조"
  const arcanaMeta =
    (rawArcanaCode
      ? ARCANA_META.find(c => c.code === rawArcanaCode)
      : null) ??
    (arcanaId !== null
      ? ARCANA_META.find(c => c.id === arcanaId) ?? null
      : null);

  // 최종 OG 이미지
  const ogImageUrl: string =
    arcanaMeta
      ? getArcanaImagePath(arcanaMeta.id)
      : entry.og_image ?? ARCANA_BACK_IMAGE;


  // ---------- 미학 점수들 ----------
  const ae = entry as {
    first_sentence?: number;
    freeze?: number;
    space?: number;
    linger?: number;
    bleak?: number;
    detour?: number;
    micro_recovery?: number;
    rhythm?: number;
    micro_particles?: number;
  };

  const firstSentence =
    typeof ae.first_sentence === "number" ? ae.first_sentence : null;
  const freeze = typeof ae.freeze === "number" ? ae.freeze : null;
  const space = typeof ae.space === "number" ? ae.space : null;
  const linger = typeof ae.linger === "number" ? ae.linger : null;
  const bleak = typeof ae.bleak === "number" ? ae.bleak : null;
  const detour = typeof ae.detour === "number" ? ae.detour : null;
  const microRecovery =
    typeof ae.micro_recovery === "number" ? ae.micro_recovery : null;
  const rhythm = typeof ae.rhythm === "number" ? ae.rhythm : null;
  const microParticles =
    typeof ae.micro_particles === "number" ? ae.micro_particles : null;

  const hasAestheticProfile =
    firstSentence !== null ||
    freeze !== null ||
    space !== null ||
    linger !== null ||
    bleak !== null ||
    detour !== null ||
    microRecovery !== null ||
    rhythm !== null ||
    microParticles !== null;

  // ---------- 간단 메트릭 바 ----------
  type MetricBarProps = {
    label: string;
    value: number | null | undefined;
    max?: number;
  };

  function MetricBar({ label, value, max = 10 }: MetricBarProps) {
    if (typeof value !== "number") return null;
    const ratio = Math.max(0, Math.min(1, value / max));

    return (
      <div className="flex items-center gap-2 text-[11px] sm:text-xs">
        <span className="w-16 shrink-0 text-slate-500">{label}</span>
        <div className="relative h-1.5 flex-1 rounded-full bg-slate-100">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-amber-400/80"
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
        <span className="w-8 text-right text-[11px] text-slate-500">
          {value}
        </span>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen justify-center bg-slate-50 px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <article className="w-full max-w-3xl rounded-3xl bg-white px-4 py-6 shadow-sm sm:px-8 sm:py-8">
        {/* 헤더 영역 */}
        <header className="mb-6 border-b border-slate-200 pb-5">
          <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[22px]">
            {title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 sm:text-xs">
            {typeof totalScore === "number" && (
              <span className="inline-flex items-center rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-semibold text-white sm:text-xs">
                총점 {totalScore}점
              </span>
            )}

            <span className="hidden h-3 w-px bg-slate-200 sm:inline-block" />

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400">
              {byteCount !== null && <span>바이트 {byteCount}/1250</span>}
              {createdAt && <span>작성일 {createdAt}</span>}
            </div>
          </div>

          {/* 태그 */}
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-0.5 text-[11px] text-slate-700 sm:text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* 1) 정서 앵커 카드 표시 섹션 */}
        {arcanaMeta && (
          <ArcanaSection arcanaMeta={arcanaMeta} />
        )}

        {/* 2) 결과 이미지 & 공유 섹션 */}
        <section className="mb-7 rounded-3xl border border-slate-100 bg-slate-50 px-4 py-5 sm:px-6 sm:py-6">
          <h2 className="text-xs font-semibold tracking-wide text-slate-600 sm:text-sm">
            결과 이미지 & 공유
          </h2>

          <div className="mt-4 flex justify-center">
            <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-slate-100 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ogImageUrl}
                alt="결과 이미지"
                className="h-auto w-full"
              />
            </div>
          </div>

          <p className="mt-3 text-center text-[11px] text-slate-500 sm:text-xs">
            이 이미지는 카카오톡·X 등에서 공유될 때 사용됩니다.
          </p>

          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <a
                href={ogImageUrl}
                download
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 sm:text-[13px]"
              >
                결과 이미지 저장하기
              </a>
            </div>

            <div className="mt-1 w-full max-w-xl">
              <p className="mb-1 text-center text-[11px] font-medium tracking-wide text-slate-400">
                결과 페이지 공유
              </p>
              <div className="flex justify-center">
                <div className="w-full [&_p]:hidden [&_button]:flex-1 [&_button]:py-2.5 [&_button]:text-[13px] [&_button]:font-medium">
                  <EntryShareBar title={title} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3) 미학 요약 프로필 */}
        {hasAestheticProfile && (
          <section className="mb-8 rounded-2xl bg-slate-50 px-4 py-4 sm:px-5 sm:py-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              이 작품의 문수림 미학 프로필
            </h2>
            <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
              문수림의 정서적 미립자 확산형 서술 구조와 저강도곡선 구성 요소를
              5점 만점 기준으로 정리한 요약입니다.
            </p>

            <div className="mt-3 grid gap-2 sm:gap-2.5">
              <MetricBar label="첫 문장" value={firstSentence} max={5} />
              <MetricBar label="정지" value={freeze} max={5} />
              <MetricBar label="공간화" value={space} max={5} />
              <MetricBar label="여운" value={linger} max={5} />
              <MetricBar label="암담 인식" value={bleak} max={5} />
              <MetricBar label="우회" value={detour} max={5} />
              <MetricBar label="미세 회복" value={microRecovery} max={5} />
              <MetricBar label="리듬" value={rhythm} max={5} />
              <MetricBar label="정서 미립자" value={microParticles} max={5} />
            </div>
          </section>
        )}

        {/* 4) 수림봇 판정 코멘트 */}
        {reasons.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              수림봇 판정 코멘트
            </h2>
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700">
              {reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>
        )}

        {/* 5) 본문 */}
        <section className="mb-9">
          {bodyText ? (
            <p className="whitespace-pre-wrap text-[15px] leading-[1.8] text-slate-900 sm:text-[16px] sm:leading-[1.9]">
              {bodyText}
            </p>
          ) : (
            <p className="text-sm text-slate-400">
              저장된 본문이 없습니다. (구버전 데이터이거나 마이그레이션이
              필요할 수 있습니다.)
            </p>
          )}
        </section>

        {/* 하단 마무리 텍스트 */}
        <footer className="mt-6 border-t border-slate-100 pt-4">
          <p className="text-[11px] leading-relaxed text-slate-400">
            위 결과는 어디까지나 수림봇에 의한 기계적 평가 기준일 뿐입니다.
            <br />
            작품의 가치를 제대로 평가 받고 싶다면, 수림스튜디오로 글을
            보내주세요.
          </p>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Link
              href="/my"
              className="inline-flex items-center justify-center rounded-lg 
                       bg-[#3a302c] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2f2723]"
            >
              내 기록 보기
            </Link>

            <button
              disabled
              className="inline-flex cursor-not-allowed items-center justify-center rounded-lg 
                       bg-[#2F5D46] px-4 py-2 text-sm font-medium text-white opacity-70 transition hover:bg-[#264E39]"
            >
              수림스튜디오로 보내기 (준비중)
            </button>
          </div>
        </footer>
      </article>
    </main>
  );
}
