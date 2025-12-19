// File: src/app/arcana/page.tsx
import Link from "next/link";
import { getRecentEntries } from "@/lib/db";

export const metadata = {
  title: "500자 소설 아카이브 | 감정 유형별 초단편 모음",
  description:
    "500자 소설 챌린지에 제출된 초단편 소설들을 감정 유형별로 모아둔 아카이브입니다.",
};

const MAX_ITEMS = 8;

export default async function ArcanaPage() {
  // 최근 엔트리 넉넉히 가져온 뒤, 프론트에서 분산
  const recent = await getRecentEntries(40);

  // 아르카나 코드 기준으로 다양성 확보
  const picked: any[] = [];
  const usedArcana = new Set<string | number>();

  for (const entry of recent) {
    const arcanaKey =
      (entry as any).arcana_code ?? (entry as any).arcana_id ?? "none";

    if (usedArcana.has(arcanaKey)) continue;

    usedArcana.add(arcanaKey);
    picked.push(entry);

    if (picked.length >= MAX_ITEMS) break;
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      {/* H1 */}
      <h1 className="mb-4 text-2xl font-semibold text-slate-900">
        500자 소설 아카이브
      </h1>

      {/* SEO 설명 문단 */}
      <p className="mb-8 text-sm leading-relaxed text-slate-600">
        이 페이지는 500자 소설 챌린지에 제출된 작품 중 일부를
        감정 유형별로 나누어 보여주는 아카이브입니다.
        짧지만 서로 다른 결의 초단편 소설들을 살펴볼 수 있습니다.
      </p>

      {/* 작품 리스트 */}
      <ul className="space-y-4">
        {picked.map((entry) => (
          <li
            key={entry.id}
            className="rounded-xl border border-slate-200 p-4"
          >
            <Link
              href={`/entries/${entry.id}`}
              className="block hover:underline"
            >
              <h2 className="text-sm font-medium text-slate-900">
                {entry.title ?? "제목 없는 500자 소설"}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {(entry.content ?? entry.body ?? "").slice(0, 80)}…
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {/* 수림 스튜디오 안내 — 최하단 1회 */}
      <div className="mt-14 border-t border-slate-200 pt-6 text-center text-sm text-slate-600">
        <p className="mb-3">
          편집자가 선별한 작품 아카이브는<br />
          수림 스튜디오에서 확인하실 수 있습니다.
        </p>
        <a
          href="https://surimstudio.com/archive"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-slate-900"
        >
          수림 스튜디오 아카이브 바로가기
        </a>
      </div>
    </main>
  );
}
