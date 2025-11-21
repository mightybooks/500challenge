// File: src/lib/date.ts

// 한국 시간(Asia/Seoul) 기준 "YYYY-MM-DD" 문자열 반환
export function getKstYmd(): string {
  const now = new Date();
  const kstString = now.toLocaleString("en-US", { timeZone: "Asia/Seoul" });
  const kst = new Date(kstString);
  return kst.toISOString().slice(0, 10); // "2025-11-21" 같은 형식
}
