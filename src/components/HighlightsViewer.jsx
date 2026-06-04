"use client";

import { useEffect, useRef, useState } from "react";
import { globalAppCache } from "../utils/imageCache";

export default function HighlightsViewer({ isActive }) {
  const videoRef = useRef(null);
  const [isPortrait, setIsPortrait] = useState(false);

  // Responsive Device Orientation Detection Lifecycle
  useEffect(() => {
    // Return early if server-side rendered
    if (typeof window === "undefined") return;

    const checkOrientation = () => {
      // Determines if viewport aspect-ratio is currently locked in portrait configuration
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    // Initial check on viewport instantiation
    checkOrientation();

    // Listen to resizing or dynamic rotation events across platforms
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  // Video Asset Lifecycle and Integration Control Engine
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Use preloaded Blob URL if available, otherwise fallback to local public path
    const targetSource = globalAppCache.highlights.videoBlobUrl || "/videos/highlights.mp4";

    if (isActive) {
      // Safely apply source adjustments if it changed or hasn't loaded yet
      if (video.src !== window.location.origin + targetSource && !video.src.startsWith('blob:')) {
        video.src = targetSource;
      }
      
      video.load(); // Registers file layout directly inside engine components
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => console.log("Video autoplay prevented:", err));
      }
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isActive]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        className="w-full h-full object-cover pointer-events-none"
      />

      {/* ── Portrait Orientation Adaptive Blocking Modal Layer ── */}
      {isPortrait && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-[#0b1719]/95 backdrop-blur-xl text-center select-none">
          <div className="w-14 h-14 mb-5 rounded-2xl flex items-center justify-center border border-[#DEC494]/30 bg-[#DEC494]/10 animate-pulse">
            <svg className="w-7 h-7 text-[#DEC494]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-[#DEC494] tracking-widest text-sm font-light uppercase mb-1">Landscape Orientation Suggested</h3>
          <p className="text-[#DEC494]/60 text-xs max-w-xs leading-relaxed">
            Please flip your phone horizontally to interactive-scrub through this 360 sequence comfortably.
          </p>
        </div>
      )}
    </div>
  );
}