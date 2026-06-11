"use client";

import { useEffect, useState } from "react";

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile browser windows
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();

    // Check if the app is already running inside standalone fullscreen mode
    const isStandalone = 
      window.matchMedia("(display-mode: standalone)").matches || 
      window.navigator.standalone === true;

    if (isStandalone) return; // Exit if already pinned and running full screen

    const handleBeforeInstallPrompt = (e) => {
      // Prevent automatic browser chrome banner from showing
      e.preventDefault();
      // Cache the installation trigger event
      setDeferredPrompt(e);
      // Display our premium custom overlay after a brief initial immersion period
      setTimeout(() => {
        setIsVisible(true);
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Trigger native operational installer screen prompt
    deferredPrompt.prompt();
    
    // Wait for user choice evaluation feedback loop
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User successfully installed application shortcut to home screen.");
    }
    
    // Clean up cache states and close UI layout overlay safely
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  // Do not render anything on desktop displays or if the trigger event didn't fire
  if (!isMobile || !isVisible) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[1000] flex flex-col p-5 rounded-2xl border border-[#DEC494]/20 bg-[#0b1719]/95 backdrop-blur-2xl shadow-[0_24px_50px_rgba(0,0,0,0.8)] animate-fade-in-up">
      <div className="flex items-start gap-4 mb-4">
        {/* Dynamic App Asset Emblem Frame */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#DEC494]/10 border border-[#DEC494]/30 flex items-center justify-center text-[#DEC494] font-medium tracking-wider text-sm">
          TP
        </div>
        
        <div className="flex-col">
          <h3 className="text-white font-medium text-sm tracking-wide uppercase mb-0.5">
            Install Tree Park App
          </h3>
          <p className="text-white/60 text-xs font-light leading-relaxed">
            Add this experience to your home screen to unlock full-screen immersive navigation without browser address bars.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full">
        <button
          onClick={() => setIsVisible(false)}
          className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-xs font-medium tracking-widest uppercase transition-colors"
        >
          Later
        </button>
        <button
          onClick={handleInstallClick}
          className="flex-1 py-2.5 rounded-xl bg-[#DEC494] text-[#0b1719] font-semibold text-xs tracking-widest uppercase shadow-[0_4px_20px_rgba(222,196,148,0.3)] active:scale-95 transition-transform"
        >
          Install Now
        </button>
      </div>
    </div>
  );
}