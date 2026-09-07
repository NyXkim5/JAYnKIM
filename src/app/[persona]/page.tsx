import { notFound } from "next/navigation";
import { getPersona, isPersonaKey, PERSONA_KEYS } from "@/features/persona/personas";
import { PersonaDepth } from "@/features/depth/PersonaDepth";
import { ProjectsExplorer } from "@/features/projects/ProjectsExplorer";
import { WorkPage } from "@/features/work/WorkPage";
import { DesignPage } from "@/features/design/DesignPage";

export function generateStaticParams() {
  return PERSONA_KEYS.map((persona) => ({ persona }));
}

export async function generateMetadata({ params }: { params: Promise<{ persona: string }> }) {
  const { persona } = await params;
  if (!isPersonaKey(persona)) return { title: "Jay Kim" };
  const p = getPersona(persona);
  return { title: `${p.label} — Jay Kim`, description: p.claim };
}

export default async function PersonaPage({ params }: { params: Promise<{ persona: string }> }) {
  const { persona } = await params;
  if (!isPersonaKey(persona)) notFound();
  if (persona === "projects") return <ProjectsExplorer />;
  if (persona === "work") return <WorkPage />;
  if (persona === "design") return <DesignPage />;
  return <PersonaDepth persona={persona} />;
}
