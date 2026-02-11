"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { cn } from "@/lib/utils";

interface CaseStudy {
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
  nextProject?: string;
}

const caseStudies: CaseStudy[] = [
  {
    slug: "optum",
    id: "001",
    title: "Optum",
    subtitle: "AI/ML Systems for Healthcare at Scale",
    year: "2025",
    role: "Software Engineer, AI/ML",
    status: "Current",
    duration: "Feb 2025 — Present",
    team: "Enterprise AI/ML Team",
    overview:
      "Building ML-powered healthcare systems at UnitedHealth Group — one of the largest healthcare companies in the world, serving over 150 million people. Working on AI infrastructure at enterprise scale, processing millions of healthcare records to improve patient outcomes and operational efficiency.",
    problem:
      "Healthcare generates massive amounts of data — clinical records, claims, pharmacy data, lab results — but most of it sits unused. Manual processes dominate: nurses spend hours on documentation, claims require human review, and care gaps go undetected. The challenge is building AI systems that can process this data at scale while meeting strict healthcare regulations and accuracy requirements.",
    approach: [
      "Developing ML pipelines for healthcare data processing at enterprise scale",
      "Building AI infrastructure to handle millions of records with high reliability",
      "Working with Python, cloud infrastructure, and ML frameworks",
      "Collaborating with cross-functional teams including data scientists and clinicians",
      "Ensuring compliance with healthcare regulations (HIPAA, SOC 2)",
      "Implementing monitoring and observability for production ML systems",
    ],
    designDecisions: [
      {
        title: "Enterprise-Scale ML Infrastructure",
        description:
          "Building ML pipelines that can process healthcare data at massive scale while maintaining reliability and compliance requirements. Focus on robust error handling, monitoring, and auditability.",
        outcome:
          "Production-grade ML systems serving enterprise healthcare operations.",
      },
      {
        title: "Healthcare-First AI Development",
        description:
          "AI systems in healthcare require different considerations than typical ML: interpretability for clinicians, audit trails for compliance, and fail-safe behavior for patient safety.",
        outcome:
          "ML systems designed with healthcare constraints from the ground up.",
      },
    ],
    impact: [
      {
        metric: "Scale",
        value: "150M+",
        description: "People served by UnitedHealth Group's healthcare services",
      },
      {
        metric: "Domain",
        value: "AI/ML",
        description: "Building machine learning systems for healthcare operations",
      },
      {
        metric: "Data",
        value: "Millions",
        description: "Healthcare records processed through ML pipelines",
      },
    ],
    stack: [
      { category: "Languages", tools: ["Python", "SQL"] },
      { category: "ML/AI", tools: ["Machine Learning", "Data Pipelines", "MLOps"] },
      { category: "Infrastructure", tools: ["AWS", "Cloud Infrastructure", "Kubernetes"] },
      { category: "Healthcare", tools: ["HIPAA", "Healthcare Data", "Clinical Systems"] },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
        caption: "Healthcare AI — building systems that improve patient outcomes",
      },
    ],
    nextProject: "cactus",
  },
  {
    slug: "archv",
    id: "003",
    title: "Archv",
    subtitle: "AI Compliance Infrastructure for Regulated Industries",
    year: "2024",
    role: "CEO & Co-Founder",
    status: "Founded · NVIDIA Inception",
    duration: "2024",
    team: "3 engineers, 1 designer",
    overview:
      "Archv is a B2B SaaS platform that automates compliance workflows for law firms, healthcare orgs, and government agencies. We built AI-powered document review pipelines that reduced legal review time by ~50%, shipping HIPAA and SOC 2 compliant infrastructure from day one.",
    problem:
      "Regulated industries — legal, healthcare, government — spend thousands of hours annually on manual document review and compliance checks. Existing tools are legacy, disconnected, and not built for AI. Law firms were spending 60-70% of associate time on document review that could be augmented with ML. The gap: no AI compliance tool existed that was both technically sophisticated and met the strict security requirements of these industries.",
    approach: [
      "Conducted 20+ user discovery calls with healthcare executives and attorneys to map compliance pain points",
      "Designed a microservices architecture from scratch to handle HIPAA and SOC 2 requirements at every layer",
      "Built ML inference pipelines using NVIDIA GPUs and CUDA for document classification and entity extraction",
      "Implemented end-to-end encryption (AES-256, TLS 1.3) with audit logging on every data access",
      "Developed RESTful APIs with JWT authentication and role-based access control (RBAC)",
      "Iterated rapidly with paying law firm clients, shipping weekly updates based on feedback",
    ],
    designDecisions: [
      {
        title: "Microservices over Monolith",
        description:
          "Separated document ingestion, ML inference, user management, and audit logging into independent services. Each service owns its database schema and communicates via message queues.",
        outcome:
          "Enabled independent scaling of GPU-heavy inference workloads without affecting user-facing services. Reduced deployment risk by isolating failure domains.",
      },
      {
        title: "GPU-Accelerated Inference Pipeline",
        description:
          "Deployed ML models on NVIDIA GPUs via CUDA, with a custom batching system that groups documents by type for optimal throughput. Used model quantization for latency-sensitive endpoints.",
        outcome:
          "Achieved sub-2 second document classification on 50+ page legal documents. 3x throughput improvement over CPU-only baseline.",
      },
      {
        title: "Zero-Trust Security Model",
        description:
          "Every API call is authenticated, every data access is logged, PHI is encrypted at rest and in transit. Built custom RBAC that maps to compliance roles (reviewer, admin, auditor).",
        outcome:
          "Passed HIPAA technical safeguard requirements. Law firm clients approved deployment after security review with zero findings.",
      },
      {
        title: "Developer-First API Design",
        description:
          "RESTful API with comprehensive OpenAPI documentation, consistent error codes, pagination, and webhook support for async processing. SDK wrappers for Python and TypeScript.",
        outcome:
          "Reduced client integration time from weeks to days. One firm completed full API integration in 3 business days.",
      },
    ],
    impact: [
      {
        metric: "Document Review Time",
        value: "~50%",
        description: "Reduction in manual document review hours for law firm clients",
      },
      {
        metric: "Paying Clients",
        value: "Q1",
        description: "Acquired paying law firm customers in first quarter of operations",
      },
      {
        metric: "NVIDIA Inception",
        value: "Admitted",
        description: "Accepted into NVIDIA's startup accelerator program for AI companies",
      },
      {
        metric: "Classification Latency",
        value: "<2s",
        description: "Sub-2 second document classification on 50+ page legal documents",
      },
    ],
    stack: [
      { category: "Frontend", tools: ["TypeScript", "React", "Next.js", "Tailwind CSS"] },
      { category: "Backend", tools: ["Node.js", "Express", "PostgreSQL", "Redis"] },
      { category: "Infrastructure", tools: ["AWS EC2", "S3", "Lambda", "Docker", "Terraform"] },
      { category: "AI/ML", tools: ["Python", "PyTorch", "CUDA", "NVIDIA GPUs", "Hugging Face"] },
      { category: "Security", tools: ["AES-256", "TLS 1.3", "JWT", "RBAC", "Audit Logging"] },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
        caption: "Engineering workspace — building Archv's core platform",
      },
      {
        src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
        caption: "Infrastructure — GPU cluster for ML inference pipelines",
      },
      {
        src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
        caption: "Security architecture — zero-trust compliance model",
      },
    ],
    nextProject: "medvanta",
  },
  {
    slug: "cactus",
    id: "002",
    title: "Cactus",
    subtitle: "Growth & Marketing Technology Platform",
    year: "2024",
    role: "Software Engineer",
    status: "Shipped",
    duration: "Dec 2024",
    team: "Engineering Team",
    overview:
      "Full-stack development for a growth and marketing technology platform. Built React components, API integrations, and data pipelines. Worked on user analytics dashboards, A/B testing infrastructure, and marketing automation tools.",
    problem:
      "Growth teams need data-driven tools to understand user behavior, run experiments, and optimize conversion funnels. The challenge is building reliable infrastructure that can handle high-volume event tracking, real-time analytics, and seamless integrations with marketing tools — all while maintaining a fast, responsive user experience.",
    approach: [
      "Built React components for analytics dashboards and marketing tools",
      "Developed API integrations connecting various marketing and analytics platforms",
      "Created data pipelines for processing user events and behavioral data",
      "Implemented A/B testing infrastructure for growth experiments",
      "Worked on PostgreSQL database optimization for analytics queries",
      "Collaborated with product and growth teams on feature requirements",
    ],
    designDecisions: [
      {
        title: "Event-Driven Analytics Architecture",
        description:
          "Built an event-driven system for tracking user behavior. Events flow through a processing pipeline that handles enrichment, aggregation, and storage — enabling real-time dashboards and historical analysis.",
        outcome:
          "Reliable analytics infrastructure supporting growth team decision-making.",
      },
      {
        title: "Modular React Components",
        description:
          "Developed a library of reusable React components for dashboards, charts, and marketing tools. Consistent design system with flexible configuration options.",
        outcome:
          "Faster feature development through component reuse across the platform.",
      },
      {
        title: "API Integration Layer",
        description:
          "Created a unified integration layer for connecting external marketing tools (email, ads, CRM). Abstracted the complexity of different API formats behind a consistent interface.",
        outcome:
          "Simplified integration management and reduced time to connect new tools.",
      },
    ],
    impact: [
      {
        metric: "Dashboards",
        value: "Shipped",
        description: "Analytics dashboards for growth team visibility",
      },
      {
        metric: "Integrations",
        value: "Multiple",
        description: "API integrations with marketing and analytics platforms",
      },
      {
        metric: "A/B Testing",
        value: "Built",
        description: "Infrastructure for running growth experiments",
      },
    ],
    stack: [
      { category: "Frontend", tools: ["React", "TypeScript", "Tailwind CSS"] },
      { category: "Backend", tools: ["Node.js", "PostgreSQL", "Redis"] },
      { category: "Data", tools: ["Analytics Pipelines", "Event Processing"] },
      { category: "Integrations", tools: ["REST APIs", "Webhooks", "Marketing Tools"] },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
        caption: "Growth platform — analytics and marketing technology",
      },
      {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        caption: "Data dashboards — visualizing user behavior and metrics",
      },
    ],
    nextProject: "archv",
  },
  {
    slug: "medvanta",
    id: "004",
    title: "MedVanta Platform",
    subtitle: "Clinical Operations & Compliance Software",
    year: "2024",
    role: "Software Engineer",
    status: "Shipped",
    duration: "2024",
    team: "Cross-functional (engineering + clinical)",
    overview:
      "Built analytics dashboards, secure backend services, and workflow automation for a healthcare technology company. Everything operated in a HIPAA-regulated environment, handling protected health information (PHI) with strict security requirements.",
    problem:
      "Medical practices were drowning in administrative overhead — tracking workload distribution, managing patient communications, and maintaining compliance documentation. Staff spent hours each week on repetitive tasks that pulled them away from patient care. Existing healthcare tools were fragmented: one for scheduling, another for communications, another for compliance, none of them talking to each other.",
    approach: [
      "Built analytics dashboards using React and Python surfacing KPIs for workload distribution across practices",
      "Developed secure backend services handling PHI with encryption at rest and database-level access controls",
      "Created UI/UX mockups in Figma for healthcare workflows, validating with clinical end-users",
      "Delivered workflow automation reducing manual admin tasks by several hours/week per practice",
      "Integrated Twilio for patient communications and Auth0 for identity management",
      "Resolved OAuth and webhook issues in production through systematic debugging",
    ],
    designDecisions: [
      {
        title: "Dashboard-First Architecture",
        description:
          "Prioritized visual analytics as the primary interface. KPI dashboards gave practice managers real-time visibility into workload balance, patient volumes, and compliance status without drilling into raw data.",
        outcome:
          "Practice managers adopted the platform within the first week. 90% of daily workflows started from the dashboard view.",
      },
      {
        title: "Encryption-First Data Layer",
        description:
          "Every PHI field encrypted at rest using database-level encryption. Row-level security policies ensured users only accessed data they were authorized for. All access logged for HIPAA audit trails.",
        outcome:
          "Zero PHI exposure incidents. Passed all compliance audits during the engagement.",
      },
      {
        title: "Figma-Driven Development",
        description:
          "Designed comprehensive UI/UX mockups before writing code. Validated flows with clinical end-users through interactive prototypes, catching workflow issues early.",
        outcome:
          "Reduced development rework by validating with users before building. Clinical staff feedback directly shaped the final product.",
      },
    ],
    impact: [
      {
        metric: "Admin Time Saved",
        value: "~5hrs",
        description: "Hours saved per week per practice through workflow automation",
      },
      {
        metric: "Adoption Speed",
        value: "1 week",
        description: "Time to full adoption by practice managers after launch",
      },
      {
        metric: "PHI Incidents",
        value: "Zero",
        description: "No data exposure incidents throughout the engagement",
      },
      {
        metric: "Integration Time",
        value: "Resolved",
        description: "OAuth and webhook production issues debugged and fixed",
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
        src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
        caption: "Healthcare technology — building for clinical workflows",
      },
      {
        src: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80",
        caption: "Analytics dashboards — real-time KPI visualization",
      },
    ],
    nextProject: "uav",
  },
  {
    slug: "uav",
    id: "005",
    title: "UAV Autonomous Flight",
    subtitle: "Autonomous Unmanned Aerial Vehicle Systems",
    year: "2023 – 2024",
    role: "President & Technical Lead",
    status: "AUVSI Competition",
    duration: "2023 — 2024",
    team: "25-member engineering team",
    overview:
      "Led a university engineering organization developing autonomous UAV systems for national AUVSI competition. Managed software, electrical, and mechanical sub-teams while personally building the flight control and computer vision systems.",
    problem:
      "Building a fully autonomous unmanned aerial vehicle that can navigate waypoints, detect and classify ground targets, and execute precision maneuvers — all without human intervention during flight. The AUVSI SUAS competition requires teams to solve real-world autonomy problems: autonomous takeoff/landing, obstacle avoidance, target identification, and payload delivery. The engineering challenge spans embedded systems, computer vision, control theory, and real-time communications.",
    approach: [
      "Managed 25 engineers across software, electrical, and mechanical sub-teams with milestone tracking",
      "Developed flight control software in C/C++ integrated with PX4 autopilot via MAVLink protocol",
      "Built computer vision pipeline using Python and OpenCV for real-time object detection",
      "Implemented sensor fusion combining GPS, IMU, and camera data for precise navigation",
      "Established Git workflows, code review processes, and documentation standards for the team",
      "Conducted weekly integration tests combining software, hardware, and flight systems",
    ],
    designDecisions: [
      {
        title: "PX4 + MAVLink Architecture",
        description:
          "Chose PX4 flight controller with MAVLink communication protocol. Custom companion computer runs vision and decision-making, sending high-level commands to PX4 for low-level control. This separation lets us iterate on autonomy software without touching flight safety code.",
        outcome:
          "Achieved stable autonomous flight with reliable failsafe behavior. Software updates didn't risk flight safety.",
      },
      {
        title: "Multi-Sensor Fusion Pipeline",
        description:
          "Combined GPS, IMU, barometer, and camera data through an Extended Kalman Filter. Each sensor compensates for others' weaknesses: GPS for absolute position, IMU for high-frequency attitude, camera for relative positioning during target approach.",
        outcome:
          "Sub-meter positioning accuracy during autonomous waypoint navigation. Robust performance even with GPS signal degradation.",
      },
      {
        title: "OpenCV Vision Pipeline",
        description:
          "Built a multi-stage detection pipeline: color segmentation for initial candidate detection, shape classification for target identification, and OCR for alphanumeric reading. Optimized for real-time processing on embedded hardware.",
        outcome:
          "Reliable target detection at competition altitudes. Processing pipeline runs at 15+ FPS on companion computer.",
      },
    ],
    impact: [
      {
        metric: "Team Size",
        value: "25",
        description: "Engineers managed across software, electrical, and mechanical sub-teams",
      },
      {
        metric: "Detection FPS",
        value: "15+",
        description: "Real-time object detection framerate on embedded hardware",
      },
      {
        metric: "Position Accuracy",
        value: "<1m",
        description: "Sub-meter autonomous waypoint navigation accuracy",
      },
      {
        metric: "Code Quality",
        value: "CI/CD",
        description: "Established Git workflows, code review, and documentation standards",
      },
    ],
    stack: [
      { category: "Flight Software", tools: ["C/C++", "PX4", "MAVLink", "RTOS"] },
      { category: "Computer Vision", tools: ["Python", "OpenCV", "NumPy", "TensorFlow Lite"] },
      { category: "Hardware", tools: ["Pixhawk", "Raspberry Pi", "GPS", "IMU", "Cameras"] },
      { category: "DevOps", tools: ["Git", "CI/CD", "Docker", "Documentation"] },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
        caption: "Autonomous UAV — field testing at competition site",
      },
      {
        src: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80",
        caption: "Computer vision — real-time target detection pipeline",
      },
    ],
    nextProject: "optum",
  },
];

function findStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((s) => s.slug === slug);
}

export default function CaseStudyPage() {
  const params = useParams();
  const slug = params.slug as string;
  const study = findStudy(slug);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  if (!study) {
    return (
      <>
        <Navbar />
        <main className="pt-14 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="font-mono text-xs text-text-light tracking-wider mb-4">404</p>
            <h1 className="text-3xl font-bold text-text-black mb-6">Case study not found</h1>
            <Link
              href="/projects"
              className="font-mono text-[11px] tracking-wider text-text-mid hover:text-text-black transition-colors"
            >
              &larr; Back to Works
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "problem", label: "Problem" },
    { id: "approach", label: "Approach" },
    { id: "design", label: "Design Decisions" },
    { id: "impact", label: "Impact" },
    { id: "stack", label: "Stack" },
  ];

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="pt-14">
          {/* Hero header */}
          <section className="px-5 md:px-8 pt-16 pb-10 border-b border-border-light">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 font-mono text-[10px] tracking-wider text-text-light hover:text-text-black transition-colors uppercase mb-8"
            >
              <span>&larr;</span> Back to Works
            </Link>

            <div className="flex items-baseline gap-3 mb-3">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-xs text-text-light"
              >
                {study.id}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-5xl md:text-7xl font-bold tracking-tight text-text-black"
              >
                {study.title}
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-lg text-text-mid max-w-2xl mb-8"
            >
              {study.subtitle}
            </motion.p>

            {/* Metadata grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {[
                { label: "Role", value: study.role },
                { label: "Duration", value: study.duration },
                { label: "Team", value: study.team },
                { label: "Status", value: study.status },
              ].map((item) => (
                <div key={item.label}>
                  <p className="font-mono text-[9px] tracking-[0.2em] text-text-light uppercase mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm text-text-dark">{item.value}</p>
                </div>
              ))}
            </motion.div>
          </section>

          {/* Two-column layout */}
          <section className="grid md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] gap-0">
            {/* Left — sticky nav */}
            <div className="hidden md:block border-r border-border-light">
              <nav className="sticky top-14 py-8 px-5">
                <p className="font-mono text-[9px] tracking-[0.2em] text-text-light uppercase mb-4">
                  Sections
                </p>
                <ul className="space-y-1">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className={cn(
                          "block py-1.5 font-mono text-[11px] tracking-wider transition-colors",
                          activeSection === s.id
                            ? "text-text-black font-bold"
                            : "text-text-light hover:text-text-mid"
                        )}
                        onClick={() => setActiveSection(s.id)}
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Right — content */}
            <div className="px-5 md:px-8 py-10 max-w-3xl">
              {/* Overview */}
              <section id="overview" className="mb-14">
                <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-4">
                  Overview
                </h2>
                <p className="text-base text-text-dark leading-relaxed">
                  {study.overview}
                </p>

                {/* Hero image */}
                {study.images[0] && (
                  <motion.figure
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-8"
                  >
                    <div className="relative w-full aspect-[16/9]">
                      <Image
                        src={study.images[0].src}
                        alt={study.images[0].caption}
                        fill
                        sizes="(max-width: 768px) 100vw, 60vw"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="font-mono text-[10px] text-text-light tracking-wider mt-3">
                      {study.images[0].caption}
                    </figcaption>
                  </motion.figure>
                )}
              </section>

              {/* Problem */}
              <section id="problem" className="mb-14">
                <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-4">
                  Problem
                </h2>
                <p className="text-base text-text-dark leading-relaxed">
                  {study.problem}
                </p>
              </section>

              {/* Approach */}
              <section id="approach" className="mb-14">
                <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-4">
                  Approach
                </h2>
                <ul className="space-y-3">
                  {study.approach.map((step, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-4 text-sm text-text-dark leading-relaxed"
                    >
                      <span className="font-mono text-[10px] text-text-light mt-0.5 shrink-0">
                        {(i + 1).toString().padStart(2, "0")}
                      </span>
                      {step}
                    </motion.li>
                  ))}
                </ul>

                {/* Secondary image */}
                {study.images[1] && (
                  <motion.figure
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-8"
                  >
                    <div className="relative w-full aspect-[16/9]">
                      <Image
                        src={study.images[1].src}
                        alt={study.images[1].caption}
                        fill
                        sizes="(max-width: 768px) 100vw, 60vw"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="font-mono text-[10px] text-text-light tracking-wider mt-3">
                      {study.images[1].caption}
                    </figcaption>
                  </motion.figure>
                )}
              </section>

              {/* Design Decisions */}
              <section id="design" className="mb-14">
                <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-6">
                  Design Decisions
                </h2>
                <div className="space-y-0">
                  {study.designDecisions.map((decision, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="border-t border-border-light py-6"
                    >
                      <button
                        onClick={() =>
                          setActiveSection(
                            activeSection === `design-${i}` ? null : `design-${i}`
                          )
                        }
                        className="w-full text-left flex items-start gap-4"
                      >
                        <span className="font-mono text-[10px] text-text-light mt-1 shrink-0">
                          {(i + 1).toString().padStart(2, "0")}
                        </span>
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-text-black mb-1">
                            {decision.title}
                          </h3>
                          <p className="text-sm text-text-mid leading-relaxed">
                            {decision.description}
                          </p>
                        </div>
                        <span className="font-mono text-xs text-text-light shrink-0 mt-1">
                          {activeSection === `design-${i}` ? "−" : "+"}
                        </span>
                      </button>
                      <AnimatePresence>
                        {activeSection === `design-${i}` && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 ml-10 pl-4 border-l-2 border-border-light">
                              <p className="font-mono text-[9px] tracking-[0.2em] text-text-light uppercase mb-2">
                                Outcome
                              </p>
                              <p className="text-sm text-text-dark leading-relaxed">
                                {decision.outcome}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                {/* Third image if exists */}
                {study.images[2] && (
                  <motion.figure
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-8"
                  >
                    <div className="relative w-full aspect-[16/9]">
                      <Image
                        src={study.images[2].src}
                        alt={study.images[2].caption}
                        fill
                        sizes="(max-width: 768px) 100vw, 60vw"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="font-mono text-[10px] text-text-light tracking-wider mt-3">
                      {study.images[2].caption}
                    </figcaption>
                  </motion.figure>
                )}
              </section>

              {/* Impact */}
              <section id="impact" className="mb-14">
                <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-6">
                  Impact
                </h2>
                <div className="grid grid-cols-2 gap-0 border-t border-l border-border-light">
                  {study.impact.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="border-r border-b border-border-light p-6"
                    >
                      <p className="font-mono text-[9px] tracking-[0.2em] text-text-light uppercase mb-2">
                        {item.metric}
                      </p>
                      <p className="text-3xl md:text-4xl font-bold text-text-black tracking-tight mb-2">
                        {item.value}
                      </p>
                      <p className="text-xs text-text-mid leading-relaxed">
                        {item.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Stack */}
              <section id="stack" className="mb-14">
                <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-6">
                  Technology Stack
                </h2>
                <div className="space-y-6">
                  {study.stack.map((group) => (
                    <div key={group.category}>
                      <p className="font-mono text-[10px] tracking-wider text-text-mid uppercase mb-3">
                        {group.category}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {group.tools.map((tool) => (
                          <span
                            key={tool}
                            className="px-3 py-1.5 rounded-sm border border-border-light font-mono text-[10px] tracking-wider text-text-dark uppercase hover:bg-bg-light transition-colors"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Next project */}
              {study.nextProject && (
                <section className="border-t border-border-light pt-10">
                  <p className="font-mono text-[9px] tracking-[0.2em] text-text-light uppercase mb-4">
                    Next Case Study
                  </p>
                  <Link
                    href={`/projects/${study.nextProject}`}
                    className="group inline-flex items-center gap-3"
                  >
                    <span className="text-2xl md:text-3xl font-bold text-text-black group-hover:text-text-mid transition-colors">
                      {findStudy(study.nextProject)?.title}
                    </span>
                    <span className="text-text-light group-hover:text-text-black transition-colors">
                      &#8599;
                    </span>
                  </Link>
                </section>
              )}
            </div>
          </section>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
