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
      className="group min-h-[88px] rounded-[12px] border border-white/60 bg-white/65 p-4 text-left shadow-[0_4px_16px_-8px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-md transition-colors hover:border-[#25D5F3] hover:bg-white/80 hover:shadow-[0_8px_24px_-8px_rgba(14,116,144,0.18),inset_0_1px_0_rgba(255,255,255,0.85)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0e7490] focus-visible:ring-offset-2 data-[state=checked]:border-[#007fe8] data-[state=checked]:bg-[#EBF3FD]/80 motion-safe:transition-all"
    >
      <span className="block text-sm font-semibold leading-snug text-[#0A1F1F]">
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
