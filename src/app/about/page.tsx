import type { Metadata } from "next";
import HomeContent from "../HomeContent";

export const metadata: Metadata = {
  title: "About — Jay Kim",
  description: "Software engineer specializing in AI/ML, full-stack development, and design. Based in Orange County, CA.",
};

export default function About() {
  return <HomeContent />;
}
