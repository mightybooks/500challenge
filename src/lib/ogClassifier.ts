// File: src/lib/ogClassifier.ts

export type AnimalType = "unicorn" | "griffin" | "wolf" | "basilisk";

export type SurimEval = {
  // 미학 68점
  firstSentence: number;   // 0~8  (첫 문장 흡입력)
  freeze: number;          // 0~10 (정지)
  space: number;           // 0~10 (공간화)
  linger: number;          // 0~10 (여운)
  bleak: number;           // 0~6  (암담 인식)
  detour: number;          // 0~8  (우회)
  microRecovery: number;   // 0~6  (미세 회복)
  rhythm: number;          // 0~4  (문장·리듬)
  microParticles: number;  // 0~6  (정서적 미립자)

  // 서사 22점
  narrativeScore: number;  // 0~22

  // 창의성·OG 10점
  layer: number;           // 의미 단층 (0~10 사이에서 운용 가정)
  world: number;           // 세계관 매칭력
  theme: number;           // 주제적 선명도
};

/**
 * 문수림 미학 기반 자동 동물 분류
 * - 점수 기반 100% 자동화
 * - Aggro가 강하면 바실리스크 우선
 * - 감성/구조/미립자 축으로 유니콘·그리핀·울프 분기
 */
export function classifyAnimal(score: SurimEval): AnimalType {
  // 1) 유니콘: 감성·정서 중심형
  const emotionalPower =
    score.freeze + score.space + score.linger + score.microParticles;

  // 2) 그리핀: 구조·리듬 중심형
  const structuralPower =
    score.narrativeScore + score.rhythm + score.firstSentence;

  // 3) 울프: 미세 정서입자 + 회복
  const microEmo =
    score.microParticles + score.microRecovery + score.linger;

  // 4) 바실리스크: Aggro to Art / 의미 단층 / 비약
  const aggro =
    score.layer + score.world + score.theme + score.bleak;

  // 바실리스크 우선 배정
  if (aggro >= 12 || score.layer >= 4) {
    return "basilisk";
  }

  // 감성 계열이 더 강하면 유니콘
  if (emotionalPower >= structuralPower && emotionalPower >= microEmo) {
    return "unicorn";
  }

  // 구조 계열이 더 강하면 그리핀
  if (structuralPower > emotionalPower && structuralPower >= microEmo) {
    return "griffin";
  }

  // 나머지는 울프 (정서입자 계열)
  return "wolf";
}
