import type { Metadata } from "next";
import Chef from "@/components/chef";
export const metadata: Metadata = {
  title: "Defius Maximus | Chef",
  description:
    "An autonomous AI agent that lets you click a button to print money.",
};

export default async function LandingPage() {
  return <Chef />;
}
