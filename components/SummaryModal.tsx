"use client";

import { format, parseISO } from "date-fns";
import { X, Calendar } from "lucide-react";
import { Theme } from "@/types";

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: { date: string; text: string }[];
  theme: Theme;
}

export function SummaryModal({
  isOpen,
  onClose,
  notes,
  theme,
}: SummaryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[60] bg-white/95 backdrop-blur-md p-8 flex flex-col animate-in fade-in zoom-in duration-200">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2
            className="text-2xl font-black uppercase tracking-tighter"
            style={{ color: theme.primaryHex }}
          >
            Month Summary
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Overview of all scheduled events
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={24} className="text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
        {notes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-2">
            <Calendar size={48} strokeWidth={1} />
            <p className="text-sm font-medium">
              No notes found for this month.
            </p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.date}
              className="group border-l-2 pl-4 py-1 transition-colors"
              style={{ borderColor: theme.primaryHex }}
            >
              <div
                className="text-[10px] font-black uppercase tracking-widest mb-1"
                style={{ color: theme.primaryHex }}
              >
                {format(parseISO(note.date), "EEEE, do MMMM")}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed italic">
                "{note.text}"
              </p>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-slate-100">
        <p className="text-[9px] text-slate-400 uppercase text-center font-bold tracking-[0.2em]">
          End of Summary
        </p>
      </div>
    </div>
  );
}
