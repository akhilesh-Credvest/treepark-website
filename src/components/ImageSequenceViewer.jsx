"use client";

import { useState, useEffect, useRef } from "react";
import { sequenceCache } from "../utils/imageCache";

export default function ImageSequenceViewer() {
  const totalFrames = 72;
  const [currentFrame, setCurrentFrame] = useState(1);
  const canvasRef = useRef(null);
  const [isPortrait, setIsPortrait] = useState(false);

  const sliderPercent = ((currentFrame - 1) / (totalFrames - 1)) * 100;

  useEffect(() => {
    const checkViewport = () => {
      if (window.innerWidth < 1024) {
        setIsPortrait(window.innerHeight > window.innerWidth);
      } else {
        setIsPortrait(false);
      }
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

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
      
      {/* Mobile Orientation Warning Safeguard Overlay */}
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

      {/* Ultra-Slim Navigation Scrub Slider Track */}
      {/* Mobile: Vertical on Right | Desktop (lg): Horizontal on Bottom */}
      <div 
        className="absolute z-50 flex items-center justify-center rounded-xl border border-[#DEC494]/15 shadow-[0_12px_32px_rgba(0,0,0,0.4)] transition-all duration-300
          top-1/2 -translate-y-1/2 right-4 w-10 h-[55vh] max-h-[360px] flex-col px-2 py-6
          lg:top-auto lg:translate-y-0 lg:left-1/2 lg:-translate-x-1/2 lg:right-auto
          lg:w-[75vw] lg:max-w-[480px] lg:h-auto lg:flex-row lg:px-6 lg:py-3.5 lg:bottom-8"
        style={{ background: "rgba(26,52,56,0.9)" }}
      >
        {/* Core Container Wrapper - Handles the rotation inversion logic perfectly */}
        <div className="relative w-full h-full flex items-center justify-center lg:h-6">
          
          {/* Inner tracks layout context */}
          <div className="absolute w-[2px] h-full rounded-full bg-[#DEC494]/10 pointer-events-none lg:w-full lg:h-[2px]" />
          
          <div
            className="absolute bottom-0 w-[2px] rounded-full bg-[#DEC494] shadow-[0_0_8px_rgba(222,196,148,0.5)] pointer-events-none lg:bottom-auto lg:left-0 lg:h-[2px]"
            style={{ 
              height: typeof window !== "undefined" && window.innerWidth < 1024 ? `${sliderPercent}%` : "2px",
              width: typeof window !== "undefined" && window.innerWidth >= 1024 ? `${sliderPercent}%` : "2px"
            }}
          />

          {/* Native Slider Input */}
          <input
            type="range"
            min="1"
            max={totalFrames}
            step="1"
            value={currentFrame}
            onChange={(e) => setCurrentFrame(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 
              [writing-mode:bt-lr] [-webkit-appearance:slider-vertical] 
              lg:[writing-mode:lr-tb] lg:[-webkit-appearance:auto]"
          />

          {/* Thumb Custom Indicator */}
          <div
            className="absolute w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#DEC494] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.5)] pointer-events-none transition-transform duration-100"
            style={{ 
              bottom: typeof window !== "undefined" && window.innerWidth < 1024 ? `calc(${sliderPercent}% - 8px)` : "auto",
              left: typeof window !== "undefined" && window.innerWidth >= 1024 ? `calc(${sliderPercent}% - 10px)` : "auto"
            }}
          >
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#0b1719]" />
          </div>

        </div>
      </div>

    </div>
  );
}