"use client";

import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Theme } from "../types";

interface HeroHeaderProps {
  theme: Theme;
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onCycleTheme: () => void;
}

export function HeroHeader({
  theme,
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onCycleTheme,
}: HeroHeaderProps) {
  return (
    <div className="relative w-full h-[350px] md:h-[450px] bg-slate-200">
      <img
        src={theme.imageUrl}
        alt="Calendar Hero"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
      />

      <button
        onClick={onCycleTheme}
        className="absolute top-4 right-4 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all"
        title="Change Theme"
      >
        <ImageIcon size={20} />
      </button>

      <div
        className="absolute bottom-0 w-full h-40 md:h-56 flex items-end justify-between p-6 md:p-8 transition-colors duration-500"
        style={{
          backgroundColor: theme.primaryHex,
          clipPath: "polygon(0 60%, 35% 100%, 100% 10%, 100% 100%, 0 100%)",
        }}
      >
        <div className="flex gap-4 mt-auto opacity-0 md:opacity-100"></div>

        <div className="text-right text-white z-10 relative">
          <div className="text-xl md:text-2xl font-light tracking-wide flex items-center justify-end gap-1 mb-1">
            <button
              onClick={onPrevMonth}
              className="hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>
            <span className="min-w-[4rem] text-center">
              {format(currentMonth, "yyyy")}
            </span>
            <button
              onClick={onNextMonth}
              className="hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <div className="text-3xl md:text-4xl font-bold tracking-widest uppercase mt-[-4px]">
            {format(currentMonth, "MMMM")}
          </div>
        </div>
      </div>
    </div>
  );
}
