// 예: src/app/arcana-test/page.tsx
"use client";

import { useState } from "react";
import { ArcanaCard } from "@/components/ArcanaCard";

type Candidate = {
  id: number;
  name: string;
};

const mockCandidates: Candidate[] = [
  { id: 0, name: "The Fool" },
  { id: 1, name: "The Magician" },
  { id: 12, name: "The Hanged Man" },
];

export default function ArcanaTestPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (id: number) => {
    if (selectedId !== null) return; // 한 번만 선택
    setSelectedId(id);
    // 여기서 이후 로직:
    // - 선택된 카드 정보 서버에 기록
    // - OG 이미지 생성 트리거 등
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-slate-950 text-white">
      <h1 className="text-xl mb-4">오늘 당신의 카드를 선택해보세요.</h1>

      <div className="flex gap-6">
        {mockCandidates.map((card) => (
          <ArcanaCard
            key={card.id}
            flipped={selectedId === card.id}
            onClick={() => handleSelect(card.id)}
            backContent={
              <div className="w-full h-full flex items-center justify-center text-sm">
                {/* TODO: 여기 나중에 진짜 '뒷면 디자인' 이미지 or SVG 넣으면 됨 */}
                <span className="tracking-widest">ARCANA</span>
              </div>
            }
            frontContent={
              <div className="w-full h-full flex flex-col items-center justify-center">
                {/* TODO: 여기엔 나중에 선택된 카드의 미니 OG 프리뷰 or 주요 심볼 */}
                <p className="text-xs uppercase text-slate-500 mb-2">You picked</p>
                <p className="text-lg font-semibold">{card.name}</p>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}
