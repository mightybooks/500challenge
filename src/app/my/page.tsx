// File: src/app/my/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type MyRecord = {
  id: string;
  title: string;
  score: number | null;
  tags: string[] | null;
  created_at: string;
  share_status?: string[] | null;
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

function getScoreBadge(score: number | null) {
  if (typeof score !== "number") {
    return {
      label: "점수 없음",
      className:
        "inline-flex items-center rounded-full bg-slate-200 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700",
    };
  }

  const label = `${score}점`;
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-white ";

  if (score >= 70) return { label, className: base + "bg-amber-500" };
  if (score >= 40) return { label, className: base + "bg-purple-500" };
  return { label, className: base + "bg-teal-500" };
}

export default function MyPage() {
  const [records, setRecords] = useState<MyRecord[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          나의 500자 기록
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          지금까지 작성한 500자 소설을 한눈에 모아봅니다.
        </p>
      </header>

      {/* 로딩 상태 */}
      {loading && (
        <section className="mt-8">
          <div className="rounded-2xl border border-slate-100 bg-white px-6 py-8 text-center shadow-sm">
            <p className="text-sm text-slate-500">
              기록을 불러오는 중입니다...
            </p>
          </div>
        </section>
      )}

      {/* 에러 상태 */}
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

      {/* 비어 있을 때 */}
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

      {/* 기록 리스트 */}
      {!loading && !error && hasRecords && (
        <section className="space-y-3">
          {records!.map((record) => {
            const tags = Array.isArray(record.tags) ? record.tags : [];
            const scoreInfo = getScoreBadge(record.score);

            return (
              <Link
                key={record.id}
                href={`/entries/${record.id}`}
                className="block rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* 상단: 제목 + 점수/날짜 */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-sm font-semibold text-slate-900 line-clamp-1 sm:text-[15px]">
                    {record.title || "(제목 없음)"}
                  </h2>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-slate-500">
                    <span className={scoreInfo.className}>
                      {scoreInfo.label}
                    </span>

                    <span className="hidden h-3 w-px bg-slate-200 sm:inline-block" />

                    <span className="text-slate-400">
                      작성일 {formatDate(record.created_at)}
                    </span>
                  </div>
                </div>

                {/* 태그 영역 */}
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
      )}
    </main>
  );
}
