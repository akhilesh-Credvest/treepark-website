"use client";

import { useEffect, useRef, useState } from "react";
import { panoramaCache } from "../utils/imageCache";

export default function Tour360Viewer() {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const imageCache = useRef(panoramaCache);
  const isPreloadedRef = useRef(false);

  const panoramas = Array.from(
    { length: 27 },
    (_, i) => `/panoramas/${i + 1}_result.webp`
  );

  const [currentPano, setCurrentPano] = useState(0);
  const [ready, setReady] = useState(false);

  // Core Viewer Engine Initialization Mount Loop
  useEffect(() => {
    if (!containerRef.current) return;

    let destroyed = false;
    let psvViewer = null;

    (async () => {
      try {
        const { Viewer } = await import("@photo-sphere-viewer/core");
        await import("@photo-sphere-viewer/core/index.css");

        if (destroyed || !containerRef.current) return;

        psvViewer = new Viewer({
          container: containerRef.current,
          panorama: panoramas[0],
          navbar: [],
          mousewheel: true,
          defaultYaw: 0,
          // CRITICAL PRODUCTION FIX: Tells WebGL engine canvas to securely allow cross-origin assets
          panoramaOptions: {
            cors: "anonymous", 
          },
        });

        viewerRef.current = psvViewer;

        psvViewer.addEventListener("ready", () => {
          if (!destroyed) setReady(true);
        });

      } catch (err) {
        console.error("PSV init error:", err);
      }
    })();

    return () => {
      destroyed = true;
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (e) {
          console.warn("Error destroying instance:", e);
        }
        viewerRef.current = null;
      }
    };
  }, []);

  // Safe Panorama Texture Swap Router
  useEffect(() => {
    if (!viewerRef.current || !ready) return;

    const targetTexture = panoramas[currentPano];

    viewerRef.current.setPanorama(targetTexture, {
      transition: {
        duration: 600, // Slightly reduced for snappier performance updates
      },
    }).catch((err) => {
      console.error("Failed to transition panorama layout texture:", err);
    });
  }, [currentPano, ready]);

  // Clean Non-blocking Background Assets Queue Downloader
  useEffect(() => {
    if (isPreloadedRef.current) return;
    isPreloadedRef.current = true;

    let index = 0;
    const loadNext = () => {
      if (index >= panoramas.length) return;
      if (imageCache.current[index]) {
        index++;
        loadNext();
        return;
      }

      const img = new Image();
      img.src = panoramas[index];
      img.onload = () => {
        imageCache.current[index] = img;
        index++;
        setTimeout(loadNext, 40);
      };
      img.onerror = () => {
        index++;
        loadNext();
      };
    };

    // Delay start slightly to allow the primary main WebGL view to initialize flawlessly first
    const t = setTimeout(loadNext, 1000);
    return () => clearTimeout(t);
  }, []);

  const prev = () => setCurrentPano((p) => Math.max(p - 1, 0));
  const next = () => setCurrentPano((p) => Math.min(p + 1, panoramas.length - 1));

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      
      {/* Primary WebGL Core Anchor Target Frame */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Counter Label UI */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-baseline gap-1.5 px-5 py-2 rounded-full bg-[#1a3438]/80 backdrop-blur-2xl border border-[#DEC494]/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)] z-40">
        <span className="text-[#DEC494] text-base font-semibold leading-none">
          {currentPano + 1}
        </span>
        <span className="text-[#DEC494]/40 text-xs tracking-[0.18em]">
          / {panoramas.length}
        </span>
      </div>

      {/* Control Panels Navigation Overlay Container */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-3 rounded-2xl bg-[#1a3438]/80 backdrop-blur-2xl border border-[#DEC494]/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-40">
        <button
          onClick={prev}
          disabled={currentPano === 0}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#DEC494]/10 border border-[#DEC494]/20 text-[#DEC494] hover:bg-[#DEC494]/20 transition-all duration-200 disabled:opacity-30"
        >
          &larr;
        </button>

        <div className="flex items-center gap-1.5 px-2">
          {panoramas.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPano(i)}
              style={{
                width: i === currentPano ? "20px" : "6px",
                height: "6px",
                borderRadius: i === currentPano ? "4px" : "50%",
                background: i === currentPano ? "#DEC494" : "rgba(222,196,148,0.25)",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={currentPano === panoramas.length - 1}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#DEC494]/10 border border-[#DEC494]/20 text-[#DEC494] hover:bg-[#DEC494]/20 transition-all duration-200 disabled:opacity-30"
        >
          &rarr;
        </button>
      </div>

    </div>
  );
}