"use client";

import { useState, useEffect, useRef } from "react";
import { dayNightCache } from "../utils/imageCache";

const locations = [
  { key: "maingate", label: "View 1" },
  { key: "clubhouse", label: "View 2" },
  { key: "lakeview", label: "View 3" },
];

const offsets = { maingate: 94, clubhouse: 168, lakeview: 22 };
const totalFrames = 36;

function frameToTime(frame) {
  const totalMinutes = ((frame - 1) / (totalFrames - 1)) * 14.5 * 60;
  const hours = Math.floor(6 + totalMinutes / 60);
  const mins = Math.floor(totalMinutes % 60);
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHour}:${String(mins).padStart(2, "0")} ${suffix}`;
}

export default function DayNightViewer() {
  const [currentLocation, setCurrentLocation] = useState("maingate");
  const [currentFrame, setCurrentFrame] = useState(1);
  const canvasRef = useRef(null);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false); // NEW — client-safe flag

  const sliderPercent = ((currentFrame - 1) / (totalFrames - 1)) * 100;

  // NEW — single source of truth for layout mode, no window checks in JSX
  useEffect(() => {
    const check = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (window.innerWidth < 1024) {
        setIsPortrait(window.innerHeight > window.innerWidth);
      } else {
        setIsPortrait(false);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const getImagePath = (loc, frame) => {
    const n = frame + offsets[loc];
    return `/daynight/${loc}/HighresScreenshot00${String(n).padStart(3, "0")}_result.webp`;
  };

  const drawImageToCanvas = (ctx, canvas, img) => {
    if (!ctx || !canvas || !img) return;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgRatio = img.width / img.height;
    const canvasRatio = canvasWidth / canvasHeight;
    let drawWidth, drawHeight, xOffset, yOffset;
    if (imgRatio > canvasRatio) {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imgRatio;
      xOffset = (canvasWidth - drawWidth) / 2;
      yOffset = 0;
    } else {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      xOffset = 0;
      yOffset = (canvasHeight - drawHeight) / 2;
    }
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, xOffset, yOffset, drawWidth, drawHeight);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cacheKey = `${currentLocation}_${currentFrame}`;
    const cachedImg = dayNightCache[cacheKey];
    if (cachedImg && cachedImg.complete) {
      drawImageToCanvas(ctx, canvas, cachedImg);
    } else {
      const img = new Image();
      img.src = getImagePath(currentLocation, currentFrame);
      img.onload = () => {
        dayNightCache[cacheKey] = img;
        drawImageToCanvas(ctx, canvas, img);
      };
    }
  }, [currentLocation, currentFrame]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
      canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
      const ctx = canvas.getContext("2d");
      const cacheKey = `${currentLocation}_${currentFrame}`;
      const cachedImg = dayNightCache[cacheKey];
      if (ctx && cachedImg && cachedImg.complete) {
        drawImageToCanvas(ctx, canvas, cachedImg);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [currentLocation, currentFrame]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0b1719] select-none">

      {isPortrait && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-[#0b1719]/95 backdrop-blur-xl text-center">
          <div className="w-14 h-14 mb-5 rounded-2xl flex items-center justify-center border border-[#DEC494]/30 bg-[#DEC494]/10 animate-pulse">
            <svg className="w-7 h-7 text-[#DEC494]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 002-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-[#DEC494] tracking-widest text-sm font-light uppercase mb-1">Landscape Orientation Suggested</h3>
          <p className="text-[#DEC494]/60 text-xs max-w-xs leading-relaxed">
            Please flip your phone horizontally to interactive-scrub through this 360 sequence comfortably.
          </p>
        </div>
      )}

      <canvas ref={canvasRef} className="w-full h-full block touch-none" />

      {/* View Tabs */}
      <div className="absolute bottom-3 top-auto left-1/2 -translate-x-1/2 lg:top-4 lg:bottom-auto z-50 flex items-center gap-1 p-1 rounded-xl sm:rounded-2xl bg-[#1a3438]/80 backdrop-blur-2xl border border-[#DEC494]/20 shadow-[0_4px_20px_rgba(0,0,0,0.35)] whitespace-nowrap max-w-[90vw] overflow-x-auto no-scrollbar">
        {locations.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setCurrentLocation(key)}
            className={`px-3 py-1.5 rounded-[8px] tracking-widest transition-all duration-300 text-[10px] lg:px-6 lg:py-2 lg:rounded-[10px] lg:text-sm ${
              currentLocation === key
                ? "bg-[#DEC494] text-[#1a3438] font-semibold shadow-[0_2px_12px_rgba(222,196,148,0.3)]"
                : "text-[#DEC494]/60 hover:text-[#DEC494] hover:bg-[#DEC494]/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── DESKTOP: Horizontal slider on bottom ── */}
      {isDesktop && (
        <div
          className="absolute z-50 bottom-6 left-1/2 -translate-x-1/2 flex flex-row items-center gap-4 px-6 py-4 rounded-xl border border-[#DEC494]/15 shadow-[0_12px_32px_rgba(0,0,0,0.4)]"
          style={{ background: "rgba(26,52,56,0.9)", width: "min(540px, 90vw)" }}
        >
          {/* Sun icon */}
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#DEC494]/10 border border-[#DEC494]/20 flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DEC494" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          </div>

          {/* Horizontal track */}
          <div className="relative flex-1 h-9 flex items-center">
            <div className="absolute inset-x-0 h-[2px] rounded-full bg-[#DEC494]/15 top-1/2 -translate-y-1/2" />
            <div
              className="absolute left-0 h-[2px] rounded-full bg-[#DEC494] top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ width: `${sliderPercent}%` }}
            />
            <input
              type="range" min="1" max={totalFrames} step="1" value={currentFrame}
              onChange={(e) => setCurrentFrame(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            {/* Thumb */}
            <div
              className="absolute w-7 h-7 rounded-full bg-[#DEC494] flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.4)] pointer-events-none"
              style={{ left: `calc(${sliderPercent}% - 14px)` }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#1a3438]" />
            </div>
          </div>

          {/* Moon icon */}
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#DEC494]/10 border border-[#DEC494]/20 flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DEC494" strokeWidth="2" strokeLinecap="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </div>

          {/* Time */}
          <div className="flex-shrink-0 px-3 py-1.5 rounded-full bg-[#DEC494]/10 border border-[#DEC494]/20">
            <span className="text-[#DEC494] text-xs tracking-widest font-mono">{frameToTime(currentFrame)}</span>
          </div>
        </div>
      )}

{/* ── MOBILE: Clean vertical slider on right ── */}
{!isDesktop && (
  <div className="absolute z-50 right-4 top-53 -translate-y-1/2 flex flex-col items-center gap-2">
    
    {/* Slider card */}
    <div
      className="flex flex-col items-center gap-3 px-3 py-5 rounded-2xl border border-[#DEC494]/15 shadow-[0_12px_32px_rgba(0,0,0,0.4)]"
      style={{ background: "rgba(26,52,56,0.9)", width: 52, height: "min(280px, 80vh)" }}
    >
      {/* Sun icon */}
      <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#DEC494]/10 border border-[#DEC494]/20 flex-shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DEC494" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      </div>

      {/* Vertical track */}
      <div className="relative flex-1 w-full flex justify-center" style={{ minHeight: 0 }}>
        <div className="absolute top-0 bottom-0 w-[2px] rounded-full bg-[#DEC494]/15 left-1/2 -translate-x-1/2" />
        <div
          className="absolute bottom-0 w-[2px] rounded-full bg-[#DEC494] left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ height: `${sliderPercent}%` }}
        />
        <input
          type="range" min="1" max={totalFrames} step="1" value={currentFrame}
          onChange={(e) => setCurrentFrame(Number(e.target.value))}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            opacity: 0, cursor: "pointer", zIndex: 20,
            writingMode: "vertical-lr", direction: "rtl",
            WebkitAppearance: "slider-vertical",
          }}
        />
        <div
          className="absolute w-6 h-6 rounded-full bg-[#DEC494] flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.4)] pointer-events-none left-1/2 -translate-x-1/2"
          style={{ bottom: `calc(${sliderPercent}% - 12px)` }}
        >
          <div className="w-2 h-2 rounded-full bg-[#1a3438]" />
        </div>
      </div>

      {/* Moon icon */}
      <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#DEC494]/10 border border-[#DEC494]/20 flex-shrink-0">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#DEC494" strokeWidth="2" strokeLinecap="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </div>
    </div>

    {/* Time pill — outside the card, no width constraint */}
    <div className="px-3 py-1 rounded-full border border-[#DEC494]/20 whitespace-nowrap flex items-center justify-center"
      style={{ background: "rgba(26,52,56,0.9)" }}>
      <span className="text-[#DEC494] text-[10px] tracking-wider font-mono text-center">
        {frameToTime(currentFrame)}
      </span>
    </div>

  </div>
)}

    </div>
  );
}