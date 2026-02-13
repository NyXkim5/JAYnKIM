import type { Metadata } from "next";
import WritingContent from "./WritingContent";

export const metadata: Metadata = {
  title: "Writing — Jay Kim",
  description: "Technical writing on ML infrastructure, HIPAA compliance, and production systems.",
};

export default function WritingPage() {
  return <WritingContent />;
}
