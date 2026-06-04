"use client";

import { useState, useEffect } from "react";
import {
  Home, SunMedium, Globe, Star,
  MapPin, Grid2X2, LayoutPanelTop, X, Menu
} from "lucide-react";

const menuItems = [
  { title: "Home",         icon: Home,           key: "Home" },
  { title: "Day / Night",  icon: SunMedium,      key: "DayNight" },
  { title: "360 Tour",     icon: Globe,          key: "Tour360" },
  { title: "Highlights",   icon: Star,           key: "Highlights" },
  { title: "Location",     icon: MapPin,         key: "Location" },
  { title: "Amenities",    icon: Grid2X2,        key: "Amenities" },
  { title: "Interior",     icon: LayoutPanelTop, key: "Interior", url: "https://visualisation.propall.tech/neighbourhood-haven-ne/" },
];

const dividersAfter = new Set([2, 5]);

export default function SideMenu({ activeMenu, setActiveMenu }) {
  const [active, setActive] = useState(0);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [menuVisible, setMenuVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Controls responsive mobile sliding tray

  useEffect(() => {
    const idx = menuItems.findIndex(item => item.key === activeMenu);
    if (idx !== -1 && !iframeUrl) {
      setActive(idx);
    }
  }, [activeMenu, iframeUrl]);

  const closeIframe = () => {
    setIframeUrl(null);
    setMenuVisible(true);
    setActive(0);
    setActiveMenu("Home");
  };

  return (
    <>
      {/* Fullscreen iframe Container with Lifecycle Control */}
      {iframeUrl && (
        <div className="fixed inset-0 z-[60] bg-black">
          <iframe
            src={iframeUrl}
            className="w-full h-full border-0 bg-black"
            allow="fullscreen; xr-spatial-tracking"
          />

          {/* Close Action Trigger */}
          <button
            onClick={closeIframe}
            className="absolute bottom-6 left-6 sm:left-8 z-[70] w-10 h-10 rounded-xl flex items-center justify-center bg-[#1a3438]/90 backdrop-blur-2xl border border-[#DEC494]/25 text-[#DEC494] hover:bg-[#DEC494]/20 hover:border-[#DEC494]/50 transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
            aria-label="Close Interior view"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>
      )}

      {/* Embedded Iframe Menu Layout Switcher */}
      {iframeUrl && !menuVisible && (
        <button
          onClick={() => setMenuVisible(true)}
          className="absolute bottom-6 left-20 sm:left-24 z-[70] w-10 h-10 rounded-xl flex items-center justify-center bg-[#1a3438]/90 backdrop-blur-2xl border border-[#DEC494]/25 text-[#DEC494] hover:bg-[#DEC494]/20 transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          aria-label="Show menu"
        >
          <Menu size={18} />
        </button>
      )}

      {/* Top Right Mobile Floating Navigation Bar - Toggle Control Panel */}
      {menuVisible && !iframeUrl && (
        <div className="absolute top-4 right-2 sm:top-2 sm:right-2 z-[80] lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`w-8 h-8 rounded-xl flex items-center justify-center bg-[#1a3438]/90 backdrop-blur-2xl border transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)] ${
              mobileMenuOpen 
                ? "border-[#DEC494]/50 text-[#DEC494] scale-95" 
                : "border-[#DEC494]/20 text-[#DEC494]/80"
            }`}
            aria-label="Toggle menu Navigation"
          >
            {mobileMenuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
          </button>
        </div>
      )}

      {/* Side Menu Layout Container Panel - Fully Responsive Desktop vs Mobile */}
      {menuVisible && (
        <div 
          className={`absolute left-1/2 -translate-x-1/2 lg:bottom-auto lg:left-auto lg:right-8 lg:top-1/2 lg:-translate-y-1/2 z-[70] select-none w-[92vw] max-w-[480px] lg:w-auto transition-all duration-500 ease-out ${
            mobileMenuOpen 
              ? "bottom-4 opacity-100 pointer-events-auto" 
              : "bottom-0 opacity-0 pointer-events-none lg:bottom-auto lg:opacity-100 lg:pointer-events-auto"
          }`}
        >
          <div className="flex flex-row lg:flex-col justify-around lg:justify-start gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl bg-[#1a3438]/95 lg:bg-[#1a3438]/80 backdrop-blur-2xl border border-[#DEC494]/20 lg:border-[#DEC494]/15 shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-x-auto no-scrollbar">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = active === index;

              return (
                <div key={item.title} className="flex flex-row lg:flex-col items-center flex-shrink-0">
                  <div className="relative group flex items-center justify-center">
                    {/* Hover Title Tooltip - Adjusted position for mobile layout */}
                    <div className="absolute bottom-14 lg:bottom-auto lg:right-16 opacity-0 scale-95 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 whitespace-nowrap z-50 hidden sm:block">
                      <div className="px-3 py-1.5 rounded-lg text-[10px] font-medium tracking-widest bg-[#0b1719]/95 text-[#DEC494] border border-[#DEC494]/30 shadow-xl uppercase">
                        {item.title}
                      </div>
                    </div>

                    {/* Navigation Item Trigger */}
                    <button
                      onClick={() => {
                        setActive(index);
                        setMobileMenuOpen(false); // Close sliding tray automatically after a selection
                        if (item.url) {
                          setIframeUrl(item.url);
                          setMenuVisible(false);
                        } else {
                          setIframeUrl(null);
                          setMenuVisible(true);
                          if (item.key) setActiveMenu(item.key);
                        }
                      }}
                      aria-label={item.title}
                      className={`w-11 h-11 sm:w-12 sm:h-12 lg:w-[52px] lg:h-[52px] rounded-xl lg:rounded-[13px] border flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                        isActive
                          ? "bg-[#DEC494]/12 border-[#DEC494]/30 text-[#DEC494]"
                          : "bg-transparent border-transparent text-[#DEC494]/45 hover:bg-[#DEC494]/8 hover:border-[#DEC494]/18 hover:text-[#DEC494]/80"
                      }`}
                    >
                      <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] lg:w-5 lg:h-5" strokeWidth={1.6} />
                    </button>
                  </div>

                  {dividersAfter.has(index) && (
                    <div className="hidden lg:block h-px w-8 mx-2 my-2 bg-[#DEC494]/15" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}