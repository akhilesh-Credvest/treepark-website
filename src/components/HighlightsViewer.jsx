"use client";
import { useEffect, useRef } from "react";

export default function HighlightsViewer({ isActive }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.load(); // Forces fresh memory registration
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
      >
        <source src="/videos/highlights.mp4" type="video/mp4" />
      </video>
    </div>
  );
}