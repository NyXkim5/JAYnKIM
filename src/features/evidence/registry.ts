import type { PersonaKey } from "@/features/persona/personas";

export type Evidence = {
  id: string;
  persona: PersonaKey[];
  value: string;
  unit?: string;
  repo: string;
  path: string;
  how: string;
  observedAt: string;
  public: boolean;
};

export const EVIDENCE: readonly Evidence[] = [
  {
    id: "dronenexus.tests.collected",
    persona: ["hardware"],
    value: "3,800",
    unit: "tests collected",
    repo: "NyXkim5/DroneNexus",
    path: "services/",
    how: "python3 -m pytest --collect-only -q services/",
    observedAt: "2026-09-05",
    public: false,
  },
  {
    id: "dronenexus.tests.files",
    persona: ["hardware"],
    value: "221",
    unit: "test files",
    repo: "NyXkim5/DroneNexus",
    path: "services/",
    how: "find services -name 'test_*.py' | wc -l",
    observedAt: "2026-09-05",
    public: false,
  },
  {
    id: "dronenexus.core.lines",
    persona: ["hardware"],
    value: "77,616",
    unit: "lines in services/core",
    repo: "NyXkim5/DroneNexus",
    path: "services/core/",
    how: "find services/core -name '*.py' -not -path '*__pycache__*' | xargs wc -l",
    observedAt: "2026-09-05",
    public: false,
  },
  {
    id: "dronenexus.yolo.latency",
    persona: ["hardware", "software"],
    value: "57.63 → 40.65 ms",
    unit: "YOLO mean latency, M1 Max CPU, 100 runs",
    repo: "NyXkim5/DroneNexus",
    path: "docs/perception/latency-benchmark.md",
    how: "read the mean column for baseline and fine-tuned ONNX export",
    observedAt: "2026-09-05",
    public: false,
  },
  {
    id: "dronenexus.siting.bound",
    persona: ["hardware"],
    value: "1 − 1/e",
    unit: "approximation guarantee, greedy siting",
    repo: "NyXkim5/DroneNexus",
    path: "services/core/siting/greedy.py",
    how: "read the greedy_select docstring",
    observedAt: "2026-09-05",
    public: false,
  },
  {
    id: "sonicfly.bearing.rmse",
    persona: ["hardware"],
    value: "2.292 → 0.605 m",
    unit: "range RMSE after covariance fix",
    repo: "sonicfly-research",
    path: "BEARING_REGRESSION.md",
    how: "read the benchmark table, 60 runs x 600 steps",
    observedAt: "2026-09-05",
    public: false,
  },
  {
    id: "archvbrain.eval.verifiedQuotes",
    persona: ["software"],
    value: "13 of 18",
    unit: "quotes byte-exact in stored text",
    repo: "ArchvBrain",
    path: "eval_data/verified_extraction_baseline.json",
    how: "totals.quotesStoredTextExact / totals.quotes in the committed baseline",
    observedAt: "2026-09-05",
    public: false,
  },
  {
    id: "archvbrain.eval.falseAnchors",
    persona: ["software"],
    value: "0",
    unit: "false anchors across 13 offset-carrying quotes",
    repo: "ArchvBrain",
    path: "eval_data/verified_extraction_baseline.json",
    how: "totals.falseAnchors in the committed baseline, rates.falseAnchorRate = 0.0",
    observedAt: "2026-09-05",
    public: false,
  },
  {
    id: "archvbrain.eval.goldRows",
    persona: ["software"],
    value: "45",
    unit: "hand-labelled gold rows across three datasets",
    repo: "ArchvBrain",
    path: "golden_reasoning_dataset.json, hallucination_dataset.json, conflict_resolution_dataset.json",
    how: "counted rows in each file: 15 + 20 + 10",
    observedAt: "2026-09-05",
    public: false,
  },
  {
    id: "iris.tenant.suiteLines",
    persona: ["software"],
    value: "3,928",
    unit: "lines of adversarial tenant-isolation tests",
    repo: "Iris",
    path: "backend/tests/test_tenant_isolation.py",
    how: "wc -l backend/tests/test_tenant_isolation.py",
    observedAt: "2026-09-05",
    public: false,
  },
  {
    id: "iris.gold.fixtures",
    persona: ["software"],
    value: "22",
    unit: "gold fixtures, 12,200 lines",
    repo: "Iris",
    path: "backend/tests/fixtures/*/gold.json",
    how: "ls backend/tests/fixtures/*/gold.json | wc -l; wc -l on the same",
    observedAt: "2026-09-05",
    public: false,
  },
  {
    id: "metis.sources.enabled",
    persona: ["software"],
    value: "130 of 135",
    unit: "curated sources enabled",
    repo: "singularity",
    path: "registry.ts",
    how: "grep -c 'enabled: true' registry.ts against total entries",
    observedAt: "2026-09-05",
    public: false,
  },
  {
    id: "bamboo.tests.files",
    persona: ["product", "software"],
    value: "313",
    unit: "test files",
    repo: "NyXkim5/nutrition-app",
    path: "src/",
    how: "find src -name '*.test.ts*' | wc -l",
    observedAt: "2026-09-05",
    public: false,
  },
  {
    id: "bamboo.gate.passing",
    persona: ["product"],
    value: "1,979 + 697",
    unit: "vitest + jest passing at last gate",
    repo: "NyXkim5/nutrition-app",
    path: "HANDOFF.md",
    how: "read the gate table dated 2026-08-07",
    observedAt: "2026-09-05",
    public: false,
  },
  {
    id: "bamboo.asc.appId",
    persona: ["product"],
    value: "6784845593",
    unit: "App Store Connect app id",
    repo: "NyXkim5/nutrition-app",
    path: "eas.json",
    how: "submit.production.ios.ascAppId",
    observedAt: "2026-09-05",
    public: false,
  },
  {
    id: "roleindex.rows.live",
    persona: ["business"],
    value: "533",
    unit: "curated roles, refreshed daily",
    repo: "NyXkim5/summer-2027-role-index",
    path: "stats.json",
    how: "stats.json total, refreshed 2026-09-04 by the GitHub Action",
    observedAt: "2026-09-05",
    public: true,
  },
  {
    id: "optum.rfp.volume",
    persona: ["software", "business"],
    value: "Tens of thousands",
    unit: "RFPs a year through one platform",
    repo: "Optum",
    path: "n/a",
    how: "Jay's statement, 2026-07-11. Qualitative by rule, no figure exists.",
    observedAt: "2026-09-05",
    public: false,
  },
];

export function findEvidence(id: string): Evidence | undefined {
  return EVIDENCE.find((e) => e.id === id);
}

export function evidenceFor(persona: PersonaKey): Evidence[] {
  return EVIDENCE.filter((e) => e.persona.includes(persona));
}

export function sourceHref(e: Evidence): string {
  if (e.public) return `https://github.com/${e.repo}/blob/main/${e.path}`;
  return `/${e.persona[0]}#${e.id}`;
}
