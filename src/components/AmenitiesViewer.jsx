"use client";

import { useState, useEffect, useRef } from "react";
import { AmenitiesCaches } from "../utils/imageCache";

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

  const selected = selectedIndex !== null ? amenities[selectedIndex] : null;

  // Sync background thread cache arrays locally
  useEffect(() => {
    amenities.forEach((item, index) => {
      if (!AmenitiesCaches[index]) {
        const img = new Image();
        img.src = item.image;
        AmenitiesCaches[index] = img;
      }
    });
  }, []);

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

  // Handle Photo Sphere mounting via cache buffers
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
        
        // INTERCEPT POINT: Bypass network fetching by pulling the preloaded instance
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
          loadingImg: null, // Clear built-in text fields to speed up layout transition
          // panoramaOptions: { cors: "anonymous" },
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
            style={{ backgroundImage: "url('/masterplan/HighresScreenshot00060_result.webp')" }}
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
              <button
                key={item.id}
                onClick={() => setSelectedIndex(index)}
                style={{ 
                  left: `${item.x}%`, 
                  top: `${item.y}%`,
                  transform: "translate(-50%, -50%)"
                }}
                className="absolute pointer-events-auto w-11 h-11 rounded-full flex items-center justify-center text-xs tracking-widest backdrop-blur-md border transition-all duration-300 bg-[#1a3438]/85 text-[#DEC494] border-[#DEC494]/40 hover:bg-[#DEC494] hover:text-[#0b1719] hover:border-[#DEC494] hover:shadow-[0_0_30px_rgba(222,196,148,0.7)] hover:scale-110 z-30"
              >
                {String(item.id).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── PANORAMA VIEW ── */}
      {selectedIndex !== null && (
        <>
          <div ref={containerRef} className="absolute inset-0 w-full h-full bg-[#0b1719]" />

          <div className="absolute bottom-8 left-8 z-50 flex flex-col pointer-events-none">
            <span className="text-[#DEC494] text-xl tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-light">
              {selected?.name}
            </span>
          </div>

          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-6 right-6 z-50 flex items-center gap-2 px-5 py-2.5 rounded-xl backdrop-blur-2xl border border-[#DEC494]/20 text-[#DEC494] text-sm tracking-widest hover:bg-[#DEC494]/20 transition-all duration-300"
            style={{ background: "rgba(26,52,56,0.8)" }}
          >
            Back &rarr;
          </button>
        </>
      )}

    </div>
  );
}