// Every project on the Projects tab. Each spec value is a registry id, so a
// number reaches the screen only if a file backs it. Images are Jay's own
// captures or renders from his own code; sources are named in the caveat.

export type ProjectStatus =
  | "SIMULATED"
  | "HARDWARE"
  | "REAL TRAINING"
  | "CODE"
  | "THIRD-PARTY"
  | "SHIPPED"
  | "LIVE DATA";

export type ProjectImage = { src: string; alt: string };
export type ProjectSpec = { label: string; evidenceId: string };

export type Project = {
  slug: string;
  title: string;
  folder: string;
  status: ProjectStatus;
  claim: string;
  caveat: string;
  specs: ProjectSpec[];
  images: ProjectImage[];
  caseStudySlug?: string;
};

export type TreeNode = { name: string; slug?: string; nodes?: TreeNode[] };

export const FOLDERS = ["hardware", "software", "mobile", "data"] as const;

export const PROJECTS: readonly Project[] = [
  {
    slug: "overwatch-c2",
    title: "OVERWATCH command and control",
    folder: "hardware",
    status: "SIMULATED",
    claim: "A live C2 surface: map, asset inspector with attitude and MGRS, and a directive panel with launch, recover, and abort.",
    caveat: "Simulated exercise against synthetic assets. No MAVLink vehicle has been driven from this panel.",
    specs: [
      { label: "Tests collected", evidenceId: "dronenexus.tests.collected" },
      { label: "Core lines", evidenceId: "dronenexus.core.lines" },
      { label: "HUD tests", evidenceId: "overwatch.tests.passed" },
    ],
    images: [
      { src: "/projects/overwatch-hud.jpg", alt: "OVERWATCH HUD with map, inspector, and primary flight display" },
      { src: "/projects/overwatch-inspector.jpg", alt: "Asset inspector with attitude horizon, MGRS grid, and power state" },
      { src: "/projects/overwatch-directive.png", alt: "Directive panel with launch, recover, return to base, and abort" },
      { src: "/projects/overwatch-map.jpg", alt: "Full map view with coverage percentage and areas of interest" },
    ],
    caseStudySlug: "drone-dashboard",
  },
  {
    slug: "siting-optimizer",
    title: "Sensor siting optimizer",
    folder: "hardware",
    status: "SIMULATED",
    claim: "Maximum coverage as a monotone submodular objective, with the 1 minus 1/e guarantee stated in the docstring.",
    caveat: "Rendered from a real run on synthetic ridge terrain. Pink cells are the four chosen sites.",
    specs: [
      { label: "Bound", evidenceId: "dronenexus.siting.bound" },
      { label: "Tests collected", evidenceId: "dronenexus.tests.collected" },
      { label: "Test files", evidenceId: "dronenexus.tests.files" },
    ],
    images: [{ src: "/projects/siting-coverage.png", alt: "48 by 48 coverage probability grid with four chosen sensor sites in pink" }],
    caseStudySlug: "drone-dashboard",
  },
  {
    slug: "drone-detector",
    title: "Drone detector training run",
    folder: "hardware",
    status: "REAL TRAINING",
    claim: "The shipped detector, drone_seraphim_v1, and the training log that produced it.",
    caveat: "Five epochs on the project dataset. Metrics read from results.csv, not from the chart.",
    specs: [
      { label: "mAP50", evidenceId: "dronenexus.yolo.map50" },
      { label: "Precision", evidenceId: "dronenexus.yolo.precision" },
      { label: "Latency", evidenceId: "dronenexus.yolo.latency" },
    ],
    images: [
      { src: "/projects/detector-training-curves.png", alt: "Loss, precision, recall, and mAP curves over five epochs" },
      { src: "/projects/detector-predictions.jpg", alt: "Validation frames with predicted bounding boxes" },
      { src: "/projects/detector-pr-curve.png", alt: "Precision recall curve" },
      { src: "/projects/detector-confusion.png", alt: "Normalized confusion matrix" },
    ],
  },
  {
    slug: "latency-benchmark",
    title: "Perception latency benchmark",
    folder: "hardware",
    status: "HARDWARE",
    claim: "Mean latency dropped from 57.63 ms to 40.65 ms after the ONNX export, over 100 timed runs.",
    caveat: "Measured on an M1 Max CPU, not on edge hardware. The doc says so in its first line.",
    specs: [
      { label: "Latency", evidenceId: "dronenexus.yolo.latency" },
      { label: "mAP50", evidenceId: "dronenexus.yolo.map50" },
      { label: "Tests collected", evidenceId: "dronenexus.tests.collected" },
    ],
    images: [],
  },
  {
    slug: "webcam-detection",
    title: "Real camera detection demo",
    folder: "hardware",
    status: "HARDWARE",
    claim: "A laptop webcam feeding YOLO and a live HUD over a WebSocket, twenty frames at about 20 fps.",
    caveat: "Real capture, host CPU. The full engagement path needs SITL or a vehicle and is out of scope for the demo.",
    specs: [
      { label: "Latency", evidenceId: "dronenexus.yolo.latency" },
      { label: "Precision", evidenceId: "dronenexus.yolo.precision" },
      { label: "HUD tests", evidenceId: "overwatch.tests.passed" },
    ],
    images: [{ src: "/projects/overwatch-tests.png", alt: "Terminal capture of the HUD unit test run, 125 passed" }],
  },
  {
    slug: "sonicfly-regression",
    title: "SonicFly bearing regression",
    folder: "hardware",
    status: "THIRD-PARTY",
    claim: "Duke's released Kalman filter carried a covariance that did not match its own reported error. I found it, patched it, and benchmarked the fix.",
    caveat: "Duke University's code and figures. My contribution is the defect analysis, the patch, and the benchmark harness.",
    specs: [{ label: "Range RMSE", evidenceId: "sonicfly.bearing.rmse" }],
    images: [{ src: "/projects/sonicfly-eval.png", alt: "Acoustic bearing and range evaluation plots from the SonicFly repository" }],
  },
  {
    slug: "msp-encoder",
    title: "Betaflight MSP encoder",
    folder: "hardware",
    status: "CODE",
    claim: "A from-scratch MultiWii Serial Protocol v1 and v2 byte encoder and decoder with checksums, tested without hardware.",
    caveat: "Pure protocol code, referenced against the Betaflight spec. No board attached.",
    specs: [
      { label: "Test files", evidenceId: "dronenexus.tests.files" },
      { label: "Core lines", evidenceId: "dronenexus.core.lines" },
    ],
    images: [],
    caseStudySlug: "drone-dashboard",
  },
  {
    slug: "archv-ink",
    title: "Archv Ink legal AI",
    folder: "software",
    status: "CODE",
    claim: "An eval harness that measures whether the AI's citations point at real text, gated on a committed baseline.",
    caveat: "Fixture-mode baseline. The false anchor rate is zero on the committed corpus, not a production measurement.",
    specs: [
      { label: "Verified quotes", evidenceId: "archvbrain.eval.verifiedQuotes" },
      { label: "False anchors", evidenceId: "archvbrain.eval.falseAnchors" },
      { label: "Gold rows", evidenceId: "archvbrain.eval.goldRows" },
    ],
    images: [],
    caseStudySlug: "archv",
  },
  {
    slug: "iris",
    title: "IRIS RFP platform",
    folder: "software",
    status: "CODE",
    claim: "Hybrid retrieval with reciprocal rank fusion, citations bound to character offsets, and tenant isolation closed three ways.",
    caveat: "The eval harnesses exist but have never scored a live model. No quality baseline is claimed.",
    specs: [
      { label: "Isolation suite", evidenceId: "iris.tenant.suiteLines" },
      { label: "Gold fixtures", evidenceId: "iris.gold.fixtures" },
    ],
    images: [],
  },
  {
    slug: "metis",
    title: "Metis threat intelligence",
    folder: "software",
    status: "CODE",
    claim: "A brief-quality judge that prints its projected dollar cost before it runs and can never block a draft.",
    caveat: "Judge is advisory and off by default. Retrieval is tool-calling over typed queries, not embeddings.",
    specs: [{ label: "Sources enabled", evidenceId: "metis.sources.enabled" }],
    images: [],
  },
  {
    slug: "va-gov-bdd",
    title: "VA.gov benefits readiness",
    folder: "software",
    status: "CODE",
    claim: "A readiness flow built from two VA pages that contradict each other on service treatment records.",
    caveat: "Bid MVP. No external user has been logged; the only gate acceptances are test entries.",
    specs: [],
    images: [],
    caseStudySlug: "va-gov-mvp",
  },
  {
    slug: "cactus-analytics",
    title: "Cactus event analytics",
    folder: "software",
    status: "CODE",
    claim: "Event ingestion and growth analytics with materialized views over raw queries.",
    caveat: "Employer work. No repository on disk, so no numbers are shown.",
    specs: [],
    images: [],
    caseStudySlug: "cactus",
  },
  {
    slug: "bamboo",
    title: "Bamboo nutrition app",
    folder: "mobile",
    status: "SHIPPED",
    claim: "Submitted to App Store Connect with a real privacy manifest, HealthKit read access, and a two-runner test strategy.",
    caveat: "Strava and WHOOP sync are built but gated off in the shipped build.",
    specs: [
      { label: "ASC app id", evidenceId: "bamboo.asc.appId" },
      { label: "Test files", evidenceId: "bamboo.tests.files" },
      { label: "Last gate", evidenceId: "bamboo.gate.passing" },
    ],
    images: [],
  },
  {
    slug: "role-index",
    title: "Summer 2027 role index",
    folder: "data",
    status: "LIVE DATA",
    claim: "A hand-curated index of early-career roles, refreshed daily by a GitHub Action.",
    caveat: "Public repository. The README still says 372; the live count is in stats.json.",
    specs: [{ label: "Live rows", evidenceId: "roleindex.rows.live" }],
    images: [],
  },
];

export function findProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function projectTree(): TreeNode {
  return {
    name: "projects",
    nodes: FOLDERS.map((folder) => ({
      name: folder,
      nodes: PROJECTS.filter((p) => p.folder === folder).map((p) => ({ name: p.title, slug: p.slug })),
    })),
  };
}
