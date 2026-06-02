"use client";

import { useState, useEffect } from "react";


const locations = [
  { key: "maingate", label: "View 1" },
  { key: "clubhouse", label: "View 2" },
  { key: "lakeview", label: "View 3" },
];

const offsets = { maingate: 94, clubhouse: 168, lakeview: 22 };
const totalFrames = 36;

// Approximate time label: frame 1 = 6:00 AM, frame 36 = 8:30 PM
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

  const sliderPercent = ((currentFrame - 1) / (totalFrames - 1)) * 100;

  const getImagePath = () => {
    const n = currentFrame + offsets[currentLocation];
    
    return `/daynight/${currentLocation}/HighresScreenshot00${String(n).padStart(3, "0")}_result.webp`;

    
  };

  

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <img
        src={getImagePath()}
        alt=""
        className="w-full h-full object-cover object-center"
      />

      {/* View tabs — top center */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#1a3438]/80 backdrop-blur-2xl border border-[#DEC494]/20 shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
        {locations.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setCurrentLocation(key)}
            className={`
              px-6 py-2 rounded-[10px] text-sm tracking-widest transition-all duration-200
              ${currentLocation === key
                ? "bg-[#DEC494] text-[#1a3438] font-semibold shadow-[0_2px_12px_rgba(222,196,148,0.3)]"
                : "text-[#DEC494]/60 hover:text-[#DEC494] hover:bg-[#DEC494]/10"
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Slider bar — bottom center */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-4 rounded-2xl bg-[#1a3438]/80 backdrop-blur-2xl border border-[#DEC494]/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-[540px]">

        {/* Sun icon box */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#DEC494]/10 border border-[#DEC494]/20 flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DEC494" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        </div>

        {/* Track */}
        <div className="relative flex-1 h-9 flex items-center">
          {/* Track bg */}
          <div className="absolute inset-x-0 h-1 rounded-full bg-[#DEC494]/15" />
          {/* Track fill */}
          <div
            className="absolute left-0 h-1 rounded-full bg-[#DEC494] transition-all duration-75"
            style={{ width: `${sliderPercent}%` }}
          />
          {/* Native range — invisible but interactive */}
          <input
            type="range"
            min="1"
            max={totalFrames}
            step="1"
            value={currentFrame}
            onChange={(e) => setCurrentFrame(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
            style={{ zIndex: 10 }}
          />
          {/* Custom thumb */}
          <div
            className="absolute w-7 h-7 rounded-full bg-[#DEC494] flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.4)] pointer-events-none transition-all duration-75"
            style={{ left: `calc(${sliderPercent}% - 14px)` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#1a3438]" />
          </div>
        </div>

        {/* Moon icon box */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#DEC494]/10 border border-[#DEC494]/20 flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DEC494" strokeWidth="2" strokeLinecap="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </div>

        {/* Time badge */}
        <div className="flex-shrink-0 px-3 py-1.5 rounded-full bg-[#DEC494]/10 border border-[#DEC494]/20">
          <span className="text-[#DEC494] text-xs tracking-widest">{frameToTime(currentFrame)}</span>
        </div>

      </div>
    </div>
  );
}