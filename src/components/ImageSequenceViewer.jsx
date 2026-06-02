"use client";

import { useState, useEffect, useRef } from "react";
import { sequenceCache } from "../utils/imageCache";

export default function ImageSequenceViewer() {
  const totalFrames = 72;
  const [currentFrame, setCurrentFrame] = useState(1);
  const canvasRef = useRef(null);

  const sliderPercent = ((currentFrame - 1) / (totalFrames - 1)) * 100;

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

  // Resize Monitor & Auto-Repaint Hook
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
      canvas.height = window.innerHeight * (window.devicePixelRatio || 1);

      const targetIndex = currentFrame - 1;
      const cachedImg = sequenceCache[targetIndex];
      if (ctx && cachedImg) {
        drawImageToCanvas(ctx, canvas, cachedImg);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [currentFrame]);

  // Frame painting engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const targetIndex = currentFrame - 1;
    const cachedImg = sequenceCache[targetIndex];

    if (cachedImg) {
      drawImageToCanvas(ctx, canvas, cachedImg);
    }
  }, [currentFrame]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0b1719] select-none">
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Slider Interface Panel */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-4 rounded-2xl bg-[#1a3438]/80 backdrop-blur-2xl border border-[#DEC494]/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-[90vw] max-w-[540px]">
        <div className="relative flex-1 h-9 flex items-center">
          <div className="absolute inset-x-0 h-1 rounded-full bg-[#DEC494]/15" />
          <div
            className="absolute left-0 h-1 rounded-full bg-[#DEC494]"
            style={{ width: `${sliderPercent}%` }}
          />
          <input
            type="range"
            min="1"
            max={totalFrames}
            step="1"
            value={currentFrame}
            onChange={(e) => setCurrentFrame(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-20"
          />
          <div
            className="absolute w-7 h-7 rounded-full bg-[#DEC494] flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.4)] pointer-events-none"
            style={{ left: `calc(${sliderPercent}% - 14px)` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#1a3438]" />
          </div>
        </div>
      </div>
    </div>
  );
}