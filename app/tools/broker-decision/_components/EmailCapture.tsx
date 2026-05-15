"use client";

import { useState, type FormEvent } from "react";
import type { RecommendationOutput, RecommendationInput } from "../_lib/types";
import { joinStateNames } from "../_config/states";

/**
 * Builds the personalized state-market-snapshot label.
 * 1 state → "California's energy market"
 * 2-3   → "California, Texas, & New York's markets"
 * 4+    → "Your 4 states' markets"
 */
function stateMarketLabel(stateCodes: string[]): string {
  if (stateCodes.length === 0) return "your state's energy market";
  if (stateCodes.length === 1) return `${joinStateNames(stateCodes)}'s energy market`;
  if (stateCodes.length <= 3) return `${joinStateNames(stateCodes)}'s markets`;
  return `your ${stateCodes.length} states' markets`;
}

interface EmailCaptureProps {
  result: RecommendationOutput;
  input: RecommendationInput;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "success" | "error" | "skipped";

export function EmailCapture({ result, input }: EmailCaptureProps) {
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
        body: JSON.stringify({ email, recommendation: result, inputs: input }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      aria-label="Email PDF capture"
      className="rounded-2xl border border-arise-300/50 bg-gradient-to-br from-arise-50/80 via-white/65 to-arise-100/55 backdrop-blur-xl backdrop-saturate-150 p-6 sm:p-7 shadow-[0_8px_24px_-12px_rgba(28, 138, 239,0.2),inset_0_1px_0_rgba(255,255,255,0.9)]"
    >
      {status === "success" ? (
        <SuccessState />
      ) : (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-arise-700">
            Take it with you
          </p>
          <h3 className="mt-1.5 text-xl font-bold text-slate-900 tracking-tight">
            Two things to bring to your next call.
          </h3>

          {/* Deliverables row — two specific, named outputs so users see
              exactly what's coming. Utility framing, not marketing. */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DeliverableCard
              icon={<IconStrategies />}
              title="9 strategies"
              body="What to actually do at the negotiation — not just what to ask."
            />
            <DeliverableCard
              icon={<IconMarket />}
              title="Your market snapshot"
              body={`Deregulation status, suppliers, and rate range for ${stateMarketLabel(input.states)}.`}
            />
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-2">
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="email"
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
                aria-describedby={validationError ? "email-error privacy-line" : "privacy-line"}
                className={`flex-1 rounded-2xl border bg-white/80 backdrop-blur-md px-4 py-3 text-base placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-arise-500 transition-colors ${
                  validationError ? "border-red-400/70" : "border-slate-200/80"
                }`}
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="group inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-semibold text-base bg-gradient-to-br from-arise-500 via-arise-600 to-arise-700 text-white shadow-[0_6px_16px_-6px_rgba(28, 138, 239,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_10px_24px_-8px_rgba(28, 138, 239,0.45),inset_0_1px_0_rgba(255,255,255,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-arise-600 whitespace-nowrap"
              >
                {status === "submitting" ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="inline-block w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin"
                    />
                    Sending
                  </>
                ) : (
                  <>
                    Send them to me
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </>
                )}
              </button>
            </div>
            {validationError && (
              <p id="email-error" className="text-sm text-red-600" role="alert">
                {validationError}
              </p>
            )}
            <p id="privacy-line" className="text-xs text-slate-500 leading-relaxed mt-1">
              One email. We won&apos;t sell your address or drip-market you.
            </p>
            {status === "error" && (
              <div className="mt-1 rounded-xl bg-amber-50/80 backdrop-blur-md border border-amber-200 px-4 py-3 text-sm text-amber-900">
                Something went wrong.{" "}
                <button
                  type="submit"
                  className="underline font-medium hover:no-underline"
                >
                  Try again
                </button>
                , or reach out to us.
              </div>
            )}
            <button
              type="button"
              onClick={() => setStatus("skipped")}
              className="self-start mt-1 text-xs text-slate-500 hover:text-arise-700 underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-arise-500 rounded"
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
        aria-hidden="true"
        className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold"
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

/* ─────────────────────────────────────────────────────────────────────────────
 * Deliverable card — small nested glass card showing one specific thing the
 * user will receive. Two of these sit side-by-side inside the EmailCapture.
 * ────────────────────────────────────────────────────────────────────────── */
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
    <div className="rounded-xl border border-arise-200/70 bg-white/55 backdrop-blur-md p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.85)]">
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="flex-shrink-0 w-9 h-9 rounded-lg bg-arise-100/80 text-arise-700 flex items-center justify-center"
        >
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  );
}

/* Inline icons — stroke style, matching the v1 design system. */

function IconStrategies() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
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
      className="w-5 h-5"
    >
      <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z" />
      <path d="M9 3v15M15 6v15" />
    </svg>
  );
}
