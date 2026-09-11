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
    slug: "pantheon",
    id: "009",
    personas: ["projects"],
    title: "Pantheon",
    subtitle: "Adopting open-source sensing, then wiring it into the live system",
    year: "2026",
    role: "Solo Engineer",
    status: "In progress",
    duration: "Sept 2026",
    team: "Solo, with an agent team",
    layout: "newspaper",
    overview:
      "Aeacus is a counter-UAS command and control platform. Its engagement model is BULWARK and its C2 surface is OVERWATCH. I ran a discovery sweep over 133 open-source drone, counter-UAS and defense-intel repositories, reading stars, last push and license straight from the GitHub API rather than from memory, then filtered them by license because the product ships to people who audit dependencies. Ten upstream repos became nine private mirrors, each named after a Greek figure, each carrying an upstream record and a proprietary adapter package. One of them, a mirror of a UK defense lab's Stone Soup tracking framework, went head to head with the tracker I had already written. Then I built the loop that had never existed: a sensor plan, a pump that merges sensor streams and ticks the tracker, and a broadcaster that puts fused tracks on the map and sends Cursor on Target to ATAK.",
    problem:
      "Two problems, one after the other. The first is that reimplementing sensor fusion, passive radar and RF classification from scratch is a waste when good code already exists, and most of it carries a license that a proprietary product cannot touch. Reading a LICENSE file is the cheap part. Knowing whether the code underneath is worth adopting takes a benchmark. The second problem was worse and quieter. The platform had a fusion engine, four sensor adapters and a CoT bridge, and not one of them ran in the live system. Fused tracks existed only inside the wargame. The map showed the fleet its own telemetry and nothing else. Every piece passed its tests, and the pieces were not connected to anything.",
    approach: [
      "Swept 133 repositories against the 98 already catalogued in July, recording stars, last push and license from the GitHub API, and sorted them by what a proprietary product can legally do with each: permissive code can be vendored, copyleft code runs only behind a process boundary, and code with no LICENSE file grants nothing",
      "Mirrored ten upstream repos into nine private forks, keeping upstream history and the original LICENSE untouched at the root so each fork can still fast forward from upstream later",
      "Wrote an adapter contract before any fork work started: every sensor plugs in behind one async SensorSource interface, every tracker behind one FusionBackend protocol, and no fork imports anything from the platform except the shared ontology and those two interfaces",
      "Ran the forks as an agent team with one owner per fork, a reviewer on every handoff who re-ran each gate and probed adversarially, and a single serial integrator, because integration is the one role that cannot be parallel",
      "Benchmarked the Stone Soup backend against my own IMM/JPDA tracker over identical detections, scored with py-motmetrics at a 25 m match radius, and published the table verbatim including the parts that flattered neither side",
      "Built the live path in one direction: a YAML sensor plan, a SensorPump that merges every source into one queue and ticks the tracker, a broadcaster that emits track packets to the map and CoT to ATAK, and a map layer that draws MIL-STD-2525 symbols",
      "Validated the outgoing CoT with node-CoT, an independent parser from the TAK ecosystem, rather than trusting my own formatter's tests to grade my own formatter",
    ],
    designDecisions: [
      {
        title: "Benchmark Before Adopting, and Publish the Losing Numbers",
        description:
          "Stone Soup is a serious tracking framework from a national defense lab, and the obvious move was to adopt it and delete my own tracker. I benchmarked instead. On three simulated targets over 216 detections my tracker scored higher on multi-object tracking accuracy and ran roughly fourteen times faster per update. The gap is bookkeeping rather than estimation: both filters converge to about 5 m, which is the measurement sigma, and Stone Soup loses ground by re-initiating a track when a noisy detection falls outside the gate. That is a result on one seed and one scenario, and the handoff says so.",
        outcome:
          "The framework stays as a selectable backend behind the FusionBackend protocol instead of replacing anything. Adopting it would have cost accuracy and speed, and only a benchmark could have shown that.",
      },
      {
        title: "One Physics Result Reshaped the Sensor Plan",
        description:
          "The same benchmark run on bistatic passive radar data failed on both backends, and that was the honest answer rather than a bug. A single passive radar node with one illuminator measures range along a spheroid and a Doppler shift. It cannot localize in three dimensions, so nothing landed inside the match radius for either tracker. My tracker scored better only because it parked one track at the receiver and stopped, while Stone Soup propagated the ambiguity into eleven tracks strung along the iso-range surface.",
        outcome:
          "Passive radar moved from standalone tracker to cueing sensor. It now refines a track that an electro-optical or Remote ID sensor started, and a test covers exactly that path.",
      },
      {
        title: "Adversarial Review Caught What Green Tests Missed",
        description:
          "Every fork owner handed off a suite that passed. The reviewers re-ran each gate and then went looking for what the tests did not ask. One found that a detection carrying a NaN position sailed through the new fusion backend and exported a NaN track for a whole coast window, while the tracker it was meant to be swappable with had filtered that at ingest for months. Another found that the RF classifier produced a single-channel spectrogram that no real image backbone could consume. Both were real, both were fixed, and neither showed up as a red test.",
        outcome:
          "Non-finite input is now rejected and logged at the backend seam with an error that names the caller and the argument, covered by tests that were mutation-checked against the old behavior.",
      },
      {
        title: "Reachability Is the Integration Test, Not a Passing Suite",
        description:
          "The final review found that the fusion backend switch had been wired into the wargame world but was not reachable from the live path, because the alternative backend does not classify tracks the way the wargame needs. Everything about it was green. The fix was to take the switch back out of the wargame and say plainly that it is not live there yet, rather than leave a config flag that looks connected and is not.",
        outcome:
          "The live sensing demo documents exactly which page receives fused tracks and which one does not, and why. A flag that does nothing is worse than an absent feature.",
      },
    ],
    impact: [
      {
        metric: "Tracking accuracy",
        value: "0.956 vs 0.872",
        description: "My tracker against Stone Soup over identical detections, scored by py-motmetrics",
        evidenceId: "pantheon.fusion.mota",
      },
      {
        metric: "Per update",
        value: "0.43 vs 6.13 ms",
        description: "Wall clock per tracker update on the same run, about fourteen times apart",
        evidenceId: "pantheon.fusion.update_ms",
      },
      {
        metric: "Repos catalogued",
        value: "133",
        description: "Stars, last push and license read from the GitHub API, then filtered by what a proprietary product can use",
        evidenceId: "pantheon.discovery.repos",
      },
      {
        metric: "Last gate",
        value: "3,922 + 453",
        description: "Python and JavaScript tests passing at the end of the wave, with ruff and mypy clean",
        evidenceId: "pantheon.gate.tests",
      },
    ],
    stack: [
      { category: "Fusion", tools: ["Stone Soup", "IMM", "JPDA", "py-motmetrics", "NumPy"] },
      { category: "Sensing", tools: ["Passive bistatic radar", "Acoustic tripwire", "RF classifier", "Remote ID"] },
      { category: "Platform", tools: ["Python 3.12", "asyncio", "Pydantic v2", "FastAPI", "WebSocket"] },
      { category: "Interop", tools: ["Cursor on Target", "node-CoT", "ATAK", "MIL-STD-2525"] },
      { category: "Gates", tools: ["pytest", "vitest", "ruff", "mypy --strict"] },
    ],
    images: [
      {
        src: "/projects/fusion-benchmark.png",
        caption: "Tracking accuracy and identity F1 on the left, milliseconds per update on the right. Mine in pink, Stone Soup outlined.",
      },
      {
        src: "/projects/live-tracks-detail.jpg",
        caption: "Two fused tracks from the acoustic replay, drawn as unknown-air symbols beside the friendly assets.",
      },
    ],
    reflections: {
      worked: [
        "Benchmarking before adopting. The framework was the obvious choice on reputation and the wrong one on measurement, and only a table settled it.",
        "One owner per fork, a reviewer on every handoff, and a single serial integrator. Owners can run in parallel because their forks never touch. Integration cannot, because everything lands in the same seam.",
        "Publishing the results that flattered nobody. The passive radar run failed on both backends, and writing that down changed the sensor plan instead of hiding a weak sensor behind a demo.",
        "Validating the outgoing CoT with a parser from outside my own codebase. My formatter passing my formatter's tests proves very little.",
      ],
      different: [
        "I would check reachability from the running system at the start of each wave rather than at the final review. A green suite told me nothing about whether the code it covered was connected to anything.",
        "The first benchmark runs were not reproducible because the tracker was handed sets of objects and iterated them in hash order, which differs between processes. Ordered inputs should have been the default from the first line.",
        "The acoustic demo shows two tracks that never move, because a tripwire has no bearing. That is truthful and it is a weak demo. I would put a sensor with bearing into the live path first next time.",
      ],
    },
    nextProject: "drone-dashboard",
  },
  {
    slug: "optum",
    id: "002",
    personas: ["work"],
    title: "Optum",
    subtitle: "Automating RFP Response at UnitedHealth Group",
    year: "2026",
    role: "Forward Deployed AI/ML Engineer",
    status: "Current",
    duration: "Feb 2026 to present",
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
    nextProject: "medvanta",
  },
  {
    slug: "archv",
    id: "001",
    personas: ["projects", "work", "design"],
    title: "Archv",
    subtitle: "AI-Powered Document Review for Regulated Industries",
    year: "2025",
    role: "CEO & Co-Founder",
    status: "Active",
    duration: "2025 to present",
    team: "3 engineers, 1 designer",
    layout: "newspaper",
    overview:
      "I founded Archv because document review in regulated industries is broken in a specific way: the cost of a mistake is catastrophic, but the tools available are either manual or untrustworthy. Generalist AI hallucinates clauses. Manual review is slow. We built a third option: AI document review where every response links to its source text and every query is logged for audit. I ran user interviews, evaluated three AI architectures, selected RAG for built-in citations, and targeted law students as the entry point into institutional adoption. Shipped with a small team on a pre-seed budget.",
    problem:
      "Law students spend much of their research time reviewing documents by hand. In practice, one missed compliance clause leads to sanctions, malpractice claims, or fines. Students who tried generalist AI tools found the outputs unusable: hallucinated clauses, no source citations, no audit trail. A professor told us during user research, 'One wrong answer and I will never use it again.' That sentence defined the product requirement. Trust is not a feature. It is a prerequisite. No product on the market combined fast AI inference with the citation integrity and compliance infrastructure these users demand before they will use it once.",
    approach: [
      "Ran user interviews with attorneys, paralegals, and compliance officers. Shadowed attorneys during live document review sessions to map workflow pain points",
      "Evaluated three AI architectures: fine-tuned LLM (costly data licensing, not updatable), ChatGPT API wrapper (no compliance, hallucinations), RAG with vector database (built-in citations, updatable, cost-effective). Selected RAG",
      "Built a microservices architecture to isolate document ingestion, ML inference, user management, and audit logging",
      "Deployed ML models on NVIDIA GPUs via CUDA for document classification and entity extraction",
      "Encrypted all data with AES-256 at rest and TLS 1.3 in transit. Logged every data access for audit trails",
      "Built RESTful APIs with JWT auth and role-based access control (RBAC) mapped to compliance roles",
      "Shipped updates on a regular cadence and used check-ins to catch issues before they became product debt",
    ],
    designDecisions: [
      {
        title: "Students First, Institutions Second",
        description:
          "Two go-to-market paths. Sell to law firms: large contracts, long sales cycles, legal procurement teams. Or sell to law students: a low monthly price, self-serve signup, same document review pain at smaller scale. Students who love the product become associates who request it at their firms. We chose students.",
        outcome: "Students are the entry point. Institutions come second.",
      },
      {
        title: "Killed Two Underperforming Features",
        description:
          "Regular check-ins surfaced two underperforming features: collaborative annotation and document comparison. Users wanted speed and accuracy. They did not want another collaboration tool. We cut both and moved engineering time to citation accuracy and response latency.",
        outcome:
          "Faster release cycles. Engineering time went to citation accuracy and response latency instead.",
      },
      {
        title: "RAG Pipeline over Fine-Tuning",
        description:
          "Evaluated three architectures. Fine-tuning a legal LLM meant heavy data licensing costs and could not update without retraining. A ChatGPT API wrapper shipped fast but had no compliance controls and hallucinated freely. RAG with a vector database gave us built-in citations, live document updates without retraining, and controllable costs. We selected RAG and planned a fine-tuned routing layer for Phase 2.",
        outcome:
          "Every AI response links to source text. Citation-first output became our primary differentiator.",
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
          "Grouping by document type keeps GPU throughput high on long legal documents, and quantized models keep the interactive path responsive.",
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
          "Async processing, pagination, and consistent errors are part of the contract, so integrators do not have to work around them.",
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
  GPU WORKER A (INT8, interactive)  +  GPU WORKER B (FP16, batch)
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
          content: `Interactive requests skip the queue and hit a reserved GPU slot with INT8 quantization to keep latency low. Batch workloads queue in SQS, group by type, and run FP16 for accuracy over speed.`,
        },
      ],
    },
    reflections: {
      worked: [
        "Citation-first design. Trust requires verifiability. Every AI response links to source text. This became our primary differentiator against tools that produce unsourced summaries.",
        "Built for students first, institutions second. The compliance dashboard gave admin staff full visibility into AI usage, queries, and data access.",
        "Regular check-ins with real users caught issues before they became product debt. We killed two features early that tested poorly and doubled down on citation accuracy.",
      ],
      different: [
        "Designed the citation UI for accuracy, not speed. Our first citation format showed the full source paragraph inline. Users trusted it, but it made every response feel slow and heavy. Switched to a linked reference pattern. The right answer presented wrong is still the wrong product.",
        "Invested more in onboarding. The first-run experience was weak. New users needed hand-holding to see the value, which stretched every onboarding cycle. The value was clear once someone ran a query. The problem was getting them to the first successful one.",
        "Ran pricing research before launch. We guessed on pricing based on competitive benchmarks that did not apply to students. Conjoint analysis upfront would have shortened the sales cycle and avoided a confusing mid-stream pricing change.",
      ],
    },
    brandPhilosophy: {
      intro: "Archv's identity lives in tension. The product interface is stripped down: black text, white space, sharp edges, no decoration. The brand mark is the opposite, a burst of iridescent color. The work is serious, so the interface stays minimal and the content speaks. The company should feel human, so the brand stays colorful. The color also stands for the range of what Archv touches: law, healthcare, government, finance.",
      typography: {
        heading: "Favorit by Dinamo. A geometric grotesque with sharp terminals and wide apertures. It reads fast at small sizes, which matters when attorneys scan compliance dashboards for hours. The geometry references architectural drafting lettering. Clean, precise, no flourishes.",
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
        "Information density without clutter. Attorneys review long documents daily. The interface respects that by fitting more content per screen without sacrificing legibility. Tight spacing, small but readable type sizes, and data tables that keep many rows in view without scrolling.",
        "Architecture taught me that materials should be honest. Concrete looks like concrete. Steel looks like steel. In the interface, a button looks like a button. A text field looks like a text field. No gradients pretending to be depth. No shadows pretending to be elevation. Flat surfaces, sharp edges, clear boundaries.",
        "The interface is almost entirely black, white, and gray. Color is scarce inside the product so content stays in focus. But the brand identity is the opposite: full spectrum, iridescent, playful. This contrast is intentional. The product is serious. The brand is approachable. Users trust the tool because it is clear. They remember the company because it is colorful.",
        "The grid is 8px. Every margin, padding, and component dimension snaps to multiples of 8. This creates visual rhythm without conscious effort. You feel it as consistency. The page feels organized before you read a single word.",
      ],
    },
    link: { url: "https://github.com/NyXkim5/archv-mock-service", label: "Repository" },
    nextProject: "optum",
  },
  {
    slug: "cactus",
    id: "004",
    personas: ["work"],
    title: "Cactus",
    subtitle: "Event Ingestion and Growth Analytics Platform",
    year: "2025",
    role: "Software Engineer",
    status: "Active",
    duration: "2025 to present",
    team: "Engineering Team",
    layout: "newspaper",
    overview:
      "The growth team was making decisions on intuition because the data was too slow to argue with. Event data scattered across several tools. A/B tests analyzed in spreadsheets days after the experiment ended. Marketing campaigns managed through separate codebases with no shared state. I built the event pipeline, the analytics dashboards, and the experimentation infrastructure that gave the team a single, real-time view of user behavior. Events become queryable as they arrive, and the daily dashboards read pre-computed aggregates instead of raw tables. The team stopped debating what happened and started debating what to do about it.",
    problem:
      "Growth teams operate on feedback loops. The tighter the loop, the faster they learn. This team's loop was broken. User events lived in one tool. Conversion data in another. Marketing campaign results in a third. Running an A/B test meant exporting data, joining it manually in a spreadsheet, and hoping the sample size was large enough to mean anything. By the time the analysis was done, the product had already changed. Marketing integrations for email, ads, and CRM each had their own codebase, their own auth patterns, their own failure modes. No one had a unified picture of what users were doing or why.",
    approach: [
      "Built a three-stage event pipeline: capture via lightweight SDK, enrichment with session metadata and geo/device context, dual-write to PostgreSQL (historical analysis) and Redis (real-time dashboards)",
      "Designed React dashboards with D3.js visualizations optimized for the specific questions growth teams ask: conversion funnels, retention cohorts, and experiment results. Each chart type chosen for the decision it supports, not the data it displays",
      "Shipped A/B testing infrastructure end-to-end: experiment definition, deterministic variant assignment, and statistical significance calculation with guardrails against premature decisions",
      "Abstracted SendGrid, Google Ads, and HubSpot behind a unified adapter interface. One integration pattern. Shared auth, rate limiting, and error handling. New marketing tools plug in without new architecture",
      "Optimized analytics queries with materialized views that pre-compute the aggregations the growth team checks daily (DAU, funnel step counts, retention cohorts) on a 5-minute refresh cycle",
      "Embedded with the growth team to prioritize features against their experimentation roadmap. Built what they would use this week, not what sounded good in a planning doc",
    ],
    designDecisions: [
      {
        title: "Dual-Write for Two Time Horizons",
        description:
          "Growth teams need two things from event data: what is happening right now, and what happened over the past months. These are different query patterns with different performance requirements. Events write simultaneously to Redis for real-time dashboards and PostgreSQL for historical analysis. The pipeline handles the fan-out. Consumers do not need to know where the data lives.",
        outcome:
          "Real-time dashboards read from Redis and historical queries read from PostgreSQL, so neither competes with the other for resources.",
      },
      {
        title: "Adapter Pattern for Marketing Integrations",
        description:
          "Each third-party tool, SendGrid, Google Ads, and HubSpot, sits behind a common adapter interface. Auth, rate limiting, retry logic, and error handling are shared infrastructure. Adding a new integration means implementing one adapter with one interface. The growth team requests a new tool, and it ships quickly because the hard problems are already solved.",
        outcome:
          "New integrations reuse the shared auth, rate limiting, and retry code instead of copying it.",
      },
      {
        title: "Materialized Views Over Raw Queries",
        description:
          "Event tables grow fast. The growth team's most common dashboard queries, DAU, conversion funnels, and retention cohorts, were scanning raw tables on every load. At that latency, people stop checking the dashboard. We pre-computed these aggregations into materialized views on a 5-minute refresh. The data is at most 5 minutes stale. The dashboard reads it without a scan.",
        outcome:
          "Dashboard loads read pre-computed aggregates instead of scanning raw event tables, so the team can check metrics through the day.",
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
    nextProject: "archv",
  },
  {
    slug: "medvanta",
    id: "003",
    personas: ["design", "work"],
    title: "MedVanta Platform",
    subtitle: "Clinical Operations & Compliance Software",
    year: "2024 to 2025",
    role: "Software Engineer",
    status: "Shipped",
    duration: "May 2024 to July 2025",
    team: "Cross-functional (engineering + clinical)",
    layout: "newspaper",
    overview:
      "Someone tears their ACL on a Saturday. They wait until Monday to call. The office plays phone tag. They see a general practitioner who refers them to an orthopaedic specialist. More waiting. I built VantaStat to shorten that path. A patient describes their injury, uploads photos, and the system routes them to the right specialist. Behind the patient-facing app, I shipped analytics dashboards for practice managers, HIPAA-compliant backend services, and workflow automation aimed at the admin tasks that consume staff time. The entire data layer is encrypted: PHI at rest and in transit, row-level access, immutable audit logging.",
    problem:
      "Orthopaedic practices run on tools that were never designed to talk to each other. Scheduling lives in one system. Patient intake in another. Compliance documentation in a third. Staff spend hours weekly on manual data entry and phone tag between systems. The patient feels this as wait time, days between injury and specialist consultation. The practice feels it as overhead, admin work that generates no clinical value. No single platform connected the patient journey from injury report to the moment a specialist reviews their case.",
    approach: [
      "Designed the patient intake flow first, in Figma, validated with clinical staff before writing code. The flow had to feel obvious to someone in pain: describe injury, upload photos, tap connect. Three steps, no account creation required",
      "Built React dashboards surfacing the metrics practice managers actually check: workload distribution across providers, patient volume trends, and compliance KPIs. Designed for daily glance use, not deep analysis",
      "Developed HIPAA-compliant backend services with AES-256 encryption at rest, TLS in transit, and database-level row security. Every access event logged for audit trails",
      "Shipped workflow automation targeting the specific admin tasks consuming the most time: appointment scheduling, intake form processing, and referral routing",
      "Integrated Twilio for SMS and voice patient communications, so patients get updates without downloading an app or checking a portal",
      "Resolved production OAuth and webhook failures that were silently dropping patient intake submissions. The system looked healthy while patients were falling through the cracks",
    ],
    designDecisions: [
      {
        title: "Three Steps to a Specialist",
        description:
          "The intake flow has exactly three steps: describe the injury in plain language, upload photos of the affected area, tap 'Connect me.' No account creation. No insurance forms. No dropdown menus asking which body part hurts. The system routes to the right orthopaedic specialist based on injury type and location. Every screen added to this flow is a patient who gives up and calls the office instead.",
        outcome:
          "The flow completes on a phone screen without scrolling, and the routing decision happens without a phone call.",
      },
      {
        title: "Encryption as Infrastructure",
        description:
          "PHI protection is not a feature. It is a layer. Every field containing patient data is encrypted at rest with database-level encryption. Row-level security policies ensure clinicians access only their authorized patients. Every access event is logged immutably for HIPAA audit trails. The system does not trust the application layer to enforce compliance. The database enforces it.",
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
    nextProject: "cactus",
  },
  {
    slug: "drone-dashboard",
    id: "006",
    personas: ["projects"],
    title: "OVERWATCH",
    subtitle: "Autonomous Swarm Ground Control System",
    year: "2025",
    role: "Solo Engineer",
    status: "Shipped",
    duration: "2025",
    team: "Solo",
    layout: "newspaper",
    overview:
      "I designed and built OVERWATCH solo: a full-stack ground control system for autonomous drone swarms, any flight controller, any protocol. The system is a monorepo with four modules: a tactical HUD (src/hud) with Leaflet.js and Canvas for real-time map rendering across four operational modes, an Electron desktop simulator (drone-sim) with React 18, Three.js, and Zustand for 3D flight visualization and physics simulation, a Python FastAPI ground control server (backend) handling 10Hz telemetry aggregation, swarm coordination, collision avoidance, geofence enforcement, and a shared protocol layer (src/shared) enforcing type-safe contracts across MAVLink 2.0 and MSP serial protocols. WebSocket broadcasts push telemetry to all connected clients. WebRTC streams video from onboard cameras. The HUD has 125 passing unit tests, and pytest collects 3,800 tests across the Python services.",
    problem:
      "Ground control stations are built by engineers who have never watched an operator lose a drone because the battery warning was buried three tabs deep. The standard interface dumps raw telemetry into tables, scatters controls across modal dialogs, and treats a map pin as sufficient spatial awareness. Operators running a swarm are forced to context-switch between views to answer basic questions: which asset is degraded, what is its heading, can I redirect it. Beyond the interface, most GCS software only supports a single flight controller protocol and has no real swarm intelligence: no formation geometry, no collision avoidance, no automatic leader election, no geofence enforcement. The gap is not hardware. It is the entire software stack between the radio and the operator's decision.",
    approach: [
      "Architected a three-tier system: operator workstation (Tactical HUD + Drone Simulator), ground control server (FastAPI + Uvicorn async), and hardware abstraction layer (MAVSDK for MAVLink 2.0, custom async MSP parser for Betaflight/INAV), connected to UAV fleets over 5.8GHz WiFi mesh with RFD900x radio fallback",
      "Built the Tactical HUD (src/hud) with four operational modes (Monitor, Command, Replay, Solo FPV), each reconfiguring panel layout while keeping the drone list and map as fixed spatial anchors. Leaflet.js with CARTO dark basemap for tactical rendering, Canvas API for attitude indicators, sparkline charts, and FPV OSD overlay",
      "Engineered 10Hz telemetry pipeline: hardware telemetry feeds mutable DroneState objects, aggregated into TelemetryPacket arrays (Pydantic v2 serialization), broadcast over WebSocket to all clients, with parallel alert engine checks (rule-based, with per-drone cooldown suppression), O(n2) pairwise collision avoidance via haversine distance, and ray-casting geofence enforcement",
      "Implemented six formation patterns (V-Formation, Line Abreast, Column, Diamond, Orbit, Scatter) with heading-aware coordinate transforms that rotate body-frame offset vectors to WGS84 using the leader's heading, and 3-second Hermite smoothstep interpolation for formation transitions",
      "Built modified Raft consensus for automatic leader election using weighted scoring across battery, GPS quality, link quality, and formation position. Battery carries the highest weight because leader failure from power loss is catastrophic. 1000ms heartbeat, 5000ms election timeout",
      "Designed collision avoidance with haversine great-circle distance for horizontal separation and a 3D Euclidean distance check against a 5m safety bubble at 10Hz. The lower-altitude drone always yields",
      "Built the Electron drone simulator with React 18, Three.js, and Zustand: procedural drone geometry with animated propellers, 30Hz local physics engine with PID controllers per axis, motor mixing matrix for X-configuration, ground effect modeling, wind force simulation, and six sensor noise models (IMU, GPS, barometer, magnetometer, LiDAR, camera) with four preset levels",
      "Implemented full hardware abstraction: MAVSDK 2.0 with async UDP for PX4/ArduPilot, custom binary MSP parser with 7-state decoder and XOR checksum for Betaflight, USB auto-detection scanning VID/PID tables at 5-second intervals with automatic protocol detection across three baud rates",
      "Shipped the REST API with JWT auth (HS256, 8hr TTL, operator/viewer roles), WebRTC video streaming via aiortc, goggles integration bridges for DJI, HDZero, and Walksnail systems, and DVR recording with synchronized telemetry JSON export",
    ],
    designDecisions: [
      {
        title: "Spatial Hierarchy Over Feature Hierarchy",
        description:
          "Every C2 tool I audited organizes by feature: a telemetry tab, a map tab, a controls tab. This forces operators to hold a mental model of where the software hid their data. OVERWATCH organizes by spatial position. Left is always fleet state with per-drone cards showing callsign, role, color, and status. Center is always the Leaflet map with SVG triangle markers rotated by heading, 3-segment trail polylines at fading opacity, and real-time formation overlay lines. Right is always the active work context. Switching between Monitor, Command, Replay, and Solo FPV mutates only this panel. The map and drone list are architecturally invariant.",
        outcome:
          "Any data point, from battery cell voltage and comm latency to flight mode, mission phase, and formation cohesion, is reachable in a single eye movement. Zero tabs. Zero modals. Zero context switches. The map and drone list never move, so operators build spatial memory instead of hunting for data.",
      },
      {
        title: "10Hz Wire Protocol as System Backbone",
        description:
          "The entire system is organized around a canonical TelemetryPacket published at 10Hz per drone: position (WGS84 with MSL and AGL altitude), attitude (roll/pitch/yaw), velocity (ground speed, vertical speed, heading), battery (voltage, current, remaining percentage), GPS (fix type, satellites, HDOP), link quality (RSSI, quality, latency), drone status (6-state priority cascade), and formation state (role, offset vector, cohesion score). Python backend uses Pydantic v2 for strict serialization. JavaScript frontend maintains byte-identical enum values and field names. The protocol enforces 'lon' in telemetry, 'lng' only in waypoint map click events. Tests enforce this distinction.",
        outcome:
          "A single packet type drives the entire system: HUD rendering, alert evaluation, collision checks, geofence enforcement, formation tracking, database persistence, and session replay. Adding a new consumer means subscribing to the same broadcast, with zero schema changes.",
      },
      {
        title: "Hardware Abstraction for Protocol Agnosticism",
        description:
          "OVERWATCH supports any flight controller through a hardware abstraction layer that bridges MAVLink 2.0 (MAVSDK async UDP for PX4/ArduPilot) and MSP binary serial (custom 7-state decoder for Betaflight/INAV). USB auto-detection scans known VID/PID tables every 5 seconds, tries MSP handshake first at three baud rates (115200, 57600, 921600), falls back to MAVLink header scanning, and maintains a connected_ports set for automatic reconnection on device reappearance. The MSP-to-NEXUS translator converts raw protocol values: RSSI from 0-1023 to normalized 0-100, altitude from centimeters to meters, battery percentage from voltage curves.",
        outcome:
          "Operators plug in any flight controller over USB and OVERWATCH detects the protocol, configures the connection, and starts streaming telemetry. PX4, ArduPilot, Betaflight, or INAV: same interface, same commands, same data.",
      },
      {
        title: "Physics-Based Simulation for Development Without Hardware",
        description:
          "The Electron simulator runs a 30Hz physics engine with real aerodynamic modeling: all-up weight calculation from component selection, thrust-to-weight ratio, hover throttle derivation, max speed from drag equation (air density 1.225 kg/m3, Cd 1.2), ground effect multiplier within 3x propeller diameter, wind force with turbulence harmonics, and LiPo discharge curves modeling the flat-middle steep-drop-off characteristic. PID controllers run per-axis with motor mixing for X-configuration. Six sensor noise models cover IMU (gyro noise density, bias instability), GPS (dropout bursts, multipath), barometer (drift rate, temperature sensitivity), magnetometer (hard/soft iron, EMI), LiDAR (distance-dependent noise), and camera (motion blur, rolling shutter), each with four presets from perfect to failing.",
        outcome:
          "Full swarm operations development and testing without a single real drone. The simulator produces telemetry indistinguishable from hardware at the wire protocol level: same packets, same timing, same edge cases.",
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
        caption: "V1. DroneNexus. React swarm dashboard with Mapbox, six fixed drones, formation controls.",
      },
    ],
    versionImages: {
      v1: {
        src: "/drone-dashboard.webp",
        caption: "V1. DroneNexus. React swarm dashboard with Mapbox, six fixed drones, formation controls.",
      },
      v2: {
        src: "/drone-dashboard-v2.png",
        caption: "V2. OVERWATCH. Three-tier ground control system: tactical HUD with four operational modes, FastAPI backend with 10Hz telemetry aggregation, and hardware abstraction across MAVLink and MSP protocols. Swarm coordination, collision avoidance, geofence enforcement, formation geometry, and leader election, all in real time.",
      },
      changelog: [
        "Built full ground control server: FastAPI + Uvicorn async backend with 10Hz telemetry aggregation, a REST API, JWT auth, and WebSocket broadcast to all connected clients",
        "Implemented swarm intelligence: modified Raft leader election, six formation patterns with heading-aware coordinate transforms, 3-second Hermite smoothstep transitions, and real-time cohesion scoring",
        "Engineered collision avoidance with haversine great-circle distance and 3D safety bubble enforcement at 10Hz",
        "Built hardware abstraction layer: MAVSDK 2.0 for PX4/ArduPilot, custom MSP binary parser for Betaflight/INAV, USB auto-detection with VID/PID scanning and automatic protocol negotiation",
        "Shipped Electron drone simulator with Three.js 3D visualization, 30Hz physics engine, PID controllers, motor mixing, ground effect, wind simulation, and six sensor noise models",
        "Added WebRTC video streaming (aiortc), goggles integration for DJI/HDZero/Walksnail, Canvas OSD overlay with full flight telemetry, and DVR recording with synchronized telemetry export",
        "Test suites cover formation geometry, collision avoidance, geofence, wire protocol, MSP codec, stress and performance benchmarks, and full API integration",
      ],
    },
    link: { url: "https://droneoverwatch.vercel.app/", label: "View Live" },
    nextProject: "drone-virtual-env",
  },
  {
    slug: "drone-virtual-env",
    id: "007",
    personas: ["projects"],
    title: "DroneNexus",
    subtitle: "Ground Control Station & Virtual Environment",
    year: "2025",
    role: "Full-Stack Developer",
    status: "Shipped",
    duration: "2025",
    team: "Solo",
    layout: "newspaper",
    overview:
      "Configuring drone hardware is currently a spreadsheet exercise. Operators cross-reference spec sheets, run thrust calculations by hand, and discover incompatibilities after the build is assembled. I built a virtual environment where every component, from frame, motors, and propellers to power system, electronics, sensors, and thermal, lives in a single interface with a 3D preview and real-time performance calculations. Swap a motor and instantly see how it changes thrust-to-weight ratio, max flight time, and hover power draw. The system catches incompatibilities before anything gets bolted together.",
    problem:
      "Hardware configuration for multi-rotor platforms involves six interdependent subsystems. Changing the motor changes the prop clearance, the power draw, the thrust curve, the flight envelope, and the thermal profile. Operators currently manage this across separate spec sheets, Excel calculators, and manufacturer tools that do not share data. Incompatibilities surface during assembly or, worse, during flight. There is no unified environment where an operator can see how one component choice ripples across every performance metric.",
    approach: [
      "Built a 3D equipment preview in Three.js: click to select, scroll to zoom, drag to rotate. Operators see the physical platform update as they swap components",
      "Designed an equipment manifest tree spanning six subsystem categories: Frame, Motors & Props, Power System, Electronics, Sensors, Thermal. Each category exposes every configurable parameter",
      "Implemented real-time performance calculations that recompute on every component change: all-up weight, thrust-to-weight ratio, max flight time, max payload, max speed, hover power, energy consumption, and hover throttle percentage",
      "Added sensor noise modeling for simulation-grade parameter estimation, so operators can preview sensor behavior before flight",
      "Built a force disposition view for multi-drone tactical planning. Operators see the full fleet, not just one platform",
    ],
    designDecisions: [
      {
        title: "Dark UI with Semantic Color",
        description:
          "The interface uses a dark theme with green accent typography consistent with military ground control conventions. The aesthetic is not decorative. Operators in this domain expect monospace fonts, status bars, and nominal/degraded/critical state indicators. The visual language matches the operational context.",
        outcome:
          "The interface reads as a professional GCS tool, with the conventions operators from defense and aerospace already know.",
      },
      {
        title: "Every Change Recalculates Everything",
        description:
          "Component interdependencies are the core complexity of hardware configuration. Swapping a motor changes thrust, power draw, flight time, payload capacity, and thermal profile simultaneously. The system recalculates all eight performance metrics on every change so operators never see stale numbers.",
        outcome:
          "Real-time feedback: all-up weight, thrust-to-weight ratio, and max flight time update live as components change.",
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
    personas: ["projects", "design", "work"],
    title: "VA.gov MVP",
    subtitle: "Conceptual Redesign for Veterans Affairs Portal",
    year: "2025",
    role: "Full-Stack Developer & Designer",
    status: "Prototype. RFI Bid.",
    duration: "2025",
    team: "Solo",
    layout: "newspaper",
    overview:
      "Veterans leave benefits unclaimed, not because they do not qualify, but because the information is buried across disconnected pages on a portal that was never designed around their tasks. I audited the most common veteran workflows on VA.gov and chose four metrics to anchor the dashboard: payment status, claim progress, disability rating, and GI Bill balance. I built a unified dashboard prototype for an RFI bid that puts all four on one screen, added AI-powered benefit discovery to surface entitlements veterans do not know they qualify for, and designed the entire interface within USWDS and WCAG 2.1 AA constraints.",
    problem:
      "VA.gov serves veterans through a portal that reflects the VA's organizational structure, not the veteran's mental model. Checking payment status requires navigating to one section. Filing a claim lives in another. Prescription management in a third. The result: veterans miss filing deadlines because the notification was on a page they never visit. They leave disability rating increases on the table because no one told them they qualify. Every extra click between a veteran and their information is a chance for them to give up.",
    approach: [
      "Designed a unified dashboard around four metrics: monthly benefits, active claims, disability rating, and GI Bill balance. All visible without scrolling",
      "Built an urgent notification system for time-sensitive alerts: payment delays, claim status changes, approaching deadlines. The things that cost veterans money when missed",
      "Replaced nested navigation with a quick-action grid: Claims, Appeals, Appointments, Prescriptions, Payments, Messages, Travel Pay, Dependents, Direct Deposit, Letters. One click to any service",
      "Implemented AI-powered Smart Insights that scan a veteran's profile and surface specific actions: potential rating increases, unclaimed benefits, upcoming filing deadlines. Proactive, not passive",
      "Built a guided tour for the first visit. Veterans who distrust government technology need a reason to stay past the first screen",
      "Designed within WCAG 2.1 AA constraints: proper contrast ratios, full keyboard navigation, screen reader support. Accessibility is not a feature for a government portal. It is a requirement",
    ],
    designDecisions: [
      {
        title: "Four Metrics, Not Forty",
        description:
          "The existing VA.gov spreads veteran data across many pages because it mirrors the VA's internal org chart, not the veteran's mental model. I audited the common return visits and chose four actions: check payment status, track claims, verify disability rating, confirm GI Bill balance. I put all four on one screen. The design discipline is what gets left out. Forty metrics is easy, four is a decision.",
        outcome:
          "Veterans see their benefits picture on one screen. Zero navigation for the tasks that bring them back.",
      },
      {
        title: "AI Benefit Discovery",
        description:
          "Veterans leave benefits unclaimed because they do not know what they qualify for. The current portal waits for the veteran to ask the right question. I added an AI module that inverts the interaction. It scans the veteran's profile and proactively surfaces specific actions: potential rating increases, unclaimed benefits, approaching filing deadlines. This is the highest-risk feature in the prototype. If the recommendations are wrong, trust is destroyed permanently.",
        outcome:
          "The proactive pattern changes the interaction from pull to push. It is also the part of the prototype that needs the most validation before it could ship.",
      },
      {
        title: "Quick Actions Over Deep Navigation",
        description:
          "The current VA.gov requires veterans to navigate nested menus organized by VA department, a structure that means nothing to someone trying to refill a prescription. I replaced the navigation with 10 quick-action cards organized by task: Claims, Appeals, Appointments, Prescriptions, Payments, Messages, Travel Pay, Dependents, Direct Deposit, Letters. The veteran's intent, not the VA's org chart, determines the layout.",
        outcome:
          "Every service is one click from the dashboard. Veterans no longer need to understand VA organizational structure to find what they need.",
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
        "Proactive recommendations over passive data display. Veterans want the system to tell them what to do, not make them figure it out.",
        "USWDS compliance was a design accelerator, not a constraint. The government design system eliminated visual decisions and kept focus on information architecture, the part that matters.",
      ],
      different: [
        "Tested with actual veterans from the start. The prototype was validated with general users. Veterans carry institutional distrust that general users do not. The onboarding, tone, and error handling all need to account for someone who expects the system to fail.",
        "Built the claims filing flow, not just the dashboard. The dashboard shows status. The real pain is in filing and appeals. Simplifying that process would have delivered more value than any amount of dashboard polish.",
        "Scoped the AI module to one use case. Smart Insights tries to do too much. Shipping deadline alerts alone would have proven value faster and built the trust needed to expand scope.",
      ],
    },
    link: { url: "https://va-gov-mvp-v1.vercel.app/", label: "View Live Demo" },
    nextProject: "drone-dashboard",
  },
  {
    slug: "ship-stability",
    id: "010",
    personas: ["projects"],
    title: "Ship Stability",
    subtitle: "Computing whether a hull rights itself, and proving the arithmetic against theory",
    year: "2026",
    role: "Solo Engineer",
    status: "Complete",
    duration: "Sept 2026",
    team: "Solo, with an agent team",
    overview:
      "A Python tool that takes a hull and a loading condition and returns the numbers a naval architect reads before a vessel sails: displacement, the centre of buoyancy, the metacentric height, and a righting arm curve. It accepts either a box barge defined by four numbers or a real hull given as a table of offsets. It applies the free surface penalty that slack tanks impose, finds the heel angle at which the first opening floods, and checks the result against the six general intact stability criteria of the IMO 2008 code. I wrote it while working through MIT OpenCourseWare 2.700 as the reference.",
    problem:
      "Most teaching implementations of ship stability stop at the metacentric height, because GM is a one-line formula and the righting arm curve is not. GM describes the hull at zero heel and says nothing about what happens at forty degrees, which is the part that decides whether a vessel comes back up. The usual shortcut is the wall-sided approximation, and it is exact right up to the moment the deck edge enters the water, which is the moment it stops being exact and also the moment anyone cares. The second problem is trust. A stability number that cannot be checked against something is a number someone chose.",
    approach: [
      "Solve the floating attitude rather than assume it. Displacement and longitudinal moment are solved together, so the hull is free to trim as it heels instead of being pinned level. On a fore and aft symmetric hull that changes nothing, which is the control that proves the solver is not inventing motion.",
      "Compute the righting arm by integration rather than by formula. For each heel angle, tilt the waterplane with the hull, solve by bisection for the plane height that keeps the displaced volume equal to the upright displacement, clip every station section against that plane, and integrate the immersed area and its centroid along the length. The righting arm is the horizontal separation between that centroid and the centre of gravity.",
      "Validate against the closed form where the closed form is exact. A box barge has analytic hydrostatics, so displacement, KB, BM, KM and GM are all known exactly, and the integrator reproduces them to floating point precision.",
      "Validate the curve against the wall-sided formula inside the range where that formula holds, then write a control test proving the two diverge outside it. Agreement everywhere would have meant the integrator was reimplementing the approximation rather than integrating the hull.",
      "Read the IMO thresholds out of the code text rather than a textbook summary, and cross-check them against two independent official sources before hardcoding any of them.",
    ],
    designDecisions: [
      {
        title: "Integrate the Heeled Volume, Do Not Approximate It",
        description:
          "The wall-sided formula gives the righting arm as a function of GM and BM, and it is genuinely exact while the hull's sides are vertical at the waterline. Past the angle where the deck edge immerses or the bilge emerges, it overpredicts, which is the wrong direction to be wrong in for a stability calculation. Integrating the real immersed shape at every angle costs more compute and removes that failure mode entirely.",
        outcome:
          "The curve stays correct through deck edge immersion. Inside the wall-sided range it agrees with the closed form to within a nanometre, which is what proves the integrator is right rather than merely plausible.",
      },
      {
        title: "A Control Test That Must Fail",
        description:
          "Matching the wall-sided formula proves nothing on its own, because an implementation that simply evaluated that formula would match it perfectly. So alongside the agreement test there is a control asserting the two results diverge past the wall-sided limit, and that the closed form is the optimistic one. The pair of tests together says the integrator tracks theory where theory holds and departs from it where theory breaks.",
        outcome:
          "Agreement became evidence instead of a coincidence. The same idea drove the whole suite, which was mutation tested by deliberately breaking the source and confirming the tests caught it.",
      },
      {
        title: "Free Surface Is Charged As A Virtual Rise Of KG",
        description:
          "A slack tank holds liquid with a free surface. When the hull heels, that liquid runs to the low side and cuts the righting arm. The correction does not depend on how full the tank is, which is why a tank one tenth full costs the same as one nine tenths full. Breadth enters cubed, so a centreline bulkhead cuts the penalty to a quarter. The tool reports the solid metacentric height, every tank's contribution, and the corrected value, because a stability booklet that quoted only the corrected number would hide where the loss came from.",
        outcome:
          "The correction enters the curve at every angle, not only at zero heel, and the criteria are checked against the corrected value.",
      },
      {
        title: "Downflooding Governs More Often Than Vanishing Stability",
        description:
          "The angle of vanishing stability is where the righting arm finally runs out. It is rarely the angle that matters. A vent that cannot be closed weathertight lets water in long before that, and once water is inside the hull none of this arithmetic describes the vessel any more. The tool takes a list of openings, finds the heel at which each immerses, names the one that floods first, and caps the criteria that the IMO code says to cap there.",
        outcome:
          "A barge with a vent one metre above the waterline floods at fourteen degrees and fails four of six criteria, which is the honest answer and not the one a GM figure alone would have given.",
      },
      {
        title: "Cite The Paragraph Next To The Constant",
        description:
          "Every stability threshold in the checker carries its IMO code paragraph number in a comment beside it. Two places where implementations commonly differ are handled literally and documented: the code caps the second and third area criteria at the downflooding angle but not the first, and it sets no upper angle on the maximum righting arm search. Following the text exactly, and saying so, matters more than matching whatever another tool happens to do.",
        outcome:
          "Every one of the six thresholds traces to the code text, cross-checked against two official sources that agree. None is left unverified.",
      },
    ],
    impact: [
      {
        metric: "Test suite",
        value: "201",
        description: "tests, covering geometry, hydrostatics, the righting arm curve, free trim, cross curves, tanks, openings and criteria",
        evidenceId: "shipstability.tests.passing",
      },
      {
        metric: "Agreement with theory",
        value: "1e-9 m",
        description: "maximum deviation from the wall-sided closed form at every degree inside its valid range",
        evidenceId: "shipstability.wallsided.agreement",
      },
      {
        metric: "Stability criteria",
        value: "6",
        description: "IMO 2008 code general intact criteria checked, plus the severe wind and rolling criterion, every threshold traced to the code text",
        evidenceId: "shipstability.imo.criteria",
      },
      {
        metric: "Cross curve identity",
        value: "3.3e-16 m",
        description: "worst error reproducing three separately integrated GZ curves from one KN table",
        evidenceId: "shipstability.kn.identity",
      },
    ],
    stack: [
      { category: "Language", tools: ["Python 3.12", "Type hints throughout"] },
      { category: "Numerical", tools: ["Sutherland-Hodgman polygon clipping", "Simpson and trapezoid integration", "Bisection solver"] },
      { category: "Output", tools: ["Matplotlib", "CSV offsets reader", "argparse CLI"] },
      { category: "Testing", tools: ["pytest", "Closed-form validation", "Mutation testing"] },
    ],
    images: [
      {
        src: "/projects/ship-stability-gz-box.png",
        caption:
          "Righting arm curve for a box barge. The dashed line is the initial slope, which equals the metacentric height at one radian. The curve rises above it because the wall-sided term grows with the square of the heel angle.",
      },
      {
        src: "/projects/ship-stability-gz-trawler.png",
        caption:
          "The same computation driven from a table of offsets rather than four numbers. The hull is a round bilge form, so the sections are polygons read from the table and clipped against the heeled waterplane.",
      },
    ],
    reflections: {
      worked: [
        "Validating against a shape with a known answer first. The box barge is not interesting, which is exactly why it is the right thing to test against.",
        "Writing the control test that had to fail. It turned an agreement into evidence.",
        "Mutation testing the suite. Halving the free surface correction, flipping a sign in the area formula and moving each IMO threshold were all caught.",
      ],
      different: [
        "I shipped a README claiming the curve stops when the hull would submerge. That branch could not fire for either supported hull type, so the claim was aspirational rather than true. It is now wired to the condition it describes.",
        "The angle of maximum righting arm was quantised to the angle step, and one criterion reads that angle directly, so step size was deciding pass or fail on a hull peaking near the threshold. Refining the peak was a correctness fix, not a polish item.",
        "There is still no damage stability. Intact stability says what happens to a sound hull, and the harder question is what happens after the hull is opened to the sea.",
        "The roll period used by the weather criterion reads waterline length from the stations that touch the water, so on a fine ended hull it is short by up to half a station spacing. That makes the result conservative rather than wrong, but it is an approximation sitting inside a criterion that looks exact.",
      ],
    },
  },
  {
    slug: "ehs-incident-log",
    id: "011",
    personas: ["projects"],
    title: "OSHA Recordkeeping",
    subtitle: "Encoding the injury recording rules, with an audit trail that detects tampering",
    year: "2026",
    role: "Solo Engineer",
    status: "Complete",
    duration: "Sept 2026",
    team: "Solo, with an agent team",
    overview:
      "A Python tool that records workplace injuries and illnesses in the format of the three OSHA forms: the 300 log, the 300A annual summary, and the 301 incident report. Column headings come from the official form package. It decides whether a case is recordable by walking the regulation, works out whether an establishment has to submit electronically, writes the federal upload files, and runs the certification and posting workflow. Every change lands in an append-only, hash-chained audit trail. All sample data is synthetic.",
    problem:
      "Injury recordkeeping looks like a data entry problem and is actually a rules problem. Whether a case goes on the log at all turns on a chain of tests in 29 CFR 1904, and the one that decides most cases is a list of fourteen treatments that count as first aid. Get that list wrong and an employer either over-records, which inflates its published injury rate, or under-records, which is a citation. The second problem is that this is a legal record. A log that can be quietly edited after an inspection is announced is worth nothing, and most spreadsheet implementations can be.",
    approach: [
      "Transcribe the forms from the official PDF rather than from memory. Eighteen columns on the 300, the exact field numbering on the 301, and the establishment and totals blocks on the 300A.",
      "Encode the recordability chain in the order the regulation states it: work related, then a new case, then a general criterion, then the specific cases. Every rule carries its CFR citation in the code beside it.",
      "Make the audit trail append-only and hash-chained, so that editing a line, deleting one, reordering them, or appending a forged entry all break the chain and are reported with the entry number that failed.",
      "Return a third answer. Where the regulation hands the call to a person, the engine returns a needs-judgment result carrying the question to ask, rather than guessing and presenting the guess as a decision.",
    ],
    designDecisions: [
      {
        title: "Three Answers, Not Two",
        description:
          "A recordability engine that returns only yes or no has to invent an answer whenever a fact is unknown or the regulation calls for judgment. Whether an injury is a significant aggravation of a preexisting condition is a judgment a physician makes, not a function. So every input is a tri-state and an unknown stops the walk and returns the question instead of a verdict. A tool that quietly guesses on the judgment calls is worse than no tool, because it produces a record nobody can defend.",
        outcome:
          "The engine either names the rule that decided the case or names the question a person still has to answer. It never fills the gap itself.",
      },
      {
        title: "The First Aid List Is The Product",
        description:
          "Fourteen treatments are first aid by definition, and the regulation says the list is complete and that the professional status of whoever administered the treatment makes no difference. A physician applying a butterfly bandage is still first aid. The traps live inside the parentheses: sutures are medical treatment while butterfly closures are first aid, an over the counter drug is first aid at nonprescription strength and medical treatment at prescription strength, a tetanus shot is first aid and a hepatitis B shot is not. The engine prints those distinctions in the question it asks.",
        outcome:
          "All fourteen items encoded with per-item citations, and the rule that a treatment on the list stays first aid whoever gives it.",
      },
      {
        title: "Append-Only And Hash-Chained",
        description:
          "The audit file is opened in append mode and nothing in the code rewrites it. Each entry stores the hash of the entry before it, so the file is a chain rather than a list. Verification walks it and reports the first entry whose sequence, previous hash or own hash does not reconcile. Changing two fields on a case writes two entries, each with its own before and after value. Setting a field to the value it already holds writes nothing.",
        outcome:
          "Editing, deleting, reordering and hand-forging an entry are each detected and each has a test. A case recorded in error is voided, not deleted, which is what the form instructions call for.",
      },
      {
        title: "Privacy Cases Keep The Name Off The Log",
        description:
          "Six categories of case, including mental illness and a sharps injury contaminated with blood, must appear on the log without the employee's name. The tool writes the required label in the name column and holds the real name only in the separate confidential list the instructions require, which is never written into the exported log. A test asserts the name is absent from the export, and a control test asserts an ordinary name is present, so the first assertion means something.",
        outcome:
          "The confidential list is reachable by its own command and is excluded from every export path.",
      },
      {
        title: "Citing A Rule Means Meeting All Of It",
        description:
          "The annual summary export cited the paragraph that permits an equivalent form in any file format. Reading that paragraph properly showed it also requires the summary to carry the employee access statement and the employer penalty statement, and the export carried neither. It was failing the exact equivalence test it was invoking as its authority. Both statements are now transcribed from the form package and written into the file.",
        outcome:
          "A citation in a comment is a claim about the code. This one was checked and found wrong, which is the argument for citing the paragraph rather than the section.",
      },
    ],
    impact: [
      {
        metric: "Test suite",
        value: "400",
        description: "tests, covering the recording rules, the audit chain, real concurrent writers, the exports and the certification workflow",
        evidenceId: "ehslog.tests.passing",
      },
      {
        metric: "Regulation encoded",
        value: "17",
        description: "distinct sections of 29 CFR 1904 cited in the code beside the rule each one governs",
        evidenceId: "ehslog.cfr.sections",
      },
      {
        metric: "First aid list",
        value: "14",
        description: "treatments encoded from the regulation, each carrying its own citation",
        evidenceId: "ehslog.firstaid.items",
      },
      {
        metric: "Industry benchmark",
        value: "975",
        description: "BLS incidence rate rows for reference year 2024, so a rate reads against its own industry",
        evidenceId: "ehslog.bls.rows",
      },
    ],
    stack: [
      { category: "Language", tools: ["Python 3.12", "Standard library only at runtime"] },
      { category: "Integrity", tools: ["SHA-256 hash chain", "Append-only JSON Lines", "Atomic record writes"] },
      { category: "Compliance", tools: ["29 CFR 1904", "OSHA forms 300, 300A and 301", "Federal upload format"] },
      { category: "Testing", tools: ["pytest", "Mutation testing", "Tamper-detection tests"] },
    ],
    images: [
      {
        src: "/projects/ehs-osha-300-log.png",
        caption:
          "The Form 300 log as the tool prints it. Case 2026-007 is a privacy concern case, so the required label stands where the name would be. The name exists in the record and reaches only the separate confidential list, never an export.",
      },
      {
        src: "/projects/ehs-audit-chain.png",
        caption:
          "Two audit entries for one case, each carrying the field, the value before and the value after. Verification walks the hash chain and reports the first entry that fails to reconcile. All data is synthetic.",
      },
      {
        src: "/projects/ehs-300a-benchmark.png",
        caption:
          "The annual summary, with both rates read against the published figures for the same industry code. A rate on its own says nothing. Against its own industry it says whether the site is above or below the line.",
      },
    ],
    reflections: {
      worked: [
        "Reading the regulation from the federal source rather than a summary. The summaries disagree with each other and several are years out of date.",
        "Making unknown a first class answer. It removed every place the engine would otherwise have had to invent a fact.",
        "Mutation testing the rules. Dropping one item from the first aid list, inverting the treatment test and disabling tamper detection were each caught.",
      ],
      different: [
        "The audit trail is a hash chain, which proves the record is consistent with itself. The bar set by verifiable logs is a Merkle tree with inclusion and consistency proofs, which a third party can check without trusting whoever holds the record. That distinction matters exactly in an inspection, which is the case the tool exists for.",
        "File locking is advisory, so a process that ignores the lock can still corrupt the record. It is also POSIX only, because it uses fcntl.",
        "The benchmark is a comparison, not a verdict. BLS publishes standard errors in a table the tool does not read, so it cannot say whether a small gap sits inside sampling error, and it prints that caveat on every run.",
        "The regulation cites a section range that includes a section which no longer exists. The musculoskeletal disorder rule was rescinded before it took effect and the cross reference was never cleaned up, so a careful reading of the citation leads to a section that is not there.",
        "The federal upload specification does not state that its columns must appear in the printed order. The tool writes them that way as the safe reading and says so, rather than presenting a guess as the spec.",
        "It is a single establishment and a single year, held in files with no concurrent writer. Two processes writing at once would race.",
      ],
    },
  },
];

export function findStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((s) => s.slug === slug);
}

export function studiesFor(persona: PersonaKey): CaseStudy[] {
  return caseStudies.filter((s) => s.personas.includes(persona));
}

// Canonical URL for a study: under its first persona. Unknown slugs fall
// back to the projects tab, which lists everything.
export function studyHref(slug: string): string {
  const persona = findStudy(slug)?.personas[0] ?? "projects";
  return `/${persona}/${slug}`;
}
