"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Questionnaire } from "./_components/Questionnaire";
import { Results } from "./_components/Results";
import { EmailCapture } from "./_components/EmailCapture";
import { AnswersSummary } from "./_components/AnswersSummary";
import { recommend } from "./_lib/recommend";
import type {
  QuestionnaireAnswers,
  RecommendationInput,
  RecommendationOutput,
} from "./_lib/types";

type Mode = { kind: "fresh" } | { kind: "result" } | { kind: "edit"; step: number };

function inputToAnswers(input: RecommendationInput): QuestionnaireAnswers {
  return {
    spend: input.spend,
    location_count: input.location_count,
    states: input.states,
    priorities: input.priorities,
    situation: input.situation,
  };
}

export function BrokerDecisionTool() {
  const [input, setInput] = useState<RecommendationInput | null>(null);
  const [result, setResult] = useState<RecommendationOutput | null>(null);
  const [resultKey, setResultKey] = useState(0);
  const [mode, setMode] = useState<Mode>({ kind: "fresh" });
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const editRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = useCallback((nextInput: RecommendationInput) => {
    const nextResult = recommend(nextInput);
    setInput(nextInput);
    setResult(nextResult);
    setResultKey((k) => k + 1);
    setMode({ kind: "result" });
  }, []);

  const handleStartOver = useCallback(() => {
    setInput(null);
    setResult(null);
    setMode({ kind: "fresh" });
  }, []);

  const handleEdit = useCallback((step: number) => {
    setMode({ kind: "edit", step });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setMode({ kind: "result" });
  }, []);

  // Scroll behavior:
  //  - Entering edit mode → scroll to the questionnaire so the visitor sees the
  //    step they're editing (not the result that pushed it offscreen).
  //  - Returning to result mode after submit → scroll to the result section.
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (mode.kind === "edit" && editRef.current) {
      const target = editRef.current;
      const top = target.getBoundingClientRect().top + window.scrollY - 40;
      window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
      return;
    }

    if (mode.kind === "result" && result && resultsRef.current) {
      const target = resultsRef.current;
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
      const id = window.setTimeout(
        () => target.focus({ preventScroll: true }),
        reducedMotion ? 0 : 250,
      );
      return () => window.clearTimeout(id);
    }
  }, [mode, resultKey, result]);

  if (mode.kind === "fresh") {
    return (
      <div className="space-y-10">
        <Questionnaire onSubmit={handleSubmit} />
      </div>
    );
  }

  if (mode.kind === "edit" && input) {
    return (
      <div ref={editRef} className="space-y-10 scroll-mt-10">
        <Questionnaire
          key={`edit-${mode.step}-${resultKey}`}
          onSubmit={handleSubmit}
          initialAnswers={inputToAnswers(input)}
          initialStep={mode.step}
          mode="edit"
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  // mode.kind === "result"
  if (!result || !input) {
    return null;
  }

  return (
    <div className="space-y-8">
      <AnswersSummary input={input} onEdit={handleEdit} onStartOver={handleStartOver} />
      <Results
        key={resultKey}
        ref={resultsRef}
        result={result}
        emailCapture={<EmailCapture result={result} input={input} />}
      />
    </div>
  );
}
