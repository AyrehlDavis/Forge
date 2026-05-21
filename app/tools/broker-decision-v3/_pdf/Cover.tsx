import { PageShell } from "./PageShell";
import { SAMPLE_CHIPS, SAMPLE_META } from "./sample-data";

// Page 1 — Cover. Typography-led, no imagery. Faint TX outline watermark
// behind the personalization panel per Ranger's optional cover suggestion.

export function Cover() {
  return (
    <PageShell
      number={1}
      total={SAMPLE_META.totalPages}
      title="Cover"
      showHeader={false}
      showFooter={false}
    >
      {/* Brand-blue rule across the top */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[#007fe8]" />

      <div className="flex h-full flex-col px-16 pb-12 pt-16">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Forge · part of Arise Energy
        </div>

        <div className="mt-24 max-w-[560px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#007fe8]">
            Broker meeting kit
          </p>
          <h1 className="mt-5 text-[44px] font-semibold leading-[1.02] tracking-tight text-slate-900">
            9 broker questions + Texas market snapshot
          </h1>
          <p className="mt-5 max-w-[480px] text-[14px] leading-[1.6] text-slate-600">
            Built from your five answers. Use this to compare broker fees,
            supplier reach, timing plan, and contract risk before you sign.
          </p>
        </div>

        {/* Personalization panel — slate-50 fill, slate-200 border, all 5 chips */}
        <div className="relative mt-12 max-w-[420px]">
          {/* Faint TX outline watermark behind the panel */}
          <svg
            aria-hidden
            viewBox="0 0 200 200"
            className="absolute -right-12 -top-8 h-[200px] w-[200px] opacity-[0.06]"
          >
            <path
              fill="#007fe8"
              d="M40 60 L70 50 L100 60 L130 55 L160 70 L165 90 L155 120 L140 150 L115 165 L85 162 L55 145 L30 115 L25 85 Z"
            />
          </svg>
          <div className="relative rounded-[6px] border border-slate-200 bg-slate-50/80 px-6 py-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Prepared for
            </p>
            <dl className="mt-3 flex flex-col gap-1.5">
              {SAMPLE_CHIPS.map((chip) => (
                <div
                  key={chip.label}
                  className="flex items-baseline justify-between gap-4 text-[13px] leading-tight"
                  data-temp={`pdf-cover-chip-${chip.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <dt className="text-slate-500">{chip.label}</dt>
                  <dd className="text-right font-medium text-slate-900">
                    {chip.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-1.5 text-[10px] leading-relaxed text-slate-500">
          <span>
            Prepared {SAMPLE_META.preparedDate} · {SAMPLE_META.version} ·
            Arise Energy
          </span>
          <span>
            No sales call triggered by this download. Reply to the email if you
            want help with the numbers.
          </span>
        </div>
      </div>
    </PageShell>
  );
}
