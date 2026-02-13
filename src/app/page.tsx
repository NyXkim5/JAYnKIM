import type { Metadata } from "next";
import HomeContent from "./HomeContent";

export const metadata: Metadata = {
  title: "Jay Kim — Software Engineer",
  description:
    "Software engineer specializing in AI/ML, full-stack development, and design. Based in Orange County, CA.",
};

export default function Home() {
  return <HomeContent />;
}
