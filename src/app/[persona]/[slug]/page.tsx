import { notFound, permanentRedirect } from "next/navigation";
import { caseStudies, findStudy } from "@/data/caseStudies";
import { isPersonaKey } from "@/features/persona/personas";
import { projectForStudy, projectHref } from "@/features/projects/projects";
import CaseStudyContent from "@/features/casestudy/CaseStudyContent";

export function generateStaticParams() {
  return caseStudies.flatMap((s) => s.personas.map((persona) => ({ persona, slug: s.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ persona: string; slug: string }> }) {
  const { slug } = await params;
  const study = findStudy(slug);
  return {
    title: study ? `${study.title} — Jay Kim` : "Case Study — Jay Kim",
    description: study?.subtitle,
  };
}

// Case studies live inside the project windows now. An old case study address
// sends the reader to that window on its case tab. Only a study that no
// project carries still renders the old page.
export default async function ScopedCaseStudy({ params }: { params: Promise<{ persona: string; slug: string }> }) {
  const { persona, slug } = await params;
  const study = findStudy(slug);
  if (!isPersonaKey(persona) || !study || !study.personas.includes(persona)) notFound();
  const project = projectForStudy(slug);
  if (project) permanentRedirect(projectHref(project.slug, "case"));
  return <CaseStudyContent slug={slug} />;
}
