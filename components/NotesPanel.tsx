"use client";

import React from "react";
import { format } from "date-fns";
import { ListRestart } from "lucide-react";
import { Theme } from "@/types";

interface NotesPanelProps {
  notes: string;
  onNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  selectedDate: Date | null;
  onToggleSummary: () => void;
  theme: Theme;
}

export function NotesPanel({
  notes,
  onNotesChange,
  selectedDate,
  onToggleSummary,
  theme,
}: NotesPanelProps) {
  return (
    <div className="w-full md:w-1/3 flex flex-col gap-4 border-r border-slate-100 pr-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {selectedDate ? format(selectedDate, "do MMM yyyy") : "Notes"}
          </h3>
          <button
            onClick={onToggleSummary}
            className="p-1.5 hover:bg-slate-100 rounded-md transition-all group"
            title="Month Summary"
          >
            <ListRestart
              size={14}
              className="transition-colors"
              style={{ color: theme.primaryHex }}
            />
          </button>
        </div>

        {!selectedDate && (
          <p className="text-[10px] text-slate-300 italic uppercase">
            Select a date to manage notes
          </p>
        )}
      </div>

      <textarea
        value={notes}
        onChange={onNotesChange}
        disabled={!selectedDate}
        placeholder={
          selectedDate
            ? "What's happening?"
            : "Click a date to start writing..."
        }
        className="flex-1 w-full bg-transparent text-sm text-slate-600 resize-none focus:outline-none disabled:cursor-not-allowed leading-relaxed"
        style={{
          backgroundImage: `linear-gradient(transparent, transparent 27px, ${theme.bgLight} 27px)`,
          backgroundSize: "100% 28px",
        }}
      />
    </div>
  );
}
