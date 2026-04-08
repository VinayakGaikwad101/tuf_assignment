"use client";

import { useState, useEffect } from "react";
import { format, addMonths, subMonths, isBefore } from "date-fns";
import { HeroHeader } from "@/components/HeroHeader";
import { NotesPanel } from "@/components/NotesPanel";
import { DateGrid } from "@/components/DateGrid";
import { Theme } from "@/types";

const THEMES: Theme[] = [
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
  const cycleTheme = () =>
    setActiveThemeIndex((prev) => (prev + 1) % THEMES.length);

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

  return (
    <main className="min-h-screen bg-neutral-100 p-4 py-12 flex items-center justify-center font-sans">
      <div className="w-full max-w-3xl bg-white shadow-2xl overflow-hidden relative transition-colors duration-500">
        <HeroHeader
          theme={theme}
          currentMonth={currentMonth}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onCycleTheme={cycleTheme}
        />

        <div className="flex flex-col md:flex-row p-6 md:p-10 gap-10 md:gap-6">
          <NotesPanel notes={notes} onNotesChange={handleNotesChange} />

          <DateGrid
            currentMonth={currentMonth}
            startDate={startDate}
            endDate={endDate}
            hoverDate={hoverDate}
            theme={theme}
            onDateClick={onDateClick}
            setHoverDate={setHoverDate}
          />
        </div>
      </div>
    </main>
  );
}
