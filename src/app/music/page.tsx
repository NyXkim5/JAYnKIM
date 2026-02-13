import type { Metadata } from "next";
import MusicContent from "./MusicContent";

export const metadata: Metadata = {
  title: "Music — Jay Kim",
  description: "What I've been listening to. Alternative, indie, and R&B.",
};

export default function MusicPage() {
  return <MusicContent />;
}
