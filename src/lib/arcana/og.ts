// File: src/lib/arcana/og.ts

// =======================================
// 1. 타입 정의
// =======================================

export type ArcanaId = number; // 0~21

export type ArcanaCard = {
  id: ArcanaId;
  code: string;        // "fool", "the-magician", ...
  krTitle: string;     // 한국어 타이틀 (선택 화면에 사용 가능)
  keywords: string[];  // 추천 로직 용 키워드
  krSummary: string;   // 카드 뜻 요약 한 줄
};

// =======================================
// 2. 메이저 아르카나 메타데이터
// =======================================

export const ARCANA_META: ArcanaCard[] = [
  {
    id: 0,
    code: "fool",
    krTitle: "0. 광대",
    krSummary: "계획보다 충동이 앞서는 시작, 미완의 가능성.",
    keywords: ["시작", "무지", "충동", "미완"],
  },
  {
    id: 1,
    code: "the-magician",
    krTitle: "1. 마법사",
    krSummary: "이미 가진 재료로 뭔가를 만들어내려는 의지와 집중.",
    keywords: ["의지", "집중", "능력", "구현"],
  },
  {
    id: 2,
    code: "the-high-priestess",
    krTitle: "2. 여사제",
    krSummary: "겉으로 말하지 못한 감정, 조용한 직관과 내면의 탐색.",
    keywords: ["직감", "내면", "비밀", "정적"],
  },
  {
    id: 3,
    code: "the-empress",
    krTitle: "3. 여황제",
    krSummary: "감정과 이미지가 풍성하게 자라는 상태, 돌봄과 성장.",
    keywords: ["풍요", "성장", "감정", "창조"],
  },
  {
    id: 4,
    code: "the-emperor",
    krTitle: "4. 황제",
    krSummary: "흐트러진 것을 구조화하고 통제하려는 책임감.",
    keywords: ["통제", "구조", "질서", "책임"],
  },
  {
    id: 5,
    code: "the-hierophant",
    krTitle: "5. 교황",
    krSummary: "이미 정해진 규칙과 전통 속에서 답을 찾으려는 태도.",
    keywords: ["전통", "조언", "지식", "체계"],
  },
  {
    id: 6,
    code: "the-lovers",
    krTitle: "6. 연인",
    krSummary: "관계와 선택 앞에서 망설이는 마음, 둘 사이의 균형.",
    keywords: ["선택", "관계", "조화", "감정"],
  },
  {
    id: 7,
    code: "the-chariot",
    krTitle: "7. 전차",
    krSummary: "속도를 올려 밀어붙이려는 추진력과 경쟁심.",
    keywords: ["진행", "결단", "속도", "야망"],
  },
  {
    id: 8,
    code: "strength",
    krTitle: "8. 힘",
    krSummary: "억누르기보다 달래며 버티는 조용한 인내심.",
    keywords: ["용기", "내적 힘", "인내", "절제"],
  },
  {
    id: 9,
    code: "the-hermit",
    krTitle: "9. 은둔자",
    krSummary: "관계를 잠시 멀리하고 스스로를 돌아보는 고독의 시간.",
    keywords: ["고독", "탐구", "회상", "내면"],
  },
  {
    id: 10,
    code: "wheel-of-fortune",
    krTitle: "10. 운명의 수레바퀴",
    krSummary: "나 때문이라기보다, 흐름이 바뀌는 전환의 순간.",
    keywords: ["변화", "전환", "순환", "우연"],
  },
  {
    id: 11,
    code: "justice",
    krTitle: "11. 정의",
    krSummary: "이득과 손해를 냉정하게 저울질하는 균형 감각.",
    keywords: ["균형", "판단", "책임", "진실"],
  },
  {
    id: 12,
    code: "the-hanged-man",
    krTitle: "12. 매달린 남자",
    krSummary: "일부러 멈춰 서서, 다른 각도로 상황을 보는 정지 상태.",
    keywords: ["정지", "희생", "관점", "포기"],
  },
  {
    id: 13,
    code: "death",
    krTitle: "13. 죽음",
    krSummary: "예전 방식과의 단절, 새로운 국면으로의 강제 전환.",
    keywords: ["종결", "전환", "단절", "재시작"],
  },
  {
    id: 14,
    code: "temperance",
    krTitle: "14. 절제",
    krSummary: "극단 사이에서 온도를 맞추려는 조율과 섞임.",
    keywords: ["조율", "균형", "중용", "회복"],
  },
  {
    id: 15,
    code: "the-devil",
    krTitle: "15. 악마",
    krSummary: "알면서도 끊지 못하는 집착, 중독적인 관계나 생각.",
    keywords: ["유혹", "집착", "속박", "억눌림"],
  },
  {
    id: 16,
    code: "the-tower",
    krTitle: "16. 탑",
    krSummary: "쌓아 올린 것이 한 번에 무너지는 사건, 강제 리셋.",
    keywords: ["붕괴", "대격변", "위기", "각성"],
  },
  {
    id: 17,
    code: "the-star",
    krTitle: "17. 별",
    krSummary: "당장 해결은 아니어도, 다시 해볼까 싶은 희미한 희망.",
    keywords: ["희망", "회복", "기대", "청명"],
  },
  {
    id: 18,
    code: "the-moon",
    krTitle: "18. 달",
    krSummary: "확신은 없고 감정만 크게 흔들리는, 불안과 상상의 구간.",
    keywords: ["불안", "환상", "감정", "모호함"],
  },
  {
    id: 19,
    code: "the-sun",
    krTitle: "19. 태양",
    krSummary: "숨길 것 없이 드러나는 성취감, 밝고 단순한 기쁨.",
    keywords: ["성취", "기쁨", "확신", "명료"],
  },
  {
    id: 20,
    code: "judgement",
    krTitle: "20. 심판",
    krSummary: "미뤄둔 것들을 정리하고, 다음 단계로 넘어가라는 호출.",
    keywords: ["부름", "변화", "자각", "정리"],
  },
  {
    id: 21,
    code: "the-world",
    krTitle: "21. 세계",
    krSummary: "한 사이클이 잘 마무리되고, 다음 여정을 준비하는 완성.",
    keywords: ["완성", "통합", "마무리", "여정"],
  },
];

// =======================================
// 3. 이미지 경로 / 헬퍼
// =======================================

// 뒷면 이미지 (고정)
export const ARCANA_BACK_IMAGE = "/og/arcana/back.png";

/** id로 카드 메타를 찾아오는 유틸 */
export function getArcanaById(id: ArcanaId | null | undefined): ArcanaCard | null {
  if (id == null) return null;
  const card = ARCANA_META.find(c => c.id === id);
  return card ?? null;
}

/** 카드 메타에서 앞면 이미지 경로 생성 */
export function getArcanaImagePathFromMeta(card: ArcanaCard): string {
  const index = String(card.id).padStart(2, "0");
  return `/og/arcana/${index}-${card.code}.png`;
}

/** id로 앞면 이미지 경로 생성 (기존 사용처 호환용) */
export function getArcanaImagePath(id: ArcanaId | null | undefined): string {
  const card = getArcanaById(id);
  if (!card) return "/og/arcana/00-fool.png";
  return getArcanaImagePathFromMeta(card);
}

// =======================================
// 4. “키워드 / 글” 기반으로 3장 후보 선정
// =======================================
//
// 입력값은 평가 결과에서 keywords 배열을 뽑아 넣거나,
// 서사/정서 단서 몇 개를 넣어도 됨.
//

export function pickArcanaCandidatesFromKeywords(
  userKeywords: string[],
  count = 3,
): ArcanaId[] {
  if (!Array.isArray(userKeywords) || userKeywords.length === 0) {
    // 키워드가 없으면 완전 랜덤 3장
    return pickRandomArcana(count);
  }

  const normalized = userKeywords
    .filter(Boolean)
    .map(k => k.toString().toLowerCase());

  const scoreMap: Map<ArcanaId, number> = new Map();

  for (const card of ARCANA_META) {
    let score = 0;
    for (const kw of normalized) {
      for (const ckw of card.keywords) {
        const c = ckw.toLowerCase();
        if (kw.includes(c) || c.includes(kw)) {
          score += 1;
        }
      }
    }
    scoreMap.set(card.id, score);
  }

  const sorted = [...scoreMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);

  const top = sorted.slice(0, count);

  // 혹시 점수 0의 카드만 있다면? → 완전 랜덤 대체
  const valid = top.filter((id) => (scoreMap.get(id) ?? 0) > 0);
  if (valid.length === 0) return pickRandomArcana(count);

  return top;
}

// =======================================
// 5. 랜덤 N장 뽑기
// =======================================

export function pickRandomArcana(n = 3): ArcanaId[] {
  const ids = ARCANA_META.map((c) => c.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[r]] = [ids[r], ids[i]];
  }
  return ids.slice(0, n);
}
