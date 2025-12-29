// File: src/app/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "500자 챌린지 소개 | 500자로 완결되는 글쓰기 실험",
  description:
    "500자 챌린지는 500자 이내로 글을 완결하는 글쓰기 실험 웹앱입니다. 문장 밀도와 사고의 핵심을 점검하며, 소설/에세이 모드로 매일 기록을 쌓을 수 있습니다.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "500자 챌린지 소개 | 500자로 완결되는 글쓰기 실험",
    description: "500자 챌린지는 500자라는 엄격한 제약을 통해 문장 밀도와 사고의 선택을 실험하는 글쓰기 실험 웹앱입니다. 경쟁이나 커뮤니티가 아닌, 개인 서사 실험과 기록을 위한 프로젝트입니다.",
    url: "/about",
    type: "website",
  },
};

export default function AboutPage() {
  // JSON-LD (선택이지만 추천): 검색엔진이 "이 페이지는 소개/정의 페이지"라는 신호를 더 잘 잡습니다.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "applicationCategory": "CreativeApplication",
    "operatingSystem": "Web",
    name: "500자 챌린지 소개",
    description: "This project is an experimental writing web application that uses strict 500-character constraints to explore narrative density and decision-making in short-form fiction. It is not a social network, contest-based community, or traditional publishing service.",
    isPartOf: {
      "@type": "WebSite",      
      name: "500자 챌린지",
      url: "https://500challenge.vercel.app/",       
    },
  };

  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col px-6 py-16">
      {/* 데코레이션 배경 (메인/스타트 톤 맞춤) */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-64 bg-gradient-to-b from-sky-100/80 via-white to-transparent blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-[-120px] -z-10 hidden w-64 rounded-full bg-indigo-100/60 blur-3xl sm:block"
        aria-hidden="true"
      />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 헤더 */}
      <header className="text-center">
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-medium text-slate-600 shadow-sm backdrop-blur">
          <span className="mr-2 text-sm">ⓘ</span>
          <span>서비스 소개</span>
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          500자 챌린지 — 500자로 완결되는 글쓰기 실험
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          500자 챌린지는 한 편의 에세이, 또는 소설을 <strong>500자 이내로 완결</strong>하는 글쓰기 실험
          웹앱입니다. 길이를 줄이는 것이 목적이 아니라,{" "}
          <strong>사고와 문장의 밀도를 조절</strong>하는 훈련을 목표로 합니다.
        </p>
      </header>

      {/* 본문 */}
      <section className="mt-10 space-y-8">
        <article className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
          <h2 className="text-lg font-semibold text-slate-900">이 앱은 무엇인가</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
            사용자는 매일 하나의 조건 아래에서 500자 분량의 짧은 글을 작성합니다. 이 앱은
            점수 경쟁을 위한 서비스가 아니라, <strong>문장을 결정하는 힘</strong>을 점검하고
            기록을 쌓는 도구입니다.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
          <h2 className="text-lg font-semibold text-slate-900">왜 500자인가</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
            500자는 짧지만 생각 없이 쓰기에는 부족하고, 길지만 설명으로 도망치기에는
            모자란 분량입니다. 제한은 불필요한 수식을 덜어내고, 핵심 문장만 남기도록
            설계된 장치입니다.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
          <h2 className="text-lg font-semibold text-slate-900">어떻게 사용되는가</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 sm:text-[15px]">
            <li>
              <strong>소설 / 에세이</strong> 모드 중 하나를 선택해 500자를 작성합니다.
            </li>
            <li>결과 페이지에서 점수와 코멘트를 확인하고, 필요하면 복사해 보관합니다.</li>
            <li>작성된 일부 결과는 아카이브 흐름(아르카나 덱)과 연결됩니다.</li>
          </ul>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] leading-relaxed text-slate-600">
            ⚠️ 결과 페이지의 점수와 코멘트는 <strong>AI 판정</strong>이며, 절대적인 문학적
            평가가 아닙니다. 도구로만 사용하시길 권장드립니다.
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
          <h2 className="text-lg font-semibold text-slate-900">프로젝트의 위치</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
            500자 챌린지는 작가 문수림이 운영하는 창작 허브 <strong>수림 스튜디오</strong>의
            실험 프로젝트 중 하나입니다. 앱에서 생성된 일부 기록과 결과물은 수림 스튜디오의
            아카이브 및 기획 콘텐츠와 연결됩니다.
          </p>
        </article>
      </section>

      {/* 내부 링크 */}
      <nav className="mt-10 rounded-2xl border border-slate-200 bg-white/70 p-6 text-center shadow-sm backdrop-blur">
        <h2 className="text-sm font-semibold text-slate-900">바로가기</h2>
        <div className="mt-4 flex flex-col items-center gap-2 text-sm">
          <a
            href="/"
            className="text-slate-600 underline underline-offset-2 hover:text-slate-900"
          >
            500자 챌린지 메인으로
          </a>
          <a
            href="/start"
            className="text-slate-600 underline underline-offset-2 hover:text-slate-900"
          >
            오늘의 500자 도전 시작하기
          </a>
          <a
            href="/arcana"
            className="text-slate-600 underline underline-offset-2 hover:text-slate-900"
          >
            아르카나 아카이브 보기
          </a>
          <a
            href="/"
            className="text-slate-600 underline underline-offset-2 hover:text-slate-900"
          >
            수림 스튜디오로 이동
          </a>
        </div>
      </nav>

      <footer className="mt-8 text-center text-[11px] text-slate-400 sm:text-xs">
        본 웹앱 및 관련 소스·기획·콘텐츠에 대한 저작권은 창작자 문수림과 수림 스튜디오에 귀속됩니다.
      </footer>
    </main>
  );
}
