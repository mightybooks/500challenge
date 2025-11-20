'use client';
export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs" style={{
      borderColor:'var(--surim-ring)', color:'var(--surim-accent-2)', background:'#fff'} }>
      {children}
    </span>
  );
}