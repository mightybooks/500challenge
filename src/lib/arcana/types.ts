// src/lib/arcana/types.ts

export type ArcanaId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
                       9 | 10 | 11 | 12 | 13 | 14 |
                       15 | 16 | 17 | 18 | 19 | 20 | 21;

// 아르카나 한 장의 구조
export type ArcanaCard = {
  id: ArcanaId;         // 1~21
  key: string;          // 파일명/식별용
  name: string;         // 카드명
  keywords: string[];   // 추천 알고리즘 매칭용 키워드
  shortMessage: string; // 카드 오픈 시 간단 메시지
  image: string;        // public/arcana/<key>.png
};
