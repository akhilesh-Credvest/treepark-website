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

import { preloadImages } from "../utils/preloadAssets";

export default function HeroSection() {
  const [activeMenu, setActiveMenu] = useState("Home");
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showWebsite, setShowWebsite] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const startupAssets = [];
    const totalFrames = 72;

    // Push ALL 72 frames into the preloader array so everything is cached locally instantly
    for (let i = 0; i < totalFrames; i++) {
      startupAssets.push(
        `/sequence/HighresScreenshot${String(i + 22).padStart(5, "0")}_result.webp`
      );
    }

    preloadImages(startupAssets, (currentProgress) => {
      // Safely map and bound progress state updates
      setProgress(Math.floor(currentProgress));
    })
      .then(() => {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
        }, 400); // Smooth exit delay for the loading panel
      })
      .catch((err) => {
        console.error("Asset preloading failed:", err);
        setIsLoading(false); // Safety fallback so app doesn't hang
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

      {/* Home (Sequence Viewer) */}
      {activeMenu === "Home" && (
        <div className="absolute inset-0 animate-fade-in">
          <ImageSequenceViewer />
        </div>
      )}

      {/* Day / Night Slider Core */}
      {activeMenu === "DayNight" && (
        <div className="absolute inset-0 animate-fade-in">
          <DayNightViewer />
        </div>
      )}

      {/* 360 Panoramic Panorama Stage */}
      {activeMenu === "Tour360" && (
        <div className="absolute inset-0 animate-fade-in">
          <Tour360Viewer />
        </div>
      )}

      {/* Amenities Panel Matrix */}
      {activeMenu === "Amenities" && (
        <div className="absolute inset-0 animate-fade-in">
          <AmenitiesViewer />
        </div>
      )}

      {/* Vector Interactive Road Mapping Canvas */}
      {activeMenu === "Location" && (
        <div className="absolute inset-0 animate-fade-in">
          <LocationViewer />
        </div>
      )}

      {/* Hardware Video Highlights Track */}
      {activeMenu === "Highlights" && (
        <div className="absolute inset-0 animate-fade-in">
          <HighlightsViewer isActive={activeMenu === "Highlights"} />
        </div>
      )}

      {/* Navigation Controller */}
      <SideMenu
        activeMenu={activeMenu}
        setActiveMenu={handleMenuChange}
      />
    </main>
  );
}