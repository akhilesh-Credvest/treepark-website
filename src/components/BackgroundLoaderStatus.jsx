"use client";

import { useEffect, useState } from "react";

export default function BackgroundLoaderStatus({ total, current }) {
  const [visible, setVisible] = useState(true);
  const isComplete = current >= total && total > 0;

  useEffect(() => {
    if (isComplete) {
      // Keep visible for a brief moment after completion, then fade out smoothly
      const timer = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setVisible(true);
    }
  }, [isComplete]);

  if (!visible || total === 0) return null;

  return (
    <div
      className="fixed bottom-6 left-6 z-[999] flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/[0.06] bg-[#0b1719]/80 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.5)] select-none transition-all duration-700 ease-in-out"
      style={{
        opacity: isComplete ? 0 : 1,
        transform: isComplete ? "translateY(10px) scale(0.95)" : "translateY(0) scale(1)",
        pointerEvents: "none",
      }}
    >
      {/* Micro Spinning Ring or Checkmark Accent */}
      {!isComplete ? (
        <div className="w-3 h-3 rounded-full border border-[#DEC494]/20 border-t-[#DEC494] animate-spin" />
      ) : (
        <svg className="w-3.5 h-3.5 text-[#DEC494]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      )}

      <div className="flex flex-col">
        <span className="text-[#DEC494] text-[9px] font-medium tracking-[0.2em] uppercase leading-none mb-1">
          {!isComplete ? "Caching Assets" : "System Optimized"}
        </span>
        <span className="text-white/40 text-[9px] tabular-nums font-light leading-none uppercase">
          {!isComplete ? `${current} / ${total} Assets Buffered` : "Background Buffer Complete"}
        </span>
      </div>
    </div>
  );
}