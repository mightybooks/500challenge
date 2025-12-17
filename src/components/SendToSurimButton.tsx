"use client";

import { useState } from "react";

type PayloadBase = {
  title: string;
  content: string;
  og_image_key: string;
  created_at: string;
};

export function SendToSurimButton({
  payloadBase,
}: {
  payloadBase: PayloadBase;
}) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!email) {
      setError("작품 선정 안내를 위한 이메일을 입력해 주세요.");
      return;
    }

    setSending(true);
    setError(null);

    try {
      const res = await fetch(
        "/api/send-to-surim",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payloadBase,
            email, // ✅ 여기서만 사용
          }),
        }
      );
      

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "전송 실패");
      }

      setDone(true);
    } catch (e: any) {
      setError(e.message ?? "알 수 없는 오류");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <p className="text-sm text-emerald-700">
        수림 스튜디오로 전송되었습니다.
      </p>
    );
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="연락받을 이메일"
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}

      <button
        onClick={handleSend}
        disabled={sending}
        className="inline-flex items-center justify-center rounded-lg 
                   bg-[#2F5D46] px-4 py-2 text-sm font-medium text-white
                   transition hover:bg-[#264E39] disabled:opacity-60"
      >
        {sending ? "전송 중..." : "수림스튜디오로 보내기"}
      </button>
    </div>
  );
}
