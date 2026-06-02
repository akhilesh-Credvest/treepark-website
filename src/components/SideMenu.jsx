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

  // Sync index highlights if components modify menus externally
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
            className="absolute bottom-6 left-8 z-[70] w-10 h-10 rounded-xl flex items-center justify-center bg-[#1a3438]/90 backdrop-blur-2xl border border-[#DEC494]/25 text-[#DEC494] hover:bg-[#DEC494]/20 hover:border-[#DEC494]/50 transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
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
          className="absolute bottom-6 left-24 z-[70] w-10 h-10 rounded-xl flex items-center justify-center bg-[#1a3438]/90 backdrop-blur-2xl border border-[#DEC494]/25 text-[#DEC494] hover:bg-[#DEC494]/20 transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          aria-label="Show menu"
        >
          <Menu size={18} />
        </button>
      )}

      {/* Side Menu Layout Container Panel */}
      {menuVisible && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-[70] select-none">
          <div
            className="flex flex-col gap-1.5 p-2.5 rounded-[20px] backdrop-blur-2xl border border-[#DEC494]/18 shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-all duration-300"
            style={{ background: "rgba(26,52,56,0.75)" }}
          >
            {/* Conditional Sub-Menu Controller Display Row */}
            {iframeUrl && (
              <div className="flex justify-center mb-1">
                <button
                  onClick={() => setMenuVisible(false)}
                  className="w-8 h-6 rounded-lg flex items-center justify-center text-[#DEC494]/40 hover:text-[#DEC494] hover:bg-[#DEC494]/10 transition-all duration-200"
                  aria-label="Hide menu"
                  title="Hide menu"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = active === index && ((item.url && iframeUrl) || (!item.url && !iframeUrl));

              return (
                <div key={index}>
                  <div className="relative group flex items-center">

                    {/* Active Navigation Pip */}
                    <div
                      className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-1 rounded-full bg-[#DEC494] transition-all duration-300"
                      style={{ height: isActive ? "28px" : "0px", opacity: isActive ? 1 : 0 }}
                    />

                    {/* Tooltip Label Overlay */}
                    <div className="absolute right-[calc(100%+18px)] top-1/2 -translate-y-1/2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none z-50">
                      <div className="px-4 py-2 rounded-xl bg-[#1a3438]/92 backdrop-blur-2xl border border-[#DEC494]/20 text-[#DEC494] text-xs tracking-[0.14em] whitespace-nowrap shadow-xl">
                        {item.title}
                      </div>
                    </div>

                    {/* Navigation Click Button Item */}
                    <button
                      onClick={() => {
                        setActive(index);
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
                      className={`w-[52px] h-[52px] rounded-[13px] border flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                        isActive
                          ? "bg-[#DEC494]/12 border-[#DEC494]/30 text-[#DEC494]"
                          : "bg-transparent border-transparent text-[#DEC494]/45 hover:bg-[#DEC494]/8 hover:border-[#DEC494]/18 hover:text-[#DEC494]/80"
                      }`}
                    >
                      <Icon size={20} strokeWidth={1.6} />
                    </button>
                  </div>

                  {dividersAfter.has(index) && (
                    <div className="h-px mx-2 my-2 bg-[#DEC494]/15" />
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