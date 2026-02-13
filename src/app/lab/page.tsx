import type { Metadata } from "next";
import TimelineContent from "./TimelineContent";

export const metadata: Metadata = {
  title: "Lab — Jay Kim",
  description: "Side projects and experiments in drones, 3D, and civic tech.",
};

export default function LabPage() {
  return <TimelineContent />;
}
