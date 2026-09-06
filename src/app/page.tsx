import type { Metadata } from "next";
import { Landing } from "@/features/landing/Landing";

export const metadata: Metadata = {
  title: "Jay Kim — Software Engineer",
  description:
    "Hardware, software and AI/ML, product, and business. Pick a persona. Every number on this site traces to a file.",
};

export default function Home() {
  return <Landing />;
}
