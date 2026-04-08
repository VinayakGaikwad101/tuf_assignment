"use client";

import { useState, useEffect, useCallback } from "react";
import { format, addMonths, subMonths, isBefore } from "date-fns";
import { HeroHeader } from "@/components/HeroHeader";
import { NotesPanel } from "@/components/NotesPanel";
import { DateGrid } from "@/components/DateGrid";
import { Theme } from "@/types";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [direction, setDirection] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [activeTheme, setActiveTheme] = useState<Theme>({
    id: "initial",
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000",
    primaryHex: "#1B95D4",
    bgLight: "rgba(27, 149, 212, 0.15)",
  });

  const extractColors = useCallback((imgUrl: string) => {
    setIsLoading(true);
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setIsLoading(false);
        return;
      }

      canvas.width = 1;
      canvas.height = 1;
      ctx.drawImage(img, 0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

      // Calculate relative luminance (W3C standard)
      // If result > 0.7, the color is very light (white/greyish)
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      let finalR = r,
        finalG = g,
        finalB = b;
      let finalHex =
        "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");

      if (luminance > 0.7) {
        // Force to a dark theme color if the image is too bright
        finalR = 30;
        finalG = 41;
        finalB = 59; // Slate-800
        finalHex = "#1e293b";
      }

      setActiveTheme({
        id: `theme-${Date.now()}`,
        imageUrl: imgUrl,
        primaryHex: finalHex,
        bgLight: `rgba(${finalR}, ${finalG}, ${finalB}, 0.15)`,
      });
      setIsLoading(false);
    };

    img.onerror = () => {
      console.error("Failed to load image");
      setIsLoading(false);
    };
  }, []);

  const randomizeTheme = useCallback(() => {
    const seed = Math.floor(Math.random() * 10000);
    const newUrl = `https://picsum.photos/seed/${seed}/1000/600`;
    extractColors(newUrl);
  }, [extractColors]);

  useEffect(() => {
    const monthKey = format(currentMonth, "yyyy-MM");
    const savedNotes = localStorage.getItem(`calendar-notes-${monthKey}`);
    setNotes(savedNotes || "");
  }, [currentMonth]);

  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newNotes = e.target.value;
      setNotes(newNotes);
      localStorage.setItem(
        `calendar-notes-${format(currentMonth, "yyyy-MM")}`,
        newNotes,
      );
    },
    [currentMonth],
  );

  const nextMonth = () => {
    setDirection(1);
    setCurrentMonth((prev) => addMonths(prev, 1));
  };
  const prevMonth = () => {
    setDirection(-1);
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const onDateClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (isBefore(day, startDate)) setStartDate(day);
      else setEndDate(day);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-100 p-4 py-12 flex items-center justify-center font-sans">
      <div className="w-full max-w-3xl bg-white shadow-2xl overflow-hidden relative min-h-[600px]">
        {/* Loader Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm transition-opacity">
            <div className="flex flex-col items-center gap-2">
              <Loader2
                className="w-10 h-10 animate-spin"
                style={{ color: activeTheme.primaryHex }}
              />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Extracting Vibe...
              </span>
            </div>
          </div>
        )}

        <HeroHeader
          theme={activeTheme}
          currentMonth={currentMonth}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onRandomize={randomizeTheme}
        />
        <div className="flex flex-col md:flex-row p-6 md:p-10 gap-10 md:gap-6">
          <NotesPanel notes={notes} onNotesChange={handleNotesChange} />
          <DateGrid
            currentMonth={currentMonth}
            direction={direction}
            startDate={startDate}
            endDate={endDate}
            hoverDate={hoverDate}
            theme={activeTheme}
            onDateClick={onDateClick}
            setHoverDate={setHoverDate}
          />
        </div>
      </div>
    </main>
  );
}
