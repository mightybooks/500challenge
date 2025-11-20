import "./globals.css";
import '@/styles/tokens.css';

export const metadata = {
  title: "500challenge",
  description: "문수림 500자소설앱 MVP",
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
