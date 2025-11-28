// src/lib/og500.ts
// 옛 동물 OG 시스템의 잔재를 정리한 경량 버전입니다.
// 지금은 /my 같은 UI에서 점수대별 색상 구분 정도에만 사용합니다.

export type ScoreBand = "amber" | "purple" | "aqua";

/**
 * 총점 기반으로 대략적인 점수 구간을 나눕니다.
 * - amber: 상위 점수대
 * - purple: 중간 점수대
 * - aqua: 그 이하 + 기본값
 */
export function getScoreBand(score: number | null | undefined): ScoreBand {
  if (typeof score !== "number") return "aqua";

  if (score >= 80) return "amber";
  if (score >= 60) return "purple";
  return "aqua";
}