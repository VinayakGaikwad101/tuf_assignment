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
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const THEMES = [
  {
    id: "glacier",
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000",
    primaryHex: "#1B95D4",
    textClass: "text-[#1B95D4]",
    bgLightClass: "bg-[#1B95D4]/10",
    bgClass: "bg-[#1B95D4]",
    hoverClass: "hover:bg-[#157bb0]",
  },
  {
    id: "forest",
    imageUrl:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1000",
    primaryHex: "#2E8B57",
    textClass: "text-[#2E8B57]",
    bgLightClass: "bg-[#2E8B57]/10",
    bgClass: "bg-[#2E8B57]",
    hoverClass: "hover:bg-[#236e44]",
  },
  {
    id: "canyon",
    imageUrl:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1000",
    primaryHex: "#D35400",
    textClass: "text-[#D35400]",
    bgLightClass: "bg-[#D35400]/10",
    bgClass: "bg-[#D35400]",
    hoverClass: "hover:bg-[#a84300]",
  },
];

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");
  const [activeThemeIndex, setActiveThemeIndex] = useState(0);

  const theme = THEMES[activeThemeIndex];

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

  const cycleTheme = () => {
    setActiveThemeIndex((prev) => (prev + 1) % THEMES.length);
  };

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
      <div className="w-full max-w-3xl bg-white shadow-2xl overflow-hidden relative transition-colors duration-500">
        <div className="relative w-full h-[350px] md:h-[450px] bg-slate-200">
          <img
            src={theme.imageUrl}
            alt="Calendar Hero"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          />

          <button
            onClick={cycleTheme}
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
                  onClick={prevMonth}
                  className="hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
                >
                  <ChevronLeft size={24} />
                </button>
                <span className="min-w-[4rem] text-center">
                  {format(currentMonth, "yyyy")}
                </span>
                <button
                  onClick={nextMonth}
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
                    className={cn(
                      "text-[10px] font-bold uppercase transition-colors duration-500",
                      theme.textClass,
                    )}
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
