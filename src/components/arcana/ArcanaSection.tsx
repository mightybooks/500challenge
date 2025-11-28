// File: src/components/arcana/ArcanaSection.tsx
"use client";

import type { ArcanaCard } from "@/lib/arcana/og";

type ArcanaSectionProps = {
  arcanaMeta: ArcanaCard | null;
};

/**
 * 결과 페이지에서만 쓰는 "표시용" 섹션.
 * - 더 이상 카드 선택을 제공하지 않음
 * - 이미 선택된 아르카나 카드와 안내 문구만 보여줌
 */
export function ArcanaSection({ arcanaMeta }: ArcanaSectionProps) {
  // 선택 안 된 상태에서는 아무것도 안 보여줌
  // (실제 플로우에서는 /entries/[id]/arcana 쪽으로 보내기 때문에 이게 뜰 일 거의 없음)
  if (!arcanaMeta) return null;

  return (
    <section className="mb-8 rounded-3xl border border-slate-100 bg-slate-50 px-4 py-5 sm:px-6 sm:py-6">
      <h2 className="text-xs font-semibold tracking-wide text-slate-600 sm:text-sm">
        오늘의 정서 앵커 카드
      </h2>

      <p className="mt-2 text-[13px] text-slate-800 sm:text-sm">
        이번 500자 소설을 상징하는 정서적 앵커 카드는{" "}
        <span className="font-semibold text-slate-900">
          {arcanaMeta.krTitle}
        </span>
        입니다.
      </p>

      {/* 카드 기본 의미 한 줄 */}
      {arcanaMeta.krSummary && (
        <p className="mt-1 text-[11px] text-slate-600 sm:text-xs">
          {arcanaMeta.krSummary}
        </p>
      )}

    </section>
  );
}
