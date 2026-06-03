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
  const [panoReady, setPanoReady] = useState(false);       // NEW
  const [overlayVisible, setOverlayVisible] = useState(false); // NEW
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, left: 0, top: 0 });
  const mapRef = useRef(null);

  const selected = selectedIndex !== null ? amenities[selectedIndex] : null;
  const masterPlanBackgroundSrc = globalAppCache.masterplan.baseMap?.src || "/masterplan/HighresScreenshot00060_result.webp";

  useEffect(() => {
    if (selectedIndex !== null) return;
    const handleResize = () => {
      if (!mapRef.current) return;
      const vW = window.innerWidth;
      const vH = window.innerHeight;
      const imgAspect = 16 / 9;
      const screenAspect = vW / vH;
      let renderW, renderH;
      if (screenAspect > imgAspect) { renderW = vW; renderH = vW / imgAspect; }
      else { renderH = vH; renderW = vH * imgAspect; }
      setDimensions({ width: renderW, height: renderH, left: (vW - renderW) / 2, top: (vH - renderH) / 2 });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex === null) {
      if (viewerRef.current) {
        try { viewerRef.current.destroy(); } catch (e) { console.warn(e); }
        viewerRef.current = null;
      }
      setPanoReady(false);   // NEW
      setOverlayVisible(false); // NEW
      return;
    }

    // Show overlay immediately when a new amenity is selected NEW
    setPanoReady(false);
    setOverlayVisible(true);

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
            // Fade out overlay after swap too NEW
            setTimeout(() => setOverlayVisible(false), 200);
            return;
          } catch (err) {
            viewerRef.current.destroy();
            viewerRef.current = null;
          }
        }

        const viewer = new Viewer({
          container: containerRef.current,
          panorama: panoramaSource,
          navbar: [],
          mousewheel: true,
          defaultYaw: 0,
          loadingImg: null,
        });

        viewerRef.current = viewer;

        // Fade out overlay when PSV fires ready NEW
        viewer.addEventListener("ready", () => {
          if (!destroyed) {
            setPanoReady(true);
            setTimeout(() => setOverlayVisible(false), 200);
          }
        });

      } catch (err) {
        console.error("PSV error:", err);
        setOverlayVisible(false); // don't get stuck on error NEW
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
                style={{ left: `${item.x}%`, top: `${item.y}%`, transform: "translate(-50%, -50%)" }}
                className="absolute pointer-events-auto z-30 flex flex-col items-center group"
              >
                <button
                  onClick={() => setSelectedIndex(index)}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold tracking-widest backdrop-blur-md border transition-all duration-300 bg-[#084042]/90 text-[#DEC494] border-[#DEC494]/60 shadow-[0_0_15px_rgba(222,196,148,0.25)] group-hover:bg-[#DEC494] group-hover:text-[#0b1719] group-hover:border-[#DEC494] group-hover:shadow-[0_0_35px_rgba(222,196,148,0.8)] group-hover:scale-110 active:scale-95"
                >
                  {String(item.id).padStart(2, "0")}
                </button>
                <div className="absolute top-14 opacity-0 scale-95 translate-y-[-4px] pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 whitespace-nowrap z-40">
                  <span className="px-3 py-1.5 rounded-lg text-[10px] font-medium tracking-widest bg-[#084042]/95 text-[#DEC494] border border-[#DEC494]/40 shadow-[0_4px_12px_rgba(0,0,0,0.5)] uppercase">
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
          <div ref={containerRef} className="absolute inset-0 w-full h-full bg-[#0b1719]" />

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
              gap: 20,
              opacity: overlayVisible ? 1 : 0,
              pointerEvents: overlayVisible ? "auto" : "none",
              transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Amenity name while loading */}
            <p style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: 11,
              fontWeight: 300,
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              color: "rgba(222,196,148,0.4)",
              marginBottom: 8,
            }}>
              {selected?.name}
            </p>
            {/* Spinner */}
            <div style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "1px solid rgba(222,196,148,0.12)",
              borderTop: "1px solid #DEC494",
              animation: "spinA 1.2s linear infinite",
            }} />
            <p style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: 9,
              fontWeight: 300,
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              color: "rgba(222,196,148,0.35)",
              animation: "pulseA 2s ease-in-out infinite",
            }}>
              Loading View
            </p>
            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300&display=swap');
              @keyframes spinA  { to { transform: rotate(360deg); } }
              @keyframes pulseA { 0%,100%{opacity:.3} 50%{opacity:.8} }
            `}</style>
          </div>

          {/* Amenity name label */}
          <div className="absolute bottom-8 left-8 z-40 flex flex-col pointer-events-none">
            <span className="text-[#DEC494] text-xl tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-light">
              {selected?.name}
            </span>
          </div>

          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-6 right-6 z-40 flex items-center gap-2 px-5 py-2.5 rounded-xl backdrop-blur-2xl border border-[#DEC494]/20 text-[#DEC494] text-sm tracking-widest hover:bg-[#DEC494]/20 transition-all duration-300"
            style={{ background: "rgba(26,52,56,0.8)" }}
          >
            Back &rarr;
          </button>
        </>
      )}

    </div>
  );
}