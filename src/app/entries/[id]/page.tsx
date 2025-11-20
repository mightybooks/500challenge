// File: src/app/entries/[id]/page.tsx

import type { Metadata } from "next";
import { getEntryById } from "@/lib/db";
import { getOgCardPath, getScoreBand, type ScoreBand } from "@/lib/og500";
import { EntryShareBar } from "@/components/EntryShareBar";

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

// OG 이미지 자동 설정
export async function generateMetadata(
  { params }: PageProps
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
        images: ["/og/500/default.png"],
      },
    };
  }

  const totalScore: number | null = entry.total_score ?? entry.score ?? null;

  const ogImage = getOgCardPath({
    entryId: entry.id,
    totalScore,
  });

  const title = entry.title || "500자 소설";

  return {
    title: `500자 소설 – ${title}`,
    description: "내가 직접 쓴 500자 소설, 점수와 함께 확인해보세요.",
    openGraph: {
      title,
      description: "내가 직접 쓴 500자 소설, 점수와 함께 확인해보세요.",
      images: [ogImage],
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

  const totalScore: number | null = entry.total_score ?? entry.score ?? null;
  const band = getScoreBand(totalScore);

  const scoreValue =
    typeof totalScore === "number" ? `${totalScore}점` : "점수 없음";

  const tags: string[] = Array.isArray(entry.tags) ? entry.tags : [];
  const reasons: string[] = Array.isArray(entry.reasons) ? entry.reasons : [];

  // 본문 필드 매핑
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

  return (
    <main className="flex min-h-screen justify-center bg-slate-50 px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <article className="w-full max-w-3xl rounded-3xl bg-white px-4 py-6 shadow-sm sm:px-8 sm:py-8">
        {/* 헤더 영역 */}
        <header className="mb-6 border-b border-slate-200 pb-5">
          <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[22px]">
            {title}
          </h1>

          {/* 메타 정보: 점수 / 바이트 / 작성일 */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-slate-600">
            {/* 점수 뱃지 */}
            <span className={getScoreBadgeClass(band)}>
              {scoreValue} · {getScoreLabel(band)}
            </span>

            {/* 구분선 (데스크탑 이상에서만) */}
            <span className="hidden h-3 w-px bg-slate-200 sm:inline-block" />

            {/* 바이트 수 / 작성일 */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400">
              {byteCount !== null && (
                <span>바이트 {byteCount}/500</span>
              )}
              {createdAt && <span>작성일 {createdAt}</span>}
            </div>
          </div>

          {/* 태그: 헤더 하단에 정돈해서 배치 */}
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-0.5 text-[11px] sm:text-xs text-slate-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* 본문 */}
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

        {/* 평가 코멘트 */}
        {reasons.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              기계 판정 코멘트
            </h2>
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700">
              {reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>
        )}

        {/* 공유 바 */}
        <footer className="mt-6 border-t border-slate-100 pt-4 sm:pt-5">
          <p className="mb-2 text-[11px] font-medium tracking-wide text-slate-400">
            이 기록 공유하기
          </p>
          <EntryShareBar title={title} />
        </footer>
      </article>
    </main>
  );
}
