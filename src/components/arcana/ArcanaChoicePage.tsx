// File: src/components/arcana/ArcanaChoicePage.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ARCANA_META,
  ARCANA_BACK_IMAGE,
  type ArcanaId,
} from "@/lib/arcana/og";
import { ArcanaDeckVisual } from "@/components/arcana/ArcanaDeckVisual";

type Props = {
  entryId: string;
  title: string;
};

export function ArcanaChoicePage({ entryId, title }: Props) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<ArcanaId | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedId, setSelectedId] = useState<ArcanaId | null>(null);
  const [showFlash, setShowFlash] = useState(false);

  const [requestDone, setRequestDone] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);

  // TODO: 이후 점수/키워드 기반 추천 로직으로 교체 예정
  const candidates = ARCANA_META.slice(0, 3);

  async function handleSelect(cardId: ArcanaId) {
  if (submitting) return;

  const card = ARCANA_META.find(c => c.id === cardId);
  if (!card) return;

  // 상태 초기화
  setSelectedId(cardId);
  setLoadingId(cardId);
  setSubmitting(true);
  setShowFlash(false);
  setRequestDone(false);
  setAnimationDone(false);

  // 1) 애니메이션 타임라인: 클릭 기준
  // 0ms ~ 1200ms: CSS 스핀 (arcana-card-spin)
  // 800ms: 플래시 ON
  // 1200ms: 애니메이션 종료로 간주
  setTimeout(() => {
    setShowFlash(true);

    // 플래시 길이(0.4s) 끝나면 애니메이션 전체 완료로 처리
    setTimeout(() => {
      setAnimationDone(true);
    }, 400);
  }, 800);

  // 2) 서버 요청 병렬 실행
  try {
    const resp = await fetch("/api/entry-arcana", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entryId,
        arcanaId: card.id,
        arcanaCode: card.code,
        arcanaKoName: card.krTitle,
      }),
    });

    const data = await resp.json();

    if (!resp.ok || data?.error) {
      throw new Error(data?.error || "카드 선택에 실패했습니다.");
    }

    // 서버 저장 완료
    setRequestDone(true);
  } catch (err) {
    console.error(err);
    alert("카드 선택 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");

    // 실패 시 상태 롤백
    setSubmitting(false);
    setLoadingId(null);
    setSelectedId(null);
    setShowFlash(false);
    setRequestDone(false);
    setAnimationDone(false);
  }
}

    // 애니메이션과 서버 저장이 모두 끝났을 때만 페이지 이동
    useEffect(() => {
    if (!requestDone || !animationDone) return;

    // 둘 다 true가 된 시점에 이동
    router.push(`/entries/${entryId}`);
    }, [requestDone, animationDone, router, entryId]);

  return (
    <div className="relative">
      <div className="mx-auto flex max-w-xl flex-col gap-8 px-4 py-8 sm:py-10">
        {/* 상단 헤더 */}
        <header className="border-b border-slate-200 pb-4">
          <p className="text-[11px] font-medium tracking-wide text-slate-400">
            오늘의 500자 소설
          </p>
          <h1 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">
            {title}
          </h1>
        </header>

        {/* 안내 문구 섹션 */}
        <section className="space-y-3">
          <p className="text-xs font-semibold text-slate-700 sm:text-sm">
            정서적 앵커 카드 선택
          </p>
          <p className="text-[11px] leading-relaxed text-slate-600 sm:text-xs">
            혹시 글쓰기와 타로카드가 긴밀한 관계를 가지고 있다는 거 아시나요?
          </p>
          <p className="text-[11px] leading-relaxed text-slate-600 sm:text-xs">
            사실 님이 작성한 글의 숨결을 수림봇이 규정할 수는 없습니다. 수림봇의
            분석은 어디까지나 기계적인 분석에 불과하니까요.
          </p>
          <p className="text-[11px] leading-relaxed text-slate-600 sm:text-xs">
            그래서 수림봇은 글의 주요 정서를 기반으로 메이저 아르카나 덱 3장을
            제안하고, 마지막 선택은 작성자의 감각에 맡깁니다. 선택된 카드는 오늘의
            이야기를 상징하는 ‘정서적 앵커’가 되어 이후에 제공되는 수림봇의
            피드백을 더 선명하게 인식하도록 도와줍니다.
          </p>
        </section>

        {/* 중앙 덱 비주얼 + 후보 카드 섹션 */}
        <section className="space-y-6 rounded-2xl bg-slate-900/90 px-4 py-8 text-slate-100 shadow-sm">
          {/* 덱 비주얼 */}
          <div className="mb-2 flex flex-col items-center justify-center gap-2">
            <ArcanaDeckVisual backImageSrc={ARCANA_BACK_IMAGE} />
            <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-300">
              아래의 3장 중에서 1장을 선택해주세요<br/> 
              너무 고민하지 말고, 첫 느낌으로 골라 주세요.
            </p>
          </div>

          {/* 후보 3장 뒷면 카드 */}
          <div className="grid gap-3 sm:grid-cols-3">
            {candidates.map(card => {
                const isSelected = selectedId === card.id;
                const isLoading = loadingId === card.id;

                const dimOthers = submitting && !isSelected;

                return (
                <button
                    key={card.id}
                    type="button"
                    disabled={submitting}
                    onClick={() => handleSelect(card.id as ArcanaId)}
                    className={`
                    group flex flex-col items-center rounded-2xl border 
                    border-slate-700 bg-slate-900/80 p-3 transition
                    hover:-translate-y-1 hover:border-slate-400 hover:shadow-md
                    disabled:cursor-not-allowed
                    ${dimOthers ? "opacity-40" : ""}
                    ${isSelected ? "brightness-110" : ""}
                    `}
                    aria-label={`${card.krTitle} 카드 선택`}
                >
                    <div className="relative w-full max-w-[120px]">
                    {/* 뒷면 카드 */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={ARCANA_BACK_IMAGE}
                        alt={card.krTitle}
                        className={`
                        w-full rounded-xl
                        ${
                            isSelected
                            ? "arcana-card-spin"
                            : "transition-transform group-hover:scale-105"
                        }
                        `}
                    />

                    {isLoading && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-black/10">
                        <span className="text-[10px] text-slate-100 drop-shadow">
                            {/* 시각적으로는 거의 안 보여도 됨 */}
                        </span>
                        </div>
                    )}
                    </div>
                </button>
                );
            })}
            </div>

          {submitting && (
            <p className="mt-3 text-center text-[11px] text-slate-400">
              선택한 카드를 저장하는 중입니다…
            </p>
          )}
        </section>
      </div>

      {showFlash && (
        <div className="fixed inset-0 z-40 bg-white pointer-events-none fullscreen-flash" />
      )}
    </div>
  );
}
