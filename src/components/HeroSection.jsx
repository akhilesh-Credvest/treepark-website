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
import PwaInstallPrompt from "./PwaInstallPrompt"; // Import new mobile full-screen installer popup

import { sequenceCache, dayNightCache, AmenitiesCaches, globalAppCache } from "../utils/imageCache";

export default function HeroSection() {
  const [activeMenu, setActiveMenu] = useState("Home");
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showWebsite, setShowWebsite] = useState(false);
  const [, startTransition] = useTransition();

  // Background Cache Progress Trackers
  const [bgTotal, setBgTotal] = useState(0);
  const [bgCurrent, setBgCurrent] = useState(0);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const totalSeqFrames = 72;
  const mobileInitialFrames = 9; // Core critical package loop for instant mobile loading
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

    useEffect(() => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(
        function(registration) {
          console.log('Service Worker registered successfully with scope: ', registration.scope);
        },
        function(err) {
          console.log('Service Worker registration failed: ', err);
        }
      );
    });
  }
}, []);
  // ── STAGE 1: UNIFIED CRITICAL CORE LOADER PIPELINE ──
  useEffect(() => {
    let loaded = 0;
    // On mobile we only wait for 9 frames to allow instant explore entry; on desktop we load all 72 frames
    const targetFrames = isMobile ? mobileInitialFrames : totalSeqFrames;

    const offscreenCanvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
    if (offscreenCanvas) {
      offscreenCanvas.width = 16;
      offscreenCanvas.height = 16;
    }
    const ctx = offscreenCanvas ? offscreenCanvas.getContext("2d") : null;

    const processStage1Progress = () => {
      loaded++;
      const currentPercent = (loaded / targetFrames) * 100;
      setProgress(Math.floor(Math.min(currentPercent, 100)));

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
            try { if (ctx) ctx.drawImage(img, 0, 0, 4, 4); } catch (e) {}
            processStage1Progress();
          })
          .catch(() => {
            processStage1Progress();
          });
      } else {
        try { if (ctx && img) ctx.drawImage(img, 0, 0, 4, 4); } catch (e) {}
        processStage1Progress();
      }
    };

    // Load initial critical frames (22 to 30 on mobile, or 22 to 93 on desktop)
    const frameLimit = 22 + targetFrames - 1;
    for (let i = 22; i <= frameLimit; i++) {
      const img = new Image();
      img.src = `/sequence/HighresScreenshot${String(i).padStart(5, "0")}_result.webp`;
      img.onload = () => {
        sequenceCache[i - 22] = img;
        runWarmup(img);
      };
      img.onerror = processStage1Progress;
    }
  }, [isMobile]);

  // ── STAGE 2: BACKGROUND LOADER PIPELINE (RUNS ON DESKTOP AND MOBILE AFTER CLICKING ENTER) ──
  useEffect(() => {
    if (!showWebsite) return;

    // Mobile needs to fetch the remaining 63 sequence images in the background
    const remainingMobileSequenceCount = isMobile ? (totalSeqFrames - mobileInitialFrames) : 0;
    const totalDayNightAssets = dayNightLocations.length * totalDayNightFrames;
    const grandTotalBg = remainingMobileSequenceCount + totalDayNightAssets + amenityFiles.length + standaloneHighResFiles.length + 1;
    
    setBgTotal(grandTotalBg);

    let bgProcessed = 0;
    const updateBgProgress = () => {
      bgProcessed++;
      setBgCurrent(bgProcessed);
    };

    const bgCanvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
    const bgCtx = bgCanvas ? bgCanvas.getContext("2d") : null;

    const warmupBgTexture = (img) => {
      if (img && img.decode) {
        img.decode()
          .then(() => { try { if (bgCtx) bgCtx.drawImage(img, 0, 0, 4, 4); } catch (e) {} })
          .catch(() => {})
          .finally(() => { updateBgProgress(); });
      } else {
        try { if (bgCtx && img) bgCtx.drawImage(img, 0, 0, 4, 4); } catch (e) {}
        updateBgProgress();
      }
    };

    // Sub-Task A: If Mobile, load the rest of the Home screen sequence frames in the background
    if (isMobile) {
      const remainingStartFrame = 22 + mobileInitialFrames;
      const remainingEndFrame = 22 + totalSeqFrames - 1;

      for (let i = remainingStartFrame; i <= remainingEndFrame; i++) {
        const img = new Image();
        img.src = `/sequence/HighresScreenshot${String(i).padStart(5, "0")}_result.webp`;
        img.onload = () => {
          sequenceCache[i - 22] = img;
          warmupBgTexture(img);
        };
        img.onerror = updateBgProgress;
      }
    }

    // Sub-Task B: Day-Night Sequences
    dayNightLocations.forEach((loc) => {
      for (let f = 1; f <= totalDayNightFrames; f++) {
        const img = new Image();
        const frameNumber = f + loc.offset;
        img.src = `/daynight/${loc.key}/HighresScreenshot${String(frameNumber).padStart(5, "0")}_result.webp`;
        img.onload = () => {
          dayNightCache[`${loc.key}_${f}`] = img;
          warmupBgTexture(img);
        };
        img.onerror = updateBgProgress;
      }
    });

    // Sub-Task C: Amenities Panorama Assets
    amenityFiles.forEach((fileSrc, index) => {
      const img = new Image();
      img.src = fileSrc;
      img.onload = () => {
        AmenitiesCaches[index] = img;
        warmupBgTexture(img);
      };
      img.onerror = updateBgProgress;
    });

    // Sub-Task D: High-Resolution Application Maps
    standaloneHighResFiles.forEach((target) => {
      const img = new Image();
      img.src = target.path;
      img.onload = () => {
        if (target.type === "location") globalAppCache.location.baseMap = img;
        if (target.type === "panoramas") globalAppCache.panoramas.tourBase = img;
        if (target.type === "masterplan") globalAppCache.masterplan.baseMap = img;
        warmupBgTexture(img);
      };
      img.onerror = updateBgProgress;
    });

    // Sub-Task E: Highlights Video pre-warming loop
    fetch("/videos/highlights.mp4")
      .then((res) => res.blob())
      .then((blob) => {
        globalAppCache.highlights.videoBlobUrl = URL.createObjectURL(blob);
        globalAppCache.highlights.isReady = true;
      })
      .catch(() => {})
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

      {/* Floating Status Bar Component monitoring the background download loop */}
      <BackgroundLoaderStatus total={bgTotal} current={bgCurrent} />

      {/* Modern custom Mobile Add To Home Screen Popup indicator */}
      <PwaInstallPrompt />

      <SideMenu activeMenu={activeMenu} setActiveMenu={handleMenuChange} />
    </main>
  );
}