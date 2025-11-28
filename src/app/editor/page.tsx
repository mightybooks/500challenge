// File: src/app/editor/page.tsx
"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { ensureAnonId } from "@/lib/anon";
import { BYTE_LIMIT } from "@/lib/config";

const MAX_BYTES = BYTE_LIMIT;
const WARN_BYTES = 50;

type Phase = "idle" | "confirm" | "loading" | "error";

function utf8ByteLength(text: string): number {
  return new TextEncoder().encode(text).length;
}

function trimToBytes(text: string, maxBytes: number): string {
  const encoder = new TextEncoder();
  let bytes = 0;
  let out = "";

  for (const ch of text) {
    const n = encoder.encode(ch).length;
    if (bytes + n > maxBytes) break;
    bytes += n;
    out += ch;
  }

  return out;
}

type SubmitResponse = {
  id: string;
  title: string;
  eval: {
    score: number | null;
    tags: string[];
    reasons: string[];
    byteCount: number;
  };
};

export default function EditorPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [touched, setTouched] = useState(false);
  const [autoTrim, setAutoTrim] = useState(true);

  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const bodyBytes = utf8ByteLength(body);
  const remaining = MAX_BYTES - bodyBytes;

  const isTitleValid = title.trim().length > 0;
  const isBodyValid = bodyBytes > 0 && bodyBytes <= MAX_BYTES;
  const canSubmit = isTitleValid && isBodyValid && !loading;

  const [lastEntryId, setLastEntryId] = useState<string | null>(null);

  // textarea 높이 자동 조정
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    const scrollH = el.scrollHeight;
    el.style.height = `${Math.min(scrollH, 480)}px`;
  }, [body]);

  // 제출 버튼 → 확인 모달
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched(true);

    if (!canSubmit) return;

    setPhase("confirm");
    setOpen(true);
    setError(null);
  }

  function handleRewrite() {
    setOpen(false);
    setPhase("idle");
    setTitle("");
    setBody("");
    setTouched(false);
    setError(null);
    setLastEntryId(null);

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  }

  // 실제 제출
async function handleConfirmSubmit() {
  if (!canSubmit) return;

  ensureAnonId();

  setPhase("loading");
  setLoading(true);
  setError(null);
  setLastEntryId(null);

  try {
    const resp = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });

    const data = await resp.json();

    if (!resp.ok || data?.error) {
      throw new Error(data?.error || "제출 실패");
    }

    const entryId = data.id as string;

    // 여기부터 흐름 변경:
    // 결과 모달을 띄우지 않고 바로 카드 선택 페이지로 이동
    setOpen(false);
    setPhase("idle");
    setLastEntryId(entryId);

    router.push(`/entries/${entryId}/arcana`);
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "서버 오류가 발생했습니다.";
    setError(msg);
    setPhase("error");
  } finally {
    setLoading(false);
  }
}

  function onBodyChange(next: string) {
    if (autoTrim) setBody(trimToBytes(next, MAX_BYTES));
    else setBody(next);
  }

  function manualCut() {
    setBody((prev) => trimToBytes(prev, MAX_BYTES));
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">
        500자 소설 작성
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        제목은 글자수 제한과 무관합니다. 본문만{" "}
        <strong>{MAX_BYTES}바이트</strong> 이내로 작성해 주세요.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        {/* 제목 */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium"
          >
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="제목을 입력하세요"
            className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:ring-2 ${
              !isTitleValid && touched
                ? "border-red-400 ring-red-200"
                : "border-neutral-200 focus:ring-neutral-300"
            }`}
          />
          {!isTitleValid && touched && (
            <p className="mt-1 text-sm text-red-500">
              제목은 필수입니다.
            </p>
          )}
        </div>

        {/* 자동 절단 */}
        <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
          <div>
            <p className="text-sm font-medium">바로 자르기</p>
            <p className="text-xs text-neutral-500">
              본문 입력 시 UTF-8 기준 {MAX_BYTES}바이트를
              즉시 초과하지 않도록 자동 절단합니다.
            </p>
          </div>

          <label className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={autoTrim}
              onChange={(e) => setAutoTrim(e.target.checked)}
            />
            <span className="select-none text-xs text-neutral-500">
              OFF
            </span>
            <span
              className={`relative h-6 w-11 rounded-full transition ${
                autoTrim ? "bg-black" : "bg-neutral-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                  autoTrim ? "left-6" : "left-0.5"
                }`}
              />
            </span>
            <span className="select-none text-xs text-neutral-800">
              ON
            </span>
          </label>
        </div>

        {/* 본문 */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="body"
              className="block text-sm font-medium"
            >
              본문
            </label>
            <ByteBadge remaining={remaining} />
          </div>

          <textarea
            id="body"
            ref={textareaRef}
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder={`본문을 입력하세요 (UTF-8 기준 ${MAX_BYTES}바이트 이내)`}
            className={`mt-2 w-full resize-none rounded-xl border bg-white px-4 py-3 leading-7 outline-none transition focus:ring-2 ${
              bodyBytes > MAX_BYTES || (touched && bodyBytes === 0)
                ? "border-red-400 ring-red-200"
                : remaining <= WARN_BYTES
                ? "border-amber-300 ring-amber-200"
                : "border-neutral-200 focus:ring-neutral-300"
            }`}
            rows={6}
          />

          {bodyBytes === 0 && touched && (
            <p className="mt-1 text-sm text-red-500">
              본문을 입력해 주세요.
            </p>
          )}

          {!autoTrim && bodyBytes > MAX_BYTES && (
            <>
              <p className="mt-1 text-sm text-red-600">
                현재 {bodyBytes}바이트입니다.{" "}
                {Math.abs(remaining)}바이트 초과.
              </p>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={manualCut}
                  className="rounded-lg bg-neutral-900 px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
                >
                  {MAX_BYTES}B로 자르기
                </button>
              </div>
            </>
          )}
        </div>

        {/* 제출 버튼 */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className={`group rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
              canSubmit
                ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-sm hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-slate-50"
                : "bg-neutral-200 text-neutral-500"
            }`}
          >
            다음 단계로 (제출 전 확인)
          </button>
          <div className="text-xs text-neutral-500">
            {remaining >= 0 ? (
              <>
                남은 용량 <strong>{remaining}</strong>B
              </>
            ) : (
              <>
                초과 <strong>{Math.abs(remaining)}</strong>B
              </>
            )}
          </div>
        </div>
      </form>

      {/* 모달 */}
      <Modal
        open={open}
        onClose={() => {
          if (loading) return;
          setOpen(false);
          if (phase !== "error") {
            setPhase("idle");
          }
        }}
        dismissOnBackdropClick={false}
      >
        {/* 확인 단계 */}
        {phase === "confirm" && (
          <div className="flex max-h-[70vh] flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto py-4 pr-1">
              <h2 className="text-sm font-semibold text-neutral-900">
                오늘의 500자 소설을 이렇게 제출할까요?
              </h2>

              <div className="rounded-xl bg-neutral-50 px-4 py-3">
                <p className="text-xs font-medium text-neutral-500">
                  제목
                </p>
                <p className="text-sm font-semibold text-neutral-900">
                  {title || "(제목 없음)"}
                </p>

                <p className="mt-3 text-xs font-medium text-neutral-500">
                  본문
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-neutral-900">
                  {body}
                </p>

                <p className="mt-3 text-[11px] text-neutral-500">
                  현재 {bodyBytes} / {MAX_BYTES}B
                </p>
              </div>

              <p className="text-[11px] text-neutral-500">
                제출 후 오늘은 다시 제출할 수 없습니다.
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 border-t border-neutral-200 bg-white pb-2 pt-3">
              <button
                type="button"
                onClick={handleRewrite}
                className="rounded-full bg-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-800"
              >
                다시 쓰기
              </button>

              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={loading}
                className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
              >
                이대로 제출, 결과 페이지로 이동
              </button>
            </div>
          </div>
        )}

        {/* 로딩 */}
        {phase === "loading" && (
          <div className="py-10 text-center">
            <div className="mb-4 flex justify-center">
              <span
                className="animate-bounce text-4xl sm:text-5xl"
                role="img"
                aria-label="수림봇"
              >
                🤖
              </span>
            </div>

            <p className="text-sm font-medium text-neutral-600">
              수림봇이 열심히 평가 중입니다…
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="h-3 w-3 animate-pulse rounded-full bg-sky-500" />
              <div className="h-3 w-3 animate-pulse rounded-full bg-indigo-500 delay-150" />
              <div className="h-3 w-3 animate-pulse rounded-full bg-purple-500 delay-300" />
            </div>

            <p className="mt-4 text-[11px] text-neutral-400">
              * 1~2초 정도 소요됩니다.
            </p>
          </div>
        )}

        {/* 에러 */}
        {phase === "error" && (
          <div className="space-y-3 py-4">
            <p className="text-sm font-semibold text-red-600">
              오류가 발생했습니다.
            </p>
            <p className="text-sm text-neutral-600">{error}</p>

            <div className="pt-2 text-right">
              <button
                onClick={() => {
                  setOpen(false);
                  setPhase("idle");
                }}
                className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function ByteBadge({ remaining }: { remaining: number }) {
  const tone =
    remaining < 0
      ? "text-red-600 border-red-200 bg-red-50"
      : remaining <= WARN_BYTES
      ? "text-amber-700 border-amber-200 bg-amber-50"
      : "text-neutral-600 border-neutral-200 bg-neutral-50";

  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs ${tone}`}
    >
      {remaining >= 0 ? `남음 ${remaining}` : `초과 ${Math.abs(remaining)}`}B
    </span>
  );
}
