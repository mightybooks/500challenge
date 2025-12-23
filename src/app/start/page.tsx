// File: src/app/start/page.tsx

export default function StartPage() {
  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col items-center px-6 py-16">

      <div
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-64 bg-gradient-to-b from-sky-100/80 via-white to-transparent blur-3xl"
        aria-hidden="true"
      />

      {/* 헤더 섹션 */}
      <header className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          오늘의 500자 도전 모드 선택
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          오늘은 어떤 방식으로 500자를 채워 보시겠어요?
          <br />
          아래에서 <strong>소설 / 에세이 / 나의 기록</strong>을 선택해 주세요.
        </p>
      </header>

      {/* about 안내 링크 */}
        <section className="mt-5 text-center">
          <a
            href="/about"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
          >
            <span className="text-sm">ⓘ</span>
            500자 챌린지는 어떤 앱인가요?
          </a>
        </section>
        
      {/* 선택 버튼 */}
      <section className="mt-8 flex w-full flex-col items-center gap-3 sm:mt-10">
        <a
          href="/editor?mode=novel"
          className="inline-flex w-full max-w-xs items-center justify-center
                     rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500
                     px-6 py-4 text-base font-semibold text-white shadow-md
                     transition-all hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110
                     focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          500자 소설 도전하기
        </a>

        <a
          href="/editor?mode=essay"
          className="inline-flex w-full max-w-xs items-center justify-center
                     rounded-2- rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-500
                     px-6 py-4 text-base font-semibold text-white shadow-md
                     transition-all hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110
                     focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          500자 에세이 도전하기
        </a>

        <a
          href="/my"
          className="inline-flex w-full max-w-xs items-center justify-center
                     rounded-2xl border border-slate-200 bg-white
                     px-6 py-4 text-base font-semibold text-slate-800 shadow-sm
                     transition-all hover:-translate-y-0.5 hover:shadow-md hover:bg-slate-50
                     focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          나의 기록 보러가기
        </a>
      </section>
  
      {/* ▼▼▼ 신규 안내 섹션 (태도 + 귀환 경로) ▼▼▼ */}

      <section className="mt-14 w-full max-w-xl text-center">
        {/* 구분선 */}
        <div className="mx-auto mb-6 h-px w-32 bg-slate-200"></div>

        {/* 안내 문구 */}
        <p className="text-sm leading-relaxed text-slate-500 sm:text-[15px]">
          글은 한 번에 늘지 않습니다.
          <br />
          <span className="font-semibold text-slate-700">
            500자 챌린지는 꾸준함과 문장력을 길러주는 도구입니다.
          </span>
          <br /><br />
          이 앱을 매일 쓰고 싶으시다면,
          <br />
          검색창에서 <span className="font-semibold text-slate-700">‘수림 스튜디오’</span>를 검색하세요.
          <br />
          메인 화면에서 언제든 다시 시작할 수 있습니다.
        </p>
      </section>

    </main>
  );
}
