// File: src/app/my/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getScoreBand, type ScoreBand } from "@/lib/og500";

type MyRecord = {
  id: string;
  title: string;
  score: number | null;
  tags: string[] | null;
  reasons?: string[] | null;
  byte_count?: number | null;
  created_at: string;
  share_status?: string[] | null;
  og_image?: string | null;
  score_band?: ScoreBand | null;
};

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

// 점수 밴드/점수 뱃지
function getScoreBadge(score: number | null, band?: ScoreBand | null) {
  const label =
    typeof score === "number" ? `${score}점` : "점수 없음";

  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold ";

  if (typeof score !== "number") {
    return {
      label,
      bandLabel: "실험 중",
      className:
        base +
        "bg-slate-200 text-slate-700",
    };
  }

  const effectiveBand: ScoreBand = band ?? getScoreBand(score);

  let colorClass = "";
  let bandLabel = "";

  switch (effectiveBand) {
    case "amber":
      colorClass = "bg-amber-500 text-white";
      bandLabel = "고득점";
      break;
    case "purple":
      colorClass = "bg-purple-500 text-white";
      bandLabel = "준수";
      break;
    case "aqua":
    default:
      colorClass = "bg-teal-500 text-white";
      bandLabel = "실험 중";
      break;
  }

  return {
    label,
    bandLabel,
    className: base + colorClass,
  };
}

// og_image 경로에서 동물 타입 추출
function parseAnimalFromOgImage(
  og: string | null | undefined,
): { key: string | null; label: string | null } {
  if (!og) return { key: null, label: null };

  // 예: /og/500/unicorn-amber.png
  const file = og.split("/").pop() ?? "";
  const [animal] = file.split("-"); // unicorn-amber → unicorn

  switch (animal) {
    case "unicorn":
      return { key: "unicorn", label: "유니콘형" };
    case "griffin":
      return { key: "griffin", label: "그리핀형" };
    case "wolf":
      return { key: "wolf", label: "울프형" };
    case "basilisk":
      return { key: "basilisk", label: "바실리스크형" };
    default:
      return { key: null, label: null };
  }
}

export default function MyPage() {
  const [records, setRecords] = useState<MyRecord[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 클라이언트 사이드 "더 보기"용 페이지네이션
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/my");

        if (!res.ok) {
          throw new Error(`요청 실패: ${res.status}`);
        }

        const json = await res.json();
        const list = Array.isArray(json.records) ? json.records : [];

        if (!cancelled) {
          setRecords(list);
        }
      } catch (err) {
        console.error("FETCH /api/my ERROR", err);
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "기록을 불러오는 중 오류가 발생했습니다.",
          );
          setRecords([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasRecords = !!records && records.length > 0;
  const visibleRecords =
    records && records.length > 0
      ? records.slice(0, page * PAGE_SIZE)
      : [];
  const hasMore =
    records && records.length > visibleRecords.length;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            나의 500자 기록
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            지금까지 작성한 500자 소설을 한눈에 모아봅니다.
          </p>
        </div>

        {/* 오늘의 도전 CTA */}
        <div className="flex justify-start sm:justify-end">
          <a
            href="/editor"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            오늘의 도전하기
          </a>
        </div>
      </header>

      {loading && (
        <section className="mt-8">
          <div className="rounded-2xl border border-slate-100 bg-white px-6 py-8 text-center shadow-sm">
            <p className="text-sm text-slate-500">
              기록을 불러오는 중입니다...
            </p>
          </div>
        </section>
      )}

      {!loading && error && (
        <section className="mt-8">
          <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-8 text-center shadow-sm">
            <p className="text-sm font-medium text-red-700">
              기록을 불러오는 중 오류가 발생했습니다.
            </p>
            <p className="mt-2 text-xs text-red-500">{error}</p>
          </div>
        </section>
      )}

      {!loading && !error && (!records || records.length === 0) && (
        <section className="mt-8">
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
            <p className="text-sm font-medium text-slate-700">
              아직 작성한 500자 소설이 없습니다.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              오늘 첫 작품을 기록해 두면, 나중에 읽을수록 더 재밌어집니다.
            </p>
            <div className="mt-5 flex justify-center">
              <Link
                href="/editor"
                className="inline-flex items-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                지금 바로 작성하기
              </Link>
            </div>
          </div>
        </section>
      )}

      {!loading && !error && hasRecords && (
        <>
          <section className="mt-4 space-y-3">
            {visibleRecords.map((record) => {
              const tags = Array.isArray(record.tags)
                ? record.tags
                : [];
              const band =
                record.score_band ??
                (record.score !== null
                  ? getScoreBand(record.score)
                  : null);
              const scoreInfo = getScoreBadge(
                record.score,
                band ?? undefined,
              );
              const animalInfo = parseAnimalFromOgImage(
                record.og_image,
              );

              return (
                <Link
                  key={record.id}
                  href={`/entries/${record.id}`}
                  className="block rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-sm font-semibold leading-snug text-slate-900 line-clamp-1 sm:text-[15px]">
                      {record.title || "(제목 없음)"}
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs text-slate-500">
                      <span className={scoreInfo.className}>
                        {scoreInfo.label}
                        {scoreInfo.bandLabel &&
                          ` · ${scoreInfo.bandLabel}`}
                      </span>

                      {animalInfo.label && (
                        <>
                          <span className="hidden h-3 w-px bg-slate-200 sm:inline-block" />
                          <span className="rounded-full border border-slate-100 bg-slate-50 px-2 py-0.5 text-[10px] sm:text-[11px] text-slate-600">
                            {animalInfo.label}
                          </span>
                        </>
                      )}

                      <span className="hidden h-3 w-px bg-slate-200 sm:inline-block" />

                      <span className="text-slate-400">
                        작성일 {formatDate(record.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 sm:text-[12px]">
                    <div className="flex flex-wrap items-center gap-2">
                      {record.byte_count !== null &&
                        typeof record.byte_count ===
                          "number" && (
                          <span>
                            바이트 {record.byte_count}/1250
                          </span>
                        )}
                    </div>
                  </div>

                  {tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-0.5 text-[11px] text-slate-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              );
            })}
          </section>

          {hasMore && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                이전 기록 더 보기
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
