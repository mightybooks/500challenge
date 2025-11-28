// File: src/app/entries/[id]/arcana/page.tsx
import { redirect } from "next/navigation";
import { getEntryById } from "@/lib/db";
import { ArcanaChoicePage } from "@/components/arcana/ArcanaChoicePage";

type PageProps = {
  params: { id: string };
};

export default async function EntryArcanaPage({ params }: PageProps) {
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

  return (
    <main className="flex min-h-screen justify-center bg-slate-50 px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="w-full max-w-3xl rounded-3xl bg-white px-4 py-6 shadow-sm sm:px-8 sm:py-8">
        <ArcanaChoicePage entryId={params.id} title={title} />
      </div>
    </main>
  );
}
