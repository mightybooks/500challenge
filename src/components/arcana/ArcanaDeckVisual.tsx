// File: src/components/arcana/ArcanaDeckVisual.tsx
/* eslint-disable @next/next/no-img-element */

type ArcanaDeckVisualProps = {
  backImageSrc: string;
  className?: string;
};

type DeckCard = {
  rotate: number;
  translateX: number;
  translateY: number;
  zIndex: number;
  scale: number;
};

const DECK_CARDS: DeckCard[] = [
  { rotate: -14, translateX: -22, translateY: 10, zIndex: 5, scale: 0.96 },
  { rotate: -7, translateX: -10, translateY: 4, zIndex: 10, scale: 0.98 },
  { rotate: 0, translateX: 0, translateY: -4, zIndex: 20, scale: 1.0 }, // 가운데 카드
  { rotate: 7, translateX: 10, translateY: 4, zIndex: 10, scale: 0.98 },
  { rotate: 14, translateX: 22, translateY: 10, zIndex: 5, scale: 0.96 },
];

export function ArcanaDeckVisual({ backImageSrc, className }: ArcanaDeckVisualProps) {
  return (
    <div
      className={`relative mx-auto flex h-48 w-32 items-center justify-center sm:h-60 sm:w-40 ${
        className ?? ""
      }`}
    >
      {DECK_CARDS.map((card, index) => (
        <div
          key={index}
          className="absolute drop-shadow-md"
          style={{
            zIndex: card.zIndex,
            transform: `
              translate(${card.translateX}px, ${card.translateY}px)
              rotate(${card.rotate}deg)
              scale(${card.scale})
            `,
            transition: "transform 150ms ease-out",
          }}
        >
          <div className="relative h-40 w-28 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 sm:h-52 sm:w-36">
            <img
              src={backImageSrc}
              alt="아르카나 카드 덱"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
