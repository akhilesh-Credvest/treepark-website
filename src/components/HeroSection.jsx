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

      {activeMenu === "Home" && (
        <ImageSequenceViewer />
      )}

      {activeMenu === "DayNight" && (
        <DayNightViewer />
      )}

      {activeMenu === "Tour360" && (
        <Tour360Viewer />
      )}

      {activeMenu === "Amenities" && (
        <AmenitiesViewer />
      )}

      {activeMenu === "Location" && (
        <LocationViewer />
      )}

      {activeMenu === "Highlights" && (
        <HighlightsViewer />
      )}

      <SideMenu
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

    </main>

  );

}