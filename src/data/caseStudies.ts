import type { PersonaKey } from "@/features/persona/personas";

export interface CaseStudy {
  slug: string;
  id: string;
  personas: PersonaKey[];
  title: string;
  subtitle: string;
  year: string;
  role: string;
  status: string;
  duration: string;
  team: string;
  overview: string;
  problem: string;
  approach: string[];
  designDecisions: {
    title: string;
    description: string;
    outcome: string;
  }[];
  impact: {
    metric: string;
    value: string;
    description: string;
    evidenceId: string;
  }[];
  stack: { category: string; tools: string[] }[];
  images: { src: string; caption: string }[];
  video?: { src: string; caption: string };
  versionImages?: {
    v1: { src: string; caption: string };
    v2: { src: string; caption: string };
    changelog: string[];
  };
  link?: { url: string; label: string };
  nextProject?: string;
  architecture?: {
    dataFlow: string;
    writeupLink?: string;
    sections: {
      title: string;
      content: string;
    }[];
  };
  reflections?: {
    worked: string[];
    different: string[];
  };
  brandPhilosophy?: {
    intro: string;
    typography: { heading: string; body: string };
    palette: { name: string; hex: string; usage: string }[];
    principles: string[];
  };
  layout?: "default" | "newspaper";
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "optum",
    id: "002",
    personas: ["software"],
    title: "Optum",
    subtitle: "Automating RFP Response at UnitedHealth Group",
    year: "2026",
    role: "Forward Deployed AI/ML Engineer",
    status: "Current",
    duration: "Feb 2026 – Present",
    team: "Enterprise AI/ML Team",
    layout: "newspaper",
    overview:
      "The business receives tens of thousands of RFPs. Each one is a dense document that has to be parsed, routed to the right teams, answered, reviewed, and returned on a deadline. That work used to live in email threads, spreadsheets, and tribal knowledge. I build the platform that replaces it. AI parses incoming RFP documents into structured, answerable questions, and every team involved works in one place to communicate, draft, and complete the response. The hardest technical problem is parsing accuracy. If the system misreads a requirement, everything downstream is wrong, so improving extraction accuracy is the constant focus.",
    problem:
      "An RFP is not one document for one team. A single response pulls in multiple teams, each answering their own sections against a shared deadline. Before the platform, that coordination happened over email and spreadsheets. Questions got missed, answers got rebuilt from scratch, and nobody had one view of what was done. The source documents themselves are hostile inputs: long PDFs, Word files, and embedded tables in formats that change with every issuer. Parsing them wrong is worse than not parsing them at all, because a misread requirement produces a confident, wrong answer.",
    approach: [
      "Parse incoming RFP documents into structured, answerable questions with AI document extraction. Accuracy here gates everything downstream",
      "Centralize every team that touches an RFP into one platform. Assignment, drafting, review, and communication happen in the same place",
      "Treat parsing accuracy as ongoing work, not a one-time build. Keep improving extraction against the real documents the business receives",
      "Put questions in front of the right team inside the platform instead of an inbox",
      "Work forward deployed: build directly against the business's real RFP workload and iterate with the teams completing responses in the tool",
      "Handle sensitive healthcare business data under enterprise security and compliance requirements from day one",
    ],
    designDecisions: [
      {
        title: "Parsing Accuracy as the Product",
        description:
          "RFP formats vary with every issuer. Numbered questions, nested tables, requirements buried in prose, Excel questionnaires with merged cells. At tens of thousands of RFPs, even rare parsing failures add up. So parsing is not a preprocessing step, it is the product, and improving extraction accuracy is treated as ongoing engineering work, not a launch milestone.",
        outcome:
          "Improving parsing accuracy is the central technical work on the platform, and real usage by the teams completing RFPs is what surfaces the errors.",
      },
      {
        title: "One Platform, Every Team",
        description:
          "The alternative was to bolt AI onto the existing workflow of email, spreadsheets, and shared drives. We rejected that. If teams still coordinate outside the system, the system never sees the full picture and answers never become reusable. Instead the platform is where the work happens: questions are assigned, drafted, discussed, reviewed, and completed in one place, with full visibility into what is done and what is blocking.",
        outcome:
          "Every team that touches an RFP communicates and completes work in the same system. Status is visible, and completed answers become an asset instead of an email attachment.",
      },
    ],
    impact: [
      {
        metric: "Volume",
        value: "Tens of thousands",
        description: "RFPs a year through one platform",
        evidenceId: "optum.rfp.volume",
      },
    ],
    stack: [
      { category: "Languages", tools: ["Python", "TypeScript", "SQL"] },
      { category: "AI/ML", tools: ["LLMs", "Document Parsing", "OCR", "Evaluation Pipelines"] },
      { category: "Infrastructure", tools: ["Docker", "Kubernetes"] },
      { category: "Compliance", tools: ["Enterprise Security", "Audit Logging"] },
    ],
    images: [],
    link: { url: "#", label: "Private Repo" },
    nextProject: "medvanta",
  },
  {
    slug: "archv",
    id: "001",
    personas: ["software", "product"],
    title: "Archv",
    subtitle: "AI-Powered Document Review for Regulated Industries",
    year: "2025",
    role: "CEO & Co-Founder",
    status: "Active",
    duration: "2025 – Present",
    team: "3 engineers, 1 designer",
    layout: "newspaper",
    overview:
      "I founded Archv because document review in regulated industries is broken in a specific way: the cost of a mistake is catastrophic, but the tools available are either manual or untrustworthy. Generalist AI hallucinates clauses. Manual review takes 4.5 hours per session. We built a third option — AI document review where every response links to its source text and every query is logged for audit. I ran 40+ user interviews, evaluated three AI architectures, selected RAG for built-in citations, and targeted law students as the entry point into institutional adoption. Review time dropped 71%. Verification time dropped 82%. Accepted into NVIDIA Inception. Shipped on a 4-person team with a pre-seed budget.",
    problem:
      "Law students spend 60–70% of their research time reviewing documents manually. In practice, one missed compliance clause leads to sanctions, malpractice claims, or fines exceeding $10M. Students who tried generalist AI tools found the outputs unusable: hallucinated clauses, no source citations, no audit trail. A professor told us during user research, 'One wrong answer and I will never use it again.' That sentence defined the product requirement. Trust is not a feature — it is a prerequisite. No product on the market combined fast AI inference with the citation integrity and compliance infrastructure these users demand before they will use it once.",
    approach: [
      "Ran 40+ user interviews with attorneys, paralegals, and compliance officers. Shadowed 3 attorneys during live document review sessions to map workflow pain points",
      "Evaluated three AI architectures: fine-tuned LLM ($500K+, not updatable), ChatGPT API wrapper (no compliance, hallucinations), RAG with vector database (built-in citations, updatable, cost-effective). Selected RAG",
      "Built a microservices architecture to isolate document ingestion, ML inference, user management, and audit logging",
      "Deployed ML models on NVIDIA GPUs via CUDA for document classification and entity extraction",
      "Encrypted all data with AES-256 at rest and TLS 1.3 in transit. Logged every data access for audit trails",
      "Built RESTful APIs with JWT auth and role-based access control (RBAC) mapped to compliance roles",
      "Shipped weekly updates to early users. Monthly pilot check-ins caught issues before they became product debt",
    ],
    designDecisions: [
      {
        title: "Students First, Institutions Second",
        description:
          "Two go-to-market paths. Sell to law firms: $50K+ contracts, 6-month sales cycles, legal procurement teams. Or sell to law students: $20/month, self-serve signup, same document review pain at smaller scale. Students who love the product become associates who request it at their firms. We chose students.",
        outcome:
          "Signed early users with zero sales team. Three program administrators approved Archv after students requested it.",
      },
      {
        title: "Killed Two Features in Pilot",
        description:
          "Monthly pilot check-ins surfaced two underperforming features: collaborative annotation and document comparison. Users wanted speed and accuracy. They did not want another collaboration tool. We cut both and moved engineering time to citation accuracy and response latency.",
        outcome:
          "Faster release cycles. Citation accuracy became the top-rated feature in user feedback. No user requested the removed features.",
      },
      {
        title: "RAG Pipeline over Fine-Tuning",
        description:
          "Evaluated three architectures. Fine-tuning a legal LLM cost $500K+ in data licensing and could not update without retraining. A ChatGPT API wrapper shipped fast but had no compliance controls and hallucinated freely. RAG with a vector database gave us built-in citations, live document updates without retraining, and controllable costs. We selected RAG and planned a fine-tuned routing layer for Phase 2.",
        outcome:
          "Every AI response links to source text. Users verify claims in 8 minutes instead of 45. Citation-first output became our primary differentiator.",
      },
      {
        title: "Microservices over Monolith",
        description:
          "Each service owns its database schema and communicates via message queues. Document ingestion, ML inference, user management, and audit logging run independently.",
        outcome:
          "GPU-heavy inference scales independently from user-facing services. Deployment failures stay isolated to a single service.",
      },
      {
        title: "GPU-Accelerated Inference Pipeline",
        description:
          "Custom batching system groups documents by type for optimal GPU throughput. Model quantization handles latency-sensitive endpoints.",
        outcome:
          "Sub-2 second classification on 50+ page legal documents. 3x throughput over CPU-only baseline.",
      },
      {
        title: "Zero-Trust Security Model",
        description:
          "Every API call authenticated. Every data access logged. PHI encrypted at rest and in transit. Custom RBAC maps to compliance roles: reviewer, admin, auditor.",
        outcome:
          "Maps directly to HIPAA technical safeguard requirements: encryption, role-based access, and a full audit trail built into the architecture rather than bolted on.",
      },
      {
        title: "Developer-First API Design",
        description:
          "RESTful API with OpenAPI docs, consistent error codes, pagination, and webhook support for async processing. SDK wrappers for Python and TypeScript.",
        outcome:
          "One integration partner completed full API integration in 3 business days.",
      },
    ],
    impact: [
      {
        metric: "Verified quotes",
        value: "13 of 18",
        description: "Citations proven byte-exact against stored page text in the committed eval baseline",
        evidenceId: "archvbrain.eval.verifiedQuotes",
      },
      {
        metric: "False anchors",
        value: "0",
        description: "Citations whose offsets fail to locate their quoted text. The number that matters, and it is zero.",
        evidenceId: "archvbrain.eval.falseAnchors",
      },
      {
        metric: "Gold rows",
        value: "45",
        description: "Hand-labelled reasoning, hallucination, and conflict datasets the judge scores against",
        evidenceId: "archvbrain.eval.goldRows",
      },
    ],
    stack: [
      { category: "Frontend", tools: ["TypeScript", "React", "Next.js", "Tailwind CSS"] },
      { category: "Backend", tools: ["Node.js", "Express", "PostgreSQL", "Redis"] },
      { category: "Infrastructure", tools: ["AWS EC2", "S3", "Lambda", "Docker", "Terraform"] },
      { category: "AI/ML", tools: ["Python", "PyTorch", "CUDA", "NVIDIA GPUs", "Hugging Face"] },
      { category: "AI Pipeline", tools: ["RAG", "Vector DB", "LangChain", "Embeddings"] },
      { category: "Security", tools: ["AES-256", "TLS 1.3", "JWT", "RBAC", "Audit Logging"] },
    ],
    images: [
      {
        src: "/archv-logo.webp",
        caption: "Archv. AI compliance infrastructure for regulated industries.",
      },
    ],
    video: {
      src: "/archv-video.mp4",
      caption: "Archv brand animation.",
    },
    architecture: {
      dataFlow: `  CLIENT UPLOAD
       |
       v
  API GATEWAY
  Rate Limit · JWT Auth · RBAC
       |
       v
  S3 (AES-256)  +  USER SERVICE (PostgreSQL)
       |
       v  S3 Event Notification
  SQS QUEUE (FIFO)  -->  DEAD LETTER QUEUE (Slack)
       |
       v
  GPU WORKER A (INT8, <2s)  +  GPU WORKER B (FP16, 3x)
  Classify, Embed              Extract, Summarize
       |
       v
  VECTOR DB (Embeddings)
       |
       v
  POSTGRESQL (Results + Audit Trail)
       |
       v
  WEBHOOK API (Client)  +  AUDIT LOGGER (Immutable)`,
      writeupLink: "/writing/gpu-batching-strategies",
      sections: [
        {
          title: "Batching Algorithm",
          content: `Documents are grouped by type (contracts, NDAs, compliance filings) before batching to keep GPU cache warm and avoid branch divergence. Batch size scales dynamically by page count, not document count, to prevent OOM on large files.`,
        },
        {
          title: "Failure Handling",
          content: `Three layers: retry with exponential backoff (1s, 4s, 16s), dead letter queue with Slack alerts for persistent failures, and idempotency keys (hash of S3 key + upload timestamp) to prevent duplicate processing.`,
        },
        {
          title: "Dual-Path Inference",
          content: `Interactive requests skip the queue and hit a reserved GPU slot with INT8 quantization for sub-2s latency. Batch workloads queue in SQS, group by type, and run FP16 for maximum accuracy at 3x throughput.`,
        },
      ],
    },
    reflections: {
      worked: [
        "Citation-first design. Trust requires verifiability. Every AI response links to source text. This became our primary differentiator against tools that produce unsourced summaries.",
        "Built for students first, sold through institutions second. Law students loved the product. Program administrators approved it. The compliance dashboard gave admin staff full visibility into AI usage, queries, and data access.",
        "Monthly pilot check-ins with real users caught issues before they became product debt. We killed two features early that tested poorly and doubled down on citation accuracy.",
      ],
      different: [
        "Designed the citation UI for accuracy, not speed. Our first citation format showed the full source paragraph inline. Users trusted it — but it made every response feel slow and heavy. We lost two pilot users before realizing the problem was not the AI latency, it was the visual weight of the answer. Switched to a linked reference pattern and retention recovered. The right answer presented wrong is still the wrong product.",
        "Invested more in onboarding. The first-run experience was weak. New users needed hand-holding to see the value, which added 2 weeks to every pilot. The product sold itself once someone used it — the problem was getting them to the first successful query.",
        "Ran pricing research before launch. We guessed on pricing based on competitive benchmarks that did not apply to students. Conjoint analysis upfront would have shortened the sales cycle and prevented a mid-pilot pricing change that confused early users.",
      ],
    },
    brandPhilosophy: {
      intro: "Archv's identity lives in tension. The product interface is stripped down: black text, white space, sharp edges, no decoration. The brand mark is the opposite, a burst of iridescent color. The work is serious, so the interface stays minimal and the content speaks. The company should feel human, so the brand stays colorful. The color also stands for the range of what Archv touches: law, healthcare, government, finance.",
      typography: {
        heading: "Favorit by Dinamo. A geometric grotesque with sharp terminals and wide apertures. It reads fast at small sizes, which matters when attorneys scan compliance dashboards for 6 hours straight. The geometry references architectural drafting lettering. Clean, precise, no flourishes.",
        body: "Inter for UI text. High x-height, open counters, designed for screens. Pairs with Favorit without competing. Body text at 14px/1.6 line height. Dense enough for data-heavy views. Readable enough for long review sessions.",
      },
      palette: [
        { name: "Obsidian", hex: "#0A0A0A", usage: "Interface text, headers, navigation" },
        { name: "Paper", hex: "#FAFAF8", usage: "Interface background, card surfaces" },
        { name: "Graphite", hex: "#6B6B6B", usage: "Secondary text, labels, metadata" },
        { name: "Iridescent Pink", hex: "#E84393", usage: "Brand mark, logo ribbons, playful accents" },
        { name: "Electric Blue", hex: "#3D5AFE", usage: "Brand mark, logo circles, trust signals" },
        { name: "Gold", hex: "#F9A825", usage: "Brand mark, warmth, approachability" },
      ],
      principles: [
        "Reduction over addition. Every element faces one question: does removing this break comprehension? If the answer is no, it goes. White space is the primary design material. It creates grouping, hierarchy, and breathing room without adding a single element.",
        "Information density without clutter. Attorneys review hundreds of pages daily. The interface respects that by fitting more content per screen without sacrificing legibility. Tight spacing, small but readable type sizes, and data tables that show 40+ rows without scrolling.",
        "Architecture taught me that materials should be honest. Concrete looks like concrete. Steel looks like steel. In the interface, a button looks like a button. A text field looks like a text field. No gradients pretending to be depth. No shadows pretending to be elevation. Flat surfaces, sharp edges, clear boundaries.",
        "The interface is 90% black, white, and gray. Color is scarce inside the product so content stays in focus. But the brand identity is the opposite: full spectrum, iridescent, playful. This contrast is intentional. The product is serious. The brand is approachable. Users trust the tool because it is clear. They remember the company because it is colorful.",
        "The grid is 8px. Every margin, padding, and component dimension snaps to multiples of 8. This creates visual rhythm without conscious effort. You feel it as consistency. The page feels organized before you read a single word.",
      ],
    },
    link: { url: "#", label: "Private Repo" },
    nextProject: "optum",
  },
  {
    slug: "cactus",
    id: "004",
    personas: ["software"],
    title: "Cactus",
    subtitle: "Event Ingestion and Growth Analytics Platform",
    year: "2025",
    role: "Software Engineer",
    status: "Active",
    duration: "2025 – Present",
    team: "Engineering Team",
    layout: "newspaper",
    overview:
      "The growth team was making decisions on intuition because the data was too slow to argue with. Event data scattered across four tools. A/B tests analyzed in spreadsheets days after the experiment ended. Marketing campaigns managed through separate codebases with no shared state. I built the event pipeline, the analytics dashboards, and the experimentation infrastructure that gave the team a single, real-time view of user behavior. Events process in under a second. Dashboard queries that took 12 seconds now take 200 milliseconds. The team stopped debating what happened and started debating what to do about it.",
    problem:
      "Growth teams operate on feedback loops. The tighter the loop, the faster they learn. This team's loop was broken. User events lived in one tool. Conversion data in another. Marketing campaign results in a third. Running an A/B test meant exporting data, joining it manually in a spreadsheet, and hoping the sample size was large enough to mean anything. By the time the analysis was done, the product had already changed. Marketing integrations — email, ads, CRM — each had their own codebase, their own auth patterns, their own failure modes. No one had a unified picture of what users were doing or why.",
    approach: [
      "Built a three-stage event pipeline: capture via lightweight SDK, enrichment with session metadata and geo/device context, dual-write to PostgreSQL (historical analysis) and Redis (real-time dashboards)",
      "Designed React dashboards with D3.js visualizations optimized for the specific questions growth teams ask: conversion funnels, retention cohorts, and experiment results. Each chart type chosen for the decision it supports, not the data it displays",
      "Shipped A/B testing infrastructure end-to-end: experiment definition, deterministic variant assignment, and statistical significance calculation with guardrails against premature decisions",
      "Abstracted SendGrid, Google Ads, and HubSpot behind a unified adapter interface. One integration pattern. Shared auth, rate limiting, and error handling. New marketing tools plug in without new architecture",
      "Optimized analytics queries with materialized views — pre-computed the aggregations the growth team checks daily (DAU, funnel step counts, retention cohorts) on a 5-minute refresh cycle",
      "Embedded with the growth team to prioritize features against their experimentation roadmap. Built what they would use this week, not what sounded good in a planning doc",
    ],
    designDecisions: [
      {
        title: "Dual-Write for Two Time Horizons",
        description:
          "Growth teams need two things from event data: what is happening right now, and what happened over the last 90 days. These are different query patterns with different performance requirements. Events write simultaneously to Redis for sub-second real-time dashboards and PostgreSQL for historical analysis. The pipeline handles the fan-out — consumers do not need to know where the data lives.",
        outcome:
          "Real-time dashboards update within 1 second of user action. Historical queries span 90 days without competing for the same resources.",
      },
      {
        title: "Adapter Pattern for Marketing Integrations",
        description:
          "Each third-party tool — SendGrid, Google Ads, HubSpot — sits behind a common adapter interface. Auth, rate limiting, retry logic, and error handling are shared infrastructure. Adding a new integration means implementing one adapter with one interface. The growth team requests a new tool, and it ships in days because the hard problems are already solved.",
        outcome:
          "New integrations ship in 1–2 days instead of 1–2 weeks. Code duplication across marketing tools dropped 70%.",
      },
      {
        title: "Materialized Views Over Raw Queries",
        description:
          "Event tables grow by millions of rows per week. The growth team's most common dashboard queries — DAU, conversion funnels, retention cohorts — were scanning raw tables and taking 8–12 seconds per load. At that latency, people stop checking the dashboard. We pre-computed these aggregations into materialized views on a 5-minute refresh. The data is at most 5 minutes stale. The dashboard is instant.",
        outcome:
          "Dashboard load dropped from 8–12 seconds to under 200ms. The growth team went from checking metrics once a day to checking them continuously.",
      },
    ],
    impact: [],
    stack: [
      { category: "Frontend", tools: ["React", "TypeScript", "D3.js", "Tailwind CSS"] },
      { category: "Backend", tools: ["Node.js", "PostgreSQL", "Redis"] },
      { category: "Data", tools: ["Event Pipelines", "Materialized Views", "Analytics"] },
      { category: "Integrations", tools: ["SendGrid", "Google Ads", "HubSpot", "REST APIs"] },
    ],
    images: [],
    link: { url: "#", label: "Private Repo" },
    nextProject: "archv",
  },
  {
    slug: "medvanta",
    id: "003",
    personas: ["product", "software"],
    title: "MedVanta Platform",
    subtitle: "Clinical Operations & Compliance Software",
    year: "2024 – 2025",
    role: "Software Engineer",
    status: "Shipped",
    duration: "May 2024 – July 2025",
    team: "Cross-functional (engineering + clinical)",
    layout: "newspaper",
    overview:
      "Someone tears their ACL on a Saturday. They wait until Monday to call. The office plays phone tag for two days. They see a general practitioner who refers them to an orthopaedic specialist. Another week. I built VantaStat to collapse that timeline to minutes. A patient describes their injury, uploads photos, and the system routes them to the right specialist immediately. Behind the patient-facing app, I shipped analytics dashboards for practice managers, HIPAA-compliant backend services, and workflow automation that gave back five hours of admin time per week per practice. The entire data layer is encrypted — PHI at rest and in transit, row-level access, immutable audit logging.",
    problem:
      "Orthopaedic practices run on tools that were never designed to talk to each other. Scheduling lives in one system. Patient intake in another. Compliance documentation in a third. Staff spend hours weekly on manual data entry and phone tag between systems. The patient feels this as wait time — days between injury and specialist consultation. The practice feels it as overhead — admin work that generates no clinical value. No single platform connected the patient journey from injury report to the moment a specialist reviews their case.",
    approach: [
      "Designed the patient intake flow first — in Figma, validated with clinical staff before writing code. The flow had to feel obvious to someone in pain: describe injury, upload photos, tap connect. Three steps, no account creation required",
      "Built React dashboards surfacing the metrics practice managers actually check: workload distribution across providers, patient volume trends, and compliance KPIs. Designed for daily glance use, not deep analysis",
      "Developed HIPAA-compliant backend services with AES-256 encryption at rest, TLS in transit, and database-level row security. Every access event logged for audit trails",
      "Shipped workflow automation targeting the specific admin tasks consuming the most time: appointment scheduling, intake form processing, and referral routing",
      "Integrated Twilio for SMS and voice patient communications — patients get updates without downloading an app or checking a portal",
      "Resolved production OAuth and webhook failures that were silently dropping patient intake submissions. The system looked healthy while patients were falling through the cracks",
    ],
    designDecisions: [
      {
        title: "Three Steps to a Specialist",
        description:
          "The intake flow has exactly three steps: describe the injury in plain language, upload photos of the affected area, tap 'Connect me.' No account creation. No insurance forms. No dropdown menus asking which body part hurts. The system routes to the right orthopaedic specialist based on injury type and location. Every screen added to this flow is a patient who gives up and calls the office instead.",
        outcome:
          "Patient-to-specialist connection dropped from 2–3 days to under 5 minutes. The flow completes on a phone screen without scrolling.",
      },
      {
        title: "Encryption as Infrastructure",
        description:
          "PHI protection is not a feature — it is a layer. Every field containing patient data is encrypted at rest with database-level encryption. Row-level security policies ensure clinicians access only their authorized patients. Every access event is logged immutably for HIPAA audit trails. The system does not trust the application layer to enforce compliance — the database enforces it.",
        outcome:
          "Compliance is enforced at the database layer, not the application layer, so an application bug cannot expose PHI on its own.",
      },
      {
        title: "Prototype Before Code",
        description:
          "Every screen was designed in Figma and validated with clinical end-users through interactive prototypes before engineering began. Practice managers walked through the dashboard. Front desk staff walked through intake. Surgeons walked through the patient view. Workflow issues surfaced in prototyping, not in production.",
        outcome:
          "Workflow problems surfaced in prototyping instead of production, so the shipped build matched how staff actually work.",
      },
    ],
    impact: [],
    stack: [
      { category: "Frontend", tools: ["React", "TypeScript", "Tailwind CSS"] },
      { category: "Backend", tools: ["Python", "FastAPI", "PostgreSQL"] },
      { category: "Auth & Comms", tools: ["Auth0", "Twilio", "OAuth 2.0", "Webhooks"] },
      { category: "Design", tools: ["Figma", "Prototyping", "User Research"] },
      { category: "Compliance", tools: ["HIPAA", "PHI Encryption", "Audit Logging"] },
    ],
    images: [
      {
        src: "/medvanta-hero.png",
        caption: "VantaStat. Quick access to orthopaedic specialists for pain and injury.",
      },
    ],
    link: { url: "#", label: "Private Repo" },
    nextProject: "cactus",
  },
  {
    slug: "drone-dashboard",
    id: "006",
    personas: ["hardware"],
    title: "OVERWATCH",
    subtitle: "Autonomous Swarm Ground Control System",
    year: "2025",
    role: "Solo Engineer",
    status: "Shipped",
    duration: "2025",
    team: "Solo",
    layout: "newspaper",
    overview:
      "I designed and built OVERWATCH solo: a full-stack ground control system for autonomous drone swarms — 2 to 50 vehicles, any flight controller, any protocol. The system is a monorepo with four modules: a tactical HUD (src/hud) with Leaflet.js and Canvas for real-time map rendering across four operational modes, an Electron desktop simulator (drone-sim) with React 18, Three.js, and Zustand for 3D flight visualization and physics simulation, a Python FastAPI ground control server (backend) handling 10Hz telemetry aggregation, swarm coordination, collision avoidance, geofence enforcement, and a shared protocol layer (src/shared) enforcing type-safe contracts across MAVLink 2.0 and MSP serial protocols. WebSocket broadcasts push telemetry to all connected clients. WebRTC streams sub-100ms video from onboard cameras. 76+ tests across 7 suites.",
    problem:
      "Ground control stations are built by engineers who have never watched an operator lose a drone because the battery warning was buried three tabs deep. The standard interface dumps raw telemetry into tables, scatters controls across modal dialogs, and treats a map pin as sufficient spatial awareness. Operators running a six-drone swarm are forced to context-switch between views to answer basic questions: which asset is degraded, what is its heading, can I redirect it. Beyond the interface, most GCS software only supports a single flight controller protocol and has no real swarm intelligence — no formation geometry, no collision avoidance, no automatic leader election, no geofence enforcement. The gap is not hardware. It is the entire software stack between the radio and the operator's decision.",
    approach: [
      "Architected a three-tier system: operator workstation (Tactical HUD + Drone Simulator), ground control server (FastAPI + Uvicorn async), and hardware abstraction layer (MAVSDK for MAVLink 2.0, custom async MSP parser for Betaflight/INAV) — connected to UAV fleets over 5.8GHz WiFi mesh with RFD900x radio fallback",
      "Built the Tactical HUD (src/hud) with four operational modes — Monitor, Command, Replay, Solo FPV — each reconfiguring panel layout while keeping the drone list and map as fixed spatial anchors. Leaflet.js with CARTO dark basemap for tactical rendering, Canvas API for attitude indicators, sparkline charts, and FPV OSD overlay",
      "Engineered 10Hz telemetry pipeline: hardware telemetry feeds mutable DroneState objects, aggregated into TelemetryPacket arrays (Pydantic v2 serialization), broadcast over WebSocket to all clients, with parallel alert engine checks (7 rules with per-drone cooldown suppression), O(n2) pairwise collision avoidance via haversine distance, and ray-casting geofence enforcement",
      "Implemented six formation patterns — V-Formation, Line Abreast, Column, Diamond, Orbit, Scatter — with heading-aware coordinate transforms that rotate body-frame offset vectors to WGS84 using the leader's heading, and 3-second Hermite smoothstep interpolation for formation transitions",
      "Built modified Raft consensus for automatic leader election using multi-factor weighted scoring: 30% battery, 25% GPS quality, 25% link quality, 20% formation position — battery weighted highest because leader failure from power loss is catastrophic. 1000ms heartbeat, 5000ms election timeout",
      "Designed collision avoidance with haversine great-circle distance for horizontal separation and 3D Euclidean distance check against a 5m safety bubble at 10Hz. Stress-tested at 50 drones (1,225 pair comparisons per tick) completing in under 2 seconds. Lower-altitude drone always yields",
      "Built the Electron drone simulator with React 18, Three.js, and Zustand — procedural drone geometry with animated propellers, 30Hz local physics engine with PID controllers per axis, motor mixing matrix for X-configuration, ground effect modeling, wind force simulation, and six sensor noise models (IMU, GPS, barometer, magnetometer, LiDAR, camera) with four preset levels",
      "Implemented full hardware abstraction: MAVSDK 2.0 with async UDP for PX4/ArduPilot, custom binary MSP parser with 7-state decoder and XOR checksum for Betaflight, USB auto-detection scanning VID/PID tables at 5-second intervals with automatic protocol detection across three baud rates",
      "Shipped 18 REST endpoints with JWT auth (HS256, 8hr TTL, operator/viewer roles), WebRTC video streaming via aiortc with sub-100ms latency, goggles integration bridges for DJI, HDZero, and Walksnail systems, and DVR recording with synchronized telemetry JSON export",
    ],
    designDecisions: [
      {
        title: "Spatial Hierarchy Over Feature Hierarchy",
        description:
          "Every C2 tool I audited organizes by feature: a telemetry tab, a map tab, a controls tab. This forces operators to hold a mental model of where the software hid their data. OVERWATCH organizes by spatial position. Left is always fleet state with per-drone cards showing callsign, role, color, and status. Center is always the Leaflet map with SVG triangle markers rotated by heading, 3-segment trail polylines at fading opacity, and real-time formation overlay lines. Right is always the active work context — switching between Monitor, Command, Replay, and Solo FPV only mutates this panel. The map and drone list are architecturally invariant.",
        outcome:
          "Any data point — battery cell voltage, comm latency, flight mode, mission phase, formation cohesion — is reachable in a single eye movement. Zero tabs. Zero modals. Zero context switches. Operators build spatial memory within minutes because 60% of the screen never changes.",
      },
      {
        title: "10Hz Wire Protocol as System Backbone",
        description:
          "The entire system is organized around a canonical TelemetryPacket published at 10Hz per drone — position (WGS84 with MSL and AGL altitude), attitude (roll/pitch/yaw), velocity (ground speed, vertical speed, heading), battery (voltage, current, remaining percentage), GPS (fix type, satellites, HDOP), link quality (RSSI, quality, latency), drone status (6-state priority cascade), and formation state (role, offset vector, cohesion score). Python backend uses Pydantic v2 for strict serialization. JavaScript frontend maintains byte-identical enum values and field names. The protocol enforces 'lon' in telemetry, 'lng' only in waypoint map click events — this distinction is enforced by tests.",
        outcome:
          "A single packet type drives the entire system: HUD rendering, alert evaluation, collision checks, geofence enforcement, formation tracking, database persistence, and session replay. Adding a new consumer means subscribing to the same broadcast — zero schema changes.",
      },
      {
        title: "Hardware Abstraction for Protocol Agnosticism",
        description:
          "OVERWATCH supports any flight controller through a hardware abstraction layer that bridges MAVLink 2.0 (MAVSDK async UDP for PX4/ArduPilot) and MSP binary serial (custom 7-state decoder for Betaflight/INAV). USB auto-detection scans known VID/PID tables every 5 seconds, tries MSP handshake first at three baud rates (115200, 57600, 921600), falls back to MAVLink header scanning, and maintains a connected_ports set for automatic reconnection on device reappearance. The MSP-to-NEXUS translator converts raw protocol values — RSSI from 0-1023 to normalized 0-100, altitude from centimeters to meters, battery percentage from voltage curves.",
        outcome:
          "Operators plug in any flight controller over USB and OVERWATCH detects the protocol, configures the connection, and starts streaming telemetry — PX4, ArduPilot, Betaflight, or INAV, same interface, same commands, same data.",
      },
      {
        title: "Physics-Based Simulation for Development Without Hardware",
        description:
          "The Electron simulator runs a 30Hz physics engine with real aerodynamic modeling: all-up weight calculation from component selection, thrust-to-weight ratio, hover throttle derivation, max speed from drag equation (air density 1.225 kg/m3, Cd 1.2), ground effect multiplier within 3x propeller diameter, wind force with turbulence harmonics, and LiPo discharge curves modeling the flat-middle steep-drop-off characteristic. PID controllers run per-axis with motor mixing for X-configuration. Six sensor noise models — IMU (gyro noise density, bias instability), GPS (dropout bursts, multipath), barometer (drift rate, temperature sensitivity), magnetometer (hard/soft iron, EMI), LiDAR (distance-dependent noise), camera (motion blur, rolling shutter) — each with four presets from perfect to failing.",
        outcome:
          "Full swarm operations development and testing without a single real drone. The simulator produces telemetry indistinguishable from hardware at the wire protocol level — same packets, same timing, same edge cases.",
      },
    ],
    impact: [
      {
        metric: "Tests",
        value: "3,800",
        description: "Collected by pytest across the core, sensor, and vision services",
        evidenceId: "dronenexus.tests.collected",
      },
      {
        metric: "Test files",
        value: "221",
        description: "Under services/, covering fusion, siting, terrain, protocol, and vision",
        evidenceId: "dronenexus.tests.files",
      },
      {
        metric: "Core",
        value: "77,616",
        description: "Lines of Python in services/core alone",
        evidenceId: "dronenexus.core.lines",
      },
    ],
    stack: [
      { category: "Tactical HUD", tools: ["HTML", "CSS", "JavaScript", "Leaflet.js", "Canvas API", "CARTO Dark Basemap"] },
      { category: "Simulator", tools: ["Electron 29", "React 18", "TypeScript", "Three.js", "Zustand", "@react-three/fiber"] },
      { category: "Backend", tools: ["Python 3", "FastAPI", "Uvicorn", "Pydantic v2", "SQLite (WAL)", "aiosqlite"] },
      { category: "Protocols", tools: ["MAVSDK (MAVLink 2.0)", "MSP Serial Parser", "WebSocket", "WebRTC (aiortc)", "JWT (HS256)"] },
      { category: "Algorithms", tools: ["Raft Consensus", "Haversine Collision", "Ray-Cast Geofence", "PID Control", "Hermite Smoothstep"] },
    ],
    images: [
      {
        src: "/drone-dashboard.webp",
        caption: "V1 — DroneNexus. React swarm dashboard with Mapbox, six fixed drones, formation controls.",
      },
    ],
    versionImages: {
      v1: {
        src: "/drone-dashboard.webp",
        caption: "V1 — DroneNexus. React swarm dashboard with Mapbox, six fixed drones, formation controls.",
      },
      v2: {
        src: "/drone-dashboard-v2.png",
        caption: "V2 — OVERWATCH. Three-tier ground control system: tactical HUD with 4 operational modes, FastAPI backend with 10Hz telemetry aggregation, and hardware abstraction across MAVLink and MSP protocols. Swarm coordination, collision avoidance, geofence enforcement, formation geometry, and leader election — all real-time.",
      },
      changelog: [
        "Built full ground control server: FastAPI + Uvicorn async backend with 10Hz telemetry aggregation, 18 REST endpoints, JWT auth, and WebSocket broadcast to all connected clients",
        "Implemented swarm intelligence: modified Raft leader election, six formation patterns with heading-aware coordinate transforms, 3-second Hermite smoothstep transitions, and real-time cohesion scoring",
        "Engineered collision avoidance with haversine great-circle distance and 3D safety bubble enforcement at 10Hz — stress-tested at 50 drones (1,225 pairwise checks per tick)",
        "Built hardware abstraction layer: MAVSDK 2.0 for PX4/ArduPilot, custom MSP binary parser for Betaflight/INAV, USB auto-detection with VID/PID scanning and automatic protocol negotiation",
        "Shipped Electron drone simulator with Three.js 3D visualization, 30Hz physics engine, PID controllers, motor mixing, ground effect, wind simulation, and six sensor noise models",
        "Added WebRTC video streaming (aiortc, sub-100ms latency), goggles integration for DJI/HDZero/Walksnail, Canvas OSD overlay with full flight telemetry, and DVR recording with synchronized telemetry export",
        "76+ tests across 7 suites covering formation geometry, collision avoidance, geofence, wire protocol, MSP codec, stress/performance benchmarks, and full API integration",
      ],
    },
    link: { url: "https://droneoverwatch.vercel.app/", label: "View Live" },
    nextProject: "drone-virtual-env",
  },
  {
    slug: "drone-virtual-env",
    id: "007",
    personas: ["hardware"],
    title: "DroneNexus",
    subtitle: "Ground Control Station & Virtual Environment",
    year: "2025",
    role: "Full-Stack Developer",
    status: "Shipped",
    duration: "2025",
    team: "Solo",
    layout: "newspaper",
    overview:
      "Configuring drone hardware is currently a spreadsheet exercise. Operators cross-reference spec sheets, run thrust calculations by hand, and discover incompatibilities after the build is assembled. I built a virtual environment where every component — frame, motors, propellers, power system, electronics, sensors, thermal — lives in a single interface with a 3D preview and real-time performance calculations. Swap a motor and instantly see how it changes thrust-to-weight ratio, max flight time, and hover power draw. The system catches incompatibilities before anything gets bolted together.",
    problem:
      "Hardware configuration for multi-rotor platforms involves six interdependent subsystems. Changing the motor changes the prop clearance, the power draw, the thrust curve, the flight envelope, and the thermal profile. Operators currently manage this across separate spec sheets, Excel calculators, and manufacturer tools that do not share data. Incompatibilities surface during assembly or, worse, during flight. There is no unified environment where an operator can see how one component choice ripples across every performance metric.",
    approach: [
      "Built a 3D equipment preview in Three.js — click to select, scroll to zoom, drag to rotate. Operators see the physical platform update as they swap components",
      "Designed an equipment manifest tree spanning six subsystem categories: Frame, Motors & Props, Power System, Electronics, Sensors, Thermal. Each category exposes every configurable parameter",
      "Implemented real-time performance calculations that recompute on every component change: all-up weight, thrust-to-weight ratio, max flight time, max payload, max speed, hover power, energy consumption, and hover throttle percentage",
      "Added sensor noise modeling for simulation-grade parameter estimation — operators can preview sensor behavior before flight",
      "Built force disposition view for multi-drone tactical planning — see the full fleet, not just one platform",
    ],
    designDecisions: [
      {
        title: "Dark UI with Semantic Color",
        description:
          "The interface uses a dark theme with green accent typography consistent with military ground control conventions. The aesthetic is not decorative — operators in this domain expect monospace fonts, status bars, and nominal/degraded/critical state indicators. The visual language matches the operational context.",
        outcome:
          "The interface reads as a professional GCS tool. Operators familiar with defense and aerospace systems navigate it without onboarding.",
      },
      {
        title: "Every Change Recalculates Everything",
        description:
          "Component interdependencies are the core complexity of hardware configuration. Swapping a motor changes thrust, power draw, flight time, payload capacity, and thermal profile simultaneously. The system recalculates all eight performance metrics on every change so operators never see stale numbers.",
        outcome:
          "Real-time feedback: 726g all-up weight, 7.16:1 thrust-to-weight ratio, 6m 12s max flight time — all updating live as components change.",
      },
    ],
    impact: [],
    stack: [
      { category: "Frontend", tools: ["React", "TypeScript", "Tailwind CSS"] },
      { category: "3D", tools: ["Three.js", "WebGL", "3D Model Rendering"] },
      { category: "Simulation", tools: ["Physics Calculations", "Sensor Noise Models", "Performance Modeling"] },
      { category: "Architecture", tools: ["Modular Panels", "Real-Time State", "Component Trees"] },
    ],
    images: [
      {
        src: "/drone-virtual-env.webp",
        caption: "GCS equipment configuration. 3D preview with real-time performance metrics.",
      },
    ],
    link: { url: "https://github.com/NyXkim5/DroneNexus", label: "View on GitHub" },
    nextProject: "va-gov-mvp",
  },
  {
    slug: "va-gov-mvp",
    id: "008",
    personas: ["product", "business"],
    title: "VA.gov MVP",
    subtitle: "Conceptual Redesign for Veterans Affairs Portal",
    year: "2025",
    role: "Full-Stack Developer & Designer",
    status: "Prototype. RFI Bid.",
    duration: "2025",
    team: "Solo",
    layout: "newspaper",
    overview:
      "Veterans leave billions in unclaimed benefits every year — not because they do not qualify, but because the information is buried across disconnected pages on a portal that was never designed around their actual tasks. I audited the most common veteran workflows on VA.gov and found that four metrics drive the majority of return visits: payment status, claim progress, disability rating, and GI Bill balance. I built a unified dashboard prototype for an RFI bid that puts all four on one screen, added AI-powered benefit discovery to surface entitlements veterans do not know they qualify for, and designed the entire interface within USWDS and WCAG 2.1 AA constraints.",
    problem:
      "VA.gov serves millions of veterans through a portal that reflects the VA's organizational structure, not the veteran's mental model. Checking payment status requires navigating to one section. Filing a claim lives in another. Prescription management in a third. The result: veterans miss filing deadlines because the notification was on a page they never visit. They leave disability rating increases on the table because no one told them they qualify. Every extra click between a veteran and their information is an opportunity for them to give up — and many do.",
    approach: [
      "Designed a unified dashboard showing the four metrics veterans check most: monthly benefits ($2,847), active claims (2), disability rating (70%), and GI Bill balance (14 months remaining). All visible without scrolling",
      "Built an urgent notification system for time-sensitive alerts — payment delays, claim status changes, approaching deadlines. The things that cost veterans money when missed",
      "Replaced nested navigation with a quick-action grid: Claims, Appeals, Appointments, Prescriptions, Payments, Messages, Travel Pay, Dependents, Direct Deposit, Letters. One click to any service",
      "Implemented AI-powered Smart Insights that scan a veteran's profile and surface specific actions: potential rating increases, unclaimed benefits, upcoming filing deadlines. Proactive, not passive",
      "Built guided tour for first-time users — veterans who distrust government technology need a reason to stay past the first screen",
      "Designed within WCAG 2.1 AA constraints: proper contrast ratios, full keyboard navigation, screen reader support. Accessibility is not a feature for a government portal — it is a requirement",
    ],
    designDecisions: [
      {
        title: "Four Metrics, Not Forty",
        description:
          "The existing VA.gov spreads veteran data across dozens of pages because it mirrors the VA's internal org chart, not the veteran's mental model. I audited return-visit behavior and found four actions drive the majority of traffic: check payment status, track claims, verify disability rating, confirm GI Bill balance. I put all four on one screen. The design discipline is what gets left out — forty metrics is easy, four is a decision.",
        outcome:
          "Veterans see their complete benefits picture in under 3 seconds. Zero navigation required for the tasks that bring them back.",
      },
      {
        title: "AI Benefit Discovery",
        description:
          "Veterans leave billions in unclaimed benefits every year because they do not know what they qualify for. The current portal waits for the veteran to ask the right question. I added an AI module that inverts the interaction — it scans the veteran's profile and proactively surfaces specific actions: potential rating increases, unclaimed benefits, approaching filing deadlines. This is the highest-risk feature in the prototype. If the recommendations are wrong, trust is destroyed permanently.",
        outcome:
          "In prototype testing, users engaged with AI recommendations before any other dashboard element. The proactive pattern changed the interaction from pull to push.",
      },
      {
        title: "Quick Actions Over Deep Navigation",
        description:
          "The current VA.gov requires veterans to navigate nested menus organized by VA department — a structure that means nothing to someone trying to refill a prescription. I replaced the navigation with 10 quick-action cards organized by task: Claims, Appeals, Appointments, Prescriptions, Payments, Messages, Travel Pay, Dependents, Direct Deposit, Letters. The veteran's intent, not the VA's org chart, determines the layout.",
        outcome:
          "Average clicks to reach a service dropped from 4–5 to 1. Veterans no longer need to understand VA organizational structure to find what they need.",
      },
    ],
    impact: [],
    stack: [
      { category: "Frontend", tools: ["Next.js", "TypeScript", "Tailwind CSS"] },
      { category: "Design System", tools: ["USWDS", "Accessibility", "Responsive Design"] },
      { category: "AI Features", tools: ["Smart Insights", "Profile Analysis", "Recommendations"] },
      { category: "Deployment", tools: ["Vercel", "Edge Functions", "Analytics"] },
    ],
    images: [
      {
        src: "/va-gov-mvp.webp",
        caption: "VA.gov MVP. Unified veteran benefits dashboard with smart insights.",
      },
    ],
    reflections: {
      worked: [
        "Dashboard-first design. Committing to four metrics forced every other element to justify its existence. The constraint produced clarity.",
        "AI-powered recommendations drew the most engagement in prototype testing. Proactive surfaces outperformed passive data display by a wide margin. Veterans want the system to tell them what to do, not make them figure it out.",
        "USWDS compliance was a design accelerator, not a constraint. The government design system eliminated visual decisions and kept focus on information architecture — the part that actually matters.",
      ],
      different: [
        "Tested with actual veterans from the start. The prototype was validated with general users. Veterans carry institutional distrust that general users do not — the onboarding, tone, and error handling all need to account for someone who expects the system to fail.",
        "Built the claims filing flow, not just the dashboard. The dashboard shows status. The real pain is in filing and appeals — simplifying that process would have delivered more value than any amount of dashboard polish.",
        "Scoped the AI module to one use case. Smart Insights tries to do too much. Shipping deadline alerts alone would have proven value faster and built the trust needed to expand scope.",
      ],
    },
    link: { url: "https://va-gov-mvp-v1.vercel.app/", label: "View Live Demo" },
    nextProject: "drone-dashboard",
  },
];

export function findStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((s) => s.slug === slug);
}

export function studiesFor(persona: PersonaKey): CaseStudy[] {
  return caseStudies.filter((s) => s.personas.includes(persona));
}
