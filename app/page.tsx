"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { format, addMonths, subMonths, isBefore, isSameDay } from "date-fns";
import { HeroHeader } from "@/components/HeroHeader";
import { NotesPanel } from "@/components/NotesPanel";
import { DateGrid } from "@/components/DateGrid";
import { SummaryModal } from "@/components/SummaryModal";
import { Theme } from "@/types";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [direction, setDirection] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");
  const [datesWithNotes, setDatesWithNotes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const [activeTheme, setActiveTheme] = useState<Theme>({
    id: "initial",
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000",
    primaryHex: "#1B95D4",
    bgLight: "rgba(27, 149, 212, 0.15)",
  });

  const refreshNoteIndicators = useCallback(() => {
    if (typeof window === "undefined") return;
    const keys = Object.keys(localStorage);
    const noteDates = keys
      .filter((key) => key.startsWith("note-"))
      .map((key) => key.replace("note-", ""));
    setDatesWithNotes(noteDates);
  }, []);

  const getMonthNotes = useMemo(() => {
    const monthPrefix = format(currentMonth, "yyyy-MM");
    return datesWithNotes
      .filter((dateStr) => dateStr.startsWith(monthPrefix))
      .map((dateStr) => ({
        date: dateStr,
        text: localStorage.getItem(`note-${dateStr}`) || "",
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [currentMonth, datesWithNotes]);

  useEffect(() => {
    refreshNoteIndicators();
  }, [refreshNoteIndicators]);

  useEffect(() => {
    if (startDate) {
      const saved = localStorage.getItem(
        `note-${format(startDate, "yyyy-MM-dd")}`,
      );
      setNotes(saved || "");
    } else {
      setNotes("");
    }
  }, [startDate]);

  const extractColors = useCallback((imgUrl: string) => {
    setIsLoading(true);
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return setIsLoading(false);
      canvas.width = 1;
      canvas.height = 1;
      ctx.drawImage(img, 0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      let fR = r,
        fG = g,
        fB = b,
        fHex =
          "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
      if (luminance > 0.7) {
        fR = 30;
        fG = 41;
        fB = 59;
        fHex = "#1e293b";
      }
      setActiveTheme({
        id: `t-${Date.now()}`,
        imageUrl: imgUrl,
        primaryHex: fHex,
        bgLight: `rgba(${fR}, ${fG}, ${fB}, 0.15)`,
      });
      setIsLoading(false);
    };
    img.onerror = () => setIsLoading(false);
  }, []);

  const randomizeTheme = useCallback(() => {
    const seed = Math.floor(Math.random() * 10000);
    extractColors(`https://picsum.photos/seed/${seed}/1000/600`);
  }, [extractColors]);

  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!startDate) return;
      const val = e.target.value;
      setNotes(val);
      const key = `note-${format(startDate, "yyyy-MM-dd")}`;
      if (val.trim()) localStorage.setItem(key, val);
      else localStorage.removeItem(key);
      refreshNoteIndicators();
    },
    [startDate, refreshNoteIndicators],
  );

  const onDateClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else {
      if (isBefore(day, startDate)) {
        setEndDate(startDate);
        setStartDate(day);
      } else if (isSameDay(day, startDate)) {
        setStartDate(null);
      } else {
        setEndDate(day);
      }
    }
  };

  return (
    <main className="min-h-screen bg-neutral-100 p-4 py-12 flex items-center justify-center font-sans">
      <div className="w-full max-w-3xl bg-white shadow-2xl overflow-hidden relative min-h-150">
        <SummaryModal
          isOpen={showSummary}
          onClose={() => setShowSummary(false)}
          notes={getMonthNotes}
          theme={activeTheme}
        />

        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <Loader2
              className="w-10 h-10 animate-spin"
              style={{ color: activeTheme.primaryHex }}
            />
          </div>
        )}

        <HeroHeader
          theme={activeTheme}
          currentMonth={currentMonth}
          onPrevMonth={() => {
            setDirection(-1);
            setCurrentMonth(subMonths(currentMonth, 1));
          }}
          onNextMonth={() => {
            setDirection(1);
            setCurrentMonth(addMonths(currentMonth, 1));
          }}
          onRandomize={randomizeTheme}
        />

        <div className="flex flex-col md:flex-row p-6 md:p-10 gap-10 md:gap-6">
          <NotesPanel
            notes={notes}
            onNotesChange={handleNotesChange}
            selectedDate={startDate}
            onToggleSummary={() => setShowSummary(true)}
            theme={activeTheme}
          />
          <DateGrid
            currentMonth={currentMonth}
            direction={direction}
            startDate={startDate}
            endDate={endDate}
            hoverDate={hoverDate}
            theme={activeTheme}
            onDateClick={onDateClick}
            setHoverDate={setHoverDate}
            datesWithNotes={datesWithNotes}
          />
        </div>
      </div>
    </main>
  );
}
