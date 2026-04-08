"use client";

import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Shuffle } from "lucide-react";
import { Theme } from "../types";

interface HeroHeaderProps {
  theme: Theme;
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onRandomize: () => void;
}

export function HeroHeader({
  theme,
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onRandomize,
}: HeroHeaderProps) {
  return (
    <div className="relative w-full h-[350px] md:h-[450px] bg-slate-100">
      <img
        key={theme.imageUrl}
        src={theme.imageUrl}
        alt="Calendar Hero"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
      />

      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={onRandomize}
          className="bg-black/30 hover:bg-black/50 text-white p-2.5 rounded-full backdrop-blur-md transition-all active:scale-95 group"
          title="Randomize Theme"
        >
          <Shuffle
            size={20}
            className="group-hover:rotate-180 transition-transform duration-500"
          />
        </button>
      </div>

      <div
        className="absolute bottom-0 w-full h-40 md:h-56 flex items-end justify-between p-6 md:p-8 transition-all duration-500 shadow-[inset_0_-120px_60px_-60px_rgba(0,0,0,0.3)]"
        style={{
          backgroundColor: theme.primaryHex,
          clipPath: "polygon(0 60%, 35% 100%, 100% 10%, 100% 100%, 0 100%)",
        }}
      >
        <div className="text-right text-white z-10 relative ml-auto">
          <div className="text-xl md:text-2xl font-light tracking-wide flex items-center justify-end gap-2 mb-1">
            <button
              onClick={onPrevMonth}
              className="hover:bg-white/20 p-1 rounded-full transition-colors"
            >
              <ChevronLeft size={28} />
            </button>
            <span className="min-w-[4rem] text-center font-medium">
              {format(currentMonth, "yyyy")}
            </span>
            <button
              onClick={onNextMonth}
              className="hover:bg-white/20 p-1 rounded-full transition-colors"
            >
              <ChevronRight size={28} />
            </button>
          </div>
          <div className="text-4xl md:text-5xl font-black uppercase leading-none drop-shadow-md">
            {format(currentMonth, "MMMM")}
          </div>
        </div>
      </div>
    </div>
  );
}
