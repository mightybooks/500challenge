'use client';
import { useState } from 'react';

export type MyFilters = { minScore:number; tag:string; q:string };

export default function MyFilterBar({ onChange }: { onChange:(f:MyFilters)=>void }){
  const [minScore,setMinScore]=useState(0);
  const [tag,setTag]=useState('');
  const [q,setQ]=useState('');
  return (
    <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
      <input value={q} onChange={e=>{setQ(e.target.value); onChange({minScore,tag,q:e.target.value});}}
        placeholder="제목 검색" className="rounded-md border px-3 py-2 text-sm" />
      <input type="number" min={0} max={100} value={minScore}
        onChange={e=>{const v=Number(e.target.value); setMinScore(v); onChange({minScore:v,tag,q});}}
        placeholder="최소 점수" className="rounded-md border px-3 py-2 text-sm" />
      <input value={tag} onChange={e=>{setTag(e.target.value); onChange({minScore,tag:e.target.value,q});}}
        placeholder="태그 포함" className="rounded-md border px-3 py-2 text-sm" />
    </div>
  );
}