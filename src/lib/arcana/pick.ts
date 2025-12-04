// File: src/lib/arcana/pick.ts
import { ARCANA_META, type ArcanaCard } from "./og";
import type { ArcanaId } from "./og";
import { ARCANA_KEYWORDS_FROM_SEEDS } from "./seed-keywords";

/**
 * 태그 → 정서/키워드 alias 매핑
 * - 실제로 자주 쓰는 해시태그 위주로만 시작해도 됩니다.
 * - 필요할 때 하나씩 추가해가면 됩니다.
 */
const BASE_TAG_ALIAS_MAP: Record<string, string[]> = {
  // 🔹 일 / 커리어
  업무스트레스: ["스트레스", "현실", "노동", "회사", "압박"],
  야근: ["야근", "일", "회사", "전진", "속도", "성과"],
  퇴사욕구: ["퇴사", "끝", "변화", "새출발", "정리"],
  번아웃: ["번아웃", "지침", "무기력", "멈춤", "휴식"],
  이직고민: ["이직", "갈림길", "선택", "변화"],
  프로젝트지옥: ["프로젝트", "압박", "야근", "몰입"],

  // 🔹 감정
  불안: ["불안", "공포", "의심", "혼란"],
  우울: ["우울", "고독", "침묵"],
  공허함: ["공허", "허무", "멍해짐"],
  자기혐오: ["혐오", "자책", "죄책감"],
  무기력: ["무기력", "지침", "멈춤"],

  // 🔹 관계 / 연애
  짝사랑: ["짝사랑", "일방적", "기대", "관계"],
  이별: ["이별", "단절", "끝", "상실"],
  권태기: ["권태", "무료함", "갈등"],
  장거리연애: ["거리", "그리움", "기다림"],
  가족갈등: ["가족", "갈등", "책임"],

  // 🔹 워라벨 / 회복
  워라밸: ["워라밸", "균형", "휴식", "조절"],
  주말힐링: ["주말", "휴식", "회복"],
  여행욕구: ["여행", "탈출", "변화", "자유"],
  혼자만의시간: ["혼자", "고독", "휴식"],

  // 🔹 중독 / 집착
  명품집착: ["명품", "소비", "집착", "욕망"],
  쇼핑중독: ["쇼핑", "소비", "중독"],
  스마트폰중독: ["스마트폰", "중독", "회피"],
  알코올의존: ["알코올", "중독", "야식"],

  // 🔹 분노 / 경쟁
  분노: ["분노", "폭발", "힘", "충돌"],
  질투: ["질투", "비교", "욕망"],
  경쟁의식: ["경쟁", "속도", "승부"],

  // 🔹 자아 / 정체성
  나만빼고다행복해보임: ["비교", "외로움", "열등감"],
  정체성혼란: ["혼란", "정체성", "방향상실"],
};

/**
 * 시드 기반 키워드를 TAG_ALIAS_MAP에 자동 주입
 */
function buildTagAliasMap(): Record<string, string[]> {
  const map: Record<string, string[]> = { ...BASE_TAG_ALIAS_MAP };

  Object.values(ARCANA_KEYWORDS_FROM_SEEDS).forEach((keywords) => {
    keywords.forEach((kw) => {
      // 이미 수동 정의된 단어면 건들지 않음
      if (!map[kw]) {
        map[kw] = [kw]; // 자기 자신이라도 alias로 등록
      }
    });
  });

  return map;
}

const TAG_ALIAS_MAP = buildTagAliasMap();

/**
 * 해시태그 정규화
 * - 앞의 # 제거
 * - alias 맵을 통해 정서 키워드로 확장
 */
function normalizeTags(rawTags: string[]): string[] {
  return rawTags.flatMap((raw) => {
    const base = raw.replace(/^#/, "").trim(); // "#추억" → "추억"
    const aliases = TAG_ALIAS_MAP[base] ?? [];
    return [base, ...aliases];
  });
}


// 배열 셔플용 유틸 (앵커가 항상 첫 번째에 안 오도록 하기 위함)
function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * 아르카나 후보 3장 선택 (단순/명료 버전)
 * - entryTags가 비어 있으면 완전 랜덤
 * - 태그가 있으면 카드의 keywords와 겹치는 개수로 점수 계산
 * - anchorId가 있으면 반드시 후보에 포함
 */
export function pickArcanaCandidates(params: {
  entryTags?: string[] | null | undefined;
  anchorId?: ArcanaId | null;
  count?: number;
}): ArcanaCard[] {
  const entryTagsSafe: string[] = Array.isArray(params.entryTags)
    ? params.entryTags
    : [];

  const count = params.count ?? 3;

  // 1) 태그 정규화: ["야근"] → ["야근","일","회사","전진",...]
  const normTags = normalizeTags(entryTagsSafe);

  // 2) 전체 카드 풀
  const allCards = [...ARCANA_META];

  // 3) 앵커 카드 확보 (있으면 무조건 포함)
  let anchorCard: ArcanaCard | null = null;
  if (params.anchorId != null) {
    const found = allCards.find((c) => c.id === params.anchorId) ?? null;
    if (found) {
      anchorCard = found;
    }
  }

  const picked: ArcanaCard[] = [];
  if (anchorCard) {
    picked.push(anchorCard);
  }

  // 4) 앵커를 제외한 나머지 카드들
  const remaining = anchorCard
    ? allCards.filter((c) => c.id !== anchorCard!.id)
    : allCards;

  // 5) 태그가 있다면, keywords와의 겹치는 개수로 점수 계산
  type Scored = { card: ArcanaCard; score: number };

  let scored: Scored[] = [];

  if (normTags.length > 0) {
    const tagSet = new Set(normTags);

    scored = remaining.map((card) => {
      let score = 0;
      for (const kw of card.keywords) {
        if (tagSet.has(kw)) score += 1;
      }
      return { card, score };
    });

    // 점수 0인 카드들은 일단 버림
    scored = scored.filter((s) => s.score > 0);

    // 점수순 정렬 (내림차순)
    scored.sort((a, b) => b.score - a.score);
  }

  // 6) 점수 있는 카드들에서 높은 순으로 채우기
  for (const s of scored) {
    if (picked.length >= count) break;
    picked.push(s.card);
  }

  // 7) 아직 부족하면 남은 카드들에서 랜덤으로 채우기
  if (picked.length < count) {
    const alreadyPickedIds = new Set(picked.map((c) => c.id));
    const fallbackPool = remaining.filter((c) => !alreadyPickedIds.has(c.id));

    // 살짝 섞어주고 앞에서부터 채우기
    shuffleInPlace(fallbackPool);

    for (const c of fallbackPool) {
      if (picked.length >= count) break;
      picked.push(c);
    }
  }

  // 8) 최종 후보도 한 번 섞어서, 앵커가 항상 0번에 있지는 않게 처리
  shuffleInPlace(picked);

  // 9) count 초과하면 잘라내기 (이론상 초과는 거의 없겠지만 안전용)
  return picked.slice(0, count);
}
