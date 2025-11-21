// File: src/app/layout.tsx
import "./globals.css";
import "@/styles/tokens.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://500challenge.vercel.app"),
  title: {
    default: "500자 소설 챌린지",
    template: "%s | 500자 소설 챌린지",
  },
  description: "500자 안에 압축된 이야기들.",
  openGraph: {
    type: "website",
    title: "500자 소설 챌린지",
    description: "내가 직접 쓴 500자 소설, 점수와 함께 확인해보세요.",
    url: "https://500challenge.vercel.app",
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
