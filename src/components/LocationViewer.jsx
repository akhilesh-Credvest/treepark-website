"use client";

import { useState, useEffect, useRef } from "react";
import { globalAppCache } from "../utils/imageCache";

const locations = [
  {
    id: 1,
    name: (<>Beary's Global<br />esearch Triangle</>),
    fullName: "Beary's Global Research Triangle",
    distance: "6 KM",
    x: "57.8%", y: "61%",
    route: [[53.4,28.8],[52.8,30.4],[55.6,31.6],[56.5,33.6],[58.2,38.1],[59.1,40.6],[59.6,43.2],[60.4,44.9],[60.6,45.8],[59.5,46.7],[59.2,48.3],[58.9,52.8],[58.4,57.2],[58.2,59.7]],
  },
  {
    id: 2,
    name: "NPS OMR",
    fullName: "NPS OMR",
    distance: "0.7 KM",
    x: "56%", y: "36%",
    route: [[53.6,29],[52.6,30.6],[54.9,31.4],[55.9,32],[56.6,34.1]],
  },
  {
    id: 3,
    name: (<>Geetha Mutispecialty<br />Hospital</>),
    fullName: "Geetha Mutispecialty Hospital",
    distance: "7.5KM",
    x: "51%", y: "58%",
    route: [[53.5,29],[52.7,30.6],[55.8,31.6],[56.9,35],[58.5,38.9],[59.1,40.9],[60,44.2],[60.5,45.6],[59.3,47],[57.6,48.9],[55.8,51.2],[54.4,53.1],[53,55.4],[51.5,57.1]],
  },
  {
    id: 4,
    name: (<>Orion Uptown<br />Mall</>),
    fullName: "Orion Uptown Mall",
    distance: "5 KM",
    x: "65%", y: "37%",
    route: [[53.5,29.1],[52.7,30.8],[55.7,31.8],[58,37.5],[59.2,40.6],[60.1,44.5],[60.5,45.8],[62,44.2],[62.7,42.6],[63.7,40.5],[64.6,38.5],[65.6,36.5]],
  },
  {
    id: 5,
    name: (<>VR Bengaluru<br />Mall</>),
    fullName: "VR Bengaluru Mall",
    distance: "15 KM",
    x: "31%", y: "91.2%",
    route: [[53.5,29],[52.7,30.6],[55.8,32],[58.9,39.8],[59.9,44],[60.5,45.7],[58.4,48],[56.5,50.2],[54.9,52.5],[53.1,55],[50.9,58.1],[49.1,60.8],[47.4,63.1],[44.3,67],[38.1,73.9],[35.6,76.4],[34.3,79.6],[33.3,82.7],[31.2,83.7],[29,85.4],[25.9,88.7],[25.1,89.6],[26.6,89.7],[28.3,89.4],[29.6,89.7],[30.5,90.9]],
  },
  {
    id: 6,
    name: (<>Red RhinoCraft<br />Brewery & Kitchen</>),
    fullName: "Red RhinoCraft Brewery & Kitchen",
    distance: "8 KM",
    x: "57.6%", y: "69%",
    route: [[53.6,28.7],[52.9,30.5],[55.8,31.7],[57.5,36.4],[58.8,39.9],[59.4,42.5],[60.4,45],[59.6,46.7],[59.2,48.6],[58.8,53.7],[58.3,58.5],[57.8,63],[58,65],[58.2,67.4]],
  },
  {
    id: 7,
    name: (<>RMX Infinity<br />Mall</>) ,
    fullName: "RMX Infinity Mall",
    distance: "16 KM",
    x: "18%", y: "96.5%",
    route: [[53.5,28.8],[52.9,30.6],[55.6,31.8],[56.7,34.4],[58.4,38.6],[59.2,41.1],[59.8,43.9],[60.5,45.2],[59.4,47.2],[57.5,48.9],[55.1,52.1],[53.8,53.9],[50.7,58.6],[48.8,61.3],[46.8,64.2],[44.2,67.1],[38.2,73.9],[35.9,75.8],[35.2,77.7],[33.7,81.6],[32.9,83.3],[30.7,83.9],[29.2,85.3],[26.9,87.6],[23.3,91.4],[18.3,96.1]],
  },
];

export default function LocationViewer() {
  const [selected, setSelected] = useState(null);
  const [displayRoute, setDisplayRoute] = useState([]);
  const [helperMode] = useState(false); // Cleaned layout lock tracking
  const [isPortrait, setIsPortrait] = useState(false);

  // Responsive Device Orientation Detection Lifecycle
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

  // Optimized fallback calculation system
  const mapBackgroundSrc = globalAppCache.location.baseMap?.src || "/location/Location_result.webp";

  const handleSelect = (item) => {
    const animateRoute = (route) => {
      setDisplayRoute([]);
      let currentRoute = [];
      route.forEach((point, index) => {
        setTimeout(() => {
          currentRoute.push(point);
          setDisplayRoute([...currentRoute]);
        }, index * 35);
      });
    };

    setSelected(item);
    animateRoute(item.route);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      {/* Background Map Graphic Layer */}
      <div className="absolute inset-0 z-10 w-full h-full overflow-hidden">
        <img
          src={mapBackgroundSrc}
          alt="Location Map Base"
          className="w-full h-full object-cover pointer-events-none select-none"
          draggable={false}
        />
      </div>
      

      {/* Tree Park origin pin */}
      <div className={`absolute z-20 ${helperMode ? "pointer-events-none" : ""}`} style={{ left: "53.5%", top: "28%", transform: "translate(-50%,-50%)" }}>
        <div className="relative flex items-center justify-center">
          <div className="absolute w-10 h-10 rounded-full border border-[#DEC494]/40 animate-ping" />
          <div className="absolute w-6 h-6 rounded-full bg-[#DEC494]/20 animate-pulse" />
          <div className="w-4 h-4 rounded-full bg-[#DEC494] shadow-[0_0_16px_rgba(222,196,148,0.9)] z-10" />
        </div>
        <div className="absolute left-6 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-[#1a3438]/90 backdrop-blur-md border border-[#DEC494]/30 text-[#DEC494] text-[10px] tracking-widest whitespace-nowrap">
          TREE PARK
        </div>
      </div>

      {/* Animated SVG Route */}
      {displayRoute.length > 1 && (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <polyline
            points={displayRoute.map(p => `${p[0]},${p[1]}`).join(" ")}
            fill="none"
            stroke="#DEC494"
            strokeWidth="0.98"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 0 8px rgba(222,196,148,0.6))" }}
          />
          <circle
            cx={displayRoute[displayRoute.length - 1][0]}
            cy={displayRoute[displayRoute.length - 1][1]}
            r="0.2"
            fill="#DEC494"
          />
        </svg>
      )}
      

      {locations.map((item) => {
        const isActive = selected?.id === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleSelect(item)}
            style={{ left: item.x, top: item.y, transform: "translate(-50%,-50%)" }}
            className={`absolute z-30 flex flex-col items-center group transition-opacity duration-300 ${helperMode ? "pointer-events-none opacity-40" : ""}`}
          >
            <div className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full border-2 transition-all duration-300 ${
              isActive
                ? "bg-[#DEC494] border-[#DEC494] scale-125 shadow-[0_0_14px_rgba(222,196,148,0.9)]"
                : "bg-[#DEC494]/50 border-[#DEC494]/60 group-hover:bg-[#DEC494] group-hover:scale-110"
            }`} />
            {/* Label — desktop only, mobile uses bottom-right card */}
            <div className={`hidden lg:block mt-1.5 px-3 py-1 rounded-md backdrop-blur-md border text-[10px] whitespace-nowrap w-max tracking-wide transition-all duration-300 ${
              isActive
                ? "bg-[#1a3438]/95 border-[#DEC494]/50 text-[#DEC494]"
                : "bg-[#1a3438]/70 border-[#DEC494]/15 text-[#DEC494]/70 group-hover:text-[#DEC494] group-hover:border-[#DEC494]/40"
            }`}>
              {item.name}
            </div>
          </button>
        );
      })}

      {/* Info card */}
      {selected && (
        <div
          className="absolute bottom-4 right-4 z-40 flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-2xl border border-[#DEC494]/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-w-[60vw] lg:max-w-none lg:bottom-8 lg:right-8 lg:gap-6 lg:px-8 lg:py-4"
          style={{ background: "rgba(26,52,56,0.92)" }}
        >
          <div className="flex flex-col min-w-0">
            <span className="text-[#DEC494]/50 text-[8px] lg:text-[9px] tracking-[0.2em] mb-0.5">DESTINATION</span>
            <span className="text-[#DEC494] text-xs lg:text-base tracking-wide truncate">{selected.fullName}</span>
          </div>
          <div className="w-px h-6 lg:h-8 bg-[#DEC494]/15 flex-shrink-0" />
          <div className="flex flex-col flex-shrink-0">
            <span className="text-[#DEC494]/50 text-[8px] lg:text-[9px] tracking-[0.2em] mb-0.5">DISTANCE</span>
            <span className="text-[#DEC494] text-xs lg:text-base font-medium">{selected.distance}</span>
          </div>
        </div>
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