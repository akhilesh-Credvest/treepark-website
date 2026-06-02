"use client";
import { useEffect, useRef } from "react";

export default function HighlightsViewer({ isActive }) {

  const videoRef = useRef(null);

  useEffect(() => {

  if (!videoRef.current)
    return;

  if (isActive) {

    videoRef.current.play();

  } else {

    videoRef.current.pause();

    videoRef.current.currentTime = 0;

  }

}, [isActive]);

  return (

    <div className="relative w-full h-screen overflow-hidden bg-black">

<video
  ref={videoRef}
  muted
  loop
  playsInline
  preload="metadata"
>
        <source
          src="/videos/highlights.mp4"
          type="video/mp4"
        />
      </video>

    </div>

  );

}