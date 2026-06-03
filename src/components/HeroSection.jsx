"use client";

import { useEffect, useState, useTransition } from "react";
import ImageSequenceViewer from "./ImageSequenceViewer";
import DayNightViewer from "./DayNightViewer";
import SideMenu from "./SideMenu";
import Tour360Viewer from "./Tour360Viewer";
import AmenitiesViewer from "./AmenitiesViewer";
import LocationViewer from "./LocationViewer";
import HighlightsViewer from "./HighlightsViewer";
import Logo from "./Logo";
import LoadingScreen from "./LoadingScreen";

// Import your memory warehouse layer
import { sequenceCache, dayNightCache, AmenitiesCaches, globalAppCache } from "../utils/imageCache";

export default function HeroSection() {
  const [activeMenu, setActiveMenu] = useState("Home");
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showWebsite, setShowWebsite] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    // ── CONFIGURATION PARAMETERS ──
    const totalSeqFrames = 72;
    const totalDayNightFrames = 36;
    const dayNightLocations = [
      { key: "maingate", offset: 94 },
      { key: "clubhouse", offset: 168 },
      { key: "lakeview", offset: 22 }
    ];

    const amenityFiles = [
      "/Amenities/Clubhouse.webp",
      "/Amenities/Swimming Pool.webp",
      "/Amenities/Kids Play Area.webp",
      "/Amenities/Picnic Area.webp",
      "/Amenities/Pet Park.webp",
      "/Amenities/Tree Park.webp",
      "/Amenities/Orchard.webp"
    ];

    // Array of your 3 specific high-resolution project files
    const standaloneHighResFiles = [
      { path: "/location/Location_result.webp", type: "location" },
      { path: "/panoramas/1_result.webp", type: "panoramas" },
      { path: "/masterplan/HighresScreenshot00060_result.webp", type: "masterplan" }
    ];

    const totalDayNightAssets = dayNightLocations.length * totalDayNightFrames;
    
    // Grand Total Math: 72 (seq) + 108 (daynight) + 7 (amenities) + 3 (specific files) + 1 (video blob) = 191 items
    const criticalTotal = totalSeqFrames + totalDayNightAssets + amenityFiles.length + standaloneHighResFiles.length + 1;
    
    let processedCount = 0;

    // Offscreen rendering pipeline to pre-warm textures on the GPU
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = 16;
    offscreenCanvas.height = 16;
    const ctx = offscreenCanvas.getContext("2d");

    const trackLoaderProgress = () => {
      processedCount++;
      const currentPercent = (processedCount / criticalTotal) * 100;
      setProgress(Math.floor(currentPercent));

      if (processedCount >= criticalTotal) {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
        }, 600);
      }
    };

    const warmupTexture = (img) => {
      if (img.decode) {
        img.decode()
          .then(() => {
            if (ctx) ctx.drawImage(img, 0, 0, 4, 4);
            trackLoaderProgress();
          })
          .catch(() => {
            if (ctx) ctx.drawImage(img, 0, 0, 4, 4);
            trackLoaderProgress();
          });
      } else {
        if (ctx) ctx.drawImage(img, 0, 0, 4, 4);
        trackLoaderProgress();
      }
    };

    // ── 1. PRELOAD HOME IMAGE SEQUENCE ──
    for (let i = 0; i < totalSeqFrames; i++) {
      const img = new Image();
      img.src = `/sequence/HighresScreenshot${String(i + 22).padStart(5, "0")}_result.webp`;
      img.onload = () => {
        sequenceCache[i] = img;
        warmupTexture(img);
      };
      img.onerror = trackLoaderProgress;
    }

    // ── 2. PRELOAD DAY-NIGHT MATRIX VIEWS ──
    dayNightLocations.forEach((loc) => {
      for (let f = 1; f <= totalDayNightFrames; f++) {
        const img = new Image();
        const frameNumber = f + loc.offset;
        img.src = `/daynight/${loc.key}/HighresScreenshot00${String(frameNumber).padStart(3, "0")}_result.webp`;
        img.onload = () => {
          dayNightCache[`${loc.key}_${f}`] = img;
          warmupTexture(img);
        };
        img.onerror = trackLoaderProgress;
      }
    });

    // ── 3. PRELOAD AMENITIES PANORAMAS ──
    amenityFiles.forEach((fileSrc, index) => {
      const img = new Image();
      img.src = fileSrc;
      img.onload = () => {
        AmenitiesCaches[index] = img;
        warmupTexture(img);
      };
      img.onerror = () => {
        console.error(`Failed loading layout path resource: ${fileSrc}`);
        trackLoaderProgress();
      };
    });

    // ── 4. PRELOAD YOUR 3 SPECIFIC STANDALONE TARGET IMAGES ──
    standaloneHighResFiles.forEach((target) => {
      const img = new Image();
      img.src = target.path;
      img.onload = () => {
        // Safe global context routing assignments based on target key
        if (target.type === "location") globalAppCache.location.baseMap = img;
        if (target.type === "panoramas") globalAppCache.panoramas.tourBase = img;
        if (target.type === "masterplan") globalAppCache.masterplan.baseMap = img;
        
        warmupTexture(img);
      };
      img.onerror = () => {
        console.error(`Failed to cache structural layout element at: ${target.path}`);
        trackLoaderProgress();
      };
    });

    // ── 5. PRELOAD HIGH-PERFORMANCE VIDEO BLOB STREAM ──
    fetch("/videos/highlights.mp4")
      .then((res) => res.blob())
      .then((blob) => {
        globalAppCache.highlights.videoBlobUrl = URL.createObjectURL(blob);
        globalAppCache.highlights.isReady = true;
        trackLoaderProgress();
      })
      .catch((err) => {
        console.error("Binary media buffer streaming allocation failed:", err);
        trackLoaderProgress();
      });

  }, []);

  const handleMenuChange = (newMenu) => {
    startTransition(() => {
      setActiveMenu(newMenu);
    });
  };

  if (isLoading || !showWebsite) {
    return (
      <LoadingScreen
        progress={progress}
        ready={!isLoading}
        onExplore={() => setShowWebsite(true)}
      />
    );
  }

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#0b1719] select-none">
      <Logo />

      {activeMenu === "Home" && (
        <div className="absolute inset-0">
          <ImageSequenceViewer />
        </div>
      )}

      {activeMenu === "DayNight" && (
        <div className="absolute inset-0">
          <DayNightViewer />
        </div>
      )}

      {activeMenu === "Tour360" && (
        <div className="absolute inset-0">
          <Tour360Viewer />
        </div>
      )}

      {activeMenu === "Amenities" && (
        <div className="absolute inset-0">
          <AmenitiesViewer />
        </div>
      )}

      {activeMenu === "Location" && (
        <div className="absolute inset-0">
          <LocationViewer />
        </div>
      )}

      {activeMenu === "Highlights" && (
        <div className="absolute inset-0">
          <HighlightsViewer isActive={activeMenu === "Highlights"} />
        </div>
      )}

      <SideMenu activeMenu={activeMenu} setActiveMenu={handleMenuChange} />
    </main>
  );
}