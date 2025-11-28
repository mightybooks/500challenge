// src/lib/supabaseClient.ts
import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log("SUPABASE ENV DEBUG", { url, anon: anon.slice(0, 8) + "..." });

// 브라우저용: 컴포넌트(use client) 등에서 사용
export function createClient() {
  return createBrowserClient(url, anon);
}

// 서버용: Route Handler, Server Component 등에서 사용
export function createServerSupabase() {
  const cookieStore = cookies();
  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try { cookieStore.set({ name, value, ...options }); } catch {}
      },
      remove(name: string, options: CookieOptions) {
        try { cookieStore.set({ name, value: '', ...options, maxAge: 0 }); } catch {}
      },
    },
  });
}