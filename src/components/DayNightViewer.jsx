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
  const totalMinutes = ((frame - 1) / (totalFrames - 1)) * 14.5 * 60; // 6:00 AM to 8:30 PM = 14.5 hrs
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

  const sliderPercent = ((currentFrame - 1) / (totalFrames - 1)) * 100;

  const getImagePath = (loc, frame) => {
    const n = frame + offsets[loc];
    return `/daynight/${loc}/HighresScreenshot00${String(n).padStart(3, "0")}_result.webp`;
  };

  // Hardware Render Handler implementing a clean, responsive layout 'object-cover' fallback
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

  // Canvas Frame Repaint Draw Loop
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

  // Responsive Layout Synchronization Viewport Logic
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
      
      {/* High-Performance Canvas Graphics Layer */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* View Tabs Overlay Menu */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#1a3438]/80 backdrop-blur-2xl border border-[#DEC494]/20 shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
        {locations.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => {
              // REMOVED: setCurrentFrame(1);
              // The active frame timeline position remains locked when changing locations.
              setCurrentLocation(key);
            }}
            className={`px-6 py-2 rounded-[10px] text-sm tracking-widest transition-all duration-300 ${
              currentLocation === key
                ? "bg-[#DEC494] text-[#1a3438] font-semibold shadow-[0_2px_12px_rgba(222,196,148,0.3)]"
                : "text-[#DEC494]/60 hover:text-[#DEC494] hover:bg-[#DEC494]/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Slider Track Controller */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-4 rounded-2xl bg-[#1a3438]/80 backdrop-blur-2xl border border-[#DEC494]/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-[90vw] max-w-[540px]">
        
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#DEC494]/10 border border-[#DEC494]/20 flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DEC494" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        </div>

        <div className="relative flex-1 h-9 flex items-center">
          <div className="absolute inset-x-0 h-1 rounded-full bg-[#DEC494]/15" />
          <div className="absolute left-0 h-1 rounded-full bg-[#DEC494]" style={{ width: `${sliderPercent}%` }} />
          <input
            type="range"
            min="1"
            max={totalFrames}
            step="1"
            value={currentFrame}
            onChange={(e) => setCurrentFrame(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-20"
          />
          <div className="absolute w-7 h-7 rounded-full bg-[#DEC494] flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.4)] pointer-events-none" style={{ left: `calc(${sliderPercent}% - 14px)` }}>
            <div className="w-2.5 h-2.5 rounded-full bg-[#1a3438]" />
          </div>
        </div>

        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#DEC494]/10 border border-[#DEC494]/20 flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DEC494" strokeWidth="2" strokeLinecap="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </div>

        <div className="flex-shrink-0 px-3 py-1.5 rounded-full bg-[#DEC494]/10 border border-[#DEC494]/20">
          <span className="text-[#DEC494] text-xs tracking-widest font-mono">{frameToTime(currentFrame)}</span>
        </div>

      </div>
    </div>
  );
}