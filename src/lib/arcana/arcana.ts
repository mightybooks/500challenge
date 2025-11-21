// src/lib/arcana/arcana.ts

export type ArcanaCard = {
  id: number;
  key: string;
  name: string;
  keywords: string[];
  shortMessage: string;  // 유저가 카드 선택 후 띄울 짧은 한 줄 메시지
  image: string;         // 나중에 public/arcana/<key>.png 로 대응
};

// 0번(Fool)는 메인 OG 카드로 사용하므로 제외.
// 1~21번만 제공.
export const ARCANA: ArcanaCard[] = [
  {
    id: 1,
    key: "magician",
    name: "The Magician",
    keywords: ["의지", "실행", "기술", "창조", "집중", "능력", "자원 활용"],
    shortMessage: "당신의 의지가 현실을 움직입니다.",
    image: "/arcana/magician.png",
  },
  {
    id: 2,
    key: "highPriestess",
    name: "The High Priestess",
    keywords: ["직감", "잠재의식", "관찰", "비밀", "통찰", "신중함"],
    shortMessage: "조용한 신호에 귀를 기울일 때입니다.",
    image: "/arcana/highPriestess.png",
  },
  {
    id: 3,
    key: "empress",
    name: "The Empress",
    keywords: ["풍요", "돌봄", "감각", "성장", "안정", "배려", "창조성"],
    shortMessage: "따뜻한 돌봄이 당신을 감쌉니다.",
    image: "/arcana/empress.png",
  },
  {
    id: 4,
    key: "emperor",
    name: "The Emperor",
    keywords: ["질서", "구조", "통제", "권위", "책임", "결단"],
    shortMessage: "경계를 세우고 중심을 잡아야 합니다.",
    image: "/arcana/emperor.png",
  },
  {
    id: 5,
    key: "hierophant",
    name: "The Hierophant",
    keywords: ["전통", "교훈", "조언", "배움", "체계", "소속", "신뢰"],
    shortMessage: "당신의 길을 비춰줄 지혜가 곁에 있습니다.",
    image: "/arcana/hierophant.png",
  },
  {
    id: 6,
    key: "lovers",
    name: "The Lovers",
    keywords: ["선택", "관계", "감정", "조화", "유혹", "가치 충돌"],
    shortMessage: "가장 중요한 것은 결국 ‘선택’입니다.",
    image: "/arcana/lovers.png",
  },
  {
    id: 7,
    key: "chariot",
    name: "The Chariot",
    keywords: ["의지력", "돌파", "추진", "승리", "집중", "속도"],
    shortMessage: "당신은 지금 앞으로 나아갈 힘을 갖고 있습니다.",
    image: "/arcana/chariot.png",
  },
  {
    id: 8,
    key: "strength",
    name: "Strength",
    keywords: ["인내", "회복력", "내적 용기", "조절", "견딤"],
    shortMessage: "부드러운 용기가 진짜 힘입니다.",
    image: "/arcana/strength.png",
  },
  {
    id: 9,
    key: "hermit",
    name: "The Hermit",
    keywords: ["고독", "탐구", "성찰", "거리두기", "지혜"],
    shortMessage: "혼자만의 시간이 답을 보여줍니다.",
    image: "/arcana/hermit.png",
  },
  {
    id: 10,
    key: "wheelOfFortune",
    name: "Wheel of Fortune",
    keywords: ["변화", "전환점", "흐름", "순환", "기회", "타이밍"],
    shortMessage: "바람이 바뀌려 합니다.",
    image: "/arcana/wheelOfFortune.png",
  },
  {
    id: 11,
    key: "justice",
    name: "Justice",
    keywords: ["균형", "공정", "명확성", "평가", "책임"],
    shortMessage: "사실을 정면으로 바라봐야 할 때입니다.",
    image: "/arcana/justice.png",
  },
  {
    id: 12,
    key: "hangedMan",
    name: "The Hanged Man",
    keywords: ["정지", "관점 변화", "포기", "수용", "전환 전 고요"],
    shortMessage: "잠시 멈춰야만 보이는 풍경이 있습니다.",
    image: "/arcana/hangedMan.png",
  },
  {
    id: 13,
    key: "death",
    name: "Death",
    keywords: ["종결", "재시작", "정리", "단절", "필연적 변화"],
    shortMessage: "무언가를 놓아야 새 것이 들어옵니다.",
    image: "/arcana/death.png",
  },
  {
    id: 14,
    key: "temperance",
    name: "Temperance",
    keywords: ["조화", "절제", "중용", "회복", "섞임"],
    shortMessage: "과하지도 모자라지도 않는 조율의 순간입니다.",
    image: "/arcana/temperance.png",
  },
  {
    id: 15,
    key: "devil",
    name: "The Devil",
    keywords: ["집착", "유혹", "중독", "속박", "패턴 반복"],
    shortMessage: "당신을 붙잡는 끈이 무엇인지 관찰하세요.",
    image: "/arcana/devil.png",
  },
  {
    id: 16,
    key: "tower",
    name: "The Tower",
    keywords: ["붕괴", "충격", "폭로", "급변", "재정립"],
    shortMessage: "낡은 구조가 무너질 때 새 길이 열립니다.",
    image: "/arcana/tower.png",
  },
  {
    id: 17,
    key: "star",
    name: "The Star",
    keywords: ["희망", "재생", "치유", "영감", "정화"],
    shortMessage: "믿어도 좋습니다. 길이 열립니다.",
    image: "/arcana/star.png",
  },
  {
    id: 18,
    key: "moon",
    name: "The Moon",
    keywords: ["모호함", "불안", "착각", "그림자", "예민함"],
    shortMessage: "확신은 잠시 미뤄두고 느낌을 관찰하세요.",
    image: "/arcana/moon.png",
  },
  {
    id: 19,
    key: "sun",
    name: "The Sun",
    keywords: ["명료함", "기쁨", "생동감", "낙관", "성공"],
    shortMessage: "따뜻한 빛이 당신을 향하고 있습니다.",
    image: "/arcana/sun.png",
  },
  {
    id: 20,
    key: "judgement",
    name: "Judgement",
    keywords: ["부름", "각성", "결단", "재정의", "평가"],
    shortMessage: "당신을 부르는 목소리가 있습니다.",
    image: "/arcana/judgement.png",
  },
  {
    id: 21,
    key: "world",
    name: "The World",
    keywords: ["완성", "통합", "성취", "순환", "마무리"],
    shortMessage: "길이 한 바퀴 돌아 당신에게 돌아옵니다.",
    image: "/arcana/world.png",
  },
];
