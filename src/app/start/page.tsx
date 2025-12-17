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
  
      {/* ▼▼▼ 여기가 신규 추가 섹션 ▼▼▼                                  */}

      <section className="mt-14 w-full max-w-xl text-center">
        {/* 구분선 */}
        <div className="mx-auto mb-6 h-px w-32 bg-slate-200"></div>

        {/* 간단 요약 */}
        <p className="text-sm leading-relaxed text-slate-500 sm:text-[15px]">
          500자 앱은 짧은 글 속에 담긴 감정의 결을 감지해<br/>  
          <span className="font-semibold text-slate-700">정서 앵커 카드</span>와 평가를 제공합니다.
          <br className="hidden sm:block" />
          더 자세한 이야기와 세계관이 궁금하다면 아래에서 확인해 보세요.
        </p>

        {/* 수림스튜디오로 이동 버튼 */}
        <div className="mt-5 flex justify-center">
          <a
            href="https://surimstudio.com/projects/500fiction_app" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center
                       rounded-full border border-slate-300 bg-white px-4 py-2
                       text-sm font-medium text-slate-700 shadow-sm
                       transition hover:bg-slate-50 hover:shadow"
          >
            500자 소설 앱 소개 보기
          </a>
        </div>
      </section>

    </main>
  );
}
