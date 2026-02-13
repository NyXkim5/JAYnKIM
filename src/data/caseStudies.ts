export interface CaseStudy {
  slug: string;
  id: string;
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
  }[];
  stack: { category: string; tools: string[] }[];
  images: { src: string; caption: string }[];
  video?: { src: string; caption: string };
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
    title: "Optum",
    subtitle: "Production ML for Healthcare at UnitedHealth Group",
    year: "2026",
    role: "Software Engineer, AI/ML",
    status: "Current",
    duration: "Feb 2026 – Present",
    team: "Enterprise AI/ML Team",
    layout: "newspaper",
    overview:
      "Building production ML pipelines at UnitedHealth Group, the largest healthcare company in the US. Owning model deployment, monitoring, and data processing across AWS and Kubernetes. The systems I work on process millions of healthcare records daily to flag care gaps, automate claims review, and surface clinical insights.",
    problem:
      "Healthcare data is fragmented. Clinical records, claims, pharmacy data, and lab results live in separate systems. Manual review dominates: nurses document by hand, claims require human approval, and care gaps go undetected until patients show up in the ER. The challenge is building ML systems that run reliably at this scale while meeting HIPAA and SOC 2 requirements.",
    approach: [
      "Own end-to-end ML pipeline development: data ingestion, feature engineering, model training, deployment, and monitoring",
      "Deploy models to production on AWS with Kubernetes orchestration and automated rollback on performance degradation",
      "Build data processing jobs handling millions of healthcare records with strict SLA requirements",
      "Implement model observability: drift detection, prediction confidence tracking, and alerting for production anomalies",
      "Work with data scientists to translate research models into production-grade services with latency and throughput guarantees",
      "Maintain HIPAA compliance across all data pipelines with encryption, access controls, and audit logging",
    ],
    designDecisions: [
      {
        title: "Pipeline-First ML Architecture",
        description:
          "Each ML model runs inside a standardized pipeline: data validation, feature computation, inference, post-processing, and result storage. Pipelines are versioned and reproducible. Failed stages retry with exponential backoff. Every prediction is logged with input features for debugging.",
        outcome:
          "Production models run with 99.9%+ uptime. Failed predictions are automatically retried and flagged for review.",
      },
      {
        title: "Healthcare Compliance by Default",
        description:
          "Every data access is authenticated and logged. PHI fields are encrypted at rest and in transit. Row-level security ensures teams only access data they are authorized for. Audit trails are immutable and retained for 7 years.",
        outcome:
          "Zero compliance incidents. All pipelines pass automated HIPAA audit checks on every deployment.",
      },
    ],
    impact: [
      {
        metric: "Scale",
        value: "150M+",
        description: "Patients served by UnitedHealth Group healthcare services",
      },
      {
        metric: "Records",
        value: "Millions",
        description: "Healthcare records processed daily through ML pipelines",
      },
      {
        metric: "Uptime",
        value: "99.9%+",
        description: "Production model availability with automated failover",
      },
    ],
    stack: [
      { category: "Languages", tools: ["Python", "SQL"] },
      { category: "ML/AI", tools: ["PyTorch", "Scikit-learn", "MLflow", "Feature Stores"] },
      { category: "Infrastructure", tools: ["AWS", "Kubernetes", "Docker", "Terraform"] },
      { category: "Data", tools: ["Spark", "Airflow", "PostgreSQL", "S3"] },
      { category: "Compliance", tools: ["HIPAA", "SOC 2", "Encryption", "Audit Logging"] },
    ],
    images: [],
    link: { url: "#", label: "Private Repo" },
    nextProject: "medvanta",
  },
  {
    slug: "archv",
    id: "001",
    title: "Archv",
    subtitle: "AI-Powered Document Review for Regulated Industries",
    year: "2025",
    role: "CEO & Co-Founder",
    status: "Active",
    duration: "2025 – Present",
    team: "3 engineers, 1 designer",
    layout: "newspaper",
    overview:
      "Archv automates compliance document review for law students, healthcare orgs, and government agencies. The platform uses a RAG pipeline on NVIDIA GPUs to classify, extract, and cite from legal documents. We built HIPAA and SOC 2 compliant infrastructure on a pre-seed budget with a 4-person team, signed paying law student users in Q1, and cut document review time by 71%.",
    problem:
      "Law students spend 60-70% of their study and research time reviewing documents manually. A single missed compliance issue in practice leads to sanctions, malpractice claims, or fines exceeding $10M. Students who tried generalist AI tools found the outputs unusable: hallucinated clauses, no source citations, no audit trail. One professor told us during user research, 'One wrong answer and I will never use it again.' No product combined fast AI inference with the data controls and compliance infrastructure these users require.",
    approach: [
      "Ran 40+ user interviews with attorneys, paralegals, and compliance officers. Shadowed 3 attorneys during live document review sessions to map workflow pain points",
      "Evaluated three AI architectures: fine-tuned LLM ($500K+, not updatable), ChatGPT API wrapper (no compliance, hallucinations), RAG with vector database (built-in citations, updatable, cost-effective). Selected RAG",
      "Built a microservices architecture to isolate document ingestion, ML inference, user management, and audit logging",
      "Deployed ML models on NVIDIA GPUs via CUDA for document classification and entity extraction",
      "Encrypted all data with AES-256 at rest and TLS 1.3 in transit. Logged every data access for audit trails",
      "Built RESTful APIs with JWT auth and role-based access control (RBAC) mapped to compliance roles",
      "Shipped weekly updates to paying law student users. Monthly pilot check-ins caught issues before they became product debt",
    ],
    designDecisions: [
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
          "Passed HIPAA technical safeguard requirements. Clients approved deployment after security review with zero findings.",
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
        metric: "Review Time",
        value: "-71%",
        description: "Document review dropped from 4.5 hours to 1.3 hours per session",
      },
      {
        metric: "Verification",
        value: "-82%",
        description: "AI output verification dropped from 45 minutes to 8 minutes per query",
      },
      {
        metric: "Retention",
        value: "100%",
        description: "3-month customer retention across all pilot users",
      },
      {
        metric: "Latency",
        value: "<2s",
        description: "Document classification on 50+ page legal files",
      },
      {
        metric: "NVIDIA Inception",
        value: "Admitted",
        description: "Accepted into NVIDIA's accelerator for AI startups",
      },
      {
        metric: "Revenue",
        value: "Q1",
        description: "Signed paying law student users in the first quarter",
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
        "Built mobile from day one. Law students review documents between classes constantly. We deprioritized mobile and it should have shipped in V1.",
        "Invested more in onboarding. The first-run experience was weak. New users needed hand-holding to see the value, which added 2 weeks to every pilot.",
        "Ran pricing research before launch. We guessed on pricing. Conjoint analysis upfront would have shortened the sales cycle.",
      ],
    },
    brandPhilosophy: {
      intro: "Archv's visual identity lives in tension. The product interface is stripped down: black text, white space, sharp edges. No decoration. Every pixel earns its place or gets removed. But the brand mark is the opposite. The logo is a burst of color: iridescent ribbons, overlapping circles, a rainbow wordmark. It is playful on purpose. Archv handles compliance documents, regulatory filings, legal risk. The work is serious. The brand says: we make serious work feel approachable. The color in the logo represents the breadth of what Archv touches: law, healthcare, government, finance. Each domain has its own weight. The logo holds all of them together in one playful mark. The interface stays minimal so the content speaks. The brand stays colorful so the company feels human.",
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
    title: "Cactus",
    subtitle: "Event Ingestion and Growth Analytics Platform",
    year: "2025",
    role: "Software Engineer",
    status: "Active",
    duration: "2025 – Present",
    team: "Engineering Team",
    layout: "newspaper",
    overview:
      "Built the event ingestion pipeline and frontend dashboards for a growth platform. The pipeline processes user behavior events in real time, feeds them into analytics views, and powers A/B testing infrastructure. I also integrated third-party marketing APIs for campaign automation.",
    problem:
      "The growth team had no unified view of user behavior. Event data was scattered across multiple tools. Running A/B tests required manual data exports and spreadsheet analysis. Marketing integrations (email, ads, CRM) each had separate codebases with no shared interface. The team needed a single platform to track events, run experiments, and manage campaigns.",
    approach: [
      "Built an event ingestion pipeline that captures user actions, enriches them with session metadata, and writes to PostgreSQL and Redis for real-time and historical queries",
      "Developed React dashboards with D3.js charts showing conversion funnels, retention curves, and experiment results",
      "Implemented A/B testing infrastructure: experiment definition, variant assignment, and statistical significance calculation",
      "Created a unified API integration layer abstracting email (SendGrid), ads (Google Ads), and CRM (HubSpot) behind a consistent interface",
      "Optimized PostgreSQL queries for analytics workloads. Added materialized views for frequently accessed metrics",
      "Worked directly with the growth team to prioritize features based on their experimentation roadmap",
    ],
    designDecisions: [
      {
        title: "Event-Driven Pipeline Architecture",
        description:
          "User events flow through a three-stage pipeline: capture, enrichment, and storage. Capture collects raw events via a lightweight SDK. Enrichment adds session data, geo, and device info. Storage writes to both PostgreSQL (historical) and Redis (real-time).",
        outcome:
          "Sub-second event processing. Growth team sees live user activity within 1 second of it happening.",
      },
      {
        title: "Unified Integration Layer",
        description:
          "Each third-party marketing tool (SendGrid, Google Ads, HubSpot) sits behind a common adapter interface. Adding a new integration means implementing one adapter. Auth, rate limiting, and error handling are shared.",
        outcome:
          "New integrations ship in 1-2 days instead of 1-2 weeks. Reduced code duplication across marketing tools by 70%.",
      },
      {
        title: "Materialized Views for Analytics",
        description:
          "Raw event tables grow fast. Running conversion funnel queries directly against them added 8-12 seconds to every dashboard load. We pre-computed the most common aggregations (daily active users, funnel step counts, retention cohorts) into materialized views refreshed on a 5-minute interval.",
        outcome:
          "Dashboard queries dropped from 8-12 seconds to under 200ms. Growth team stopped context-switching while waiting for data.",
      },
    ],
    impact: [
      {
        metric: "Event Latency",
        value: "<1s",
        description: "Real-time event processing from capture to dashboard display",
      },
      {
        metric: "Query Speed",
        value: "60x",
        description: "Dashboard queries dropped from 8-12s to <200ms with materialized views",
      },
      {
        metric: "Integration Speed",
        value: "1-2 days",
        description: "Time to add a new third-party marketing integration",
      },
      {
        metric: "A/B Testing",
        value: "Shipped",
        description: "Full experimentation infrastructure with statistical significance",
      },
    ],
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
    title: "MedVanta Platform",
    subtitle: "Clinical Operations & Compliance Software",
    year: "2024",
    role: "Software Engineer",
    status: "Shipped",
    duration: "2023 – 2024",
    team: "Cross-functional (engineering + clinical)",
    layout: "newspaper",
    overview:
      "Built VantaStat, a patient-facing mobile app that connects orthopaedic injury patients to specialists in minutes. Designed and shipped analytics dashboards, HIPAA-compliant backend services, and workflow automation that saved practices ~5 hours of admin time per week. All PHI encrypted at rest and in transit.",
    problem:
      "Orthopaedic practices run on fragmented tools. Scheduling lives in one system. Patient intake lives in another. Compliance docs sit in a third. Staff spend hours each week on manual data entry and phone tag. Patients wait days to reach a specialist. No single platform connected the patient journey from injury report to specialist consultation.",
    approach: [
      "Built React dashboards surfacing workload distribution, patient volumes, and compliance KPIs across practices",
      "Developed secure backend services handling PHI with AES-256 encryption and database-level row security",
      "Designed patient intake flow in Figma. Users describe their injury, upload photos, and get matched to a specialist",
      "Shipped workflow automation that eliminated ~5 hours of weekly admin tasks per practice",
      "Integrated Twilio for SMS/voice patient communications and Auth0 for identity management",
      "Debugged and resolved OAuth and webhook failures in production",
    ],
    designDecisions: [
      {
        title: "Mobile-First Patient Intake",
        description:
          "Patients open the app, describe their injury in plain language, upload photos of the affected area, and tap 'Connect me.' The system routes them to the right orthopaedic specialist based on injury type and location.",
        outcome:
          "Reduced time from injury report to specialist connection from days to minutes.",
      },
      {
        title: "Encryption-First Data Layer",
        description:
          "Every PHI field encrypted at rest using database-level encryption. Row-level security policies ensure users access only their authorized data. Every access event logged for HIPAA audit trails.",
        outcome:
          "Zero PHI exposure incidents. Passed all compliance audits during the engagement.",
      },
      {
        title: "Figma-Driven Development",
        description:
          "Designed full UI/UX mockups before writing code. Validated flows with clinical end-users through interactive prototypes. Caught workflow issues before a single line shipped.",
        outcome:
          "Clinical staff feedback shaped the final product directly. Practice managers adopted the platform within the first week.",
      },
    ],
    impact: [
      {
        metric: "Admin Time",
        value: "~5hrs",
        description: "Saved per week per practice through workflow automation",
      },
      {
        metric: "Adoption",
        value: "1 week",
        description: "Full adoption by practice managers after launch",
      },
      {
        metric: "PHI Incidents",
        value: "Zero",
        description: "No data exposure incidents throughout the engagement",
      },
      {
        metric: "Patient Flow",
        value: "<5 min",
        description: "Time from injury report to specialist connection, down from 2-3 days",
      },
    ],
    stack: [
      { category: "Frontend", tools: ["React", "TypeScript", "Tailwind CSS"] },
      { category: "Backend", tools: ["Python", "FastAPI", "PostgreSQL"] },
      { category: "Auth & Comms", tools: ["Auth0", "Twilio", "OAuth 2.0", "Webhooks"] },
      { category: "Design", tools: ["Figma", "Prototyping", "User Research"] },
      { category: "Compliance", tools: ["HIPAA", "PHI Encryption", "Audit Logging"] },
    ],
    images: [
      {
        src: "/medvanta-app.webp",
        caption: "VantaStat. Quick access to orthopaedic specialists for pain and injury.",
      },
      {
        src: "/medvanta-intake.webp",
        caption: "Patient intake flow. Describe symptoms, upload photos, connect to a specialist.",
      },
    ],
    link: { url: "#", label: "Private Repo" },
    nextProject: "cactus",
  },
  {
    slug: "drone-dashboard",
    id: "006",
    title: "DroneNexus",
    subtitle: "Real-Time Drone Swarm Management Dashboard",
    year: "2025",
    role: "Full-Stack Developer",
    status: "Shipped",
    duration: "2025",
    team: "Solo",
    layout: "newspaper",
    overview:
      "Built a real-time drone swarm management dashboard for commanding up to 6 autonomous drones simultaneously. Features live map visualization with waypoint navigation, formation controls (V-Formation, Line, Diamond), swarm health monitoring, and a full command center with telemetry data for altitude, speed, and battery levels.",
    problem:
      "Managing multiple autonomous drones requires operators to monitor dozens of telemetry streams, coordinate flight paths, and respond to anomalies in real time. Existing ground control software is built for single-drone operations and lacks the situational awareness needed for swarm coordination. Operators need a unified interface that surfaces critical data without overwhelming them.",
    approach: [
      "Designed a three-panel layout: drone list (left), live map (center), command center (right) for optimal operator workflow",
      "Built real-time telemetry streaming for altitude, speed, battery, and GPS position across all drones",
      "Implemented waypoint mission planning with execute, loiter, orbit, and RTL (Return to Launch) commands",
      "Created formation control system supporting V-Formation, Line, Diamond, and custom configurations",
      "Added swarm-level metrics: health score, average altitude, network latency, and mesh network status",
      "Built event logging with timestamped entries for all navigation, sensor, and command events",
    ],
    designDecisions: [
      {
        title: "Three-Panel Operator Layout",
        description:
          "Split the interface into drone roster (left), live map (center), and command center (right). This mirrors how operators naturally scan: check fleet status, verify positions on map, then issue commands.",
        outcome:
          "Operators can monitor all drones and issue commands without switching views or losing situational awareness.",
      },
      {
        title: "Real-Time Swarm Telemetry",
        description:
          "Each drone streams altitude, speed, battery, and position data. Swarm-level aggregates (health score, average altitude, network latency) give operators a high-level pulse without checking individual drones.",
        outcome:
          "98% swarm health visibility with 27ms network latency for responsive command execution.",
      },
    ],
    impact: [
      {
        metric: "Drones",
        value: "6",
        description: "Simultaneous drone management with individual and swarm controls",
      },
      {
        metric: "Swarm Health",
        value: "98%",
        description: "Real-time swarm cohesion and health monitoring",
      },
      {
        metric: "Latency",
        value: "27ms",
        description: "Network latency for real-time command execution",
      },
    ],
    stack: [
      { category: "Frontend", tools: ["React", "TypeScript", "Tailwind CSS"] },
      { category: "Mapping", tools: ["Mapbox", "Real-Time GPS", "Waypoint Engine"] },
      { category: "Data", tools: ["WebSocket", "Telemetry Streams", "Event Logging"] },
      { category: "Controls", tools: ["Formation Algorithms", "MAVLink", "Mission Planning"] },
    ],
    images: [
      {
        src: "/drone-dashboard.webp",
        caption: "Swarm dashboard. Real-time map with 6 active drones in V-Formation.",
      },
    ],
    link: { url: "https://github.com/NyXkim5/DroneNexus", label: "View on GitHub" },
    nextProject: "drone-virtual-env",
  },
  {
    slug: "drone-virtual-env",
    id: "007",
    title: "DroneNexus",
    subtitle: "Ground Control Station & Virtual Environment",
    year: "2025",
    role: "Full-Stack Developer",
    status: "Shipped",
    duration: "2025",
    team: "Solo",
    layout: "newspaper",
    overview:
      "Built a Ground Control Station (GCS) with 3D equipment preview, sensor noise modeling, flight operations management, and force disposition modules. The virtual environment lets operators configure drone hardware (frame, motors, propellers, power systems, electronics, sensors, thermal components) with real-time compatibility checks and performance calculations.",
    problem:
      "Drone operators need to configure and validate hardware setups before flight. Current tools require switching between spec sheets, calculators, and separate software for each subsystem. There's no unified environment where operators can preview equipment in 3D, check compatibility, and see how component choices affect flight performance metrics like thrust-to-weight ratio, max speed, and flight time.",
    approach: [
      "Built a 3D equipment preview with click-to-select, scroll-to-zoom, and drag-to-rotate interaction",
      "Created an equipment manifest tree with categories: Frame, Motors & Props, Power System, Electronics, Sensors, Thermal",
      "Implemented real-time performance calculations: all-up weight, thrust-to-weight ratio, max flight time, max payload, max speed, hover power, energy, and hover throttle",
      "Added sensor noise modeling module for realistic simulation parameters",
      "Built flight operations panel for mission planning and execution",
      "Designed force disposition view for multi-drone tactical planning",
    ],
    designDecisions: [
      {
        title: "Military-Grade HUD Aesthetic",
        description:
          "Used a dark theme with green accent typography mimicking military ground control interfaces. Monospace fonts, status bars, and system nominal indicators create an authentic operator experience.",
        outcome:
          "Professional GCS interface that aligns with defense and aerospace industry expectations.",
      },
      {
        title: "Real-Time Performance Calculations",
        description:
          "Every component change instantly recalculates all performance metrics: weight, thrust ratio, flight time, payload capacity, and power draw. Operators see the impact of each hardware choice immediately.",
        outcome:
          "726g all-up weight, 7.16:1 thrust-to-weight (Sport), 6m 12s max flight time displayed in real-time.",
      },
    ],
    impact: [
      {
        metric: "Components",
        value: "6",
        description: "Major subsystem categories with full configuration trees",
      },
      {
        metric: "Metrics",
        value: "8+",
        description: "Real-time performance calculations updated on every change",
      },
      {
        metric: "Status",
        value: "Nominal",
        description: "All systems compatibility checking with live diagnostics",
      },
    ],
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
    title: "VA.gov MVP",
    subtitle: "Conceptual Redesign for Veterans Affairs Portal",
    year: "2025",
    role: "Full-Stack Developer & Designer",
    status: "Prototype. RFI Bid.",
    duration: "2025",
    team: "Solo",
    layout: "newspaper",
    overview:
      "Built a conceptual MVP redesign of VA.gov for an RFI bid response. The prototype demonstrates a modernized veteran portal with a unified benefits dashboard, claims tracking, disability rating overview, GI Bill entitlement status, and AI-powered smart insights. Accessibility-first design with USWDS compliance.",
    problem:
      "VA.gov serves millions of veterans but the current experience is fragmented. Veterans must navigate between disconnected systems to check benefits, file claims, manage prescriptions, and access records. Critical information like payment delays, claim status changes, and benefit eligibility updates are buried or require multiple clicks. Veterans deserve a single, intuitive dashboard that surfaces what matters most.",
    approach: [
      "Designed a unified dashboard showing monthly benefits ($2,847), active claims (2), disability rating (70%), and GI Bill status (14 months remaining) at a glance",
      "Built urgent notification system for time-sensitive alerts like payment delays",
      "Created quick-action grid: Claims, Appeals, Appointments, Prescriptions, Payments, Messages, Travel Pay, Dependents, Direct Deposit, Letters",
      "Implemented AI-powered Smart Insights with personalized recommendations based on veteran profile",
      "Added guided tour functionality for first-time users",
      "Ensured WCAG 2.1 AA accessibility compliance with proper contrast, focus management, and screen reader support",
    ],
    designDecisions: [
      {
        title: "Dashboard-First Information Architecture",
        description:
          "Replaced the existing multi-page navigation with a single dashboard that surfaces the 4 most critical data points immediately: benefits amount, active claims, disability rating, and education entitlement.",
        outcome:
          "Veterans can see their complete benefits picture in under 3 seconds without navigating away from the landing page.",
      },
      {
        title: "AI-Powered Smart Insights",
        description:
          "Added a beta Smart Insights section that uses AI to analyze veteran profiles and surface personalized recommendations: potential disability rating increases, unclaimed benefits, and upcoming deadline reminders.",
        outcome:
          "Demonstrates how AI can proactively help veterans maximize their benefits without requiring them to search for information.",
      },
    ],
    impact: [
      {
        metric: "Quick Actions",
        value: "10",
        description: "One-click access to the most common veteran services",
      },
      {
        metric: "Key Metrics",
        value: "4",
        description: "Benefits, claims, disability, and education status visible at a glance",
      },
      {
        metric: "Accessibility",
        value: "AA",
        description: "WCAG 2.1 AA compliant with full keyboard navigation and screen reader support",
      },
    ],
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
    link: { url: "https://va-gov-mvp-v1.vercel.app/", label: "View Live Demo" },
    nextProject: "drone-dashboard",
  },
];

export function findStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((s) => s.slug === slug);
}
