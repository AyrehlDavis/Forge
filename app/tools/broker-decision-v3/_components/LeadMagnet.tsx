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
  price_first: "Hands on",
  budget_certainty: "Certainty",
  handled_for_me: "Little effort",
};
const SITUATION_LABEL: Record<Situation, string> = {
  shopping_now: "Shopping now",
  renewal_soon: "Renewal soon",
  contract_6_plus_months: "Tracking",
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
      <h3 className="mt-1.5 text-lg font-semibold leading-snug text-slate-900 sm:text-xl">
        Maximize the value of your next energy contract.
      </h3>

      {voucher && <Voucher voucher={voucher} />}

      {/* Personalization chips — echo of the chip-trail. Proof we used every answer. */}
      {chips.length > 0 && (
        <ul
          aria-label="Personalization details used"
          className="mt-4 flex flex-wrap gap-2"
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

      {/* Unified deliverable card — meeting kit + market snapshot in a
          single intentional surface. Visually light, no dense data rows. */}
      <div className="mt-4">
        <DeliverableCard
          title={asset.title}
          body={asset.body}
          stateName={stateName}
          spendLabel={inputs.spend ? SPEND_LABEL[inputs.spend] : null}
          situationLabel={inputs.situation ? SITUATION_LABEL[inputs.situation] : null}
        />
      </div>

      <p className="mt-4 text-sm font-semibold leading-6 text-slate-900">
        We won&apos;t call you from this form.{" "}
        <span className="font-medium text-slate-600">
          Reply if you want help with the numbers.
        </span>
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-3 flex flex-col gap-2.5">
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
          One email. We won&apos;t sell your address. The email includes a
          one-click unsubscribe.
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

// Unified deliverable card — meeting kit + market snapshot together in one
// intentional surface. Visually light: a single small artifact-and-state
// lockup on the left, the asset title + "prepared from" line on the right.
// No data rows, no multi-thumb peeks, no source-attribution lines — those
// were a previous direction; this version strips back to one quiet card.
function DeliverableCard({
  title,
  body,
  stateName,
  spendLabel,
  situationLabel,
}: {
  title: string;
  body: string;
  stateName: string;
  spendLabel: string | null;
  situationLabel: string | null;
}) {
  const preparedFor = [stateName, spendLabel, "11–50 sites", situationLabel]
    .filter((s): s is string => Boolean(s))
    .join(" · ");

  return (
    <article
      data-temp="magnet-deliverable-card"
      className="overflow-hidden rounded-[10px] border border-slate-200 bg-white"
    >
      <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-[120px_1fr] sm:items-center sm:gap-6 sm:p-6">
        <div className="flex justify-center sm:justify-start">
          <DeliverableLockup stateName={stateName} />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#006bc5]">
            What arrives in your inbox
          </p>
          <h4 className="mt-2 text-lg font-semibold leading-snug text-slate-900 sm:text-xl">
            {title} + {stateName} market snapshot
          </h4>
          <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-slate-500">
            Prepared for: {preparedFor}
          </p>
          <button
            type="button"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#006bc5] underline-offset-4 transition-colors hover:text-arise-800 hover:underline focus:outline-none focus-visible:underline"
          >
            <span aria-hidden>↓</span>
            Download PDF
          </button>
        </div>
      </div>
    </article>
  );
}

// Single visual element — a small PDF cover with the state outline tucked
// into it. Combines the "meeting kit" and "market snapshot" deliverables
// into one quiet lockup.
function DeliverableLockup({ stateName }: { stateName: string }) {
  return (
    <figure
      aria-label="PDF + market snapshot preview"
      className="relative"
    >
      <div
        className="relative overflow-hidden rounded-[6px] border border-slate-200 bg-white shadow-[0_4px_16px_-4px_rgba(15,23,42,0.12)]"
        style={{ width: 112, height: 145 }}
      >
        <div className="absolute inset-x-0 top-0 h-[3px] bg-[#007fe8]" />
        <div className="flex h-full flex-col justify-between px-4 pb-4 pt-5">
          <div>
            <p className="text-[7px] font-semibold uppercase tracking-[0.18em] text-[#007fe8]">
              Broker meeting kit
            </p>
            <p className="mt-2 text-[11px] font-semibold leading-[1.15] tracking-tight text-slate-900">
              9 broker questions + {stateName} snapshot
            </p>
            <div className="mt-2 space-y-[3px]">
              <div className="h-[1px] w-16 rounded-full bg-slate-200" />
              <div className="h-[1px] w-14 rounded-full bg-slate-200" />
              <div className="h-[1px] w-12 rounded-full bg-slate-200" />
            </div>
          </div>
          <div className="flex items-end justify-between gap-2">
            <p className="text-[7px] uppercase tracking-[0.14em] text-slate-400">
              ~9 pp · Letter
            </p>
            <svg
              viewBox="0 0 240 240"
              fill="#007fe8"
              stroke="#007fe8"
              strokeWidth="1"
              strokeLinejoin="round"
              aria-hidden
              className="h-9 w-9 opacity-90"
            >
              <path d="M52 78 L88 70 L122 78 L148 72 L182 80 L196 92 L208 116 L214 138 L210 158 L196 178 L184 196 L166 210 L142 218 L120 220 L98 212 L74 196 L58 174 L48 152 L42 130 L46 104 Z" />
            </svg>
          </div>
        </div>
      </div>
    </figure>
  );
}
