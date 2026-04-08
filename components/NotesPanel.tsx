"use client";

import React from "react";
import { format } from "date-fns";

interface NotesPanelProps {
  notes: string;
  onNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  selectedDate: Date | null; // Added this to match the parent's pass-down
}

export function NotesPanel({
  notes,
  onNotesChange,
  selectedDate,
}: NotesPanelProps) {
  return (
    <div className="w-full md:w-1/3 flex flex-col gap-4 border-r border-slate-100 pr-4">
      <div className="flex flex-col">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {selectedDate ? format(selectedDate, "do MMMM yyyy") : "Notes"}
        </h3>
        {!selectedDate && (
          <p className="text-[10px] text-slate-300 italic mt-1 uppercase">
            Select a date to manage notes
          </p>
        )}
      </div>

      <textarea
        value={notes}
        onChange={onNotesChange}
        disabled={!selectedDate}
        placeholder={
          selectedDate ? "Plan your day..." : "Click a date to start writing..."
        }
        className="flex-1 w-full bg-transparent text-sm text-slate-600 resize-none focus:outline-none disabled:cursor-not-allowed leading-relaxed"
        style={{
          backgroundImage:
            "linear-gradient(transparent, transparent 27px, #f1f5f9 27px)",
          backgroundSize: "100% 28px",
        }}
      />
    </div>
  );
}
