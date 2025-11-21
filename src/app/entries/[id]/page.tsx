// File: src/app/entries/[id]/page.tsx

import type { Metadata } from "next";
import { getEntryById } from "@/lib/db";
import { getScoreBand, type ScoreBand } from "@/lib/og500";
import { EntryShareBar } from "@/components/EntryShareBar";
import Link from "next/link";

type PageProps = {
  params: { id: string };
};

// 점수 밴드(색상대)별 라벨
function getScoreLabel(band: ScoreBand): string {
  switch (band) {
    case "amber":
      return "고득점 작품";
    case "purple":
      return "준수한 작품";
    case "aqua":
    default:
      return "실험 중인 작품";
  }
}

// 점수 밴드별 배지 스타일 (Tailwind)
function getScoreBadgeClass(band: ScoreBand): string {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-white";

  switch (band) {
    case "amber":
      return `${base} bg-amber-500`;
    case "purple":
      return `${base} bg-purple-500`;
    case "aqua":
    default:
      return `${base} bg-teal-500`;
  }
}

// 미학 점수 간단 바 컴포넌트
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

// OG 이미지 자동 설정 (메타데이터)
export async function generateMetadata(
  { params }: PageProps,
): Promise<Metadata> {
  const entry = await getEntryById(params.id);

  // 존재하지 않는 경우 기본 OG
  if (!entry) {
    return {
      title: "500자 소설",
      description: "내가 쓴 500자 소설을 기록하고 평가하는 서비스",
      openGraph: {
        title: "500자 소설",
        description: "내가 쓴 500자 소설을 기록하고 평가하는 서비스",
        images: [
          {
            // 실제 존재하는 카드 중 하나를 기본값으로 사용
            url: "/og/500/unicorn-aqua.png",
            width: 1200,
            height: 630,
          },
        ],
      },
    };
  }

  const t = entry.title || "500자 소설";
  const ogImage =
    ((entry as any).og_image as string | null) ?? "/og/500/unicorn-aqua.png";

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
  };
}

// 결과 페이지 본문
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

  const title: string = entry.title ?? "500자 소설";
  const totalScore: number | null =
    (entry.total_score as number | null) ?? (entry.score as number | null) ?? null;
  const band = getScoreBand(totalScore);
  const scoreValue =
    typeof totalScore === "number" ? `${totalScore}점` : "점수 없음";

  const tags: string[] = Array.isArray(entry.tags) ? entry.tags : [];
  const reasons: string[] = Array.isArray(entry.reasons) ? entry.reasons : [];
  const bodyText: string = (entry.body as string | null | undefined) ?? "";

  const createdAt =
    entry.created_at &&
    new Date(entry.created_at).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const byteCount: number | null =
    typeof entry.byte_count === "number" ? entry.byte_count : null;

  const ogImageUrl: string =
    ((entry as any).og_image as string | null) ?? "/og/500/unicorn-aqua.png";

      // 미학 점수들 (entry를 느슨하게 캐스팅해서 사용)
  const ae = entry as {
    freeze?: number;
    space?: number;
    linger?: number;
    micro_particles?: number;
    bleak?: number;
    rhythm?: number;
    narrative_turn?: number;
  };

  const freeze =
    typeof ae.freeze === "number" ? ae.freeze : null;
  const space =
    typeof ae.space === "number" ? ae.space : null;
  const linger =
    typeof ae.linger === "number" ? ae.linger : null;
  const microParticles =
    typeof ae.micro_particles === "number" ? ae.micro_particles : null;
  const bleak =
    typeof ae.bleak === "number" ? ae.bleak : null;
  const rhythm =
    typeof ae.rhythm === "number" ? ae.rhythm : null;
  const narrativeTurn =
    typeof ae.narrative_turn === "number" ? ae.narrative_turn : null;

  const hasAestheticProfile =
    freeze !== null ||
    space !== null ||
    linger !== null ||
    microParticles !== null ||
    bleak !== null ||
    rhythm !== null ||
    narrativeTurn !== null;

  return (
    <main className="flex min-h-screen justify-center bg-slate-50 px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <article className="w-full max-w-3xl rounded-3xl bg-white px-4 py-6 shadow-sm sm:px-8 sm:py-8">
        {/* OG 카드 + 상단 CTA 영역 */}
        {ogImageUrl && (
          <section className="mb-7">
            <div className="flex justify-center">
              <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-slate-100 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ogImageUrl}
                  alt={`${title} - 500자 소설 결과 카드`}
                  className="h-auto w-full"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-col items-center gap-3">
              <p className="text-[11px] text-slate-500 sm:text-xs">
                이 카드는 카카오톡·X 등에서 공유될 때 사용되는 결과 이미지입니다.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <a
                  href={ogImageUrl}
                  download
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 sm:text-[13px]"
                >
                  이미지 저장하기
                </a>
              </div>

              {/* 공유 버튼 영역 */}
              <div className="mt-2 w-full max-w-xl">
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
        )}

        {/* 헤더 영역 */}
        <header className="mb-6 border-b border-slate-200 pb-5">
          <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[22px]">
            {title}
          </h1>

          {/* 메타 정보: 점수 / 바이트 / 작성일 */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 sm:text-xs">
            <span className={getScoreBadgeClass(band)}>
              {scoreValue} · {getScoreLabel(band)}
            </span>

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

        {/* 미학 요약 프로필 */}
        {hasAestheticProfile && (
          <section className="mb-8 rounded-2xl bg-slate-50 px-4 py-4 sm:px-5 sm:py-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              이 작품의 문수림 미학 프로필
            </h2>
            <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
              freeze · space · linger를 중심으로, 리듬과 전환, 미립자 감도 등을 한눈에 정리한 요약입니다.
            </p>

            <div className="mt-3 grid gap-2 sm:gap-2.5">
              <MetricBar label="정지" value={freeze} />
              <MetricBar label="공간화" value={space} />
              <MetricBar label="여운" value={linger} />
              <MetricBar label="미립자 감각" value={microParticles} />
              <MetricBar label="암담도" value={bleak} />
              <MetricBar label="리듬" value={rhythm} />
              <MetricBar label="전환" value={narrativeTurn} />
            </div>
          </section>
        )}

        {/* 본문 */}
        <section className="mb-9">
          {bodyText ? (
            <p className="whitespace-pre-wrap text-[15px] leading-[1.8] text-slate-900 sm:text-[16px] sm:leading-[1.9]">
              {bodyText}
            </p>
          ) : (
            <p className="text-sm text-slate-400">
              저장된 본문이 없습니다. (구버전 데이터이거나 마이그레이션이 필요할 수 있습니다.)
            </p>
          )}
        </section>

        {/* 평가 코멘트 */}
        {reasons.length > 0 && (
          <section className="mb-6">
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
    
        {/* 하단 마무리 텍스트 */}
        <footer className="mt-6 border-t border-slate-100 pt-4">
          <p className="text-[11px] text-slate-400 leading-relaxed">
          위 결과는 어디까지나 수림봇에 의한 기계적 평가 기준일 뿐입니다.
          <br />
          작품의 가치를 제대로 평가 받고 싶다면, 수림스튜디오로 글을 보내주세요.
          </p>

        {/* 버튼 영역 */}
        <div className="mt-5 flex flex-col sm:flex-row gap-2 sm:justify-end">

          {/* 내 기록 보기 */}
          <Link
            href="/my"
            className="inline-flex items-center justify-center rounded-lg 
                       bg-[#3a302c] hover:bg-[#2f2723]
                       px-4 py-2 text-white text-sm font-medium transition"
          >
            내 기록 보기
          </Link>

          {/* 수림스튜디오로 보내기 — 비활성 (stub) */}
          <button
            disabled
            className="inline-flex items-center justify-center rounded-lg 
                       bg-[#2F5D46] hover:bg-[#264E39]
                       px-4 py-2 text-white text-sm font-medium transition
                       opacity-70 cursor-not-allowed"
          >
            수림스튜디오로 보내기 (준비중)
          </button>
        </div>
       </footer>
      </article>
    </main>
  );
}
