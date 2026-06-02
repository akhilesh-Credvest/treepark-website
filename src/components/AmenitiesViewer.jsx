"use client";

import { useState, useEffect, useRef } from "react";
import { AmenitiesCaches } from "../utils/imageCache";

const amenities = [
  { id: 1, name: "Club House",              image: "/amenities/Clubhouse.webp",        x: "57.4%",  y: "6.5%" },
  { id: 2, name: "Swimming Pool",           image: "/amenities/Swimming Pool.webp",            x: "55%",y: "3.2%"   },
  { id: 3, name: "Kids Play Area",          image: "/amenities/Kids Play Area.webp",            x: "47.5%",  y: "15%"  },
  { id: 4, name: "Picnic Area",             image: "/amenities/Picnic Area.webp",             x: "25.5%",  y: "41%"  },
  { id: 5, name: "Pet Park",                image: "/amenities/Pet Park.webp",    x: "68%",  y: "89%"  },
  { id: 6, name: "Tree Park", image: "/amenities/Tree Park.webp",    x: "49%",  y: "7%"  },
  { id: 7, name: "Orchard", image: "/amenities/Orchard.webp",    x: "24%",  y: "53%"  },
];

export default function AmenitiesViewer() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
const imageCache = useRef(AmenitiesCaches);

  const selected = selectedIndex !== null ? amenities[selectedIndex] : null;

  const navigate = (dir) => {
    setSelectedIndex((prev) => (prev + dir + amenities.length) % amenities.length);
  };

  const preloadFrame = (index) => {

  if (
    index < 0 ||
    index >= amenities.length ||
    imageCache.current[index]
  ) return;

  const img = new Image();

  img.src = amenities[index].image;

  imageCache.current[index] = img;

};

  useEffect(() => {

  let index = 0;

  const loadNext = () => {

    if (index >= amenities.length)
      return;

    preloadFrame(index);

    index++;

    setTimeout(
      loadNext,
      50
    );

  };

  loadNext();

}, []);

useEffect(() => {

  if (
    selectedIndex === null ||
    !containerRef.current
  ) return;

  let destroyed = false;

  (async () => {

    try {

      const { Viewer } =
        await import("@photo-sphere-viewer/core");

      await import(
        "@photo-sphere-viewer/core/index.css"
      );

      if (
        destroyed ||
        !containerRef.current
      ) return;

      const panorama =
        amenities[selectedIndex].image;

      if (viewerRef.current) {

        viewerRef.current.setPanorama(
          panorama,
          {
            transition: {
              duration: 800,
            },
          }
        );

        return;

      }

      viewerRef.current =
        new Viewer({

          container:
            containerRef.current,

          panorama,

          navbar: [],

          mousewheel: true,

          defaultYaw: 0,

        });

    } catch (err) {

      console.error(
        "PSV error:",
        err
      );

    }

  })();

  return () => {

    destroyed = true;

  };

}, [selectedIndex]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">

      {/* ── MASTERPLAN VIEW ── */}
      {selectedIndex === null && (
        <>
          <img
            src="/masterplan/HighresScreenshot00060_result.webp"
            alt=""
            className="w-full h-full object-cover"
          />

          {amenities.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setSelectedIndex(index)}
              style={{ left: item.x, top: item.y }}
              className="absolute w-11 h-11 rounded-full flex items-center justify-center text-xs tracking-widest backdrop-blur-md border transition-all duration-200 bg-[#1a3438]/80 text-[#DEC494] border-[#DEC494]/40 hover:bg-[#DEC494]/15 hover:border-[#DEC494]/80 hover:shadow-[0_0_0_6px_rgba(222,196,148,0.12)] hover:scale-110"
            >
              {String(item.id).padStart(2, "0")}
            </button>
          ))}
        </>
      )}

      {/* ── PANORAMA VIEW ── */}
      {selectedIndex !== null && (
        <>
          {/* Viewer canvas */}
          <div ref={containerRef} className="absolute inset-0" />

          {/* Name — bottom left, no background */}
          <div className="absolute bottom-8 left-8 z-50 flex flex-col">
            {/* <span className="text-[#DEC494]/50 text-[10px] tracking-[0.2em] mb-1">
              {String(selectedIndex + 1).padStart(2, "0")} / {String(amenities.length).padStart(2, "0")}
            </span> */}
            <span className="text-[#DEC494] text-xl tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {selected.name}
            </span>
          </div>

          {/* Back button — top right */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-6 right-6 z-50 flex items-center gap-2 px-5 py-2.5 rounded-xl backdrop-blur-2xl border border-[#DEC494]/20 text-[#DEC494] text-sm tracking-widest hover:bg-[#DEC494]/10 transition-all duration-200"
            style={{ background: "rgba(26,52,56,0.75)" }}
          >
            Back →
          </button>
        </>
      )}

    </div>
  );
}