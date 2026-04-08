"use client";

interface NotesPanelProps {
  notes: string;
  onNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function NotesPanel({ notes, onNotesChange }: NotesPanelProps) {
  return (
    <div className="w-full md:w-1/3">
      <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-4">
        Notes
      </h3>
      <textarea
        value={notes}
        onChange={onNotesChange}
        className="w-full h-48 md:h-64 resize-none bg-transparent outline-none text-sm text-slate-700 leading-[32px]"
        placeholder="Write your notes here..."
        style={{
          backgroundImage:
            "repeating-linear-gradient(transparent, transparent 31px, #e2e8f0 31px, #e2e8f0 32px)",
          backgroundAttachment: "local",
        }}
      />
    </div>
  );
}
