// File: src/lib/arcana/text.ts

import type { ArcanaId } from "./og";
import type { WritingMode } from "@/lib/arcana/types";
import { ARCANA_SEEDS_NOVEL, ARCANA_SEEDS_ESSAY } from "./seeds";

// NOVEL/ESSAY 시드를 모두 합친 통합 시드 테이블
const ALL_SEEDS: Record<ArcanaId, string[]> = (() => {
  const map: Record<ArcanaId, string[]> = {} as any;

  ARCANA_SEEDS_NOVEL.forEach((arr, idx) => {
    map[idx as ArcanaId] = [...(map[idx as ArcanaId] ?? []), ...arr];
  });

  ARCANA_SEEDS_ESSAY.forEach((arr, idx) => {
    map[idx as ArcanaId] = [...(map[idx as ArcanaId] ?? []), ...arr];
  });

  return map;
})();

/**
 * 본문에서 "첫 문장"만 대략 추출하는 함수
 * - 줄바꿈 이전 or 마침표/물음표/느낌표… 기준
 */
export function extractFirstSentence(raw: string | null | undefined): string {
  if (!raw) return "";

  const text = raw.trim().replace(/\s+/g, " ");
  if (!text) return "";

  const firstLine = text.split("\n")[0].trim();

  const match = firstLine.match(/.+?[\.!?…]/);
  if (match) {
    return match[0].trim();
  }

  return firstLine;
}

/**
 * 아주 단순한 토크나이즈: 공백 기준으로 자르고
 * 너무 짧은 토큰은 버린다.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);
}

/**
 * 두 문장의 유사도(공통 토큰 개수) 계산
 * 절대값 말고 "상대 순위"만 쓰일 거라 이 정도면 충분.
 */
function calcSentenceSimilarity(a: string, b: string): number {
  const aTokens = tokenize(a);
  const bTokens = tokenize(b);
  if (!aTokens.length || !bTokens.length) return 0;

  const setB = new Set(bTokens);
  let overlap = 0;
  for (const tok of aTokens) {
    if (setB.has(tok)) overlap++;
  }
  return overlap;
}

/**
 * 첫 문장 + 모드(novel/essay)를 기반으로
 * 가장 어울리는 아르카나 id 하나를 추정한다.
 * - 매칭이 전혀 없으면 null
 * - 모드는 현재 로직에서는 시드 통합이라 참고용만 사용
 */
export function detectArcanaFromFirstSentence(
  firstSentence: string | null,
  _mode: WritingMode,
): ArcanaId | null {
  if (!firstSentence) return null;
  const sentence = firstSentence.trim();
  if (!sentence) return null;

  // 1) 완전 일치 우선 (시드 그대로 쓴 경우)
  for (const [idStr, seedLines] of Object.entries(ALL_SEEDS)) {
    const id = Number(idStr) as ArcanaId;
    if (seedLines.includes(sentence)) {
      return id;
    }
  }

  // 2) 단어 유사도 기준으로 가장 비슷한 카드 찾기
  let bestId: ArcanaId | null = null;
  let bestScore = 0;

  for (const [idStr, seedLines] of Object.entries(ALL_SEEDS)) {
    const id = Number(idStr) as ArcanaId;

    // 그 카드의 여러 시드 문장 중 최고 점수 하나만 사용
    const scoreForCard = seedLines.reduce((acc, seed) => {
      const s = calcSentenceSimilarity(sentence, seed);
      return s > acc ? s : acc;
    }, 0);

    if (scoreForCard > bestScore) {
      bestScore = scoreForCard;
      bestId = id;
    }
  }

  // 전 카드가 0점이면 "아무것도 못 골랐음"
  if (!bestId || bestScore === 0) return null;

  return bestId;
}
