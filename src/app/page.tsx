// File: src/app/page.tsx

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
          500자 소설 챌린지
        </h1>

        {/* 서브텍스트 */}
        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          이 웹앱은 문수림이 설계한 <strong>‘500자 소설 챌린지’</strong>입니다.
          <br />
          하루 단 한 번의 기회, <span className="font-semibold">하루 1회</span>만 도전하실 수 있습니다.
          <br />
          일반 <strong>에세이와 소설 모두 가능</strong>합니다.
          <br />
          500자 안에 여러분만의 이야기를 밀도 있게 담을 수 있을지 시험해 보세요.
        </p>
      </header>

      {/* 안내 카드 영역 */}
      <section className="mt-8 w-full space-y-4">
        {/* 평가 안내 카드 */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-[12px] leading-relaxed text-slate-700 shadow-sm sm:text-sm">
          <div className="mb-2 inline-flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs">
              <span className="text-base">🤖</span>
            </span>
            <p className="text-xs font-semibold tracking-tight text-slate-800 sm:text-[13px]">
              AI 수림봇의 문수림 미학 점수
            </p>
          </div>
          <p>
            ⚠️ 결과 페이지의 <strong>점수와 코멘트는 모두 AI 수림봇의 기계적 판정</strong>일 뿐입니다.
            <br />
            가볍게 즐기는 놀이에 가깝고, 절대적인 문학적 평가가 아닙니다.
          </p>
          <p className="mt-2 text-[11px] text-slate-500 sm:text-[12px]">
            너무 진지하게 상처받지 말고,{" "}
            <span className="font-medium">“오늘의 500자 실험”</span> 정도로 활용해 주세요.
          </p>
        </div>

        {/* 수림지 제출 안내 카드 */}
        <div className="rounded-2xl border border-sky-100 bg-sky-50/70 px-5 py-4 text-[12px] leading-relaxed text-slate-700 shadow-sm sm:text-sm">
          <div className="mb-2 inline-flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-xs text-white">
              📬
            </span>
            <p className="text-xs font-semibold tracking-tight text-slate-900 sm:text-[13px]">
              월간 수림지에 작품을 보내고 싶으시다면
            </p>
          </div>
          <p>
            AI 판정이 마음에 들지 않거나, 작품을 더 살려보고 싶으시다면
            <br />
            <strong className="font-semibold">결과 페이지에서 작품을 수림스튜디오로 제출</strong>해 주세요.
          </p>
          <p className="mt-2">
            인간 편집자 <strong>문수림이 직접 검토</strong>하여,
            <br />
            적합하다고 판단되는 작품은{" "}
            <strong>『월간 수림지』에 수록</strong>됩니다.
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
            도전은 <strong>하루에 한 번</strong>만 가능합니다. 오늘의 500자를 신중하게 완성해 보세요.
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
            중요한 작품은 결과 페이지에서 <strong>복사하거나 파일로 내려받아</strong>
            &nbsp;별도로 백업해 두시길 권장드립니다.
          </p>
        </div>
      </section>
    </main>
  );
}
