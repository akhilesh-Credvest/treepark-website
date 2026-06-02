"use client";

import { useState, useEffect, useRef } from "react";
import { sequenceCache } from "../utils/imageCache";

export default function ImageSequenceViewer() {
  const totalFrames = 72;
  const [currentFrame, setCurrentFrame] = useState(1);
  const canvasRef = useRef(null);
  const imageCache = useRef(sequenceCache);
  const isPreloadedRef = useRef(false);

  const sliderPercent = ((currentFrame - 1) / (totalFrames - 1)) * 100;

  // Unified clean layout mapping matching your production directory paths
  const getImagePath = (frameIndex) => {
    return `/sequence/HighresScreenshot${String(frameIndex + 22).padStart(5, "0")}_result.webp`;
  };

  // Centralized hardware render function ensuring correct aspect fit/fill
  const drawImageToCanvas = (ctx, canvas, img) => {
    if (!ctx || !canvas || !img) return;
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Implements CSS 'object-cover' emulation natively on HTML5 Canvas
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

  // Baseline Responsive Canvas Sizing and Core Event Listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const ctx = canvas.getContext("2d");
      
      // Upgrade resolution tracking backing metrics to eliminate high-DPI blur
      canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
      canvas.height = window.innerHeight * (window.devicePixelRatio || 1);

      const targetIndex = currentFrame - 1;
      const cachedImg = imageCache.current[targetIndex];

      if (cachedImg && cachedImg.complete) {
        drawImageToCanvas(ctx, canvas, cachedImg);
      } else {
        // Fallback placeholder loader to absolute zero frame blackouts
        const img = new Image();
        img.src = getImagePath(targetIndex);
        img.onload = () => {
          imageCache.current[targetIndex] = img;
          drawImageToCanvas(ctx, canvas, img);
        };
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Prime sizing calculations immediately

    return () => window.removeEventListener("resize", handleResize);
  }, [currentFrame]);

  // Paint Frame Trigger Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const targetIndex = currentFrame - 1;
    const cachedImg = imageCache.current[targetIndex];

    if (cachedImg && cachedImg.complete) {
      drawImageToCanvas(ctx, canvas, cachedImg);
    } else {
      const img = new Image();
      img.src = getImagePath(targetIndex);
      img.onload = () => {
        imageCache.current[targetIndex] = img;
        drawImageToCanvas(ctx, canvas, img);
      };
    }
  }, [currentFrame]);

  // Non-blocking Sequential Background Asset Loader
  useEffect(() => {
    if (isPreloadedRef.current) return;
    isPreloadedRef.current = true;

    let index = 0;
    const loadNext = () => {
      if (index >= totalFrames) return;

      if (imageCache.current[index]) {
        index++;
        loadNext();
        return;
      }

      const img = new Image();
      img.src = getImagePath(index);
      img.onload = () => {
        imageCache.current[index] = img;

        // Instantly force-render the baseline first frame if it finishes loading
        if (index === 0 && canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) drawImageToCanvas(ctx, canvasRef.current, img);
        }

        index++;
        if ("requestIdleCallback" in window) {
          requestIdleCallback(loadNext);
        } else {
          setTimeout(loadNext, 16);
        }
      };
      img.onerror = () => {
        index++;
        loadNext();
      };
    };

    loadNext();
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0b1719] select-none">
      
      {/* High-Performance Canvas Graphics Layer */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block"
      />

      {/* Slider Interface Panel Container */}
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
            className="absolute w-7 h-7 rounded-full bg-[#DEC494] flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.4)] pointer-events-none transition-transform duration-100 active:scale-110"
            style={{ left: `calc(${sliderPercent}% - 14px)` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#1a3438]" />
          </div>
        </div>
      </div>

    </div>
  );
}