// File: src/lib/score.ts

export const LOSER_THRESHOLD = 50; // 점수 기준 (표시용 기준)

// 이미 있으실 getDisplayScore
export function getDisplayScore(rawScore: number | null): number | null {
  if (rawScore == null) return null;

  if (rawScore >= 88) {
    return rawScore;
  }

  return rawScore + 8;
}

// 🔹 루저 판정 헬퍼
export function isLoserScore(rawScore: number | null): boolean {
  if (rawScore == null) return false;

  const display = getDisplayScore(rawScore);
  return display !== null && display < LOSER_THRESHOLD;
}
