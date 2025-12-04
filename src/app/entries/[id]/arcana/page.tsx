// File: src/app/entries/[id]/arcana/page.tsx
import { redirect } from "next/navigation";
import { getEntryById } from "@/lib/db";
import { ArcanaChoicePage } from "@/components/arcana/ArcanaChoicePage";
import { extractFirstSentence } from "@/lib/arcana/text";
import type { WritingMode } from "@/lib/arcana/types";

type PageProps = {
  params: { id: string };
  searchParams?: { mode?: string };
};

export default async function EntryArcanaPage({ params, searchParams }: PageProps) {
  const entry = await getEntryById(params.id);

  if (!entry) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">존재하지 않는 기록입니다.</p>
        </div>
      </main>
    );
  }

  // 이미 카드 선택이 끝난 기록이면 결과 페이지로 돌려보냄
  if ((entry as any).arcana_id != null) {
    redirect(`/entries/${params.id}`);
  }

  const title = entry.title ?? "500자 소설";

  // 🔹 본문 필드 이름에 맞게 하나 골라 쓰기
  const body: string =
    (entry as any).content ??
    (entry as any).body ??
    (entry as any).text ??
    "";

  const tags: string[] = Array.isArray(entry.tags) ? entry.tags : [];

  // 🔹 첫 문장 추출
  const firstSentence = extractFirstSentence(body);

  // 🔹 최종 mode 결정: 1순위 DB, 2순위 쿼리, 기본값 novel
  const modeFromDb = (entry as any).mode as WritingMode | null | undefined;
  const modeFromQuery: WritingMode | null =
    searchParams?.mode === "essay"
      ? "essay"
      : searchParams?.mode === "novel"
      ? "novel"
      : null;

  const mode: WritingMode = modeFromDb ?? modeFromQuery ?? "novel";

  return (
    <main className="flex min-h-screen justify-center bg-slate-50 px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="w-full max-w-3xl rounded-3xl bg-white px-4 py-6 shadow-sm sm:px-8 sm:py-8">
        <ArcanaChoicePage
          entryId={params.id}
          title={title}
          tags={tags}
          firstSentence={firstSentence}
          mode={mode}
        />
      </div>
    </main>
  );
}
