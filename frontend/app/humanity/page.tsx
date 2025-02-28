import type { Metadata } from "next";
import Home from "@/components/home";
import Humanity from "@/components/humanity";

export const metadata: Metadata = {
  title: "Defius Maximus | Humanity Verification",
  description:
    "An autonomous AI agent that lets you click a button to print money.",
};

export default function HomePage() {
  return <Humanity />;
}
