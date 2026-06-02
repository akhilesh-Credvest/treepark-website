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

import { sequenceCache, dayNightCache, generalCache } from "../utils/imageCache";

export default function HeroSection() {
  const [activeMenu, setActiveMenu] = useState("Home");
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showWebsite, setShowWebsite] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const totalSeqFrames = 72;
    const totalDayNightFrames = 36; // Matching DayNightViewer configuration parameters
    
    const dayNightLocations = [
      { key: "maingate", offset: 94 },
      { key: "clubhouse", offset: 168 },
      { key: "lakeview", offset: 22 }
    ];

    // Compute grand total tracking boundary
    const totalDayNightAssets = dayNightLocations.length * totalDayNightFrames;
    const criticalTotal = totalSeqFrames + totalDayNightAssets + 1; // +1 for Masterplan
    
    let processedCount = 0;

    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = 16;
    offscreenCanvas.height = 16;
    const ctx = offscreenCanvas.getContext("2d");

    const updateLoaderProgress = () => {
      processedCount++;
      const currentPercent = (processedCount / criticalTotal) * 100;
      setProgress(Math.floor(currentPercent));

      if (processedCount === criticalTotal) {
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
            updateLoaderProgress();
          })
          .catch(() => {
            if (ctx) ctx.drawImage(img, 0, 0, 4, 4);
            updateLoaderProgress();
          });
      } else {
        if (ctx) ctx.drawImage(img, 0, 0, 4, 4);
        updateLoaderProgress();
      }
    };

    // 1. Preload Image Sequence (Home Layer)
    for (let i = 0; i < totalSeqFrames; i++) {
      const img = new Image();
      img.src = `/sequence/HighresScreenshot${String(i + 22).padStart(5, "0")}_result.webp`;
      img.onload = () => {
        sequenceCache[i] = img;
        warmupTexture(img);
      };
      img.onerror = updateLoaderProgress;
    }

    // 2. Preload DayNight Matrix (All 3 Views completely cached)
    dayNightLocations.forEach((loc) => {
      for (let f = 1; f <= totalDayNightFrames; f++) {
        const img = new Image();
        const frameNumber = f + loc.offset;
        img.src = `/daynight/${loc.key}/HighresScreenshot00${String(frameNumber).padStart(3, "0")}_result.webp`;
        
        img.onload = () => {
          const cacheKey = `${loc.key}_${f}`;
          dayNightCache[cacheKey] = img;
          warmupTexture(img);
        };
        img.onerror = updateLoaderProgress;
      }
    });

    // 3. Preload Masterplan Layout Map File
    const mpImg = new Image();
    mpImg.src = `/masterplan/masterplan_layout.webp`;
    mpImg.onload = () => {
      generalCache.masterplan = mpImg;
      warmupTexture(mpImg);
    };
    mpImg.onerror = updateLoaderProgress;

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
        <div className="absolute inset-0 animate-fade-in">
          <Tour360Viewer />
        </div>
      )}

      {activeMenu === "Amenities" && (
        <div className="absolute inset-0 animate-fade-in">
          <AmenitiesViewer />
        </div>
      )}

      {activeMenu === "Location" && (
        <div className="absolute inset-0 animate-fade-in">
          <LocationViewer />
        </div>
      )}

      {activeMenu === "Highlights" && (
        <div className="absolute inset-0 animate-fade-in">
          <HighlightsViewer isActive={activeMenu === "Highlights"} />
        </div>
      )}

      <SideMenu activeMenu={activeMenu} setActiveMenu={handleMenuChange} />
    </main>
  );
}