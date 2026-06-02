"use client";

import { useState, useEffect, useRef } from "react";

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

// Convert route % points to SVG polyline string
function toPoints(route) {
  return route.map(p => `${p[0]},${p[1]}`).join(" ");
}

// Calculate total polyline length in SVG units (approx)
function routeLength(route) {
  let len = 0;
  for (let i = 1; i < route.length; i++) {
    const dx = route[i][0] - route[i-1][0];
    const dy = route[i][1] - route[i-1][1];
    len += Math.sqrt(dx*dx + dy*dy);
  }
  return len;
}

export default function LocationViewer() {
const [selected, setSelected] = useState(null);
const [displayRoute, setDisplayRoute] = useState([]);
const polyRef = useRef(null);

  // ── ROUTE HELPER (remove after setting routes) ──
  const [helperMode, setHelperMode] = useState(false);
  const [helperPoints, setHelperPoints] = useState([]);
  const [helperCopied, setHelperCopied] = useState(false);
  const handleMapClick = (e) => {
    if (!helperMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (((e.clientX - rect.left) / rect.width) * 100).toFixed(1);
    const y = (((e.clientY - rect.top) / rect.height) * 100).toFixed(1);
    setHelperPoints((prev) => [...prev, [parseFloat(x), parseFloat(y)]]);
    setHelperCopied(false);
  };
  const helperRouteString = `[${helperPoints.map(p => `[${p[0]},${p[1]}]`).join(",")}]`;
  const copyHelper = () => {
    navigator.clipboard.writeText(helperRouteString);
    setHelperCopied(true);
    setTimeout(() => setHelperCopied(false), 2000);
  };
  // ── END ROUTE HELPER ──


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
    <div className="absolute inset-0 flex items-center justify-center">

      {/* Map — click to record route points (remove onClick after done) */}
      <div className={`absolute inset-0 z-10 ${helperMode ? "cursor-crosshair" : "cursor-default"}`} onClick={handleMapClick}>
        <img
          src="/location/Location_result.webp"
          alt=""
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
      </div>

      {/* ── ROUTE HELPER OVERLAY (remove after setting routes) ── */}
      {/* <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-20">
        {helperPoints.length > 1 && (
          <polyline
            points={helperPoints.map(p => `${p[0]},${p[1]}`).join(" ")}
            fill="none" stroke="#00ffcc" strokeWidth="0.5" strokeLinecap="round" strokeDasharray="1,0.8"
          />
        )}
        {helperPoints.map((p, i) => (
          <g key={i}>
            <circle cx={p[0]} cy={p[1]} r="0.7" fill="#00ffcc" />
            <text x={p[0]+1} y={p[1]-0.8} fontSize="1.8" fill="#00ffcc" fontFamily="monospace">{i+1}</text>
          </g>
        ))}
      </svg> */}
      {/* Toggle button — always visible */}
      {/* <button
        onClick={() => { setHelperMode(m => !m); setHelperPoints([]); }}
        className="absolute top-5 right-24 z-[100] px-4 py-2 rounded-xl text-[10px] tracking-widest transition-all duration-200"
        style={{
          background: helperMode ? "#00ffcc" : "rgba(0,30,25,0.85)",
          color: helperMode ? "#001a15" : "#00ffcc",
          border: "1px solid rgba(0,255,204,0.35)",
        }}
      >
        {helperMode ? "◉ Recording…" : "◎ Set Route"}
      </button> */}

      {/* Points bar — visible when in helper mode and points exist */}
      {/* {helperMode && helperPoints.length > 0 && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl border border-[#00ffcc]/30 shadow-lg max-w-[60vw] overflow-hidden" style={{background:"rgba(0,30,25,0.92)"}}>
          <span className="text-[#00ffcc] text-[10px] tracking-widest font-mono truncate">{helperRouteString}</span>
          <button onClick={copyHelper} className="flex-shrink-0 px-3 py-1 rounded-lg text-[10px] tracking-widest transition-all" style={{background: helperCopied ? "#00ffcc" : "rgba(0,255,204,0.1)", color: helperCopied ? "#001a15" : "#00ffcc", border:"1px solid rgba(0,255,204,0.3)"}}>
            {helperCopied ? "✓ Copied" : "Copy"}
          </button>
          <button onClick={() => setHelperPoints(p => p.slice(0,-1))} className="flex-shrink-0 px-3 py-1 rounded-lg text-[10px] text-[#00ffcc]/60 hover:text-[#00ffcc] transition-all" style={{background:"rgba(0,255,204,0.05)",border:"1px solid rgba(0,255,204,0.15)"}}>Undo</button>
          <button onClick={() => setHelperPoints([])} className="flex-shrink-0 px-3 py-1 rounded-lg text-[10px] text-[#00ffcc]/60 hover:text-[#00ffcc] transition-all" style={{background:"rgba(0,255,204,0.05)",border:"1px solid rgba(0,255,204,0.15)"}}>Clear</button>
        </div>
      )} */}
      {/* ── END ROUTE HELPER ── */}//

      {/* Tree Park origin pin */}
      <div className={`absolute z-20 ${helperMode ? "pointer-events-none" : ""}`} style={{ left: "53.5%", top: "28%", transform: "translate(-50%,-50%)" }}>
        <div className="relative flex items-center justify-center">
          {/* Pulse rings */}
          <div className="absolute w-10 h-10 rounded-full border border-[#DEC494]/40 animate-ping" />
          <div className="absolute w-6 h-6 rounded-full bg-[#DEC494]/20 animate-pulse" />
          {/* Core dot */}
          <div className="w-4 h-4 rounded-full bg-[#DEC494] shadow-[0_0_16px_rgba(222,196,148,0.9)] z-10" />
        </div>
        {/* Label */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-[#1a3438]/90 backdrop-blur-md border border-[#DEC494]/30 text-[#DEC494] text-[10px] tracking-widest whitespace-nowrap">
          TREE PARK
        </div>
      </div>

      {/* Animated SVG Route */}
     {displayRoute.length > 1 && (

  <svg
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    className="
      absolute
      inset-0
      w-full
      h-full
      pointer-events-none
      z-10
    "
  >

    <polyline
      points={displayRoute
        .map(
          p => `${p[0]},${p[1]}`
        )
        .join(" ")
      }

      fill="none"

      stroke="#DEC494"

      strokeWidth="0.98"

      strokeLinecap="round"

      strokeLinejoin="round"

      style={{
        filter:
          "drop-shadow(0 0 8px rgba(222,196,148,0.6))",
      }}
    />

    <circle
      cx={
        displayRoute[
          displayRoute.length - 1
        ][0]
      }
      cy={
        displayRoute[
          displayRoute.length - 1
        ][1]
      }
      r="0.2"
      fill="#DEC494"
    />

  </svg>

)}

      {/* Location markers */}
      {locations.map((item) => {
        const isActive = selected?.id === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleSelect(item)}
            style={{ left: item.x, top: item.y, transform: "translate(-50%,-50%)" }}
            className={`absolute z-30 flex flex-col items-center group ${helperMode ? "pointer-events-none opacity-40" : ""}`}
          >
            {/* Dot */}
            <div className={`
              w-4 h-4 rounded-full border-2 transition-all duration-300
              ${isActive
                ? "bg-[#DEC494] border-[#DEC494] scale-125 shadow-[0_0_14px_rgba(222,196,148,0.9)]"
                : "bg-[#DEC494]/50 border-[#DEC494]/60 group-hover:bg-[#DEC494] group-hover:scale-110"
              }
            `} />
            {/* Label */}
        <div
        className={`mt-1.5 px-3 py-1 rounded-md  backdrop-blur-md border text-[10px] whitespace-nowrap w-max max-w-none tracking-wide transition-all duration-300 ${
            isActive
            ? "bg-[#1a3438]/95 border-[#DEC494]/50 text-[#DEC494]"
            : "bg-[#1a3438]/70 border-[#DEC494]/15 text-[#DEC494]/70 group-hover:text-[#DEC494] group-hover:border-[#DEC494]/40"
        }`}
        >
        {item.name}
        </div>
          </button>
        );
      })}

      {/* Info card */}
      {selected && (
        <div className="absolute bottom-15 left-350 z-40 flex items-center gap-6 px-8 py-4 rounded-2xl backdrop-blur-2xl border border-[#DEC494]/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          style={{ background: "rgba(26,52,56,0.85)" }}>
          <div className="flex flex-col">
            <span className="text-[#DEC494]/50 text-[9px] tracking-[0.2em] mb-0.5">DESTINATION</span>
            <span className="text-[#DEC494] text-base tracking-wide">{selected.fullName}</span>
          </div>
          <div className="w-px h-8 bg-[#DEC494]/15" />
          <div className="flex flex-col">
            <span className="text-[#DEC494]/50 text-[9px] tracking-[0.2em] mb-0.5">DISTANCE</span>
            <span className="text-[#DEC494] text-base font-medium">{selected.distance}</span>
          </div>
          {/* <button
            onClick={() => setSelected(null)}
            className="ml-2 w-7 h-7 rounded-lg flex items-center justify-center text-[#DEC494]/40 hover:text-[#DEC494] hover:bg-[#DEC494]/10 transition-all text-sm"
          >
            ✕
          </button> */}
        </div>
      )}
      
    </div>
  );
}