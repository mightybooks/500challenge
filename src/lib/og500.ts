// File: src/lib/og500.ts

// ===========================
// 기본 타입
// ===========================

// 점수 밴드 (색상대)
export type ScoreBand = "amber" | "purple" | "aqua";

// OG에 쓰이는 동물 타입
export type OgAnimal = "unicorn" | "griffin" | "wolf" | "basilisk";

// 문수림 미학 점수 타입
export type AestheticScores = {
  freeze: number;
  space: number;
  linger: number;
  microParticles: number;
  bleak: number;
  rhythm: number;
  narrativeTurn: number;
  aggroToArt: number;
};

// OG 카드 최종 반환 타입
export type OgCardResult = {
  path: string;        // "/og/500/unicorn-amber.png"
  creature: OgAnimal;  // "unicorn"
  color: ScoreBand;    // "amber"
};


// ===========================
// 점수 → 색 밴드
// ===========================
export function getScoreBand(score: number | null | undefined): ScoreBand {
  if (typeof score !== "number") return "aqua";
  if (score >= 70) return "amber";
  if (score >= 40) return "purple";
  return "aqua";
}


// ===========================
// (새 버전) 문수림 미학 기반 동물 선택
// ===========================
function pickAnimalByAesthetic(a: AestheticScores): OgAnimal {
  const {
    freeze,
    space,
    linger,
    microParticles,
    bleak,
    rhythm,
    narrativeTurn,
    aggroToArt,
  } = a;

  // 1) AggroToArt 감지 → 바실리스크
  if (aggroToArt >= 1) return "basilisk";

  // 2) 정지-공간-여운 합산 → 유니콘
  if (freeze + space + linger >= 28) return "unicorn";

  // 3) 미립자 + 서늘함 → 울프
  if (microParticles >= 12 && bleak >= 4) return "wolf";

  // 4) 리듬 + 전환 → 그리핀
  if (rhythm >= 8 && narrativeTurn >= 5) return "griffin";

  // 5) 기본값 → 그리핀
  return "griffin";
}


// ===========================
// (레거시 fallback) entryId 기반 동물 결정
// ===========================
const OG_ANIMALS: OgAnimal[] = ["unicorn", "griffin", "wolf", "basilisk"];

function pickAnimalByEntryId(entryId: string | null | undefined): OgAnimal {
  if (!entryId) return "unicorn";

  let hash = 0;
  for (const ch of entryId) {
    hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  }
  const idx = hash % OG_ANIMALS.length;
  return OG_ANIMALS[idx];
}


// ===========================
// 공용: 동물 최종 선택
// ===========================
export function decideOgAnimal(params: {
  aesthetic?: Partial<AestheticScores> | null;
  entryId?: string | null;
}): OgAnimal {
  const { aesthetic, entryId } = params;

  if (aesthetic) {
    // 부분 값 들어와도 안전보정
    const full: AestheticScores = {
      freeze: aesthetic.freeze ?? 0,
      space: aesthetic.space ?? 0,
      linger: aesthetic.linger ?? 0,
      microParticles: aesthetic.microParticles ?? 0,
      bleak: aesthetic.bleak ?? 0,
      rhythm: aesthetic.rhythm ?? 0,
      narrativeTurn: aesthetic.narrativeTurn ?? 0,
      aggroToArt: aesthetic.aggroToArt ?? 0,
    };
    return pickAnimalByAesthetic(full);
  }

  // 없으면 기존 방식 사용
  return pickAnimalByEntryId(entryId ?? null);
}


// ===========================
// OG 카드 경로 생성 (확장형)
// ===========================

export function getOgCardDetail(params: {
  totalScore: number | null;
  aesthetic?: Partial<AestheticScores> | null;
  entryId?: string | null;
}): {
  path: string;
  creature: OgAnimal;
  color: ScoreBand;
} {
  const { totalScore, aesthetic, entryId } = params;

  // 색상 밴드
  const band = getScoreBand(totalScore);

  // 동물 (문수림 미학 > entryId fallback)
  const animal = decideOgAnimal({ aesthetic, entryId });

  // 최종 이미지 경로
  const path = `/og/500/${animal}-${band}.png`;

  return {
    path,
    creature: animal,
    color: band,
  };
}
