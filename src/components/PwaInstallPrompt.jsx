"use client";

import { useEffect, useState } from "react";

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);
  const [showIosPrompt, setShowIosPrompt] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();

    // Check if already running in fullscreen standalone mode
    const isStandalone = 
      window.matchMedia("(display-mode: standalone)").matches || 
      window.navigator.standalone === true;

    if (isStandalone) return;

    // 1. Android / Chrome automatic prompt listener
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => {
        setShowAndroidPrompt(true);
      }, 4000); // Shows up 4 seconds after entry
    };

    // 2. iOS Safari detection logic
    const isCurrentIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isSafari = /Safari/.test(navigator.userAgent) && !/CriOS/.test(navigator.userAgent);
    
    if (isCurrentIos && isSafari) {
      setTimeout(() => {
        setShowIosPrompt(true);
      }, 4000);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("App installed");
    }
    setDeferredPrompt(null);
    setShowAndroidPrompt(false);
  };

  if (!isMobile) return null;

  // Render Layout for Android / Chrome Devices
  if (showAndroidPrompt) {
    return (
      <div className="fixed bottom-24 left-4 right-4 z-[1000] flex flex-col p-5 rounded-2xl border border-[#DEC494]/20 bg-[#0b1719]/95 backdrop-blur-2xl shadow-[0_24px_50px_rgba(0,0,0,0.8)] animate-fade-in-up">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#DEC494]/10 border border-[#DEC494]/30 flex items-center justify-center text-[#DEC494] font-medium text-sm">
            TP
          </div>
          <div>
            <h3 className="text-white font-medium text-sm tracking-wide uppercase mb-0.5">
              Install Tree Park App
            </h3>
            <p className="text-white/60 text-xs font-light leading-relaxed">
              Add to home screen to unlock seamless, edge-to-edge fullscreen viewing.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full">
          <button onClick={() => setShowAndroidPrompt(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 text-xs font-medium uppercase tracking-widest">
            Later
          </button>
          <button onClick={handleAndroidInstall} className="flex-1 py-2.5 rounded-xl bg-[#DEC494] text-[#0b1719] font-semibold text-xs uppercase tracking-widest shadow-[0_4px_20px_rgba(222,196,148,0.3)]">
            Install Now
          </button>
        </div>
      </div>
    );
  }

  // Render Layout for iOS Safari Devices (Instructions manual override)
  if (showIosPrompt) {
    return (
      <div className="fixed bottom-24 left-4 right-4 z-[1000] flex flex-col p-5 rounded-2xl border border-[#DEC494]/20 bg-[#0b1719]/95 backdrop-blur-2xl shadow-[0_24px_50px_rgba(0,0,0,0.8)]">
        <div className="flex items-start gap-4 mb-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#DEC494]/10 border border-[#DEC494]/30 flex items-center justify-center text-[#DEC494] font-medium text-sm">
            TP
          </div>
          <div>
            <h3 className="text-white font-medium text-sm tracking-wide uppercase mb-0.5">
              Run in Fullscreen Mode
            </h3>
            <p className="text-white/60 text-xs font-light leading-relaxed">
              To experience this tour without browser bars, follow these steps:
            </p>
          </div>
        </div>
        
        {/* Step Instructions */}
        <div className="bg-white/5 rounded-xl p-3 mb-4 space-y-2 text-xs font-light text-white/80">
          <div className="flex items-center gap-2">
            <span className="text-[#DEC494] font-mono font-medium">1.</span> Tap the browser's <span className="font-medium text-white">"Share"</span> icon at the bottom.
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#DEC494] font-mono font-medium">2.</span> Scroll down and select <span className="font-medium text-white">"Add to Home Screen"</span>.
          </div>
        </div>

        <button onClick={() => setShowIosPrompt(false)} className="w-full py-2.5 rounded-xl bg-white/10 text-white text-xs font-medium uppercase tracking-widest text-center">
          Got It
        </button>
      </div>
    );
  }

  return null;
}