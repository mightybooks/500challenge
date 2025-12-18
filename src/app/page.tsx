// File: src/app/page.tsx

import Image from "next/image";

export default function Home() {
  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col items-center px-6 py-16">
      {/* 데코레이션 배경 */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-64 bg-gradient-to-b from-sky-100/80 via-white to-transparent blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-[-120px] -z-10 hidden w-64 rounded-full bg-indigo-100/60 blur-3xl sm:block"
        aria-hidden="true"
      />

      {/* 헤더 섹션 */}
      <header className="text-center">
        {/* 상단 라벨 */}
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-medium text-slate-600 shadow-sm backdrop-blur">
          <span className="mr-1 text-xs">✨</span>
          <span>문수림 미학 기반 500자 소설 자동 평가</span>
        </div>

        {/* 타이틀 */}
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          500자 챌린지 앱
        </h1>

        {/* 서브텍스트 */}
        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
        500자 소설을 쓰는 문수림이 직접 설계한<br/> <strong>‘500자 쓰기 챌린지’</strong> 웹앱
        </p>
      </header>

      {/* 인트로 이미지 */}
        <section className="mt-10 w-full flex justify-center">
          <div className="w-full max-w-2xl">
            <Image
              src="/introimg.png"
              alt="수림 스튜디오 500자 챌린지 인트로"
              width={1200}
              height={675}
              priority
              className="rounded-2xl shadow-sm"
            />
          </div>
        </section>

      {/* 안내 카드 영역 */}
      <section className="mt-8 w-full space-y-4">
        {/* 평가 안내 카드 */}
        <div className="rounded-2xl text-center border border-slate-200 bg-slate-50 px-5 py-4 text-[12px] leading-relaxed text-slate-700 shadow-sm sm:text-sm">
          <p>
            ⚠️ 결과 페이지의<br/><strong>점수와 코멘트는 모두 AI 수림봇의 기계적 판정</strong>일 뿐입니다.
            <br />
            결코 절대적인 문학적 평가가 아니며,<br/>어디까지나 오락적인 요소입니다.
          </p>
        </div>       
      </section>

      {/* 하루 1회 도전 안내 */}
      <section className="mt-6 text-center">
        <p className="inline-flex items-center rounded-full bg-slate-900 text-[11px] font-medium text-slate-50 sm:text-xs">
          <span className="rounded-full bg-sky-400 px-2 py-1 text-[10px] font-semibold tracking-wide text-slate-900 sm:text-[11px]">
            TODAY
          </span>
          <span className="px-3 py-1">
            도전은 <strong>하루에 한 번</strong>만 가능합니다.<br/>오늘의 500자를 신중하게 완성해 보세요.
          </span>
        </p>
      </section>

            {/* CTA 버튼 영역: 오늘의 500자 도전 → /start */}
      <section className="mt-7 flex w-full flex-col items-center gap-3 sm:mt-8">
        <a
          href="/start"
          className="inline-flex w-full max-w-xs items-center justify-center
                     rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500
                     px-6 py-4 text-base font-semibold text-white shadow-md
                     transition-all hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110
                     focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          오늘의 500자 도전하기
        </a>
      </section>

      {/* 기록 보존 관련 안내 */}
      <section className="mt-6 w-full">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-center text-[11px] leading-relaxed text-slate-400 sm:text-xs">
          <p>
            ※ 이 웹앱은 챌린지 기록의 <strong>영구 보존을 보장하지 않습니다.</strong>
          </p>
          <p className="mt-1">
            중요한 작품은 결과 페이지에서 <strong>복사해</strong>
            &nbsp;별도로 백업해 두시길 권장드립니다.
          </p>
        </div>
      </section>
    </main>
  );
}
