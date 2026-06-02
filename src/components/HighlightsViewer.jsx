"use client";

import { useEffect, useRef } from "react";
import { globalAppCache } from "../utils/imageCache";

export default function HighlightsViewer({ isActive }) {
  const videoRef = useRef(null);

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
    </div>
  );
}