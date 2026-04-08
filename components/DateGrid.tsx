"use client";

import React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  isWithinInterval,
  isBefore,
  isAfter,
} from "date-fns";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Theme } from "../types";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DateGridProps {
  currentMonth: Date;
  startDate: Date | null;
  endDate: Date | null;
  hoverDate: Date | null;
  theme: Theme;
  onDateClick: (day: Date) => void;
  setHoverDate: (day: Date | null) => void;
}

export const DateGrid = React.memo(function DateGrid({
  currentMonth,
  startDate,
  endDate,
  hoverDate,
  theme,
  onDateClick,
  setHoverDate,
}: DateGridProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    calendarDays.push(day);
    day = addDays(day, 1);
  }

  return (
    <div className="w-full md:w-2/3">
      <div className="grid grid-cols-7 text-center mb-6" aria-hidden="true">
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((dayName) => (
          <div
            key={dayName}
            className={cn(
              "text-[10px] font-bold uppercase transition-colors duration-500",
              theme.textClass,
            )}
          >
            {dayName}
          </div>
        ))}
      </div>

      <div
        className="grid grid-cols-7 gap-y-2 text-center text-sm md:text-base font-semibold text-slate-700"
        onMouseLeave={() => setHoverDate(null)}
        role="grid"
        aria-label="Calendar dates"
      >
        {calendarDays.map((date) => {
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isSelectedStart = startDate && isSameDay(date, startDate);
          const isSelectedEnd = endDate && isSameDay(date, endDate);
          const isWithinSelection =
            startDate &&
            endDate &&
            isWithinInterval(date, { start: startDate, end: endDate });
          const isHovered =
            startDate &&
            !endDate &&
            hoverDate &&
            ((isAfter(date, startDate) && isBefore(date, hoverDate)) ||
              (isBefore(date, startDate) && isAfter(date, hoverDate)) ||
              isSameDay(date, hoverDate));

          return (
            <button
              key={date.toString()}
              type="button"
              aria-label={format(date, "PPPP")}
              aria-pressed={
                !!(isSelectedStart || isSelectedEnd || isWithinSelection)
              }
              className={cn(
                "h-10 md:h-12 flex items-center justify-center cursor-pointer transition-all relative focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                !isCurrentMonth &&
                  "text-slate-300 font-normal hover:text-slate-500",
                isCurrentMonth &&
                  "hover:bg-slate-100 focus-visible:ring-[#1B95D4]",
                (isWithinSelection || isHovered) &&
                  cn(theme.bgLightClass, "rounded-none"),
                isSelectedStart &&
                  cn(
                    theme.bgClass,
                    theme.hoverClass,
                    "text-white rounded-l-full rounded-r-none",
                  ),
                isSelectedEnd &&
                  cn(
                    theme.bgClass,
                    theme.hoverClass,
                    "text-white rounded-r-full rounded-l-none",
                  ),
                isSelectedStart && isSelectedEnd && "rounded-full",
                isSelectedStart && !endDate && !hoverDate && "rounded-full",
              )}
              onClick={() => onDateClick(date)}
              onMouseEnter={() => setHoverDate(date)}
              onFocus={() => setHoverDate(date)}
            >
              <span className="z-10">{format(date, "d")}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
