// src/lib/anon.ts

// 브라우저 환경에서 anon_id를 보장해 주는 유틸입니다.
// - 쿠키에 anon_id가 있으면: 그 값을 그대로 사용
// - 쿠키에 없고 localStorage에만 있으면: 쿠키로 동기화
// - 둘 다 없으면: 새 anon_id를 만들고 쿠키 + localStorage에 저장
//
// SSR(서버)에서는 document/window가 없으므로 빈 문자열을 반환합니다.
// 서버에서 anon_id가 필요하면 next/headers의 cookies()로 직접 읽어야 합니다.

export function ensureAnonId(): string {
  // SSR일 때는 건너뜀 (미들웨어/서버 코드에서 처리)
  if (typeof document === "undefined" || typeof window === "undefined") {
    return "";
  }

  // 1) 쿠키에서 anon_id 찾기
  const cookieMatch = document.cookie.match(/(?:^|; )anon_id=([^;]+)/);
  if (cookieMatch?.[1]) {
    const id = decodeURIComponent(cookieMatch[1]);
    // 쿠키에 있는데 localStorage에는 없을 수 있으니 한 번 동기화
    syncLocalStorage(id);
    return id;
  }

  // 2) localStorage에서 anon_id 찾기
  const stored = window.localStorage.getItem("anon_id");
  if (stored) {
    setCookie("anon_id", stored, 400);
    return stored;
  }

  // 3) 둘 다 없으면 새 anon_id 발급
  //    구분이 쉽도록 접두어를 붙여둡니다.
  const id = `anon_${getRandomId()}`;
  window.localStorage.setItem("anon_id", id);
  setCookie("anon_id", id, 400);
  return id;
}

// 쿠키에 이미 anon_id가 있다고 가정하고, 읽기만 필요한 경우에 사용.
// 브라우저 전용입니다.
export function readAnonIdFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|; )anon_id=([^;]+)/);
  return m?.[1] ? decodeURIComponent(m[1]) : null;
}

// 내부용: localStorage 동기화
function syncLocalStorage(id: string) {
  try {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("anon_id");
    if (!stored) {
      window.localStorage.setItem("anon_id", id);
    }
  } catch {
    // localStorage 접근 실패해도 앱 동작에는 지장 없으니 조용히 무시
  }
}

// 안전한 랜덤 ID 생성
function getRandomId(): string {
  const g: any = globalThis as any;

  if (g.crypto && typeof g.crypto.randomUUID === "function") {
    return g.crypto.randomUUID();
  }

  // 폴백: UUID v4 스타일
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 브라우저 쿠키 설정
function setCookie(name: string, value: string, days: number) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${d.toUTCString()}`;

  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; ${expires}; path=/; SameSite=Lax`;
}
