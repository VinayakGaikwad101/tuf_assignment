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
  isWeekend,
} from "date-fns";
import { Theme } from "../types";

const HOLIDAYS = [
  "2026-01-01",
  "2026-01-26",
  "2026-08-15",
  "2026-10-02",
  "2026-12-25",
];

interface DateGridProps {
  currentMonth: Date;
  direction: number;
  startDate: Date | null;
  endDate: Date | null;
  hoverDate: Date | null;
  theme: Theme;
  datesWithNotes: string[];
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
  datesWithNotes,
  onDateClick,
  setHoverDate,
}: DateGridProps) {
  const calendarDays = [];
  let day = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
  while (day <= end) {
    calendarDays.push(day);
    day = addDays(day, 1);
  }

  return (
    <div className="w-full md:w-2/3 flex flex-col">
      <div className="grid grid-cols-7 text-center mb-6">
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
          <div
            key={d}
            className="text-[10px] font-bold uppercase"
            style={{ color: theme.primaryHex }}
          >
            {d}
          </div>
        ))}
      </div>

      <div
        className="relative flex-1 min-h-62.5"
        style={{ perspective: "1200px" }}
      >
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentMonth.toISOString()}
            className="grid grid-cols-7 gap-y-2 text-center text-sm font-semibold absolute w-full top-0"
            onMouseLeave={() => setHoverDate(null)}
          >
            {calendarDays.map((date) => {
              const dateStr = format(date, "yyyy-MM-dd");
              const isCurrMonth = isSameMonth(date, currentMonth);
              const isHoliday = HOLIDAYS.includes(dateStr);
              const isSelStart = startDate && isSameDay(date, startDate);
              const isSelEnd = endDate && isSameDay(date, endDate);
              const hasNote = datesWithNotes.includes(dateStr);

              const isBetween =
                startDate &&
                endDate &&
                isWithinInterval(date, {
                  start: startDate,
                  end: endDate,
                });

              const isHover =
                startDate &&
                !endDate &&
                hoverDate &&
                isWithinInterval(date, {
                  start: isBefore(startDate, hoverDate) ? startDate : hoverDate,
                  end: isBefore(startDate, hoverDate) ? hoverDate : startDate,
                });

              return (
                <motion.button
                  key={date.toString()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDateClick(date)}
                  onMouseEnter={() => setHoverDate(date)}
                  className={`h-10 md:h-12 flex items-center justify-center relative transition-all rounded-md outline-none
                    ${!isCurrMonth ? "text-slate-300" : ""}
                    ${isSelStart || isSelEnd ? "text-white!" : ""}
                    ${isHoliday && isCurrMonth ? "underline underline-offset-4 font-bold" : ""}
                  `}
                  style={{
                    backgroundColor:
                      isSelStart || isSelEnd
                        ? theme.primaryHex
                        : isBetween || isHover
                          ? theme.bgLight
                          : "transparent",
                    color:
                      isSelStart || isSelEnd
                        ? "#fff"
                        : (isHoliday || isWeekend(date)) && isCurrMonth
                          ? theme.primaryHex
                          : isCurrMonth
                            ? "#334155"
                            : "#cbd5e1",
                    borderRadius: isSelStart
                      ? "999px 0 0 999px"
                      : isSelEnd
                        ? "0 999px 999px 0"
                        : isBetween || isHover
                          ? "0px"
                          : "4px",
                  }}
                >
                  <div className="flex flex-col items-center justify-center relative w-full h-full">
                    <span>{format(date, "d")}</span>
                    {hasNote && (
                      <div
                        className="w-1.5 h-1.5 rounded-full absolute bottom-1 left-1/2 -translate-x-1/2"
                        style={{
                          backgroundColor:
                            isSelStart || isSelEnd ? "#fff" : theme.primaryHex,
                        }}
                      />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
});
