"use client";

import { useRouter } from "next/navigation";
import { AnswersSummary } from "../../_components/AnswersSummary";
import { EmailCapture } from "../../_components/EmailCapture";
import { Results } from "../../_components/Results";
import type { RecommendationInput, RecommendationOutput } from "../../_lib/types";

interface ResultPreviewProps {
  input: RecommendationInput;
  result: RecommendationOutput;
}

export function ResultPreview({ input, result }: ResultPreviewProps) {
  const router = useRouter();
  const goToQuestionnaire = () => router.push("/tools/broker-decision");

  return (
    <div className="space-y-8">
      <AnswersSummary
        input={input}
        onEdit={goToQuestionnaire}
        onStartOver={goToQuestionnaire}
      />
      <Results
        result={result}
        emailCapture={<EmailCapture result={result} input={input} />}
      />
    </div>
  );
}
