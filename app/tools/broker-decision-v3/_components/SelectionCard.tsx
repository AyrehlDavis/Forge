"use client";

interface SelectionCardProps {
  label: string;
  descriptor?: string;
  selected: boolean;
  onSelect: () => void;
  ariaLabel?: string;
}

export function SelectionCard({
  label,
  descriptor,
  selected,
  onSelect,
  ariaLabel,
}: SelectionCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={ariaLabel ?? label}
      data-state={selected ? "checked" : undefined}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onSelect();
        }
      }}
      className="group relative rounded-[14px] border border-white/60 bg-white/65 px-5 py-4 text-left shadow-[0_4px_16px_-8px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-md transition-all duration-200 hover:border-[#007fe8] hover:bg-white/80 hover:shadow-[0_8px_24px_-8px_rgba(0,107,197,0.18),inset_0_1px_0_rgba(255,255,255,0.85)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-2 active:border-[#007fe8] active:bg-[#EBF3FD]/70 active:shadow-[0_2px_6px_-4px_rgba(0,107,197,0.18)] data-[state=checked]:border-[#007fe8] data-[state=checked]:bg-[#EBF3FD]/80 motion-safe:transition-all motion-safe:active:scale-[0.985]"
    >
      <span className="block text-[15px] font-medium leading-snug text-[#0A1F1F] sm:text-base">
        {label}
      </span>
      {descriptor && (
        <span className="mt-1.5 block text-sm leading-6 text-slate-600">
          {descriptor}
        </span>
      )}
    </button>
  );
}
