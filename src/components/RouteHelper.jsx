"use client";

import { useState } from "react";

export default function RouteHelper() {
  const [points, setPoints] = useState([]);
  const [copied, setCopied] = useState(false);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (((e.clientX - rect.left) / rect.width) * 100).toFixed(1);
    const y = (((e.clientY - rect.top) / rect.height) * 100).toFixed(1);
    setPoints((prev) => [...prev, [parseFloat(x), parseFloat(y)]]);
    setCopied(false);
  };

  const undo = () => {
    setPoints((prev) => prev.slice(0, -1));
    setCopied(false);
  };

  const clear = () => {
    setPoints([]);
    setCopied(false);
  };

  const routeString = `[${points.map((p) => `[${p[0]},${p[1]}]`).join(",")}]`;

  const copy = () => {
    navigator.clipboard.writeText(routeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">

      {/* Map — click to record points */}
      <div className="absolute inset-0 cursor-crosshair" onClick={handleClick}>
        <img
          src="/location/Frame 1000006182.png"
          alt=""
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
      </div>

      {/* SVG overlay — draw recorded points */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      >
        {/* Line connecting points */}
        {points.length > 1 && (
          <polyline
            points={points.map((p) => `${p[0]},${p[1]}`).join(" ")}
            fill="none"
            stroke="#DEC494"
            strokeWidth="0.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {/* Dots at each point */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p[0]} cy={p[1]} r="0.8" fill="#DEC494" />
            <text
              x={p[0] + 1.2}
              y={p[1] - 0.8}
              fontSize="2"
              fill="#DEC494"
              fontFamily="monospace"
            >
              {i + 1}
            </text>
          </g>
        ))}
      </svg>

      {/* Top bar */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-2xl border border-[#DEC494]/20 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
        style={{ background: "rgba(26,52,56,0.9)" }}>
        <span className="text-[#DEC494]/60 text-xs tracking-widest">ROUTE HELPER</span>
        <span className="text-[#DEC494]/30 text-xs">·</span>
        <span className="text-[#DEC494] text-xs tracking-widest">{points.length} POINTS</span>
        <span className="text-[#DEC494]/30 text-xs">·</span>
        <span className="text-[#DEC494]/50 text-xs">Click map to add points</span>
      </div>

      {/* Bottom panel */}
      <div className="absolute bottom-6 left-6 right-6 z-50 flex flex-col gap-3">

        {/* Route string output */}
        {points.length > 0 && (
          <div className="px-5 py-3 rounded-xl backdrop-blur-2xl border border-[#DEC494]/20 font-mono text-[#DEC494] text-xs break-all"
            style={{ background: "rgba(26,52,56,0.92)" }}>
            {routeString}
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={copy}
            disabled={points.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl backdrop-blur-2xl border border-[#DEC494]/20 text-sm tracking-widest transition-all duration-200 disabled:opacity-30"
            style={{ background: copied ? "#DEC494" : "rgba(26,52,56,0.9)", color: copied ? "#1a3438" : "#DEC494" }}
          >
            {copied ? "✓ Copied!" : "Copy Route"}
          </button>

          <button
            onClick={undo}
            disabled={points.length === 0}
            className="px-5 py-2.5 rounded-xl backdrop-blur-2xl border border-[#DEC494]/20 text-[#DEC494] text-sm tracking-widest hover:bg-[#DEC494]/10 transition-all duration-200 disabled:opacity-30"
            style={{ background: "rgba(26,52,56,0.9)" }}
          >
            ← Undo
          </button>

          <button
            onClick={clear}
            disabled={points.length === 0}
            className="px-5 py-2.5 rounded-xl backdrop-blur-2xl border border-[#DEC494]/20 text-[#DEC494] text-sm tracking-widest hover:bg-[#DEC494]/10 transition-all duration-200 disabled:opacity-30"
            style={{ background: "rgba(26,52,56,0.9)" }}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}