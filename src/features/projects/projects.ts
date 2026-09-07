// Every project on the Projects tab. Each spec value is a registry id, so a
// number reaches the screen only if a file backs it. Images are Jay's own
// captures or renders from his own code; sources are named in the caveat.

import { SCHOOL } from "./school";

export type ProjectStatus =
  | "SIMULATED"
  | "HARDWARE"
  | "REAL TRAINING"
  | "CODE"
  | "THIRD-PARTY"
  | "SHIPPED"
  | "LIVE DATA"
  | "COMMUNITY";

export type ProjectImage = { src: string; alt: string };
// A demo clip served from public/, shown above the figures with a poster frame.
export type ProjectVideo = { src: string; poster: string; alt: string };
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
  video?: ProjectVideo;
  caseStudySlug?: string;
  // A real address the window's URL bar can show: a live site or the repo.
  url?: string;
  // True when that url is a private GitHub repository. The window says so.
  privateRepo?: boolean;
};

export type TreeNode = { name: string; slug?: string; nodes?: TreeNode[] };

export const FOLDERS = ["hardware", "software", "mobile", "school"] as const;
export const FOLDER_LABELS: Record<(typeof FOLDERS)[number], string> = {
  hardware: "hardware",
  software: "software",
  mobile: "mobile",
  school: "school contributions",
};

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
    url: "https://github.com/NyXkim5/DroneNexus",
    privateRepo: true,
  },
  {
    slug: "siting-optimizer",
    title: "Sensor siting optimizer",
    folder: "hardware",
    status: "SIMULATED",
    claim: "Maximum coverage as a monotone submodular objective, with the 1 minus 1/e guarantee stated in the docstring.",
    caveat: "Rendered from a real run on synthetic ridge terrain, 36 candidate masts on a lattice, four chosen greedily at 900 m range. No real site survey yet.",
    specs: [
      { label: "Expected coverage", evidenceId: "dronenexus.siting.coverage" },
      { label: "Bound", evidenceId: "dronenexus.siting.bound" },
      { label: "Tests collected", evidenceId: "dronenexus.tests.collected" },
    ],
    images: [{ src: "/projects/siting-plan.png", alt: "Left, the ridge terrain with every candidate mast, the four chosen sites and their range rings. Right, expected coverage per demand cell in pink, with the sites overlaid" }],
    caseStudySlug: "drone-dashboard",
    url: "https://github.com/NyXkim5/DroneNexus",
    privateRepo: true,
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
    url: "https://github.com/NyXkim5/DroneNexus",
    privateRepo: true,
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
      { label: "p95", evidenceId: "dronenexus.latency.onnx.p95" },
      { label: "mAP50", evidenceId: "dronenexus.yolo.map50" },
    ],
    images: [
      { src: "/projects/latency-benchmark.png", alt: "Mean, p50 and p95 latency for the baseline, fine-tuned and ONNX detectors, ONNX lowest in every group" },
    ],
    url: "https://github.com/NyXkim5/DroneNexus",
    privateRepo: true,
  },
  {
    slug: "webcam-detection",
    title: "Real camera detection demo",
    folder: "hardware",
    status: "HARDWARE",
    claim: "A laptop webcam feeding YOLO and a live HUD over a WebSocket, twenty frames at about 20 fps.",
    caveat: "Host CPU. The two frames ran a recorded clip (Pexels, Joseph Redfield) through the same detector and HUD in place of the webcam on 2026-09-06, with the drone fine-tune. The full engagement path needs SITL or a vehicle and is out of scope for the demo.",
    specs: [
      { label: "Latency", evidenceId: "dronenexus.yolo.latency" },
      { label: "Precision", evidenceId: "dronenexus.yolo.precision" },
      { label: "HUD tests", evidenceId: "overwatch.tests.passed" },
    ],
    images: [
      { src: "/projects/webcam-drone-detect-1.jpg", alt: "OVERWATCH live detection HUD, LIVE, a quadcopter boxed as drone with its confidence, inference time and source resolution in the performance panel" },
      { src: "/projects/webcam-drone-detect-2.jpg", alt: "A later frame of the same clip, the box tracking the drone as it banks past the palm trees" },
    ],
    url: "https://github.com/NyXkim5/DroneNexus",
    privateRepo: true,
  },
  {
    slug: "sonicfly-regression",
    title: "Pan acoustic drone tracker",
    folder: "hardware",
    status: "THIRD-PARTY",
    claim: "Duke's released Kalman filter carried a covariance that did not match its own reported error. I found it, patched it, then built Pan, a private derivative with a real-flight regression gate that showed the fancier filters lose on real data.",
    caveat: "Derived from Duke's SonicFly, credited in the repo. Synthetic tuning wins vanished on the real test set, so the recommended default is the plain honest-R fix. The bearing gain is small and holds on four of ten trajectories.",
    specs: [
      { label: "Range RMSE, real", evidenceId: "pan.real.range_rmse" },
      { label: "Bearing MAE, real", evidenceId: "pan.real.bearing_mae" },
      { label: "Range RMSE, synthetic", evidenceId: "sonicfly.bearing.rmse" },
    ],
    images: [
      { src: "/projects/pan-range.png", alt: "Range error for five filter chains on two synthetic sets and real flight, every derivative beats the shipped chain on range" },
      { src: "/projects/pan-bearing.png", alt: "Bearing error for the same chains, the recommended chain is worst on static synthetic and best on real flight" },
      { src: "/projects/pan-timeseries.png", alt: "Real flight trajectory nine, raw network bearing, RTK truth, shipped and recommended chains over 29 seconds" },
      { src: "/projects/pan-nees.png", alt: "Normalised estimation error squared on the synthetic sets with the consistency line at four" },
      { src: "/projects/sonicfly-eval.png", alt: "Acoustic bearing and range evaluation plots from the upstream SonicFly repository" },
    ],
    url: "https://github.com/NyXkim5/pan",
    privateRepo: true,
  },
  {
    slug: "msp-encoder",
    title: "Betaflight MSP encoder",
    folder: "hardware",
    status: "CODE",
    claim: "A from-scratch MultiWii Serial Protocol v1 byte encoder and decoder with XOR checksums, tested without hardware.",
    caveat: "Pure protocol code, referenced against the Betaflight spec. v1 frames only, no v2 path exists. No board attached.",
    specs: [
      { label: "Test files", evidenceId: "dronenexus.tests.files" },
      { label: "Core lines", evidenceId: "dronenexus.core.lines" },
      { label: "Arm frame", evidenceId: "dronenexus.msp.arm_frame.bytes" },
    ],
    images: [
      { src: "/projects/msp-frame.png", alt: "Twenty-two labelled bytes of one MSP v1 arm frame from the encoder, header, size, code, eight RC channels and the XOR checksum" },
    ],
    caseStudySlug: "drone-dashboard",
    url: "https://github.com/NyXkim5/DroneNexus",
    privateRepo: true,
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
    images: [
      { src: "/projects/archv-eval.png", alt: "Nineteen eval cases against four verification flags, every false anchor cell empty, and the totals block beside it" },
    ],
    video: {
      src: "/projects/archv-demo.mp4",
      poster: "/projects/archv-demo-poster.jpg",
      alt: "Archv Ink product demo, the assistant answering a FERPA question about student PII inside the firm workspace, cut from the Archv website",
    },
    caseStudySlug: "archv",
    url: "https://github.com/NyXkim5/archv-mock-service",
    privateRepo: true,
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
      { label: "Route cases", evidenceId: "iris.isolation.route_cases" },
    ],
    images: [
      { src: "/projects/iris-isolation.png", alt: "Seventy-seven tenant isolation route cases grouped by URL surface, and test functions per proof layer" },
    ],
    url: "https://github.com/NyXkim5/IrisEvaluationMVP",
    privateRepo: true,
  },
  {
    slug: "metis",
    title: "Metis threat intelligence",
    folder: "software",
    status: "CODE",
    claim: "A brief-quality judge that prints its projected dollar cost before it runs and can never block a draft.",
    caveat: "Judge is advisory and off by default. Retrieval is tool-calling over typed queries, not embeddings.",
    specs: [
      { label: "Sources enabled", evidenceId: "metis.sources.enabled" },
      { label: "State-controlled", evidenceId: "metis.sources.state_controlled" },
    ],
    images: [
      { src: "/projects/metis-sources.png", alt: "Curated source registry entries per tier, enabled filled and disabled hollow, the seven state-controlled entries in pink" },
    ],
    url: "https://github.com/NyXkim5/singularity",
    privateRepo: true,
  },
  {
    slug: "va-gov-bdd",
    title: "VA.gov benefits readiness",
    folder: "software",
    status: "CODE",
    claim: "A readiness flow built from two VA pages that contradict each other on service treatment records.",
    caveat: "Bid MVP. The prototype sits behind a passphrase and a recorded confidentiality acknowledgement, so no screens are shown here. No external user has been logged.",
    specs: [],
    images: [],
    caseStudySlug: "va-gov-mvp",
    url: "https://va-gov-mvp-v1.vercel.app",
  },
  {
    slug: "cactus-analytics",
    title: "Hermes on-device inference",
    folder: "software",
    status: "CODE",
    claim: "Fixes to Cactus's Flutter and Swift bindings, then Hermes, a private derivative with the first Dart test suite, a benchmark harness, and generation that no longer blocks the calling isolate.",
    caveat: "Derived from Cactus Compute's engine, credited in the repo with the license kept. My upstream pull requests were not merged. The event analytics case study is employer work with no public code.",
    specs: [
      { label: "Decode", evidenceId: "hermes.bench.decode" },
      { label: "First token", evidenceId: "hermes.first_token" },
      { label: "Dart tests", evidenceId: "hermes.tests" },
    ],
    images: [
      { src: "/projects/hermes-streaming.png", alt: "macOS Flutter test app mid-generation, spinner live and the first partial sentence streaming in" },
      { src: "/projects/hermes-done.png", alt: "The same app after completion with the engine's own throughput chips and the first token on screen time" },
      { src: "/projects/hermes-liveness.png", alt: "Calling isolate timer ticks during generation and time to first visible token, before and after Generation 3" },
      { src: "/projects/hermes-throughput.png", alt: "Prefill and decode tokens per second for two models at two prompt sizes, mean and standard deviation" },
      { src: "/projects/hermes-overhead.png", alt: "Engine time against Dart binding overhead per call, log scale" },
      { src: "/projects/cactus-site.jpg", alt: "cactuscompute.com landing page, on-device AI with cloud fallback" },
    ],
    caseStudySlug: "cactus",
    url: "https://github.com/NyXkim5/hermes",
    privateRepo: true,
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
    images: [
      { src: "/projects/bamboo-site.jpg", alt: "bamboonutrition.app landing page with the phone mockup and calorie ring" },
      { src: "/projects/bamboo-site-2.jpg", alt: "Three things your current app cannot do, from the Bamboo site" },
    ],
    url: "https://bamboonutrition.app/",
  },
  {
    slug: "role-index",
    title: "Summer 2027 role index",
    folder: "school",
    status: "LIVE DATA",
    claim: "An open source job hunting index for students: hand-curated early-career roles, refreshed daily by a GitHub Action.",
    caveat: "Public repository. The README still says 372; the live count is in stats.json.",
    specs: [{ label: "Live rows", evidenceId: "roleindex.rows.live" }],
    images: [
      { src: "/projects/role-index-repo.jpg", alt: "README of the Summer 2027 role index repository on GitHub" },
    ],
    url: "https://github.com/NyXkim5/summer-2027-role-index",
  },
  ...SCHOOL,
];

export function findProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function projectTree(): TreeNode {
  return {
    name: "projects",
    nodes: FOLDERS.map((folder) => ({
      name: FOLDER_LABELS[folder],
      nodes: PROJECTS.filter((p) => p.folder === folder).map((p) => ({ name: p.title, slug: p.slug })),
    })),
  };
}
