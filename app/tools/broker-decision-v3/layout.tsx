import type { ReactNode } from "react";
import { FeedbackWidget } from "./_components/FeedbackWidget";

export default function BrokerDecisionV3Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <FeedbackWidget />
    </>
  );
}
