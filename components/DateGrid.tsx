"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  isToday,
} from "date-fns";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Theme } from "../types";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DateGridProps {
  currentMonth: Date;
  direction: number;
  startDate: Date | null;
  endDate: Date | null;
  hoverDate: Date | null;
  theme: Theme;
  onDateClick: (day: Date) => void;
  setHoverDate: (day: Date | null) => void;
}

export const DateGrid = React.memo(function DateGrid({
  currentMonth,
  direction,
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

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full md:w-2/3 flex flex-col">
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

      <div className="relative flex-1 min-h-[250px] overflow-hidden">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentMonth.toISOString()}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="grid grid-cols-7 gap-y-2 text-center text-sm md:text-base font-semibold text-slate-700 absolute w-full top-0"
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
              const isCurrentDay = isToday(date);

              return (
                <button
                  key={date.toString()}
                  type="button"
                  aria-label={format(date, "PPPP")}
                  aria-pressed={
                    !!(isSelectedStart || isSelectedEnd || isWithinSelection)
                  }
                  className={cn(
                    "h-10 md:h-12 flex items-center justify-center cursor-pointer transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    !isCurrentMonth &&
                      "text-slate-300 font-normal hover:text-slate-500",
                    isCurrentMonth && !isCurrentDay && "hover:bg-slate-100",
                    isCurrentDay &&
                      !isSelectedStart &&
                      !isSelectedEnd &&
                      !isWithinSelection &&
                      cn(
                        "border-2 font-bold",
                        theme.textClass,
                        "border-current rounded-full",
                      ),
                    (isWithinSelection || isHovered) &&
                      cn(theme.bgLightClass, "rounded-none border-transparent"),
                    isSelectedStart &&
                      cn(
                        theme.bgClass,
                        theme.hoverClass,
                        "text-white rounded-l-full rounded-r-none border-transparent",
                      ),
                    isSelectedEnd &&
                      cn(
                        theme.bgClass,
                        theme.hoverClass,
                        "text-white rounded-r-full rounded-l-none border-transparent",
                      ),
                    isSelectedStart && isSelectedEnd && "rounded-full",
                    isSelectedStart &&
                      !endDate &&
                      !hoverDate &&
                      "rounded-full focus-visible:ring-[#1B95D4]",
                  )}
                  onClick={() => onDateClick(date)}
                  onMouseEnter={() => setHoverDate(date)}
                  onFocus={() => setHoverDate(date)}
                >
                  <span className="z-10">{format(date, "d")}</span>
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
});
