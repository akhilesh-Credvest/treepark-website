"use client";

import { useState } from "react";

export default function ImageSequenceViewer() {
  const totalFrames = 72;
  const [currentFrame, setCurrentFrame] = useState(1);

  const sliderPercent = ((currentFrame - 1) / (totalFrames - 1)) * 100;

  const getImagePath = (index) => {
    return `/sequence/HighresScreenshot000${String(index + 21).padStart(2, "0")}_result.webp`;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <img
        src={getImagePath(currentFrame)}
        alt="ArchViz"
        draggable={false}
        className="w-full h-full object-cover select-none"
      />

      {/* Slider bar — only */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-4 rounded-2xl bg-[#1a3438]/80 backdrop-blur-2xl border border-[#DEC494]/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-[540px]">

        {/* Track */}
        <div className="relative flex-1 h-9 flex items-center">
          <div className="absolute inset-x-0 h-1 rounded-full bg-[#DEC494]/15" />
          <div
            className="absolute left-0 h-1 rounded-full bg-[#DEC494] transition-all duration-75"
            style={{ width: `${sliderPercent}%` }}
          />
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

      </div>
    </div>
  );
}