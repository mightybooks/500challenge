// File: src/components/EntryShareBar.tsx
"use client";

import { useEffect, useState } from "react";

type Props = {
  title: string;
};

declare global {
  interface Window {
    Kakao?: any;
  }
}

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

// 현재 URL
function getCurrentUrl(): string {
  if (typeof window === "undefined") return "";
  return window.location.href;
}

export function EntryShareBar({ title }: Props) {
  const [kakaoReady, setKakaoReady] = useState(false);
  const [copied, setCopied] = useState(false);

  // ------------- Kakao SDK 로딩 & 초기화 -------------
  useEffect(() => {
    if (!KAKAO_JS_KEY) return;
    if (typeof window === "undefined") return;

    // 이미 초기화된 경우
    if (window.Kakao && window.Kakao.isInitialized()) {
      if (window.Kakao.Link) {
        setKakaoReady(true);
      }
      return;
    }

    // SDK 스크립트 주입
    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";
    script.async = true;
    script.onload = () => {
      try {
        if (window.Kakao && !window.Kakao.isInitialized()) {
          window.Kakao.init(KAKAO_JS_KEY);
        }
        if (window.Kakao && window.Kakao.Link) {
          setKakaoReady(true);
        }
      } catch (err) {
        console.error("Kakao init error:", err);
      }
    };
    script.onerror = () => {
      console.error("Kakao SDK load error");
    };
    document.head.appendChild(script);

    // SDK는 유지
  }, []);

  // ------------- 공유 기능 -------------


  // ✅ 카카오 공유: URL 스크랩 방식
  const handleKakaoShare = () => {
    if (typeof window === "undefined") return;

    if (!kakaoReady || !window.Kakao || !window.Kakao.Link) {
      alert("카카오 공유를 준비하는 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    const url = getCurrentUrl();
    if (!url) return;

    try {
      window.Kakao.Link.sendScrap({
        requestUrl: url,
      });
    } catch (e) {
      console.error("Kakao share error:", e);
    }
  };

  // 트위터(X)
  const handleTwitterShare = () => {
    const url = getCurrentUrl();
    if (!url) return;

    const shareUrl = new URL("https://twitter.com/intent/tweet");
    shareUrl.searchParams.set("url", url);
    shareUrl.searchParams.set("text", `500자 소설 – ${title}`);
    window.open(shareUrl.toString(), "_blank", "noopener,noreferrer");
  };

  // 페이스북
  const handleFacebookShare = () => {
    const url = getCurrentUrl();
    if (!url) return;

    const shareUrl =
      "https://www.facebook.com/sharer/sharer.php?u=" +
      encodeURIComponent(url);
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  // 링크 복사
  const handleCopy = async () => {
    try {
      const url = getCurrentUrl();
      if (!url) return;

      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // ------------- UI (버튼 전용 바) -------------

  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleKakaoShare}
          className="inline-flex flex-1 items-center justify-center rounded-full bg-[#FEE500] px-3 py-2.5 text-[13px] font-semibold text-slate-900 hover:bg-[#ffe94a]"
        >
          카카오톡
        </button>

        <button
          type="button"
          onClick={handleTwitterShare}
          className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-900 px-3 py-2.5 text-[13px] font-semibold text-white hover:bg-slate-800"
        >
          트위터
        </button>

        <button
          type="button"
          onClick={handleFacebookShare}
          className="inline-flex flex-1 items-center justify-center rounded-full bg-[#1877F2] px-3 py-2.5 text-[13px] font-semibold text-white hover:bg-[#166fe0]"
        >
          페이스북
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-300 px-3 py-2.5 text-[13px] font-medium text-slate-700 hover:bg-slate-50"
        >
          링크 복사
        </button>
      </div>

      {copied && (
        <span className="text-center text-[11px] text-emerald-500">
          링크가 복사되었습니다.
        </span>
      )}
    </div>
  );
}
