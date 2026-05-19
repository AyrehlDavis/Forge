"use client";

import { useState, type FormEvent } from "react";
import { getState, getStateName } from "../_config/states";
import type {
  LocationCount,
  Priority,
  Situation,
  Spend,
  Track,
  V3Inputs,
  V3Recommendation,
} from "../_lib/types";

// Voucher prop — structural placeholder for Chris's named-human voucher. When
// populated, renders avatar + name + reply promise above the form. Left empty
// for this iteration pending Chris's approval of name, photo, and reply commitment.
export interface VoucherProps {
  name: string;
  title: string;
  avatarSrc: string;
  promise: string;
}

interface LeadMagnetProps {
  result: V3Recommendation;
  inputs: V3Inputs;
  voucher?: VoucherProps;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "success" | "error" | "skipped";

// Track-specific asset names + body lines. Read by the PDF preview card and
// the email-subject microcopy below the form.
const TRACK_ASSET: Record<Track, { title: string; body: string; subject: string }> = {
  A_use_broker: {
    title: "9 broker questions + score grid",
    body: "A one-page call worksheet — good answers, red flags, and space to score three brokers.",
    subject: "Your 9 broker questions",
  },
  B_go_direct: {
    title: "9 supplier-RFP questions",
    body: "Use this to run a clean direct-to-supplier RFP — terms, fees, and the questions suppliers don't volunteer.",
    subject: "Your 9 supplier-RFP questions",
  },
  C_regulated: {
    title: "9 utility-program checkpoints",
    body: "What to confirm with your regulated utility — tariff schedules, demand-response programs, and where the savings actually live.",
    subject: "Your 9 utility-program checkpoints",
  },
};

const SPEND_LABEL: Record<Spend, string> = {
  under_25k: "Under $25K",
  "25k_100k": "$25K–$100K",
  "100k_500k": "$100K–$500K",
  over_500k: "Over $500K",
};
const LOCATION_LABEL: Record<LocationCount, string> = {
  "1": "1 site",
  "2-10": "2–10 sites",
  "11-50": "11–50 sites",
  "50+": "50+ sites",
};
const PRIORITY_LABEL: Record<Priority, string> = {
  balanced_price_risk: "Balanced",
  price_first: "Lower cost",
  budget_certainty: "Certainty",
  handled_for_me: "Hands off",
};
const SITUATION_LABEL: Record<Situation, string> = {
  shopping_now: "Shopping now",
  renewal_soon: "Renewal soon",
  contract_6_plus_months: "6+ months out",
  always_in_market: "Always in market",
};

function marketLabelFromStates(codes: string[]): string {
  if (codes.length === 0) return "No states";
  const entries = codes
    .map(getState)
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const dereg = entries.filter((s) => s.isDeregulated === true).length;
  const partial = entries.filter((s) => s.isPartial === true).length;
  const reg = entries.length - dereg - partial;
  if (dereg === entries.length) return "Open market";
  if (dereg === 0 && reg + partial > 0) return "Regulated";
  return "Mixed market";
}

function primaryStateLabel(codes: string[]): string {
  if (codes.length === 0) return "your state";
  if (codes.length === 1) return getStateName(codes[0]);
  return `${codes.length}-state portfolio`;
}

function buildChips(inputs: V3Inputs): string[] {
  const chips: string[] = [];
  if (inputs.states.length > 0) {
    chips.push(primaryStateLabel(inputs.states));
    chips.push(marketLabelFromStates(inputs.states));
  }
  if (inputs.spend) chips.push(SPEND_LABEL[inputs.spend]);
  if (inputs.situation) chips.push(SITUATION_LABEL[inputs.situation]);
  if (inputs.locationCount) chips.push(LOCATION_LABEL[inputs.locationCount]);
  if (inputs.priority) chips.push(PRIORITY_LABEL[inputs.priority]);
  return chips;
}

export function LeadMagnet({ result, inputs, voucher }: LeadMagnetProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [validationError, setValidationError] = useState<string | null>(null);

  if (status === "skipped") return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!EMAIL_REGEX.test(email)) {
      setValidationError("Enter a valid email address.");
      return;
    }
    setValidationError(null);
    setStatus("submitting");
    try {
      const res = await fetch("/api/broker-decision/send-pdf", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, recommendation: result, inputs }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const asset = TRACK_ASSET[result.track];
  const chips = buildChips(inputs);
  const stateName = primaryStateLabel(inputs.states);
  const subjectLine = `Subject: ${asset.subject} + ${stateName} market snapshot · From: forge@arise.com · ~9 pages`;

  if (status === "success") {
    return (
      <section aria-label="Take the recommendation with you">
        <SuccessState />
      </section>
    );
  }

  return (
    <section aria-label="Take the recommendation with you">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#006bc5]">
        Your meeting kit
      </p>
      <h3 className="mt-2 text-xl font-semibold leading-snug text-slate-900 sm:text-2xl">
        Built from your five answers — ready for your next call.
      </h3>

      {voucher && <Voucher voucher={voucher} />}

      {/* Personalization chips — echo of the chip-trail. Proof we used every answer. */}
      {chips.length > 0 && (
        <ul
          aria-label="Personalization details used"
          className="mt-5 flex flex-wrap gap-2"
        >
          {chips.map((chip) => (
            <li
              key={chip}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
            >
              {chip}
            </li>
          ))}
        </ul>
      )}

      {/* Email-preview panel — show what arrives, don't symbolize it. */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <PdfPreviewCard
          title={asset.title}
          body={asset.body}
          stateName={stateName}
          spendLabel={inputs.spend ? SPEND_LABEL[inputs.spend] : null}
        />
        <SnapshotPreviewCard
          stateName={stateName}
          market={inputs.states.length > 0 ? marketLabelFromStates(inputs.states) : "—"}
          situation={inputs.situation}
        />
      </div>

      <p className="mt-6 text-sm font-semibold leading-6 text-slate-900">
        We won&apos;t call you from this form.{" "}
        <span className="font-medium text-slate-600">
          Reply if you want help with the numbers.
        </span>
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col gap-3">
        <label htmlFor="lead-email" className="sr-only">
          Work email address
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="lead-email"
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (validationError) setValidationError(null);
            }}
            disabled={status === "submitting"}
            aria-invalid={!!validationError}
            aria-describedby={validationError ? "lead-email-error lead-privacy" : "lead-privacy lead-subject"}
            className={`flex-1 rounded-full border bg-white px-5 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-2 transition-colors ${
              validationError ? "border-red-400" : "border-slate-200"
            }`}
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="v3-pill-primary inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap px-6 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-2"
          >
            {status === "submitting" ? (
              <>
                <span
                  aria-hidden
                  className="inline-block h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin"
                />
                Sending
              </>
            ) : (
              <>
                Send them to me
                <span aria-hidden>→</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setStatus("skipped")}
            className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-2"
          >
            No thanks
          </button>
        </div>
        {validationError && (
          <p id="lead-email-error" className="text-sm text-red-600" role="alert">
            {validationError}
          </p>
        )}
        <p
          id="lead-subject"
          className="text-xs leading-5 text-slate-500"
          data-temp="magnet-subject-preview"
        >
          {subjectLine}
        </p>
        <p id="lead-privacy" className="text-xs leading-relaxed text-slate-500">
          One email. We won&apos;t sell your address or drip-market you. The
          email includes a one-click unsubscribe.
        </p>
        {status === "error" && (
          <div className="mt-1 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Something went wrong.{" "}
            <button type="submit" className="font-medium underline hover:no-underline">
              Try again
            </button>
            , or reach out to us.
          </div>
        )}
      </form>
    </section>
  );
}

function Voucher({ voucher }: { voucher: VoucherProps }) {
  return (
    <figure className="mt-5 flex items-center gap-3 rounded-[12px] border border-slate-200 bg-white px-4 py-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={voucher.avatarSrc}
        alt=""
        aria-hidden
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
      <figcaption className="text-sm leading-snug text-slate-700">
        <span className="font-semibold text-slate-900">
          {voucher.name}, {voucher.title}
        </span>
        <span className="ml-2 text-slate-600">— {voucher.promise}</span>
      </figcaption>
    </figure>
  );
}

function SuccessState() {
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-base font-bold text-white"
      >
        ✓
      </span>
      <div>
        <h3 className="text-xl font-semibold text-emerald-900">Check your inbox.</h3>
        <p className="mt-1 text-slate-700">
          Your meeting kit and market snapshot are on the way.
        </p>
      </div>
    </div>
  );
}

// PDF preview — stylized first-page representation showing the track-specific
// asset name, the user's personalization, and a faded sample of question rows.
function PdfPreviewCard({
  title,
  body,
  stateName,
  spendLabel,
}: {
  title: string;
  body: string;
  stateName: string;
  spendLabel: string | null;
}) {
  return (
    <article
      data-temp="magnet-pdf-preview"
      className="relative overflow-hidden rounded-[12px] border border-slate-200 bg-white p-4"
    >
      <div className="flex items-start gap-3">
        <div
          aria-hidden
          className="flex h-[88px] w-16 shrink-0 flex-col justify-between rounded-[6px] border border-slate-200 bg-gradient-to-b from-white to-arise-50/60 p-1.5 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.08)]"
        >
          <div className="space-y-0.5">
            <div className="h-1 w-6 rounded-full bg-[#006bc5]" />
            <div className="h-0.5 w-10 rounded-full bg-slate-300" />
          </div>
          <div className="space-y-0.5">
            <div className="h-0.5 w-9 rounded-full bg-slate-200" />
            <div className="h-0.5 w-7 rounded-full bg-slate-200" />
            <div className="h-0.5 w-8 rounded-full bg-slate-200" />
            <div className="h-0.5 w-6 rounded-full bg-slate-200" />
          </div>
          <div className="text-center text-[6px] font-semibold uppercase tracking-[0.1em] text-slate-400">
            ~9 pp
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#006bc5]">
            PDF · 1 of 2
          </p>
          <p className="mt-1 text-sm font-semibold leading-snug text-slate-900">
            {title}
          </p>
          <p className="mt-1.5 text-xs leading-5 text-slate-600">{body}</p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-slate-500">
            Prepared for: {stateName}
            {spendLabel ? ` · ${spendLabel}` : ""}
          </p>
        </div>
      </div>
    </article>
  );
}

// Snapshot preview — stylized state outline + market read for the user's
// portfolio. Values illustrative, marked data-temp until real data is wired.
function SnapshotPreviewCard({
  stateName,
  market,
  situation,
}: {
  stateName: string;
  market: string;
  situation: Situation | null;
}) {
  const windowNote =
    situation === "shopping_now"
      ? "Active window"
      : situation === "renewal_soon"
        ? "90-day window"
        : situation === "contract_6_plus_months"
          ? "6+ mo lead"
          : situation === "always_in_market"
            ? "Continuous"
            : "Window TBD";

  return (
    <article
      data-temp="magnet-snapshot-preview"
      className="relative overflow-hidden rounded-[12px] border border-slate-200 bg-white p-4"
    >
      <div className="flex items-start gap-3">
        <div
          aria-hidden
          className="flex h-[88px] w-16 shrink-0 items-center justify-center rounded-[6px] border border-slate-200 bg-gradient-to-br from-arise-50/40 to-white"
        >
          <svg
            viewBox="0 0 40 40"
            fill="none"
            stroke="#006bc5"
            strokeWidth="1.5"
            strokeLinejoin="round"
            className="h-9 w-9 opacity-70"
          >
            <path d="M6 10 L14 8 L22 11 L30 9 L34 14 L33 22 L29 30 L22 33 L14 31 L8 27 L5 19 Z" />
            <circle cx="18" cy="20" r="1.5" fill="#006bc5" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0e7490]">
            Snapshot · 2 of 2
          </p>
          <p className="mt-1 text-sm font-semibold leading-snug text-slate-900">
            {stateName} market snapshot
          </p>
          <dl
            className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] leading-tight"
            data-temp="magnet-snapshot-rows"
          >
            <dt className="text-slate-500">Status</dt>
            <dd className="text-right font-medium text-slate-900">{market}</dd>
            <dt className="text-slate-500">Suppliers</dt>
            <dd className="text-right font-medium tabular-nums text-slate-900">
              14 active
            </dd>
            <dt className="text-slate-500">Rate range</dt>
            <dd className="text-right font-medium tabular-nums text-slate-900">
              $0.068–$0.082
            </dd>
            <dt className="text-slate-500">Timing</dt>
            <dd className="text-right font-medium text-slate-900">{windowNote}</dd>
          </dl>
        </div>
      </div>
    </article>
  );
}
