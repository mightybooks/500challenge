// File: src/lib/og500.ts

export type ScoreBand = "amber" | "purple" | "aqua";

type OgAnimal = "unicorn" | "griffin" | "wolf" | "basilisk";

type OgCategoryKey = `${ScoreBand}_${OgAnimal}`;

const OG_ANIMALS: OgAnimal[] = ["unicorn", "griffin", "wolf", "basilisk"];

/**
 * 점수 → 색상 밴드
 * 70점 이상: amber
 * 40점 이상: purple
 * 그 외 / 점수 없음: aqua
 */
export function getScoreBand(score: number | null | undefined): ScoreBand {
  if (typeof score !== "number") return "aqua";
  if (score >= 70) return "amber";
  if (score >= 40) return "purple";
  return "aqua";
}

/**
 * entryId 기반 동물 선택
 * - 같은 id는 항상 같은 동물로 매핑되게 간단 해시 사용
 */
function pickAnimalByEntryId(entryId: string | null | undefined): OgAnimal {
  if (!entryId) return "unicorn";

  let hash = 0;
  for (const ch of entryId) {
    hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  }

  const idx = hash % OG_ANIMALS.length;
  return OG_ANIMALS[idx];
}

/**
 * band + animal 조합별 내부 코드 / 레이블
 * (지금은 문서/큐레이션용 참고 정보. 필요하면 UI에서 써도 됨)
 */
export const OG_CATEGORY_META: Record<
  OgCategoryKey,
  { code: string; labelKo: string }
> = {
  // AMBER 라인 (고득점)
  amber_unicorn: { code: "AMBER_UNICORN", labelKo: "정교한 감성형" },
  amber_griffin: { code: "AMBER_GRIFFIN", labelKo: "구조적 장인형" },
  amber_wolf: { code: "AMBER_WOLF", labelKo: "리듬 좋은 서사형" },
  amber_basilisk: { code: "AMBER_BASILISK", labelKo: "완성도 높은 파격형" },

  // PURPLE 라인 (준수)
  purple_unicorn: { code: "PURPLE_UNICORN", labelKo: "감성 중심 준수형" },
  purple_griffin: { code: "PURPLE_GRIFFIN", labelKo: "틀은 좋은 설계형" },
  purple_wolf: { code: "PURPLE_WOLF", labelKo: "서사 중심 준수형" },
  purple_basilisk: { code: "PURPLE_BASILISK", labelKo: "안전한 실험형" },

  // AQUA 라인 (실험 / 저득점)
  aqua_unicorn: { code: "AQUA_UNICORN", labelKo: "날것 감성형" },
  aqua_griffin: { code: "AQUA_GRIFFIN", labelKo: "설계 전초형" },
  aqua_wolf: { code: "AQUA_WOLF", labelKo: "동력 먼저 서사형" },
  aqua_basilisk: { code: "AQUA_BASILISK", labelKo: "거친 실험형" },
};

/**
 * 점수 + entryId 기반 OG 카드 경로
 * - 점수 → 색상 밴드
 * - entryId → 동물
 * - 최종 파일명: /og/500/{animal}-{band}.png
 */
export function getOgCardPath(params: {
  entryId: string;
  totalScore: number | null;
}): string {
  const { entryId, totalScore } = params;

  const band = getScoreBand(totalScore);
  const animal = pickAnimalByEntryId(entryId);

  return `/og/500/${animal}-${band}.png`;
}
