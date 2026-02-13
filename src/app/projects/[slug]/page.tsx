import { caseStudies } from "@/data/caseStudies";
import CaseStudyContent from "./CaseStudyContent";

export function generateStaticParams() {
  return caseStudies.map((study) => ({
    slug: study.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);
  return {
    title: study ? `${study.title} — Jay Kim` : "Case Study — Jay Kim",
    description: study?.subtitle,
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CaseStudyContent slug={slug} />;
}
