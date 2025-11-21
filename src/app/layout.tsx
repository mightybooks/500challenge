// File: src/app/layout.tsx
import "./globals.css";
import "@/styles/tokens.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "500자 소설 챌린지 | 수림스튜디오",
  description:
    "500자 안에 당신만의 소설을 써보세요. 수림봇이 문수림 미학 기준으로 점수를 매기고, 공유 가능한 카드까지 만들어 드립니다.",
  metadataBase: new URL("https://500challenge.vercel.app"),
  openGraph: {
    title: "500자 소설 챌린지 | 수림스튜디오",
    description:
      "짧게 쓰고, 깊게 남기는 500자 소설 챌린지. 지금 바로 첫 작품을 제출해보세요.",
    url: "https://500challenge.vercel.app",
    siteName: "500자 소설 챌린지",
    images: [
      {
        url: "/og-500challenge.png", // public 아래라 이렇게만 써도 됨
        width: 1200,
        height: 630,
        alt: "500자 소설 챌린지 대표 이미지",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "500자 소설 챌린지 | 수림스튜디오",
    description:
      "500자 초단편을 쓰고, 수림봇에게 평가받는 플레이그라운드.",
    images: ["/og-500challenge.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        style={{ margin: 0, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto" }}
        className="bg-slate-50 text-slate-900"
      >
        <div className="flex min-h-screen flex-col">
          {/* 메인 컨텐츠 */}
          <main className="flex-1">{children}</main>

          {/* 공통 푸터 */}
          <footer className="mt-12 border-t border-slate-200 bg-white/80 py-6 text-center text-[11px] text-slate-500">
            <p>© 2025 Surim Studio. All rights reserved.</p>
            <p className="mt-1">500자 소설 챌린지 · 수림스튜디오 실험 웹앱</p>
            <p className="mt-1">
              <a
                href="https://surimstudio.com"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-slate-700"
              >
                수림스튜디오 공식 사이트 바로가기
              </a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
