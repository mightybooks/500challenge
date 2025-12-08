// File: src/lib/arcana/og.ts

import type { WritingMode } from "@/lib/arcana/types";

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
    keywords: [
      "시작", "충동", "미완", "도전", "새출발",
      "첫걸음", "무계획", "실험", "변화",
    ],
  },
  {
    id: 1,
    code: "the-magician",
    krTitle: "1. 마법사",
    krSummary: "이미 가진 재료로 뭔가를 만들어내려는 의지와 집중.",
    keywords: [
      "의지", "집중", "능력", "구현",
      "일", "프로젝트", "창작", "기술",
    ],
  },
  {
    id: 2,
    code: "the-high-priestess",
    krTitle: "2. 여사제",
    krSummary: "겉으로 드러나지 않은 직감과 비밀, 말해지지 않은 감정.",
    keywords: [
      "직감", "비밀", "내면", "침묵",
      "우울", "불안", "고독", "혼자",
    ],
  },
  {
    id: 3,
    code: "the-empress",
    krTitle: "3. 여황제",
    krSummary: "풍요와 돌봄, 감각적인 만족.",
    keywords: [
      "풍요", "돌봄", "감각", "풍성함",
      "가족", "생활", "소비", "위로",
    ],
  },
  {
    id: 4,
    code: "the-emperor",
    krTitle: "4. 황제",
    krSummary: "통제와 책임, 구조를 세우는 힘.",
    keywords: [
      "권위", "통제", "책임", "질서",
      "회사", "상사", "리더", "규칙",
    ],
  },
  {
    id: 5,
    code: "the-hierophant",
    krTitle: "5. 교황",
    krSummary: "전통과 규범, 관계 속에서 배우는 역할.",
    keywords: [
      "전통", "규범", "교사", "멘토",
      "관계", "조언", "조직", "집단",
    ],
  },
  {
    id: 6,
    code: "the-lovers",
    krTitle: "6. 연인",
    krSummary: "끌림과 선택, 관계의 갈림길.",
    keywords: [
      "사랑", "관계", "선택", "갈림길",
      "연애", "커플", "갈등", "유혹",
    ],
  },
  {
    id: 7,
    code: "the-chariot",
    krTitle: "7. 전차",
    krSummary: "정면 돌파, 속도, 경쟁.",
    keywords: [
      "전진", "속도", "경쟁", "집중",
      "목표", "야근", "성과", "몰입",
    ],
  },
  {
    id: 8,
    code: "strength",
    krTitle: "8. 힘",
    krSummary: "지혜, 내면의 힘, 자기통제.",
    keywords: [
     "용기", "분노", "자기통제", "참음", 
     "버티기", "멘탈", "경계", "자존감",
    ],
  },
  {
    id: 9,
    code: "the-hermit",
    krTitle: "9. 은둔자",
    krSummary: "혼자만의 시간, 현실을 재정비하는 고독.",
    keywords: [
      "고독", "사색", "현실", "거리두기",
      "우울", "퇴근길", "혼술", "밤",
    ],
  },
  {
    id: 10,
    code: "wheel-of-fortune",
    krTitle: "10. 운명의 수레바퀴",
    krSummary: "예상치 못한 전환점, 반복되는 패턴.",
    keywords: [
      "운명", "전환", "우연", "반복",
      "변화", "타이밍", "기회", "순환",
    ],
  },
  {
    id: 11,
    code: "justice",
    krTitle: "11. 정의",
    krSummary: "균형 잡힌 판단, 책임을 따지는 순간.",
    keywords: [
      "정의", "판단", "책임", "공정",
      "현실", "계약", "갈등", "결정",
    ],
  },
  {
    id: 12,
    code: "the-hanged-man",
    krTitle: "12. 매달린 남자",
    krSummary: "멈춤을 통한 관점 전환, 유보된 선택.",
    keywords: [
      "멈춤", "희생", "보류", "기다림",
      "정체", "포기", "홀딩", "보류",
    ],
  },
  {
    id: 13,
    code: "death",
    krTitle: "13. 죽음",
    krSummary: "끝이자 시작, 돌아갈 수 없는 변화.",
    keywords: [
      "끝", "종결", "이별", "상실",
      "변화", "재시작", "정리", "단절",
    ],
  },
  {
    id: 14,
    code: "temperance",
    krTitle: "14. 절제",
    krSummary: "섞고 조절하며 균형을 찾는 과정.",
    keywords: [
      "절제", "균형", "중간", "타협",
      "위라벨", "조절", "건강", "식단",
    ],
  },
  {
    id: 15,
    code: "the-devil",
    krTitle: "15. 악마",
    krSummary: "중독과 집착, 알면서도 끊지 못하는 것들.",
    keywords: [
      "집착", "중독", "속박", "유혹",
      "소비", "야식", "알코올", "스마트폰",
    ],
  },
  {
    id: 16,
    code: "the-tower",
    krTitle: "16. 탑",
    krSummary: "갑작스러운 붕괴, 피할 수 없는 사건.",
    keywords: [
      "붕괴", "사고", "파국", "충격",
      "실패", "해고", "이별", "큰일",
    ],
  },
  {
    id: 17,
    code: "the-star",
    krTitle: "17. 별",
    krSummary: "조용한 위안, 멀리 있는 희망.",
    keywords: [
      "희망", "위로", "회복", "기대",
      "추억", "사진", "밤하늘", "소원",
    ],
  },
  {
    id: 18,
    code: "the-moon",
    krTitle: "18. 달",
    krSummary: "불안과 의심, 흐릿한 경계.",
    keywords: [
      "불안", "공포", "의심", "혼란",
      "악몽", "감정기복", "걱정", "밤",
    ],
  },
  {
    id: 19,
    code: "the-sun",
    krTitle: "19. 태양",
    krSummary: "밝은 성취, 관계의 회복과 기쁨.",
    keywords: [
      "행복", "기쁨", "성취", "회복",
      "위라벨", "가족", "휴식", "추억",
      "사진", "여행",
    ],
  },
  {
    id: 20,
    code: "judgement",
    krTitle: "20. 심판",
    krSummary: "과거를 돌아보고 새로 일어서는 순간.",
    keywords: [
      "심판", "평가", "기록", "되돌아봄",
      "결산", "마감", "회고", "재시작",
    ],
  },
  {
    id: 21,
    code: "the-world",
    krTitle: "21. 세계",
    krSummary: "여정의 완성, 하나의 사이클이 끝나는 자리.",
    keywords: [
      "완성", "마무리", "성취", "여정",
      "출간", "프로젝트끝", "졸업", "결실",
    ],
  },
];

export const ARCANA_SCENES: Record<ArcanaId, string> = {
  0: `새로운 출발, 여행은 늘 설레이는 법이죠.
토실이는 첫 촬영을 위한 준비를 모두 마쳤나 봅니다.
헌데, 수리미는 아직 더 체크할 게 남았나 봐요.
어쩌겠어요? 우리 모두 시작의 타이밍은 다 다른 법이잖요`,

  1: `인생의 마법은 어디서 시작되는 걸까요?
수리미가 마법봉을 높이 들어보지만, 그건 어디까지나 평범한 나무막대기입니다.
그나마 토실이가 미스트를 뿌려주니 그럴싸해 보일 뿐이죠.
그렇지만, 우리 모두가 알고 있잖아요, 
인생을 근사하게 만들어주는 건 우리들 내면에 이미 깃들어 있다는 걸.`,

  2: `타인을 잡아끄는 신비함은 어디서 나오는 걸까요?
토실이의 써클렌즈?
수리미의 분장술?
아니면, LED백라이트 덕일까요?
글쎄요, 연출보다는 연출을 할 줄 아는 지혜 덕분일지도 모르죠.`,

  3: `토실이의 손짓 덕에 수리미가 땀을 뻘뻘 흘립니다.
정원을 가득채우기 위해서는 반드시 대가가 필요하죠.
토실이는 수리미에게 어떤 대가를 지불했을까요?
아니, 어쩌면 수리미가 토실이에게 지불하고 있는 중일지도 모르겠네요.`,

  4: `권위는 모두에게 무거운 법이죠.
수리미는 딱딱하고 무거운 갑옷 덕에 벌써부터 숨을 몰아쉬는군요.
덕분에 편안한 쿠션에 기대어 아이스커피를 마시는 토실이가 권위있어 보입니다.
그렇지만 표정이 굳은 거로 봐선 통화내용은 심각한가 보네요.
정말, 누구에게도 가볍지 않다니까요.`,

  5: `관습이란 참 애매합니다.
지키자니 번거롭고, 어기자니 괜히 찝찝하죠.
그건 토실이도 마찬가지입니다.
토실이가 카톨릭 신자도 아니고, 삭발례도 더는 하지 않는 세상인데,
수리미는 전통적인 카드 모양 그대로 연출되길 바라는군요.
정말, 누구 편을 들어주기도 참 애매합니다.`,

  6: `사랑이 피어날 땐 만물이 아름답죠. 
오래된 연인들에겐 집착만이 남지만 말이죠.
그런데 우리가 일상에서 피우는 고집과 집착도 만만하지 않다는 걸 아시나요?
연출을 위해 고집스럽게 살색 타이즈를 입으려고 드는
수리미와 토실이를 보세요.
지켜보는 이들 입장에서는 왜 저러나 싶을 뿐인데 말입니다.`,

  7: `승리는 한 달음에 곧게 뻗어나가서 쟁취했을 때가 멋진 법이죠.
토실이는 승리하기 위한 모든 준비를 마쳤습니다.
황금색 투구를 쓰고, 창을 들었죠.
다만 전차를 끌고 달려야할 수리미는 오래 쪼그리고 기다리느라
다리에 쥐가 났을 뿐입니다.`,

  8: `양치하기 싫다는 토실이를 달래
이빨을 닦아주는 수리미가 지혜로운 걸까요,
아니면 스스로 양치하기 귀찮아서
수리미가 닦아줄 때까지 기다린 토실이가 지혜로운 걸까요?
어느 쪽이든 더 지혜로운 자가 더 힘이 있는 자겠죠?`,

  9: `작은 램프로 자신의 발밑을 비추는 수리미는
흙먼지와 안개를 단박에 구분하고
어떻게 대처해야 좋은지도 너무나 잘 알고 있죠.
다만 그게 
한발짝 떨어진 곳에서 토실이가 일으킨 흙먼지라는 걸 모를 뿐이죠.`,

  10: `누구도 거대한 운명의 수레바퀴를 피할 수는 없습니다.
그렇다면 긴장해서 잔뜩 움츠러들어있기 보단
토실이와 수리미처럼 적당히 바퀴에 기대어 보는 건 어떨까요?
어쩌면 목적지까지 편하게 굴러갈 수 있을지도 모릅니다.
아, 구르는 동안 적당히 까지고 다칠 수도 있지만 말입니다.`,

  11: `눈을 가리고 저울과 칼을 들고 있어야할 토실이가
칼만 두 자루를 쥐고 있습니다.
저울을 들고 긴장하는 건 오히려 보호받아야할 수리미죠.
그렇습니다. 어쩌면 공평함이란 것 자체가 환상일지도 모릅니다.
우린 자신을 위해 늘 준비하는 자세로 있어야 하는 거죠.`,

  12: `인내나 희생도 적절한 보상이 없다면 누구도 하지 않을 일입니다.
감당할 수 있는 만큼 감당하고,
할 수 있을 만큼만 하다보면 저절로 기회가 올겁니다.
잠시 거꾸로 매달려서 나머지는 수리미가 CG로 해주리라 믿는 토실이처럼
뭐든, 적당히 해보자는 말입니다.`,

  13: `죽음의 낫을 든 토실이가 수리미를 밟고 올라섰군요.
지금 당장은 토실이의 완벽한 승리입니다.
하지만 우리 인생은 자고로 삼세판이 기본 셈법이었죠.
수리미의 패배는 세 번 중 고작 한번일 뿐입니다.
오히려 지금의 패배로 다음 수를 예측할 수 있게되었을지도 모르죠.`,

  14: `컵을 들고 물정난을 하는 토실이를 수리미가 신중하게 카메라로 담아냅니다.
카메라에 물을 담아내는 것만큼 어려운 일도 없으니까요.
그럼에도 촬영을 성공할 수 있는 건
토실이와 수리미의 적절한 조화 덕이죠.
셔터 스피드를 따라 천천히 움직이는 토실이를 보세요.
프로 모델이나 다름없습니다.`,

  15: `세상에 겉만 번지르르한 경우는 허다하죠.
알맹이 없는 문장들로 채워진 책들이 허다하듯이 말이죠.
이번에는 수리미가 그렇군요. 
악마 분장은 그럴싸했지만, 여전히 토실이에겐 힘을 쓰지 못하는군요.
저 꼬리의 불은 분명 수리미의 똥꼬까지 바짝 타들어갈 게 뻔합니다.`,

  16: `공든 건물도 시공사가 부실하면 부서질 수 있는 게 세상이죠.
수리미와 토실이의 젠가놀이는
끝이 예견된 놀이임에도 술래 입장에서는 그저 당혹스럽기만 합니다.
뭐, 그래도 젠가가 허물어진 거지 수리미가 허물어진 건 아니니까요.
다음 판은 토실이도 쉽지 않을 겁니다.`,

  17: `스튜디오에서 물장난을 치고 있는 토실이와 수리미가 걱정되는군요.
단벌 신사인 수리미 입장에서는 치명타일 테니까요.
그래도 걱정없이 즐기는 걸 보면
미래를 걱정하기 보단 현재를 즐기며 낙관하기로 했나 봅니다.
좋은 자세인 거 같아요.
뭐, 좀 젖었다면, 벗어놓고 알몸으로 뛰어서라도 퇴근하면 되겠죠.`,

  18: `우리 모두 야생의 본능이 남아있는 짐승들이죠.
토실이를 보세요. 초식동물이면서도 달을 보며 하울링을 합니다.
아마 먹다 남긴 건초가 생각나서겠죠.
수리미가 애처로운 건 그 건초를 자신의 지갑을 털어 사서겠죠.
스튜디오가 시끄러운 건 둘의 허황된 욕심 때문일 겁니다.`,

  19: `활짝 웃어보이는 토실이의 얼굴이 마치 어린아이의 얼굴 같네요.
오늘은 수리미도 토실이가 무겁지 않나 봅니다.
그렇죠, 우리 모두에게 이런 날이 한 번씩은 찾아오는 법이죠.
아무리 웃어도 무해하기만 한 그런 날 말입니다.`,

  20: `토실이의 나팔은 장난감 인형들에게
때로는 기상나팔이고,
때로는 식사시간 알람이고,
때로는 취침신호입니다.
모든 게 토실이의 나팔소리로 결정이 나죠.
사실은 수리미의 컷 사인에서 결정나는 것이지만,
장난감 인형들은 그런 건 전혀 모른답니다.`,

  21: `모든 촬영이 순조롭게 끝마쳤습니다.
이제 토실이가 와이어에서 내려오기만 하면 되겠네요.
아, 수리미는 LED백라이트도 끄고, 와이어도 감아둬야 할테고요.
그리고 또 토실이는 뒷정리를 하고, 수리미는 청소를 하고, 또,
또, 또, 또, 세상은 그런 식으로 계속 굴러갈 테죠.`,
};

// =======================================
// 3. 이미지 경로 / 헬퍼
// =======================================

// 뒷면 이미지 (고정)
export const ARCANA_BACK_IMAGE_NOVEL = "/og/arcana/back-novel.png";
export const ARCANA_BACK_IMAGE_ESSAY = "/og/arcana/back-essay.png";
// 점수 미달 전용 루저 카드 OG
export const ARCANA_LOSER_IMAGE = "/og/arcana/losercardv2.png";

// 예전 코드들 하위 호환용
export const ARCANA_BACK_IMAGE = ARCANA_BACK_IMAGE_NOVEL;

// WritingMode는 아까 정의한 타입 기준
export function getArcanaFallbackOg(mode?: WritingMode | null): string {
  if (mode === "essay") return ARCANA_BACK_IMAGE_ESSAY;
  // 기본값: 소설 모드 카드 뒷면
  return ARCANA_BACK_IMAGE_NOVEL;
}

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
  if (!card) return "/og/arcana/ogdefault.png";
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
