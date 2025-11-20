// File: src/components/Modal.tsx
"use client";

import { useEffect } from "react";

type ModalProps = {
  open: boolean;
  title?: string;
  onClose?: () => void;
  children: React.ReactNode;
  /**
   * 바깥 영역 클릭 시 닫을지 여부 (기본 true)
   */
  dismissOnBackdropClick?: boolean;
};

function Modal({
  open,
  title,
  onClose,
  children,
  dismissOnBackdropClick = true,
}: ModalProps) {
  // ESC 키로 닫기
  useEffect(() => {
    if (!open || !onClose) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleBackdropClick = () => {
    if (!onClose) return;
    if (!dismissOnBackdropClick) return;
    onClose();
  };

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={handleContentClick}
      >
        {title && (
          <header className="mb-4">
            <h2 className="text-base font-semibold text-slate-900">
              {title}
            </h2>
          </header>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
