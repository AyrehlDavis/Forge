import type { Metadata } from "next";
import { BrokerDecisionV2 } from "./BrokerDecisionV2";

export const metadata: Metadata = {
  title: "Should I Use an Energy Broker? — V2 | Arise Energy",
  description:
    "Tell us about your portfolio. We'll tell you what to do — and what we'd do if it were us.",
};

export default function Page() {
  return <BrokerDecisionV2 />;
}
