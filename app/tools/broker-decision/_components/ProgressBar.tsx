interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Question ${current} of ${total}`}
        className="flex gap-1.5 flex-1"
      >
        {Array.from({ length: total }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              step <= current ? "bg-arise-600" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <div className="text-sm text-slate-600 font-medium tabular-nums">
        Step {current} of {total}
      </div>
    </div>
  );
}
