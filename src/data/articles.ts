export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  status: "published" | "in-progress";
}

export const articles: Article[] = [
  {
    slug: "gpu-batching-strategies",
    title: "GPU Batching Strategies for Document Classification",
    description:
      "Why single-document inference wastes 85% of GPU capacity, and how type-based grouping, page-count batch sizing, and dual-path routing brought utilization from 15% to 70%+ with zero OOM incidents.",
    date: "2024",
    readTime: "8 min",
    tags: ["GPU", "ML Infrastructure", "PyTorch"],
    status: "in-progress",
  },
  {
    slug: "hipaa-infra-patterns",
    title: "HIPAA-Compliant Infrastructure Without the Overhead",
    description:
      "How we built compliant-by-default infrastructure at Archv. Column-level encryption, row-level access control, immutable audit logs, and zero-trust service mesh. All automated, no manual checklists.",
    date: "2024",
    readTime: "6 min",
    tags: ["HIPAA", "AWS", "Security"],
    status: "in-progress",
  },
  {
    slug: "ml-monitoring-prod",
    title: "ML Monitoring That Catches Failures",
    description:
      "Aggregate accuracy dashboards hide localized failures. We built alerting on data drift, prediction confidence drops, and silent model degradation. Alerts fire before users report problems.",
    date: "2025",
    readTime: "5 min",
    tags: ["MLOps", "Monitoring", "Production"],
    status: "in-progress",
  },
];
