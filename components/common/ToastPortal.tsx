"use client";

import useToast from "../../hooks/useToast";

export default function ToastPortal() {
  const toasts = useToast((state) => state.toasts);
  const removeToast = useToast((state) => state.removeToast);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-xs flex-col gap-3 px-4 sm:max-w-sm">
      {toasts.map(({ id, type, message }) => (
        <div
          key={id}
          className={`pointer-events-auto overflow-hidden rounded-3xl border px-4 py-3 shadow-2xl transition ${
            type === "success"
              ? "border-emerald-200 bg-emerald-600 text-white"
              : "border-red-200 bg-red-600 text-white"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/90">
                {type === "success" ? "Success" : "Error"}
              </p>
              <p className="text-sm leading-5 text-white/95">{message}</p>
            </div>
            <button
              type="button"
              onClick={() => removeToast(id)}
              className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-xs font-medium text-white transition hover:bg-white/20"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
