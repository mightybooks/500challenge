"use client";

import React from "react";

type ArcanaCardProps = {
  flipped: boolean;
  onClick?: () => void;
  backContent: React.ReactNode;
  frontContent: React.ReactNode;
};

export default function ArcanaCard({
  flipped,
  onClick,
  backContent,
  frontContent,
}: ArcanaCardProps) {
  return (
    <div
      onClick={onClick}
      className="w-[200px] h-[320px] cursor-pointer"
      style={{
        perspective: "1000px",
      }}
    >
      <div
        className="relative w-full h-full duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {backContent}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          {frontContent}
        </div>
      </div>
    </div>
  );
}
