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

  useEffect(() => {
    if (!KAKAO_JS_KEY) return;

    // 이미 초기화된 경우
    if (window.Kakao && window.Kakao.isInitialized()) {
      if (window.Kakao.Share) {
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
        if (window.Kakao && window.Kakao.Share) {
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

    return () => {
      // 필요하면 cleanup, 지금은 SDK를 계속 유지하는 편이 나음
    };
  }, []);

  // ------------- 공유 기능 -------------

  // 카카오 공유
  const handleKakaoShare = () => {
    if (!kakaoReady || !window.Kakao || !window.Kakao.Share) {
      alert(
        "카카오 공유를 준비하는 중입니다. 잠시 후 다시 시도해 주세요."
      );
      return;
    }

    const url = getCurrentUrl();
    if (!url) return;

    const imageUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/og/500/unicorn-aqua.png`
        : "";

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: `500자 소설 – ${title}`,
        description: "내가 직접 쓴 500자 소설 평가 결과입니다.",
        imageUrl,
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
      buttons: [
        {
          title: "페이지 열기",
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        },
      ],
    });
  };

  // 트위터
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

  // ------------- UI -------------

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-[11px] leading-relaxed text-slate-500 sm:text-xs">
        이 결과 페이지를 공유해보세요.
        <br className="hidden sm:block" />
        <span className="text-slate-400">제목:</span>{" "}
        <span className="font-medium text-slate-600">{title}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleKakaoShare}
          className="inline-flex items-center rounded-full bg-[#FEE500] px-3 py-1.5 text-[11px] font-semibold text-slate-900 hover:bg-[#ffe94a]"
        >
          카카오톡
        </button>

        <button
          type="button"
          onClick={handleTwitterShare}
          className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800"
        >
          트위터
        </button>

        <button
          type="button"
          onClick={handleFacebookShare}
          className="inline-flex items-center rounded-full bg-[#1877F2] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#166fe0]"
        >
          페이스북
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center rounded-full border border-slate-300 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
        >
          링크 복사
        </button>

        {copied && (
          <span className="text-[11px] text-emerald-500">복사되었습니다.</span>
        )}
      </div>
    </div>
  );
}
