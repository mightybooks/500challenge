// File: src/components/arcana/ArcanaSection.tsx

import type { ArcanaCard } from "@/lib/arcana/og";
import { ARCANA_SCENES } from "@/lib/arcana/og";

type ArcanaSectionProps = {
  arcanaMeta: ArcanaCard;
  isLoser?: boolean;
};

export function ArcanaSection({ arcanaMeta, isLoser }: ArcanaSectionProps) {
  if (!arcanaMeta) return null;

  // 🔹 루저 전용 앵커 문구
  const loserText = `수림봇이 오늘의 원고를 보더니,
메모리카드라도 주고 부려 먹으라고 하네요.
그래도 괜찮습니다.
오늘은 살짝 모자랐던 날일 뿐이고,
내일의 500자는 지금보다 분명 더 나아질 테니까요.`;

  // 🔹 루저라면: 번호/제목/요약 싹 무시하고 전용 블록만 표시
  if (isLoser) {
    return (
      <section className="mb-8 rounded-3xl border border-slate-100 bg-slate-50 px-4 py-5 sm:px-6 sm:py-6">
        <h2 className="text-xs font-semibold tracking-wide text-slate-600 sm:text-sm">
          오늘의 정서 앵커 카드
        </h2>
        <p className="mt-3 whitespace-pre-line text-xs leading-relaxed text-slate-700 sm:text-sm">
          {loserText}
        </p>
      </section>
    );
  }

  // 🔹 정상 카드일 때만 기존 로직 사용
  const scene = ARCANA_SCENES[arcanaMeta.id];
  const anchorText = scene;

  return (
    <section className="mb-8 rounded-3xl border border-slate-100 bg-slate-50 px-4 py-5 sm:px-6 sm:py-6">
      <h2 className="text-xs font-semibold tracking-wide text-slate-600 sm:text-sm">
        오늘의 정서 앵커 카드
      </h2>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900 sm:text-[15px]">
            {arcanaMeta.krTitle}
          </p>

          {arcanaMeta.krSummary && (
            <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
              {arcanaMeta.krSummary}
            </p>
          )}

          {anchorText && (
            <p className="mt-3 whitespace-pre-line text-xs leading-relaxed text-slate-700 sm:text-sm">
              {anchorText}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
