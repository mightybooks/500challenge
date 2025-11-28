"use client";

import { useState } from "react";
import ArcanaCard from "@/components/arcana/ArcanaCard";

export default function TestPage() {
  const [flip, setFlip] = useState(false);

  return (
    <div className="p-10 flex justify-center">
      <ArcanaCard
        flipped={flip}
        onClick={() => setFlip(!flip)}
        backContent={
          <img src="/arcana/arcana-back.png" className="w-full h-full" />
        }
        frontContent={
          <img src="/arcana/1.png" className="w-full h-full" />
        }
      />
    </div>
  );
}
