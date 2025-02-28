import type { Metadata } from "next";
import HumanityId from "@/components/humanity/id";

export const metadata: Metadata = {
  title: "Defius Maximus | Humanity Verification",
  description:
    "An autonomous AI agent that lets you click a button to print money.",
};

export default function HumanityPage({ params }: { params: { id: string } }) {
  return <HumanityId id={params.id} />;
}
