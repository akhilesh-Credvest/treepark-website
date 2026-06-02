"use client";

export default function LoadingScreen({
  progress,
}) {

  return (

    <div className="fixed inset-0 z-[9999] bg-[#102125] flex flex-col items-center justify-center">

      <img
        src="/NH- logo (1).png"
        alt="Logo"
        className="h-[85px] w-auto object-contain"
        draggable={false}
      />

      <div className="w-[400px] h-[8px] rounded-full bg-white/10 overflow-hidden">

        <div
          className="h-full bg-[#DEC494] transition-all duration-300"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      <div className="mt-5 text-[#DEC494] tracking-[4px] text-sm">

        LOADING PROJECT ASSETS

      </div>

      <div className="mt-2 text-[#DEC494]/70">

        {Math.floor(progress)}%

      </div>

    </div>

  );

}