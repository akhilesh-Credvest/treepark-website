"use client";

export default function Logo() {
  return (
    <div className="absolute top-3 left-3 lg:top-8 lg:left-8 z-[999]">
      <img
        src="/NH- logo (1).png"
        alt="Logo"
        className="h-[28px] lg:h-[80px] w-auto object-contain"
        draggable={false}
      />
    </div>
  );
}