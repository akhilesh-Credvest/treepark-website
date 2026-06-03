"use client";

export default function Logo() {
  return (
    <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-[999]">
      <img
        src="/NH- logo (1).png"
        alt="Logo"
        className="h-[50px] sm:h-[70px] md:h-[85px] w-auto object-contain"
        draggable={false}
      />
    </div>
  );
}