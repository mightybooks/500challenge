// src/components/ArcanaCard.tsx
"use client";

type ArcanaCardProps = {
  backContent: React.ReactNode;   // 뒤집히기 전(카드 뒷면)
  frontContent: React.ReactNode;  // 뒤집힌 후(카드 앞면)
  flipped: boolean;               // 상태는 부모에서 관리
  onClick?: () => void;
};

export function ArcanaCard({ backContent, frontContent, flipped, onClick }: ArcanaCardProps) {
  return (
    <div
      className={`arcana-card ${flipped ? "is-flipped" : ""}`}
      onClick={onClick}
    >
      {/* 뒷면 */}
      <div className="arcana-card-face arcana-card-back bg-slate-900">
        {backContent}
      </div>

      {/* 앞면 */}
      <div className="arcana-card-face arcana-card-front bg-white">
        {frontContent}
      </div>
    </div>
  );
}
