"use client";

import { useState, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const monthKey = format(currentMonth, "yyyy-MM");
    const savedNotes = localStorage.getItem(`calendar-notes-${monthKey}`);
    setNotes(savedNotes || "");
  }, [currentMonth]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    const monthKey = format(currentMonth, "yyyy-MM");
    localStorage.setItem(`calendar-notes-${monthKey}`, newNotes);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const onDateClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (isBefore(day, startDate)) {
        setStartDate(day);
      } else {
        setEndDate(day);
      }
    }
  };

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
    <main className="min-h-screen bg-neutral-100 p-4 py-12 flex items-center justify-center font-sans">
      <div className="w-full max-w-3xl bg-white shadow-2xl overflow-hidden relative">
        <div className="relative w-full h-[350px] md:h-[450px] bg-slate-200">
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            HERO IMAGE GOES HERE
          </div>

          <div
            className="absolute bottom-0 w-full h-32 md:h-48 bg-[#1B95D4] flex items-end justify-between p-6 md:p-8"
            style={{
              clipPath: "polygon(0 50%, 45% 100%, 100% 20%, 100% 100%, 0 100%)",
            }}
          >
            <div className="flex gap-4 mt-auto opacity-0 md:opacity-100"></div>

            <div className="text-right text-white">
              <div className="text-xl md:text-2xl font-light tracking-wide flex items-center justify-end gap-2">
                <button
                  onClick={prevMonth}
                  className="hover:bg-white/20 p-1 rounded-full transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                {format(currentMonth, "yyyy")}
                <button
                  onClick={nextMonth}
                  className="hover:bg-white/20 p-1 rounded-full transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="text-3xl md:text-5xl font-bold tracking-widest uppercase mt-[-4px]">
                {format(currentMonth, "MMMM")}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row p-6 md:p-10 gap-10 md:gap-6">
          <div className="w-full md:w-1/3">
            <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-4">
              Notes
            </h3>
            <textarea
              value={notes}
              onChange={handleNotesChange}
              className="w-full h-48 md:h-64 resize-none bg-transparent outline-none text-sm text-slate-700 leading-[32px]"
              placeholder="Write your notes here..."
              style={{
                backgroundImage:
                  "repeating-linear-gradient(transparent, transparent 31px, #e2e8f0 31px, #e2e8f0 32px)",
                backgroundAttachment: "local",
              }}
            />
          </div>

          <div className="w-full md:w-2/3">
            <div className="grid grid-cols-7 text-center mb-6">
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                (dayName) => (
                  <div
                    key={dayName}
                    className="text-[10px] font-bold text-[#1B95D4] uppercase"
                  >
                    {dayName}
                  </div>
                ),
              )}
            </div>

            <div
              className="grid grid-cols-7 gap-y-2 text-center text-sm md:text-base font-semibold text-slate-700"
              onMouseLeave={() => setHoverDate(null)}
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
                  <div
                    key={date.toString()}
                    className={cn(
                      "h-10 md:h-12 flex items-center justify-center cursor-pointer transition-all relative",
                      !isCurrentMonth &&
                        "text-slate-300 font-normal hover:text-slate-500",
                      isCurrentMonth && "hover:bg-slate-100",
                      (isWithinSelection || isHovered) &&
                        "bg-[#1B95D4]/10 rounded-none",
                      isSelectedStart &&
                        "bg-[#1B95D4] text-white rounded-l-full rounded-r-none hover:bg-[#157bb0]",
                      isSelectedEnd &&
                        "bg-[#1B95D4] text-white rounded-r-full rounded-l-none hover:bg-[#157bb0]",
                      isSelectedStart && isSelectedEnd && "rounded-full",
                      isSelectedStart &&
                        !endDate &&
                        !hoverDate &&
                        "rounded-full",
                    )}
                    onClick={() => onDateClick(date)}
                    onMouseEnter={() => setHoverDate(date)}
                  >
                    <span className="z-10">{format(date, "d")}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
