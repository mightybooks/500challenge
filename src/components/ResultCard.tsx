// File: src/components/ResultCard.tsx

type ResultCardProps = {
  title: string;
  score: number | null;
  byteCount?: number | null;
  tags?: string[];
  reasons?: string[];
};

function getScoreBand(score: number | null): "amber" | "purple" | "aqua" {
  if (typeof score !== "number") return "aqua";
  if (score >= 70) return "amber";
  if (score >= 40) return "purple";
  return "aqua";
}

function getScoreBadgeClass(score: number | null): string {
  const band = getScoreBand(score);
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

export function ResultCard({
  title,
  score,
  byteCount,
  tags,
  reasons,
}: ResultCardProps) {
  const scoreText =
    typeof score === "number" ? `${score}점` : "점수 없음";

  const safeTags = Array.isArray(tags) ? tags : [];
  const safeReasons = Array.isArray(reasons) ? reasons : [];

  return (
    <div className="space-y-4">
      {/* 제목 */}
      <div>
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          평가 결과
        </h3>
        <p className="mt-1 text-sm font-medium text-slate-900 line-clamp-2">
          {title || "제목 없음"}
        </p>
      </div>

      {/* 점수 + 메타 */}
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-slate-500">
        <span className={getScoreBadgeClass(score)}>
          {scoreText}
        </span>

        {typeof byteCount === "number" && (
          <span className="text-[11px] text-slate-400">
            바이트 {byteCount}/1250
          </span>
        )}

        {safeTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {safeTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-100 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 코멘트 */}
      {safeReasons.length > 0 && (
        <div>
          <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            기계 판정 코멘트
          </h4>
          <ul className="list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-slate-700">
            {safeReasons.map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
