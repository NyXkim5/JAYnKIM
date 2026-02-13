import type { Metadata } from "next";
import ProjectsContent from "./ProjectsContent";

export const metadata: Metadata = {
  title: "Work — Jay Kim",
  description: "Case studies and professional work in AI/ML, healthcare tech, and full-stack engineering.",
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}
