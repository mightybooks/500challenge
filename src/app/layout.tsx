import "./globals.css";
import '@/styles/tokens.css';
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://500challenge.vercel.app"),
  title: {
    default: "500자 소설 챌린지",
    template: "%s | 500자 소설 챌린지",
  },
  description: "500바이트 안에 압축된 이야기들.",
  openGraph: {
    type: "website",
    title: "500자 소설 챌린지",
    description: "내가 직접 쓴 500자 소설, 점수와 함께 확인해보세요.",
    url: "https://500challenge.vercel.app",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto" }}>
        {children}
      </body>
    </html>
  );
}
