// src/lib/arcana/engine.ts

import { ARCANA, type ArcanaCard } from "./arcana";

/**
 * 아주 단순한 전처리:
 * - 소문자 변환
 * - 특수문자 제거
 * - 공백 기준 토큰화
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * 카드 하나와 유저 텍스트 토큰 배열을 비교해서
 * 얼마나 잘 맞는지 "점수"를 산출하는 함수.
 *
 * 지금은:
 * - 카드 키워드가 텍스트에 얼마나 포함되어 있는지 개수를 세는 방식
 * - 키워드가 하나도 안 맞으면 0점
 */
function scoreCardByText(card: ArcanaCard, tokens: string[]): number {
  const tokenSet = new Set(tokens);

  let score = 0;
  for (const kw of card.keywords) {
    // 키워드도 소문자/공백 제거 후 토큰 단위 비교
    const kwTokens = kw
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    // 키워드 토큰 중 하나라도 등장하면 +1
    const matched = kwTokens.some((k) => tokenSet.has(k));
    if (matched) {
      score += 1;
    }
  }

  return score;
}

/**
 * 유저 텍스트를 기반으로
 * 1~21 아르카나 중 "후보 카드"들을 점수화하고,
 * 상위권에서 3장을 뽑아주는 함수.
 *
 * - 기본 로직:
 *   1) 텍스트 토큰화
 *   2) 각 카드에 점수 부여
 *   3) 점수 내림차순 정렬
 *   4) 상위 N장 중에서 약간 랜덤 섞어서 3장 선택
 */
export function pickArcanaCandidates(
  text: string,
  numCandidates: number = 3
): ArcanaCard[] {
  const tokens = tokenize(text);

  // 1) 각 카드에 점수 부여
  const scored = ARCANA.map((card) => ({
    card,
    score: scoreCardByText(card, tokens),
  }));

  // 2) 점수 내림차순 정렬
  scored.sort((a, b) => b.score - a.score);

  // 3) 상위 N장 후보 풀 만들기
  //    - 키워드가 하나도 안 맞으면 score=0 → 그런 카드가 너무 많으면
  //      그냥 ARCANA 전체에서 랜덤 뽑는 것과 다를 바 없으므로
  //      최소 상위 8장 정도만 후보로 사용.
  const TOP_POOL_SIZE = Math.min(8, scored.length);
  const topPool = scored.slice(0, TOP_POOL_SIZE);

  // 4) topPool 안에서 랜덤하게 numCandidates장 선택
  const shuffled = shuffleArray(topPool);
  const picked = shuffled.slice(0, numCandidates).map((item) => item.card);

  return picked;
}

/**
 * 간단한 Fisher-Yates 셔플
 */
function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * id로 카드 찾는 헬퍼 (필요하면 UI나 API에서 활용)
 */
export function getArcanaById(id: number): ArcanaCard | undefined {
  return ARCANA.find((c) => c.id === id);
}
