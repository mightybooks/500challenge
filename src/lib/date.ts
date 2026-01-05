// File: src/lib/date.ts

/**
 * KST(Asia/Seoul) 기준 날짜 문자열 반환
 * 형식: YYYY-MM-DD
 * 서버 로케일 / UTC 역전 문제 없음
 */
export function getKstYmd(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}
