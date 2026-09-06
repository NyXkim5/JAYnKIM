import type { PersonaKey } from "./personas";

export type Artifact = {
  persona: PersonaKey;
  title: string;
  file: string;
  what: string;
  evidenceId?: string;
  caseStudySlug?: string;
};

export const ARTIFACTS: readonly Artifact[] = [
  {
    persona: "hardware",
    title: "Sensor siting with a stated bound",
    file: "DroneNexus/services/core/siting/greedy.py",
    what: "Maximum coverage as a monotone submodular objective. The docstring states the 1 − 1/e guarantee and why ties break to the lowest index so a plan reproduces.",
    evidenceId: "dronenexus.siting.bound",
    caseStudySlug: "drone-dashboard",
  },
  {
    persona: "hardware",
    title: "Line of sight over layered terrain",
    file: "DroneNexus/services/core/terrain/los.py",
    what: "DDA raycasting across stacked terrain layers. It refuses to floor the step size because sub-metre building layers must not be steppable-over.",
    caseStudySlug: "drone-dashboard",
  },
  {
    persona: "hardware",
    title: "A covariance bug in a published lab's filter",
    file: "sonicfly-research/BEARING_REGRESSION.md",
    what: "Duke's released Kalman filter carried an R that implied σ≈10.7° when the paper's own MAE implied σ=57.3°. The fix improved range RMSE and slightly worsened bearing MAE. Both numbers are in the write-up.",
    evidenceId: "sonicfly.bearing.rmse",
  },
  {
    persona: "hardware",
    title: "Measured latency, not claimed latency",
    file: "DroneNexus/docs/perception/latency-benchmark.md",
    what: "YOLO mean latency over 100 timed runs before and after ONNX export, with the doc warning that these are host-CPU numbers, not edge numbers.",
    evidenceId: "dronenexus.yolo.latency",
    caseStudySlug: "drone-dashboard",
  },
  {
    persona: "software",
    title: "Does the citation point at real text?",
    file: "ArchvBrain/eval_verified_extraction.py",
    what: "A harness that measures falseAnchorRate, the share of citations whose offsets fail to locate their quoted text. Baseline-gated. The docstring calls it the number that matters.",
    evidenceId: "archvbrain.eval.falseAnchors",
    caseStudySlug: "archv",
  },
  {
    persona: "software",
    title: "Hybrid retrieval that binds citations to offsets",
    file: "Iris/backend/app/rag/retrieval.py",
    what: "pgvector cosine plus Postgres full text fused with reciprocal rank fusion, then maximal marginal relevance. Citations bind to character spans and the answer refuses when retrieval returns nothing.",
  },
  {
    persona: "software",
    title: "Tenant isolation, closed three ways",
    file: "Iris/backend/migrations/versions/0019_force_row_level_security.py",
    what: "App-layer rejection, Postgres RLS with FORCE, a non-superuser role, and an adversarial suite that keeps it closed.",
    evidenceId: "iris.tenant.suiteLines",
  },
  {
    persona: "software",
    title: "The judge prints its cost before it runs",
    file: "singularity/services/agents/scripts/eval-briefs.ts",
    what: "Projected dollar cost against real per-token pricing, a daily spend cap that raises instead of overspending, and a judge that is advisory-only by design.",
  },
];

export function artifactsFor(persona: PersonaKey): Artifact[] {
  return ARTIFACTS.filter((a) => a.persona === persona);
}
