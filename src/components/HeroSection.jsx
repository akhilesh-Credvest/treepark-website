"use client";

import { useEffect, useState } from "react";

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

useEffect(() => {

  const startupAssets = [];

  for (let i = 22; i <= 30; i++) {

    startupAssets.push(
      `/sequence/HighresScreenshot${String(i).padStart(5, "0")}_result.webp`
    );

  }

  preloadImages(
    startupAssets,
    setProgress
  ).then(() => {

    setIsLoading(false);

  });

}, []);

// useEffect(() => {

//   if (isLoading) return;

//   const backgroundAssets = [];

//   // PANORAMAS

//   for (let i = 1; i <= 27; i++) {

//     backgroundAssets.push(
//       `/panoramas/${i}_result.webp`
//     );

//   }
// // DAY NIGHT - MAINGATE

// for (let i = 95; i <= 130; i++) {

//   backgroundAssets.push(
//     `/daynight/maingate/HighresScreenshot${String(i).padStart(5, "0")}_result.webp`
//   );

// }

// // DAY NIGHT - CLUBHOUSE

// for (let i = 169; i <= 204; i++) {

//   backgroundAssets.push(
//     `/daynight/clubhouse/HighresScreenshot${String(i).padStart(5, "0")}_result.webp`
//   );

// }

// // DAY NIGHT - LAKEVIEW

// for (let i = 23; i <= 58; i++) {

//   backgroundAssets.push(
//     `/daynight/lakeview/HighresScreenshot${String(i).padStart(5, "0")}_result.webp`
//   );

// }

//   // AMENITIES

//   backgroundAssets.push(
//     "/amenities/Clubhouse.webp",
//     "/amenities/Swimming Pool.webp",
//     "/amenities/Kids Play Area.webp",
//     "/amenities/Picnic Area.webp",
//     "/amenities/Pet Park.webp",
//     "/amenities/Tree Park.webp",
//     "/amenities/Orchard.webp"
//   );

//   // LOCATION

//   backgroundAssets.push(
//     "/location/Location_result.webp"
//   );

//   // START BACKGROUND PRELOAD

//   preloadImages(
//     backgroundAssets,
//     () => {}
//   );
//   // HIGHLIGHTS VIDEO
//   backgroundAssets.push(
//   "/videos/highlights.mp4"
// );

// }, [isLoading]);

//   if (isLoading) {

//     return (
//       <LoadingScreen
//         progress={progress}
//       />
//     );

//   }

return (

  <main className="relative w-full h-screen overflow-hidden">

    <Logo />

    {/* Home */}

    <div
      className={`absolute inset-0 transition-opacity duration-300 ${
        activeMenu === "Home"
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <ImageSequenceViewer />
    </div>

    {/* Day Night */}

    <div
      className={`absolute inset-0 transition-opacity duration-300 ${
        activeMenu === "DayNight"
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <DayNightViewer />
    </div>

    {/* 360 Tour */}

    <div
      className={`absolute inset-0 transition-opacity duration-300 ${
        activeMenu === "Tour360"
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <Tour360Viewer />
    </div>

    {/* Amenities */}

    <div
      className={`absolute inset-0 transition-opacity duration-300 ${
        activeMenu === "Amenities"
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <AmenitiesViewer />
    </div>

    {/* Location */}

    <div
      className={`absolute inset-0 transition-opacity duration-300 ${
        activeMenu === "Location"
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <LocationViewer />
    </div>

    {/* Highlights */}

    <div
      className={`absolute inset-0 transition-opacity duration-300 ${
        activeMenu === "Highlights"
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <HighlightsViewer />
    </div>

    <SideMenu
      activeMenu={activeMenu}
      setActiveMenu={setActiveMenu}
    />

  </main>

);

}