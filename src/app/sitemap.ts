import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/caseStudies";
import { BASE_URL } from "@/data/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/projects",
    "/lab",
    "/writing",
    "/matcha",
    "/music",
    "/contact",
    "/writing/gpu-batching-strategies",
    "/writing/hipaa-infra-patterns",
    "/writing/ml-monitoring-prod",
  ];

  const caseStudyPages = caseStudies.map((s) => `/projects/${s.slug}`);

  return [...staticPages, ...caseStudyPages].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/projects/") ? 0.8 : 0.7,
  }));
}
