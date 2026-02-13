import type { Metadata } from "next";
import MatchaContent from "./MatchaContent";

export const metadata: Metadata = {
  title: "Recs — Jay Kim",
  description: "Cafe and food recommendations in Orange County and LA.",
};

export default function MatchaPage() {
  return <MatchaContent />;
}
