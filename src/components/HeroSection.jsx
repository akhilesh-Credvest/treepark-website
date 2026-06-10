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
import BackgroundLoaderStatus from "./BackgroundLoaderStatus";

// Import your memory warehouse layer
import { sequenceCache, dayNightCache, AmenitiesCaches, globalAppCache } from "../utils/imageCache";

export default function HeroSection() {
  const [activeMenu, setActiveMenu] = useState("Home");
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showWebsite, setShowWebsite] = useState(false);
  const [, startTransition] = useTransition();

  // Background Thread State Tracking
  const [bgTotal, setBgTotal] = useState(0);
  const [bgCurrent, setBgCurrent] = useState(0);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

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

  const standaloneHighResFiles = [
    { path: "/location/Location_result.webp", type: "location" },
    { path: "/panoramas/1_result.webp", type: "panoramas" },
    { path: "/masterplan/HighresScreenshot00060_result.webp", type: "masterplan" }
  ];

  // ── STAGE 1: CRITICAL MAIN LOOP FOR INITIAL EXPERIENCE LOADING SCREEN ──
  useEffect(() => {
    let loaded = 0;
    const targetFrames = isMobile ? 9 : totalSeqFrames;
    const frameLimit = isMobile ? 30 : 22 + totalSeqFrames - 1;

    // Offscreen canvas to warm up core textures directly onto the GPU
    const offscreenCanvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
    if (offscreenCanvas) {
      offscreenCanvas.width = 16;
      offscreenCanvas.height = 16;
    }
    const ctx = offscreenCanvas ? offscreenCanvas.getContext("2d") : null;

    const processStage1Progress = () => {
      loaded++;
      const currentPercent = (loaded / targetFrames) * 100;
      setProgress(Math.floor(currentPercent));

      if (loaded >= targetFrames) {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
        }, 400);
      }
    };

    const runWarmup = (img) => {
      if (img && img.decode) {
        img.decode()
          .then(() => {
            try {
              if (ctx) ctx.drawImage(img, 0, 0, 4, 4);
            } catch (e) {
              console.warn("Canvas draw omitted during warmup:", e);
            }
            processStage1Progress();
          })
          .catch((err) => {
            // Safely catch runtime EncodingError without crashing the component tree
            console.error("Stage 1 Texture decoding bypassed safely:", err);
            processStage1Progress();
          });
      } else {
        try {
          if (ctx && img) ctx.drawImage(img, 0, 0, 4, 4);
        } catch (e) {
          console.warn("Canvas draw omitted during warmup:", e);
        }
        processStage1Progress();
      }
    };

    // Sequential loop covering the primary user interface visuals
    for (let i = 22; i <= frameLimit; i++) {
      const img = new Image();
      img.src = `/sequence/HighresScreenshot${String(i + 22).padStart(5, "0")}_result.webp`;
      img.onload = () => {
        sequenceCache[i - 22] = img;
        runWarmup(img);
      };
      img.onerror = () => {
        console.error(`Failed to download layout sequence item: Frame ${i}`);
        processStage1Progress();
      };
    }
  }, [isMobile]);

  // ── STAGE 2: NON-BLOCKING BACKGROUND DEFERRED ASSETS PIPELINE ──
  useEffect(() => {
    // Only kick off background caching operations once the user clicks "ENTER EXPERIENCE"
    if (!showWebsite || isMobile) return;

    const totalDayNightAssets = dayNightLocations.length * totalDayNightFrames;
    const grandTotalBg = totalDayNightAssets + amenityFiles.length + standaloneHighResFiles.length + 1;
    setBgTotal(grandTotalBg);

    let bgProcessed = 0;
    const updateBgProgress = () => {
      bgProcessed++;
      setBgCurrent(bgProcessed);
    };

    // Offscreen canvas pipeline for deferred images
    const bgCanvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
    if (bgCanvas) {
      bgCanvas.width = 16;
      bgCanvas.height = 16;
    }
    const bgCtx = bgCanvas ? bgCanvas.getContext("2d") : null;

    const warmupBgTexture = (img) => {
      if (img && img.decode) {
        img.decode()
          .then(() => {
            try {
              if (bgCtx) bgCtx.drawImage(img, 0, 0, 4, 4);
            } catch (e) {
              console.warn("Canvas draw omitted during bg warmup:", e);
            }
          })
          .catch((err) => {
            // Safely swallow deferred background image decoding errors to avoid console noise
            console.error("Background Texture decoding bypassed safely:", err);
          })
          .finally(() => {
            updateBgProgress();
          });
      } else {
        try {
          if (bgCtx && img) bgCtx.drawImage(img, 0, 0, 4, 4);
        } catch (e) {
          console.warn("Canvas draw omitted during bg warmup:", e);
        }
        updateBgProgress();
      }
    };

    // Sub-Task A: Day-Night Texture Processing Matrices
    dayNightLocations.forEach((loc) => {
      for (let f = 1; f <= totalDayNightFrames; f++) {
        const img = new Image();
        const frameNumber = f + loc.offset;
        img.src = `/daynight/${loc.key}/HighresScreenshot00${String(frameNumber).padStart(3, "0")}_result.webp`;
        img.onload = () => {
          dayNightCache[`${loc.key}_${f}`] = img;
          warmupBgTexture(img);
        };
        img.onerror = () => {
          console.error(`Failed loading daynight resource: ${loc.key} Frame ${f}`);
          updateBgProgress();
        };
      }
    });

    // Sub-Task B: Amenities Panorama Assets Caching Ring
    amenityFiles.forEach((fileSrc, index) => {
      const img = new Image();
      img.src = fileSrc;
      img.onload = () => {
        AmenitiesCaches[index] = img;
        warmupBgTexture(img);
      };
      img.onerror = () => {
        console.error(`Failed loading amenity layout resource: ${fileSrc}`);
        updateBgProgress();
      };
    });

    // Sub-Task C: High-Resolution Application Architecture Maps
    standaloneHighResFiles.forEach((target) => {
      const img = new Image();
      img.src = target.path;
      img.onload = () => {
        if (target.type === "location") globalAppCache.location.baseMap = img;
        if (target.type === "panoramas") globalAppCache.panoramas.tourBase = img;
        if (target.type === "masterplan") globalAppCache.masterplan.baseMap = img;
        warmupBgTexture(img);
      };
      img.onerror = () => {
        console.error(`Failed to cache structural standalone element at: ${target.path}`);
        updateBgProgress();
      };
    });

    // Sub-Task D: High-Performance Video Stream Storage Caching
    fetch("/videos/highlights.mp4")
      .then((res) => res.blob())
      .then((blob) => {
        globalAppCache.highlights.videoBlobUrl = URL.createObjectURL(blob);
        globalAppCache.highlights.isReady = true;
      })
      .catch((err) => {
        console.error("Failed to preload target stream highlights video:", err);
      })
      .finally(() => {
        updateBgProgress();
      });

  }, [showWebsite, isMobile]);

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
    <main className="relative w-screen h-[100dvh] overflow-hidden bg-[#0b1719] select-none">
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

      {/* Persistent Overlay Monitoring the Background Loading Pipeline Status Thread */}
      <BackgroundLoaderStatus total={bgTotal} current={bgCurrent} />

      <SideMenu activeMenu={activeMenu} setActiveMenu={handleMenuChange} />
    </main>
  );
}