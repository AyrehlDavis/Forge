"use client";

import { useState, type FormEvent } from "react";
import { getStateName } from "../_config/states";
import type { V3Inputs, V3Recommendation } from "../_lib/types";

interface LeadMagnetProps {
  result: V3Recommendation;
  inputs: V3Inputs;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "success" | "error" | "skipped";

function joinStateNames(codes: string[]): string {
  const names = codes.map(getStateName);
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

function stateMarketLabel(stateCodes: string[]): string {
  if (stateCodes.length === 0) return "your state's energy market";
  if (stateCodes.length === 1) return `${joinStateNames(stateCodes)}'s energy market`;
  if (stateCodes.length <= 3) return `${joinStateNames(stateCodes)}'s markets`;
  return `your ${stateCodes.length} states' markets`;
}

export function LeadMagnet({ result, inputs }: LeadMagnetProps) {
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

  return (
    <section aria-label="Take the recommendation with you">
      {status === "success" ? (
        <SuccessState />
      ) : (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#006bc5]">
            Take it with you
          </p>
          <h3 className="mt-2 text-xl font-semibold leading-snug text-slate-900 sm:text-2xl">
            Two things to bring to your next call.
          </h3>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DeliverableCard
              icon={<IconStrategies />}
              title="9 strategies"
              body="What to actually do at the negotiation — not just what to ask."
            />
            <DeliverableCard
              icon={<IconMarket />}
              title="Your market snapshot"
              body={`Deregulation status, suppliers, and rate range for ${stateMarketLabel(inputs.states)}.`}
            />
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-2">
            <label htmlFor="lead-email" className="sr-only">
              Email address
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="lead-email"
                type="email"
                name="email"
                inputMode="email"
                autoComplete="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                disabled={status === "submitting"}
                aria-invalid={!!validationError}
                aria-describedby={validationError ? "lead-email-error lead-privacy" : "lead-privacy"}
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
            </div>
            {validationError && (
              <p id="lead-email-error" className="text-sm text-red-600" role="alert">
                {validationError}
              </p>
            )}
            <p id="lead-privacy" className="text-xs text-slate-500 leading-relaxed mt-1">
              One email. We won&apos;t sell your address or drip-market you.
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
            <button
              type="button"
              onClick={() => setStatus("skipped")}
              className="mt-1 self-start text-xs text-slate-500 underline underline-offset-2 hover:text-[#006bc5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-2 rounded"
            >
              No thanks
            </button>
          </form>
        </>
      )}
    </section>
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
        <p className="mt-1 text-slate-700">Your strategies and market snapshot are on the way.</p>
      </div>
    </div>
  );
}

function DeliverableCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[12px] border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ECFEFF] text-[#0e7490]"
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-slate-900">{title}</p>
          <p className="mt-0.5 text-xs leading-5 text-slate-600">{body}</p>
        </div>
      </div>
    </div>
  );
}

function IconStrategies() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M4 7h12M4 12h12M4 17h8" />
      <path d="M18.5 15.5l1.5 1.5L23 14" />
    </svg>
  );
}

function IconMarket() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z" />
      <path d="M9 3v15M15 6v15" />
    </svg>
  );
}
