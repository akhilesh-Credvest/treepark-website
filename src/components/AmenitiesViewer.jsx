"use client";

import { useState, useEffect, useRef } from "react";
import { AmenitiesCaches, globalAppCache } from "../utils/imageCache";

const amenities = [
  { id: 1, name: "Club House",         image: "/Amenities/Clubhouse.webp",       x: 58.5,  y: 12 },
  { id: 2, name: "Swimming Pool",      image: "/Amenities/Swimming Pool.webp",   x: 55,    y: 9  },
  { id: 3, name: "Kids Play Area",     image: "/Amenities/Kids Play Area.webp",  x: 49,    y: 20 },
  { id: 4, name: "Picnic Area",        image: "/Amenities/Picnic Area.webp",     x: 25.5,  y: 41 },
  { id: 5, name: "Pet Park",           image: "/Amenities/Pet Park.webp",        x: 68,    y: 87 },
  { id: 6, name: "Tree Park",          image: "/Amenities/Tree Park.webp",       x: 50,    y: 12 },
  { id: 7, name: "Orchard",            image: "/Amenities/Orchard.webp",         x: 24,    y: 53 },
];

export default function AmenitiesViewer() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, left: 0, top: 0 });
  const mapRef = useRef(null);
  const [isPortrait, setIsPortrait] = useState(false);

  const selected = selectedIndex !== null ? amenities[selectedIndex] : null;

  const masterPlanBackgroundSrc = globalAppCache.masterplan.baseMap?.src || "/masterplan/HighresScreenshot00060_result.webp";

  // Responsive Device Orientation & Layout Calculation Lifecycle
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;

      // Track aspect ratio updates to switch layout context
      setIsPortrait(window.innerHeight > window.innerWidth);

      if (selectedIndex !== null || !mapRef.current) return;
      
      const vW = window.innerWidth;
      const vH = window.innerHeight;
      const imgAspect = 16 / 9;
      const screenAspect = vW / vH;

      let renderW, renderH;

      // Always contain fully within screen — no cropping
      if (screenAspect > imgAspect) {
        // Screen wider than image: fit by height
        renderH = vH;
        renderW = vH * imgAspect;
      } else {
        // Screen taller than image: fit by width
        renderW = vW;
        renderH = vW / imgAspect;
      }

      setDimensions({
        width: renderW,
        height: renderH,
        left: (vW - renderW) / 2,
        top: (vH - renderH) / 2,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedIndex]);

  // Responsive Device Orientation Detection Lifecycle
  useEffect(() => {
    if (selectedIndex !== null) return;

    const handleResize = () => {
      if (!mapRef.current) return;
      
      const vW = window.innerWidth;
      const vH = window.innerHeight;
      const imgAspect = 16 / 9; 
      const screenAspect = vW / vH;

      let renderW, renderH;

      if (screenAspect > imgAspect) {
        renderW = vW;
        renderH = vW / imgAspect;
      } else {
        renderH = vH;
        renderW = vH * imgAspect;
      }

      setDimensions({
        width: renderW,
        height: renderH,
        left: (vW - renderW) / 2,
        top: (vH - renderH) / 2,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex === null) {
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (e) {
          console.warn(e);
        }
        viewerRef.current = null;
      }
      return;
    }

    if (!containerRef.current) return;
    let destroyed = false;

    (async () => {
      try {
        const { Viewer } = await import("@photo-sphere-viewer/core");
        await import("@photo-sphere-viewer/core/index.css");

        if (destroyed || !containerRef.current) return;
        
        const preloadedAsset = AmenitiesCaches[selectedIndex];
        const panoramaSource = preloadedAsset ? preloadedAsset.src : amenities[selectedIndex].image;

        if (viewerRef.current) {
          try {
            await viewerRef.current.setPanorama(panoramaSource, { transition: { duration: 400 } });
            return;
          } catch (err) {
            viewerRef.current.destroy();
            viewerRef.current = null;
          }
        }

        viewerRef.current = new Viewer({
          container: containerRef.current,
          panorama: panoramaSource,
          navbar: [],
          mousewheel: true,
          defaultYaw: 0,
          loadingImg: null,
        });
      } catch (err) {
        console.error("PSV error:", err);
      }
    })();

    return () => { destroyed = true; };
  }, [selectedIndex]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">

      {/* ── MASTERPLAN VIEW ── */}
      {selectedIndex === null && (
        <div ref={mapRef} className="absolute inset-0 w-full h-full overflow-hidden">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: `url('${masterPlanBackgroundSrc}')` }}
          />

          <div 
            className="absolute pointer-events-none"
            style={{
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              left: `${dimensions.left}px`,
              top: `${dimensions.top}px`,
            }}
          >
          {amenities.map((item, index) => (
            <div
              key={item.id}
              style={{ 
                left: `${item.x}%`, 
                top: `${item.y}%`,
                transform: "translate(-50%, -50%)"
              }}
              className="absolute pointer-events-auto z-30 flex flex-col items-center group"
            >
              <button
                onClick={() => setSelectedIndex(index)}
                className="w-5 h-5 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-[8px] lg:text-xs font-bold tracking-widest backdrop-blur-md border transition-all duration-300 bg-[#084042]/90 text-[#DEC494] border-[#DEC494]/60 shadow-[0_0_15px_rgba(222,196,148,0.25)] group-hover:bg-[#DEC494] group-hover:text-[#0b1719] group-hover:border-[#DEC494] group-hover:shadow-[0_0_35px_rgba(222,196,148,0.8)] group-hover:scale-110 active:scale-95"
              >
                {String(item.id).padStart(2, "0")}
              </button>

              {/* Tooltip — above on mobile, below on desktop */}
              <div className="absolute bottom-9 lg:bottom-auto lg:top-14 opacity-0 scale-95 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 whitespace-nowrap z-40">
                <span className="px-2 py-1 lg:px-3 lg:py-1.5 rounded-lg text-[9px] lg:text-[10px] font-medium tracking-widest bg-[#084042]/95 text-[#DEC494] border border-[#DEC494]/40 shadow-[0_4px_12px_rgba(0,0,0,0.5)] uppercase">
                  {item.name}
                </span>
              </div>
            </div>
          ))}
          </div>
        </div>
      )}

      {/* ── PANORAMA VIEW ── */}
      {selectedIndex !== null && (
        <>
            <div
      ref={containerRef}
      className="absolute bg-[#0b1719]"
      style={{
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        maxHeight: "100svh",
      }}
    />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 lg:bottom-8 lg:left-8 lg:translate-x-0 z-50 flex flex-col items-center lg:items-start pointer-events-none">
        <span className="text-[#DEC494]/50 text-[8px] tracking-[0.2em] uppercase mb-0.5">Now Viewing</span>
        <span className="text-[#DEC494] text-xs lg:text-xl tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-light">
          {selected?.name}
        </span>
      </div>

  <button
    onClick={() => setSelectedIndex(null)}
    className="absolute bottom-4 left-4 lg:top-6 lg:right-6 lg:bottom-auto lg:left-auto z-50 flex items-center gap-1.5 px-3 py-1.5 lg:px-5 lg:py-2.5 rounded-xl backdrop-blur-2xl border border-[#DEC494]/20 text-[#DEC494] text-[10px] lg:text-sm tracking-widest hover:bg-[#DEC494]/20 transition-all duration-300"
    style={{ background: "rgba(26,52,56,0.8)" }}
  >
    <span className="lg:hidden">&larr; Back</span>
    <span className="hidden lg:inline">Back &rarr;</span>
  </button>
        </>
      )}
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