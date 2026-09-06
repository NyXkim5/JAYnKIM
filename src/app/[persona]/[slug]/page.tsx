import { notFound } from "next/navigation";
import { caseStudies, findStudy } from "@/data/caseStudies";
import { isPersonaKey } from "@/features/persona/personas";
import CaseStudyContent from "@/app/projects/[slug]/CaseStudyContent";

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

export default async function ScopedCaseStudy({ params }: { params: Promise<{ persona: string; slug: string }> }) {
  const { persona, slug } = await params;
  const study = findStudy(slug);
  if (!isPersonaKey(persona) || !study || !study.personas.includes(persona)) notFound();
  return <CaseStudyContent slug={slug} />;
}
