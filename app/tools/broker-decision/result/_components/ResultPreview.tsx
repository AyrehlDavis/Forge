"use client";

import { useRouter } from "next/navigation";
import { LeadMagnet } from "../../../broker-decision-v3/_components/LeadMagnet";
import { ResultCard } from "../../../broker-decision-v3/_components/ResultCard";
import type { V3Inputs, V3Recommendation } from "../../../broker-decision-v3/_lib/types";

interface ResultPreviewProps {
  result: V3Recommendation;
  inputs: V3Inputs;
}

export function ResultPreview({ result, inputs }: ResultPreviewProps) {
  const router = useRouter();
  const onReset = () => router.push("/tools/broker-decision-v3");

  return (
    <ResultCard
      result={result}
      onReset={onReset}
      magnet={<LeadMagnet result={result} inputs={inputs} />}
    />
  );
}
