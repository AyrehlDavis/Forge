import { redirect } from "next/navigation";

// The site root has no landing page of its own — every reviewer + demo viewer
// wants the V3 broker-decision tool. The 3-track review surface is at
// /tools/broker-decision/result for stakeholders commenting via Vercel toolbar.
export default function Home() {
  redirect("/tools/broker-decision-v3");
}
