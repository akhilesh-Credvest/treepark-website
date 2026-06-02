"use client";

import Image from 'next/image';

export default function LoadingScreen({
  progress = 0,
  onExplore,
  ready,
}) {
  // Clamp progress to a safe range (0-100)
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#0b1719] flex items-center justify-center font-sans antialiased selection:bg-[#DEC494]/20 select-none">

      {/* Ambient Background Lights */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#13292d_0%,#050b0c_100%)] animate-pulse duration-[6000ms]" />
      <div className="absolute w-[1000px] h-[1000px] rounded-full bg-[#DEC494]/5 blur-[180px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#1d3a40]/20 blur-[120px] pointer-events-none" />

      {/* Main Glassmorphic Container */}
      <div className="relative w-[92vw] max-w-[540px] px-6 md:px-12 py-16 rounded-[40px] border border-white/[0.08] bg-white/[0.01] backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col items-center transition-all duration-700 ease-out">
        
        {/* Decorative corner accents */}
        <div className="absolute top-6 left-6 w-3 h-3 border-t border-l border-[#DEC494]/20 rounded-tl" />
        <div className="absolute top-6 right-6 w-3 h-3 border-t border-r border-[#DEC494]/20 rounded-tr" />
        <div className="absolute bottom-6 left-6 w-3 h-3 border-b border-l border-[#DEC494]/20 rounded-bl" />
        <div className="absolute bottom-6 right-6 w-3 h-3 border-b border-r border-[#DEC494]/20 rounded-br" />

        {/* Logo Container */}
        <div className="relative mb-8 p-6 rounded-[24px] border border-[#DEC494]/20 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-transform duration-500">
          <Image
            src="/NTP_OS.png"
            alt="Logo"
            draggable={false}
            width={160}
            height={160}
            className="w-auto h-[120px] md:h-[160px] object-contain relative z-10"
            priority 
          />
        </div>

        {!ready ? (
          <div className="w-full flex flex-col items-center">
            {/* Status Indicator */}
            <div className="mb-8 text-[#DEC494]/80 text-[11px] font-medium tracking-[0.4em] uppercase text-center">
              PREPARING EXPERIENCE
            </div>

            {/* Premium Progress Bar */}
            <div className="relative w-full h-[6px] rounded-full bg-white/[0.07] overflow-hidden backdrop-blur-sm">
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_15px_rgba(222,196,148,0.6)]"
                style={{
                  width: `${safeProgress}%`,
                  background: "linear-gradient(90deg, #b89655 0%, #DEC494 50%, #f7e9ce 100%)",
                }}
              />
            </div>

            {/* Percentage Display */}
            <div className="mt-6 text-[#DEC494] text-4xl font-extralight tracking-tight tabular-nums">
              {Math.floor(safeProgress)}<span className="text-xl ml-0.5 opacity-60">%</span>
            </div>

            {/* Loading Action Text */}
            <div className="mt-3 text-white/30 text-[10px] font-light tracking-[0.3em] uppercase animate-pulse">
              LOADING PROJECT ASSETS
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* Welcome Heading */}
            <h1 className="text-[#DEC494] text-2xl md:text-3xl font-light tracking-[0.35em] uppercase text-center mb-8 leading-relaxed">
              WELCOME
            </h1>

            {/* Premium CTA Button */}
            <button
              onClick={onExplore}
              className="group relative overflow-hidden px-14 py-4 rounded-full border border-[#DEC494]/40 bg-[#DEC494]/5 text-[#DEC494] text-[12px] font-medium tracking-[0.3em] uppercase transition-all duration-500 ease-out hover:border-[#DEC494] hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(222,196,148,0.25)]"
            >
              <span className="absolute inset-0 translate-y-[101%] bg-[#DEC494] transition-transform duration-500 ease-out group-hover:translate-y-0" />
              <span className="relative z-10 block transition-colors duration-500 group-hover:text-[#0b1719]">
                ENTER EXPERIENCE
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Minimal Elegant Footer */}
      <div className="absolute bottom-8 flex flex-col items-center gap-2">
        <div className="h-[30px] w-[1px] bg-gradient-to-b from-white/0 to-white/10 mb-2" />
        <div className="text-white/20 text-[10px] font-light tracking-[0.5em] uppercase text-center cursor-default">
          Tree Park &bull; Neighbourhood Estates
        </div>
      </div>

    </div>
  );
}