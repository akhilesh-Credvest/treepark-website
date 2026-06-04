"use client";

import { useEffect, useRef, useState } from "react";
import { panoramaCache } from "../utils/imageCache";

export default function Tour360Viewer() {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const imageCache = useRef(panoramaCache);
  const isPreloadedRef = useRef(false);
  const [isPortrait, setIsPortrait] = useState(false);

  const panoramas = Array.from(
    { length: 27 },
    (_, i) => `/panoramas/${i + 1}_result.webp`
  );

  const [currentPano, setCurrentPano] = useState(0);
  const [ready, setReady] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true); // NEW

  // Responsive Device Orientation Detection Lifecycle// Responsive Device Orientation Detection Lifecycle
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkOrientation = () => {
      // Determines if viewport aspect-ratio is currently locked in portrait configuration
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    // Initial calculation on component mounting
    checkOrientation();

    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);


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
        });

        viewerRef.current = psvViewer;

        psvViewer.addEventListener("ready", () => {
          if (!destroyed) {
            setReady(true);
            setTimeout(() => setOverlayVisible(false), 200); // short delay then fade NEW
          }
        });

      } catch (err) {
        console.error("PSV init error:", err);
      }
    })();

    return () => {
      destroyed = true;
      if (viewerRef.current) {
        try { viewerRef.current.destroy(); } catch (e) { console.warn(e); }
        viewerRef.current = null;
      }
    };
  }, []);

  // Safe Panorama Texture Swap Router
  useEffect(() => {
    if (!viewerRef.current || !ready) return;
    viewerRef.current.setPanorama(panoramas[currentPano], {
      transition: { duration: 600 },
    }).catch((err) => console.error("Failed to transition panorama layout texture:", err));
  }, [currentPano, ready]);

  // Clean Non-blocking Background Assets Queue Downloader
  useEffect(() => {
    if (isPreloadedRef.current) return;
    isPreloadedRef.current = true;

    let index = 0;
    const loadNext = () => {
      if (index >= panoramas.length) return;
      if (imageCache.current[index]) { index++; loadNext(); return; }
      const img = new Image();
      img.src = panoramas[index];
      img.onload = () => { imageCache.current[index] = img; index++; setTimeout(loadNext, 40); };
      img.onerror = () => { index++; loadNext(); };
    };
    const t = setTimeout(loadNext, 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
  // Completely disable multi-asset preloading on mobile to save RAM
  if (typeof window !== "undefined" && window.innerWidth < 1024) return;

  if (isPreloadedRef.current) return;
  isPreloadedRef.current = true;

  let index = 0;
  const loadNext = () => {
    if (index >= panoramas.length) return;
    if (imageCache.current[index]) { index++; loadNext(); return; }
    const img = new Image();
    img.src = panoramas[index];
    img.onload = () => { index++; loadNext(); };
    img.onerror = () => { index++; loadNext(); };
  };
  setTimeout(loadNext, 1000);
}, []);

  const prev = () => setCurrentPano((p) => Math.max(p - 1, 0));
  const next = () => setCurrentPano((p) => Math.min(p + 1, panoramas.length - 1));

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">

      {/* Primary WebGL Core Anchor Target Frame */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* ── Loading Overlay ── NEW */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 50,
          background: "#0b1719",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          pointerEvents: overlayVisible ? "auto" : "none",
          opacity: overlayVisible ? 1 : 0,
          transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Spinning ring */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "1px solid rgba(222,196,148,0.15)",
            borderTop: "1px solid #DEC494",
            animation: "spin360 1.2s linear infinite",
          }}
        />
        <p
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: 10,
            fontWeight: 300,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "rgba(222,196,148,0.5)",
            animation: "pulse360 2s ease-in-out infinite",
          }}
        >
          Loading View
        </p>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300&display=swap');
          @keyframes spin360 { to { transform: rotate(360deg); } }
          @keyframes pulse360 { 0%,100%{opacity:.4} 50%{opacity:.9} }
        `}</style>
      </div>



{/* Counter Label UI */}
<div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-baseline gap-1 px-3 py-1.5 lg:px-5 lg:py-2 rounded-full bg-[#1a3438]/80 backdrop-blur-2xl border border-[#DEC494]/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)] z-40">
  <span className="text-[#DEC494] text-sm lg:text-base font-semibold leading-none">
    {currentPano + 1}
  </span>
  <span className="text-[#DEC494]/40 text-[10px] lg:text-xs tracking-[0.18em]">
    / {panoramas.length}
  </span>
</div>

{/* Control Panels Navigation Overlay Container */}
<div className="absolute bottom-3 lg:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 lg:gap-4 px-2 py-2 lg:px-4 lg:py-3 rounded-2xl bg-[#1a3438]/80 backdrop-blur-2xl border border-[#DEC494]/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-40 max-w-[92vw]">
  <button
    onClick={prev}
    disabled={currentPano === 0}
    className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center bg-[#DEC494]/10 border border-[#DEC494]/20 text-[#DEC494] text-sm hover:bg-[#DEC494]/20 transition-all duration-200 disabled:opacity-30 flex-shrink-0"
  >
    &larr;
  </button>

  {/* Dots — Hidden on mobile, flex on desktop/laptop viewports (lg) */}
  <div className="hidden lg:flex items-center gap-1.5 px-2 flex-shrink-0">
    {panoramas.map((_, i) => (
      <button
        key={i}
        onClick={() => setCurrentPano(i)}
        style={{
          width: i === currentPano ? "16px" : "5px",
          height: "5px",
          borderRadius: i === currentPano ? "3px" : "50%",
          background: i === currentPano ? "#DEC494" : "rgba(222,196,148,0.25)",
          border: "none",
          padding: 0,
          cursor: "pointer",
          transition: "all 0.25s ease",
          flexShrink: 0,
        }}
      />
    ))}
  </div>

  <button
    onClick={next}
    disabled={currentPano === panoramas.length - 1}
    className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center bg-[#DEC494]/10 border border-[#DEC494]/20 text-[#DEC494] text-sm hover:bg-[#DEC494]/20 transition-all duration-200 disabled:opacity-30 flex-shrink-0"
  >
    &rarr;
  </button>
</div>
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