import type { MetadataRoute } from "next";
import { caseStudies, studyHref } from "@/data/caseStudies";
import { BASE_URL } from "@/data/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/projects",
    "/design",
    "/work",
    "/stealth",
  ];

  const caseStudyPages = caseStudies.map((s) => studyHref(s.slug));
  const isStudy = (path: string) => path.split("/").length === 3;

  return [...staticPages, ...caseStudyPages].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : isStudy(path) ? 0.8 : 0.7,
  }));
}
