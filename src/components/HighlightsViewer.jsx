"use client";

export default function HighlightsViewer() {

  return (

    <div className="relative w-full h-screen overflow-hidden bg-black">

      <video
    className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source
          src="/videos/highlights.mp4"
          type="video/mp4"
        />
      </video>

    </div>

  );

}