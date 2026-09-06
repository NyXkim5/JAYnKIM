# Persona Instrument, Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the persona system, evidence registry, canvas dot-matrix specimen, single-screen landing, route transitions, depth page shell, and content migration, with `hardware` and `software` live and `product` and `business` as placeholders.

**Architecture:** Persona is a config object plus a URL segment. A pure canvas renderer turns a `SpecimenFrame` (grid of 0..1 cells, some labelled) into draw calls; adapters build frames from committed JSON snapshots generated offline from DroneNexus and ArchvBrain. An evidence registry is the only source for any number on screen, enforced by a test. Route changes reuse the existing `TransitionOverlay`; persona switches on the landing dissolve the specimen cell by cell and flip the ground.

**Tech Stack:** Next.js 16.1.6 App Router, React 19.2.3, TypeScript strict, Tailwind v4, framer-motion 12, Vitest 4, pnpm. Python 3.12 with numpy for the hardware snapshot script only.

**Spec:** `docs/superpowers/specs/2026-09-05-persona-instrument-portfolio-design.md`

## Global Constraints

- Work only in `/Users/jay/Desktop/jaykim/.claude/worktrees/portfolio-update` on branch `worktree-portfolio-update`. Never run `git -C` against another repo; this session's worktree guard refuses it. Read other repos with `cat`, `sed`, `python3`.
- TypeScript strict. Never `any`. No default exports except Next pages and layouts.
- `pnpm`, never `npm` or `yarn`.
- Functional components only. Functions under 40 lines. One responsibility per function.
- No `console.log` in committed code.
- Every number rendered on any page resolves to an entry in `src/features/evidence/registry.ts`. The test in Task 2 enforces it for `caseStudies.ts`; the Readout and artifact cards only render registry entries by construction.
- No traction language: "signed", "customers", "pilots", "users" are banned in copy unless a signed document is on disk. None is.
- `cactus` (the cactus-compute fork) and `sonicfly-patched` never appear as Jay's work.
- Optum copy: "RFP automation platform" only. No cloud provider. No parsing-accuracy figure.
- Copy style: no em dashes, no semicolons in prose, short sentences, active voice.
- Reduced motion honored in every animated component.
- Commit messages: imperative present tense, no Co-Authored-By lines.
- Gate before declaring any task done: the task's tests pass. Gate before the final task: `pnpm test`, `pnpm type-check`, `pnpm lint`, `pnpm build` all exit 0, checked with `echo $?` directly, never through a pipe.

---

## File map

Created:

```
src/features/persona/personas.ts            persona config + type guards
src/features/persona/personas.test.ts
src/features/persona/usePersona.ts          pure helpers + hook for landing state
src/features/persona/usePersona.test.ts
src/features/persona/useScrambleText.ts     cherry-picked verbatim from wip/dossier-terminal
src/features/persona/artifacts.ts           artifact cards per persona
src/features/persona/artifacts.test.ts
src/features/persona/PersonaSwitch.tsx
src/features/persona/PersonaSwitch.test.tsx
src/features/persona/PersonaBar.tsx         thin bar for depth pages
src/features/evidence/registry.ts
src/features/evidence/registry.test.ts
src/features/evidence/Readout.tsx
src/features/evidence/Readout.test.tsx
src/features/specimen/types.ts
src/features/specimen/renderer.ts           pure: layout, render, paint, interpolate, breathe
src/features/specimen/renderer.test.ts
src/features/specimen/snapshot.ts           snapshot JSON -> SpecimenFrame, upsample, placeholder
src/features/specimen/snapshot.test.ts
src/features/specimen/adapters.ts           frameFor(persona)
src/features/specimen/adapters.test.ts
src/features/specimen/data/hardware.json
src/features/specimen/data/software.json
src/features/specimen/Specimen.tsx
src/features/landing/Clock.tsx
src/features/landing/Landing.tsx
src/features/depth/PersonaDepth.tsx
src/app/[persona]/page.tsx
src/app/[persona]/[slug]/page.tsx
scripts/specimen/hardware.py
scripts/specimen/software.py
```

Modified:

```
src/data/caseStudies.ts                     personas field, evidenceId on impact, metric migration
src/data/caseStudies.test.ts
src/data/routes.ts                          persona routes replace /projects in primary nav
src/app/page.tsx                            renders Landing
src/app/about/page.tsx                      renders HomeContent instead of redirecting
src/app/projects/ProjectsContent.tsx        strip unverified numbers from two descriptions
src/app/projects/[slug]/CaseStudyContent.tsx  hide Impact section when empty
src/app/sitemap.ts                          persona routes
src/components/layout/Navbar.tsx            primary links no longer sliced by index
src/components/transitions/TransitionOverlay.tsx  persona routes + overlay color per target
vitest.config.ts                            tsx tests, jsx automatic
package.json                                jsdom + testing-library devDeps
```

Deleted:

```
src/styles/theme.ts
```

---

### Task 1: Persona config

**Files:**
- Create: `src/features/persona/personas.ts`
- Test: `src/features/persona/personas.test.ts`

**Interfaces:**
- Produces: `PersonaKey`, `Ground`, `Persona`, `PERSONAS`, `DEFAULT_PERSONA`, `isPersonaKey(x: string): x is PersonaKey`, `getPersona(key: PersonaKey): Persona`, `PERSONA_KEYS: readonly PersonaKey[]`

- [ ] **Step 1: Write the failing test**

```ts
// src/features/persona/personas.test.ts
import { describe, it, expect } from "vitest";
import {
  PERSONAS,
  PERSONA_KEYS,
  DEFAULT_PERSONA,
  isPersonaKey,
  getPersona,
} from "./personas";

describe("personas", () => {
  it("defines exactly four personas in keyboard order", () => {
    expect(PERSONA_KEYS).toEqual(["hardware", "software", "product", "business"]);
    expect(PERSONAS.map((p) => p.index)).toEqual([1, 2, 3, 4]);
  });

  it("puts hardware and software on black, product and business on white", () => {
    expect(getPersona("hardware").ground).toBe("black");
    expect(getPersona("software").ground).toBe("black");
    expect(getPersona("product").ground).toBe("white");
    expect(getPersona("business").ground).toBe("white");
  });

  it("marks only hardware and software live in phase 1", () => {
    expect(PERSONAS.filter((p) => p.live).map((p) => p.key)).toEqual(["hardware", "software"]);
  });

  it("defaults to hardware", () => {
    expect(DEFAULT_PERSONA).toBe("hardware");
  });

  it("guards unknown keys", () => {
    expect(isPersonaKey("hardware")).toBe(true);
    expect(isPersonaKey("war")).toBe(false);
    expect(isPersonaKey("")).toBe(false);
  });

  it("gives every persona a one-sentence claim with no em dash", () => {
    for (const p of PERSONAS) {
      expect(p.claim.length).toBeGreaterThan(20);
      expect(p.claim).not.toContain("—");
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/features/persona/personas.test.ts`
Expected: FAIL, cannot find module `./personas`

- [ ] **Step 3: Write the implementation**

```ts
// src/features/persona/personas.ts
export type PersonaKey = "hardware" | "software" | "product" | "business";
export type Ground = "black" | "white";

export type Persona = {
  key: PersonaKey;
  label: string;
  short: string;
  ground: Ground;
  index: 1 | 2 | 3 | 4;
  claim: string;
  live: boolean;
};

export const PERSONAS: readonly Persona[] = [
  {
    key: "hardware",
    label: "Hardware & Systems",
    short: "HARDWARE",
    ground: "black",
    index: 1,
    claim: "I write the math that decides where a sensor goes, and I say out loud when no hardware is wired in yet.",
    live: true,
  },
  {
    key: "software",
    label: "Software & AI/ML",
    short: "SOFTWARE",
    ground: "black",
    index: 2,
    claim: "I measure whether my AI is lying before I let it answer.",
    live: true,
  },
  {
    key: "product",
    label: "Product & Design",
    short: "PRODUCT",
    ground: "white",
    index: 3,
    claim: "I ship to the App Store, then grade my own app a B and fix what I found.",
    live: false,
  },
  {
    key: "business",
    label: "Business & Strategy",
    short: "BUSINESS",
    ground: "white",
    index: 4,
    claim: "I source every market claim and write the kill gate before I start.",
    live: false,
  },
] as const;

export const PERSONA_KEYS: readonly PersonaKey[] = PERSONAS.map((p) => p.key);
export const DEFAULT_PERSONA: PersonaKey = "hardware";

export function isPersonaKey(x: string): x is PersonaKey {
  return (PERSONA_KEYS as readonly string[]).includes(x);
}

export function getPersona(key: PersonaKey): Persona {
  const found = PERSONAS.find((p) => p.key === key);
  if (!found) throw new Error(`unknown persona: ${key}`);
  return found;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/features/persona/personas.test.ts`
Expected: PASS, 6 tests

- [ ] **Step 5: Commit**

```bash
git add src/features/persona/personas.ts src/features/persona/personas.test.ts
git commit -m "Add persona config with grounds, claims, and keyboard order"
```

---

### Task 2: Evidence registry

**Files:**
- Create: `src/features/evidence/registry.ts`
- Test: `src/features/evidence/registry.test.ts`

**Interfaces:**
- Consumes: `PersonaKey` from Task 1
- Produces: `Evidence`, `EVIDENCE`, `findEvidence(id: string): Evidence | undefined`, `evidenceFor(persona: PersonaKey): Evidence[]`, `sourceHref(e: Evidence): string`

- [ ] **Step 1: Write the failing test**

```ts
// src/features/evidence/registry.test.ts
import { describe, it, expect } from "vitest";
import { EVIDENCE, findEvidence, evidenceFor, sourceHref } from "./registry";

describe("evidence registry", () => {
  it("has unique ids", () => {
    const ids = EVIDENCE.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("requires how and observedAt on every entry", () => {
    for (const e of EVIDENCE) {
      expect(e.how.length, e.id).toBeGreaterThan(5);
      expect(e.observedAt, e.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("assigns every entry to at least one persona", () => {
    for (const e of EVIDENCE) {
      expect(e.persona.length, e.id).toBeGreaterThan(0);
    }
  });

  it("finds by id and returns undefined for unknown", () => {
    expect(findEvidence("dronenexus.tests.collected")?.value).toBe("3,800");
    expect(findEvidence("nope")).toBeUndefined();
  });

  it("filters by persona", () => {
    const hw = evidenceFor("hardware");
    expect(hw.length).toBeGreaterThan(2);
    for (const e of hw) expect(e.persona).toContain("hardware");
  });

  it("links public repos to GitHub and private ones to the depth page anchor", () => {
    const pub = EVIDENCE.find((e) => e.public);
    const priv = EVIDENCE.find((e) => !e.public);
    expect(pub && sourceHref(pub)).toMatch(/^https:\/\/github\.com\//);
    expect(priv && sourceHref(priv)).toMatch(/^\/[a-z]+#/);
  });

  it("warns nothing is older than 90 days", () => {
    const cutoff = Date.now() - 90 * 24 * 3600 * 1000;
    const stale = EVIDENCE.filter((e) => new Date(e.observedAt).getTime() < cutoff);
    expect(stale.map((e) => e.id)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/features/evidence/registry.test.ts`
Expected: FAIL, cannot find module `./registry`

- [ ] **Step 3: Write the implementation**

Every entry below was produced by a command run during discovery on 2026-09-05. Do not add an entry without a `how` you actually ran or a file you actually read.

```ts
// src/features/evidence/registry.ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/features/evidence/registry.test.ts`
Expected: PASS, 7 tests

- [ ] **Step 5: Commit**

```bash
git add src/features/evidence/registry.ts src/features/evidence/registry.test.ts
git commit -m "Add evidence registry seeded from discovery"
```

---

### Task 3: Content migration of caseStudies.ts

**Files:**
- Modify: `src/data/caseStudies.ts` (type at lines 1-53, impact blocks at 196-222, 366-386, 444-458, 533-557, 633-647, 711-725)
- Modify: `src/data/caseStudies.test.ts`
- Modify: `src/app/projects/ProjectsContent.tsx` (archv and medvanta descriptions)
- Modify: `src/app/projects/[slug]/CaseStudyContent.tsx` (line 60 nav item, lines 563-575 impact section)

**Interfaces:**
- Consumes: `PersonaKey` from Task 1, `findEvidence` from Task 2
- Produces: `CaseStudy.personas: PersonaKey[]`, `CaseStudy.impact[n].evidenceId: string`, `studiesFor(persona: PersonaKey): CaseStudy[]`

- [ ] **Step 1: Write the failing tests**

Append to `src/data/caseStudies.test.ts`:

```ts
import { findEvidence } from "@/features/evidence/registry";
import { PERSONA_KEYS } from "@/features/persona/personas";
import { studiesFor } from "./caseStudies";

describe("caseStudies content rules", () => {
  it("assigns every study to at least one persona", () => {
    for (const s of caseStudies) {
      expect(s.personas.length, s.slug).toBeGreaterThan(0);
      for (const p of s.personas) expect(PERSONA_KEYS).toContain(p);
    }
  });

  it("backs every impact metric with a registry entry", () => {
    for (const s of caseStudies) {
      for (const item of s.impact) {
        expect(findEvidence(item.evidenceId), `${s.slug}: ${item.metric}`).toBeDefined();
      }
    }
  });

  it("never claims traction", () => {
    const banned = /\b(signed|customers?|pilots?|users?)\b/i;
    for (const s of caseStudies) {
      for (const item of s.impact) {
        expect(`${item.metric} ${item.value} ${item.description}`, s.slug).not.toMatch(banned);
      }
    }
  });

  it("filters by persona", () => {
    expect(studiesFor("hardware").map((s) => s.slug)).toEqual(["drone-dashboard", "drone-virtual-env"]);
  });
});
```

Note: the existing file already imports `caseStudies` and `describe/it/expect`. Place the new imports at the top with the existing ones.

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/data/caseStudies.test.ts`
Expected: FAIL on `personas` undefined and `evidenceId` undefined

- [ ] **Step 3: Update the CaseStudy type**

In `src/data/caseStudies.ts`, at the top of the file add the import, and inside `export interface CaseStudy` change the `impact` shape and add `personas`:

```ts
import type { PersonaKey } from "@/features/persona/personas";

export interface CaseStudy {
  slug: string;
  id: string;
  personas: PersonaKey[];
  // ... every existing field stays exactly as it is, except impact:
  impact: {
    metric: string;
    value: string;
    description: string;
    evidenceId: string;
  }[];
  // ... rest unchanged
}
```

- [ ] **Step 4: Add `personas` to each study and migrate each `impact` block**

Add `personas` right after `id:` in each study object, and replace each `impact: [...]` block with the content below. Every other field in each study stays untouched.

optum:
```ts
    personas: ["software"],
    // ...
    impact: [
      {
        metric: "Volume",
        value: "Tens of thousands",
        description: "RFPs a year through one platform",
        evidenceId: "optum.rfp.volume",
      },
    ],
```

archv (replaces all five previous entries):
```ts
    personas: ["software", "product"],
    // ...
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
```

cactus (all four removed, no source on disk):
```ts
    personas: ["software"],
    // ...
    impact: [],
```

medvanta (all three removed, no source on disk):
```ts
    personas: ["product", "software"],
    // ...
    impact: [],
```

drone-dashboard (replaces all five):
```ts
    personas: ["hardware"],
    // ...
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
```

drone-virtual-env (all three removed):
```ts
    personas: ["hardware"],
    // ...
    impact: [],
```

va-gov-mvp (all three removed):
```ts
    personas: ["product", "business"],
    // ...
    impact: [],
```

- [ ] **Step 5: Add `studiesFor`**

Append to the bottom of `src/data/caseStudies.ts`, after `findStudy`:

```ts
export function studiesFor(persona: PersonaKey): CaseStudy[] {
  return caseStudies.filter((s) => s.personas.includes(persona));
}
```

- [ ] **Step 6: Strip the two unverified summary descriptions**

In `src/app/projects/ProjectsContent.tsx`:

Replace the archv `description` string with:
```ts
    description: "Founded AI document review startup for regulated industries. 40+ user interviews. Chose RAG over fine-tuning for built-in citations. Targeted law students as the entry point into institutional adoption. The eval harness measures whether a citation points at real text, and the committed baseline holds that rate at zero false anchors.",
```

Replace the medvanta `description` string with:
```ts
    description: "Built VantaStat to collapse the timeline from orthopaedic injury to specialist consultation from days to minutes. Shipped analytics dashboards, a HIPAA-compliant backend, and workflow automation for practice managers.",
```

- [ ] **Step 7: Hide the Impact section when empty**

In `src/app/projects/[slug]/CaseStudyContent.tsx`, read lines 55-65 and 560-580 first. Then:

At the nav item list around line 60, the array includes `{ id: "impact", label: "Impact" }`. After the array is built, filter it:

```ts
const navItems = allNavItems.filter((item) => item.id !== "impact" || study.impact.length > 0);
```

If the array is a literal assigned to a `const` used directly, rename that const to `allNavItems` and add the line above immediately after it, then use `navItems` where the original was used.

At the impact section around line 563, wrap the existing `<section id="impact" ...>...</section>` block:

```tsx
{study.impact.length > 0 && (
  <section id="impact" className="mb-14">
    {/* existing section body unchanged */}
  </section>
)}
```

- [ ] **Step 8: Run tests and type-check**

Run: `pnpm vitest run src/data/caseStudies.test.ts`
Expected: PASS, 8 tests

Run: `pnpm type-check; echo "exit=$?"`
Expected: `exit=0`

- [ ] **Step 9: Commit**

```bash
git add src/data/caseStudies.ts src/data/caseStudies.test.ts src/app/projects/ProjectsContent.tsx "src/app/projects/[slug]/CaseStudyContent.tsx"
git commit -m "Migrate case study metrics to the evidence registry and tag personas"
```

---

### Task 4: Specimen types and pure renderer

**Files:**
- Create: `src/features/specimen/types.ts`
- Create: `src/features/specimen/renderer.ts`
- Test: `src/features/specimen/renderer.test.ts`

**Interfaces:**
- Consumes: `Ground` from Task 1
- Produces: `Cell`, `SpecimenFrame`, `DrawCall`, `Layout`, `layout(frame, width, height): Layout`, `render(frame, width, height, ground): DrawCall[]`, `paint(ctx, calls, ground): void`, `emptyFrame(cols, rows): SpecimenFrame`, `interpolate(a, b, t): SpecimenFrame`, `breathe(frame, seed, tick): SpecimenFrame`

- [ ] **Step 1: Write the types**

```ts
// src/features/specimen/types.ts
export type Cell = { v: number; label?: string };

export type SpecimenFrame = {
  cols: number;
  rows: number;
  cells: Cell[]; // row-major, length cols * rows
};

export type Layout = { cell: number; gap: number; ox: number; oy: number };

export type DrawCall =
  | { kind: "rect"; x: number; y: number; w: number; h: number; gray: number }
  | { kind: "text"; x: number; y: number; text: string; size: number; gray: number };
```

- [ ] **Step 2: Write the failing tests**

```ts
// src/features/specimen/renderer.test.ts
import { describe, it, expect } from "vitest";
import { layout, render, emptyFrame, interpolate, breathe } from "./renderer";
import type { SpecimenFrame } from "./types";

function frame(cols: number, rows: number, v = 0.5): SpecimenFrame {
  return { cols, rows, cells: Array.from({ length: cols * rows }, () => ({ v })) };
}

describe("layout", () => {
  it("fits the grid inside the box and centres it", () => {
    const l = layout(frame(4, 2), 400, 400);
    expect(l.cell).toBe(100);
    expect(l.ox).toBe(0);
    expect(l.oy).toBe(100);
  });

  it("keeps a gap of at least one pixel", () => {
    expect(layout(frame(100, 100), 50, 50).gap).toBeGreaterThanOrEqual(1);
  });
});

describe("render", () => {
  it("skips cells at or below the floor", () => {
    const f = frame(2, 1, 0);
    f.cells[1] = { v: 1 };
    const calls = render(f, 200, 100, "black");
    expect(calls.filter((c) => c.kind === "rect")).toHaveLength(1);
  });

  it("is deterministic", () => {
    const f = frame(3, 3, 0.7);
    expect(render(f, 300, 300, "black")).toEqual(render(f, 300, 300, "black"));
  });

  it("draws a labelled cell as an inverse rect plus text", () => {
    const f = frame(1, 1, 0.3);
    f.cells[0] = { v: 0.3, label: "7" };
    const calls = render(f, 100, 100, "black");
    const rect = calls.find((c) => c.kind === "rect");
    const text = calls.find((c) => c.kind === "text");
    expect(rect && rect.gray).toBe(1);
    expect(text && text.text).toBe("7");
    expect(text && text.gray).toBe(0);
  });

  it("maps brighter values to lighter gray on black and darker gray on white", () => {
    const f = frame(1, 1, 1);
    const onBlack = render(f, 10, 10, "black")[0];
    const onWhite = render(f, 10, 10, "white")[0];
    expect(onBlack.kind === "rect" && onBlack.gray).toBeGreaterThan(0.8);
    expect(onWhite.kind === "rect" && onWhite.gray).toBeLessThan(0.2);
  });
});

describe("interpolate", () => {
  it("returns a at t=0 and b at t=1", () => {
    const a = frame(4, 4, 0.2);
    const b = frame(4, 4, 0.9);
    expect(interpolate(a, b, 0)).toEqual(a);
    expect(interpolate(a, b, 1)).toEqual(b);
  });

  it("resolves cells in reading order", () => {
    const a = frame(4, 1, 0);
    const b = frame(4, 1, 1);
    const mid = interpolate(a, b, 0.5);
    expect(mid.cells.map((c) => c.v)).toEqual([1, 1, 0, 0]);
  });

  it("throws on mismatched dimensions", () => {
    expect(() => interpolate(frame(2, 2), frame(3, 3), 0.5)).toThrow();
  });
});

describe("breathe", () => {
  it("changes at most one percent of cells", () => {
    const f = frame(50, 50, 0.5);
    const out = breathe(f, 7, 3);
    const changed = out.cells.filter((c, i) => c.v !== f.cells[i].v).length;
    expect(changed).toBeLessThanOrEqual(25);
    expect(changed).toBeGreaterThan(0);
  });

  it("stays within range and is deterministic for the same seed and tick", () => {
    const f = frame(20, 20, 0.98);
    const a = breathe(f, 1, 9);
    const b = breathe(f, 1, 9);
    expect(a).toEqual(b);
    for (const c of a.cells) {
      expect(c.v).toBeGreaterThanOrEqual(0);
      expect(c.v).toBeLessThanOrEqual(1);
    }
  });

  it("never touches labelled cells", () => {
    const f = frame(10, 10, 0.5);
    f.cells[0] = { v: 0.5, label: "3" };
    for (let t = 0; t < 50; t++) {
      expect(breathe(f, 4, t).cells[0]).toEqual(f.cells[0]);
    }
  });
});

describe("emptyFrame", () => {
  it("builds a zeroed frame of the right size", () => {
    const e = emptyFrame(3, 2);
    expect(e.cells).toHaveLength(6);
    expect(e.cells.every((c) => c.v === 0 && c.label === undefined)).toBe(true);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `pnpm vitest run src/features/specimen/renderer.test.ts`
Expected: FAIL, cannot find module `./renderer`

- [ ] **Step 4: Write the renderer**

```ts
// src/features/specimen/renderer.ts
import type { Cell, DrawCall, Layout, SpecimenFrame } from "./types";
import type { Ground } from "@/features/persona/personas";

const FLOOR = 0.02;
const BREATHE_FRACTION = 0.01;
const BREATHE_AMOUNT = 0.04;

export function layout(frame: SpecimenFrame, width: number, height: number): Layout {
  const cell = Math.max(1, Math.floor(Math.min(width / frame.cols, height / frame.rows)));
  const gap = Math.max(1, Math.round(cell * 0.12));
  const ox = Math.floor((width - cell * frame.cols) / 2);
  const oy = Math.floor((height - cell * frame.rows) / 2);
  return { cell, gap, ox, oy };
}

function grayFor(v: number, ground: Ground): number {
  const t = Math.min(1, Math.max(0, v));
  return ground === "black" ? 0.12 + t * 0.8 : 0.88 - t * 0.8;
}

function inverse(ground: Ground): number {
  return ground === "black" ? 1 : 0;
}

function cellCalls(c: Cell, x: number, y: number, size: number, ground: Ground): DrawCall[] {
  if (c.label !== undefined) {
    return [
      { kind: "rect", x, y, w: size, h: size, gray: inverse(ground) },
      { kind: "text", x: x + size / 2, y: y + size / 2, text: c.label, size: size * 0.6, gray: 1 - inverse(ground) },
    ];
  }
  if (c.v <= FLOOR) return [];
  return [{ kind: "rect", x, y, w: size, h: size, gray: grayFor(c.v, ground) }];
}

export function render(frame: SpecimenFrame, width: number, height: number, ground: Ground): DrawCall[] {
  const l = layout(frame, width, height);
  const size = l.cell - l.gap;
  const calls: DrawCall[] = [];
  for (let r = 0; r < frame.rows; r++) {
    for (let c = 0; c < frame.cols; c++) {
      const cell = frame.cells[r * frame.cols + c];
      const x = l.ox + c * l.cell + l.gap / 2;
      const y = l.oy + r * l.cell + l.gap / 2;
      calls.push(...cellCalls(cell, x, y, size, ground));
    }
  }
  return calls;
}

function grayCss(g: number): string {
  const n = Math.round(g * 255);
  return `rgb(${n},${n},${n})`;
}

export function paint(ctx: CanvasRenderingContext2D, calls: DrawCall[], ground: Ground): void {
  ctx.fillStyle = ground === "black" ? "#0a0a0a" : "#ffffff";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (const call of calls) {
    ctx.fillStyle = grayCss(call.gray);
    if (call.kind === "rect") {
      ctx.fillRect(call.x, call.y, call.w, call.h);
      continue;
    }
    ctx.save();
    ctx.translate(call.x, call.y);
    ctx.rotate(-Math.PI / 2);
    ctx.font = `${call.size}px var(--font-jetbrains), monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(call.text, 0, 0);
    ctx.restore();
  }
}

export function emptyFrame(cols: number, rows: number): SpecimenFrame {
  return { cols, rows, cells: Array.from({ length: cols * rows }, () => ({ v: 0 })) };
}

export function interpolate(a: SpecimenFrame, b: SpecimenFrame, t: number): SpecimenFrame {
  if (a.cols !== b.cols || a.rows !== b.rows) {
    throw new Error("interpolate needs frames of equal dimensions");
  }
  const n = a.cells.length;
  const resolved = Math.round(Math.min(1, Math.max(0, t)) * n);
  const cells = a.cells.map((cell, i) => (i < resolved ? b.cells[i] : cell));
  return { cols: a.cols, rows: a.rows, cells };
}

function lcg(seed: number): () => number {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function breathe(frame: SpecimenFrame, seed: number, tick: number): SpecimenFrame {
  const rnd = lcg(seed * 7919 + tick * 104729);
  const n = frame.cells.length;
  const count = Math.max(1, Math.floor(n * BREATHE_FRACTION));
  const cells = frame.cells.slice();
  for (let k = 0; k < count; k++) {
    const i = Math.floor(rnd() * n);
    const cell = cells[i];
    if (cell.label !== undefined) continue;
    const delta = (rnd() * 2 - 1) * BREATHE_AMOUNT;
    cells[i] = { v: Math.min(1, Math.max(0, cell.v + delta)) };
  }
  return { cols: frame.cols, rows: frame.rows, cells };
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm vitest run src/features/specimen/renderer.test.ts`
Expected: PASS, 13 tests

If `breathe` "changes at most one percent" fails with 0 changes, the LCG picked an index whose delta rounded to the same value. That cannot happen with floating point unless delta is exactly 0, which the test seed avoids. If it does, change the test's seed, not the implementation.

- [ ] **Step 6: Commit**

```bash
git add src/features/specimen/types.ts src/features/specimen/renderer.ts src/features/specimen/renderer.test.ts
git commit -m "Add pure dot-matrix renderer with dissolve and breathe"
```

---

### Task 5: Snapshot loader, upsample, placeholder

**Files:**
- Create: `src/features/specimen/snapshot.ts`
- Test: `src/features/specimen/snapshot.test.ts`

**Interfaces:**
- Consumes: `SpecimenFrame` from Task 4, `PersonaKey` from Task 1
- Produces: `SpecimenSnapshot`, `snapshotToFrame(s): SpecimenFrame`, `upsample(frame, factor): SpecimenFrame`, `placeholderFrame(cols, rows): SpecimenFrame`

- [ ] **Step 1: Write the failing tests**

```ts
// src/features/specimen/snapshot.test.ts
import { describe, it, expect } from "vitest";
import { snapshotToFrame, upsample, placeholderFrame, type SpecimenSnapshot } from "./snapshot";

function snap(overrides: Partial<SpecimenSnapshot> = {}): SpecimenSnapshot {
  return {
    persona: "hardware",
    cols: 2,
    rows: 2,
    values: [0, 0.5, 1, 0.25],
    labels: { "3": "1" },
    source: {
      repo: "NyXkim5/DroneNexus",
      commit: "abc",
      path: "services/core/siting/",
      how: "python3 scripts/specimen/hardware.py",
      observedAt: "2026-09-05",
    },
    ...overrides,
  };
}

describe("snapshotToFrame", () => {
  it("builds a frame with labels at the right indices", () => {
    const f = snapshotToFrame(snap());
    expect(f.cols).toBe(2);
    expect(f.cells[3]).toEqual({ v: 0.25, label: "1" });
    expect(f.cells[0]).toEqual({ v: 0 });
  });

  it("rejects a value outside 0..1", () => {
    expect(() => snapshotToFrame(snap({ values: [0, 0.5, 1.5, 0.25] }))).toThrow(/range/);
  });

  it("rejects a length mismatch", () => {
    expect(() => snapshotToFrame(snap({ values: [0, 0.5] }))).toThrow(/length/);
  });

  it("rejects a label index outside the grid", () => {
    expect(() => snapshotToFrame(snap({ labels: { "9": "x" } }))).toThrow(/label/);
  });
});

describe("upsample", () => {
  it("repeats each cell into a factor x factor block and keeps the label top-left", () => {
    const f = snapshotToFrame(snap());
    const up = upsample(f, 2);
    expect(up.cols).toBe(4);
    expect(up.rows).toBe(4);
    expect(up.cells[0].v).toBe(0);
    expect(up.cells[1].v).toBe(0);
    expect(up.cells[2].v).toBe(0.5);
    expect(up.cells[10]).toEqual({ v: 0.25, label: "1" });
    expect(up.cells[11]).toEqual({ v: 0.25 });
  });
});

describe("placeholderFrame", () => {
  it("is a dim sparse grid with no labels", () => {
    const p = placeholderFrame(8, 8);
    expect(p.cells).toHaveLength(64);
    const lit = p.cells.filter((c) => c.v > 0);
    expect(lit.length).toBeGreaterThan(4);
    expect(lit.length).toBeLessThan(32);
    expect(p.cells.every((c) => c.label === undefined && c.v <= 0.2)).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/features/specimen/snapshot.test.ts`
Expected: FAIL, cannot find module `./snapshot`

- [ ] **Step 3: Write the implementation**

```ts
// src/features/specimen/snapshot.ts
import type { PersonaKey } from "@/features/persona/personas";
import type { Cell, SpecimenFrame } from "./types";

export type SnapshotSource = {
  repo: string;
  commit: string;
  path: string;
  how: string;
  observedAt: string;
  note?: string;
};

export type SpecimenSnapshot = {
  persona: PersonaKey;
  cols: number;
  rows: number;
  values: number[];
  labels: Record<string, string>;
  source: SnapshotSource;
};

function checkValues(s: SpecimenSnapshot): void {
  const expected = s.cols * s.rows;
  if (s.values.length !== expected) {
    throw new Error(`snapshot length ${s.values.length} does not match ${s.cols}x${s.rows}`);
  }
  for (const v of s.values) {
    if (!Number.isFinite(v) || v < 0 || v > 1) throw new Error(`snapshot value out of range: ${v}`);
  }
}

function checkLabels(s: SpecimenSnapshot): void {
  const max = s.cols * s.rows;
  for (const key of Object.keys(s.labels)) {
    const i = Number(key);
    if (!Number.isInteger(i) || i < 0 || i >= max) throw new Error(`snapshot label index invalid: ${key}`);
  }
}

export function snapshotToFrame(s: SpecimenSnapshot): SpecimenFrame {
  checkValues(s);
  checkLabels(s);
  const cells: Cell[] = s.values.map((v, i) => {
    const label = s.labels[String(i)];
    return label === undefined ? { v } : { v, label };
  });
  return { cols: s.cols, rows: s.rows, cells };
}

export function upsample(frame: SpecimenFrame, factor: number): SpecimenFrame {
  const cols = frame.cols * factor;
  const rows = frame.rows * factor;
  const cells: Cell[] = new Array(cols * rows);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const src = frame.cells[Math.floor(r / factor) * frame.cols + Math.floor(c / factor)];
      const topLeft = r % factor === 0 && c % factor === 0;
      cells[r * cols + c] = topLeft && src.label !== undefined ? { v: src.v, label: src.label } : { v: src.v };
    }
  }
  return { cols, rows, cells };
}

export function placeholderFrame(cols: number, rows: number): SpecimenFrame {
  const cells: Cell[] = [];
  for (let i = 0; i < cols * rows; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const lit = (r + c) % 3 === 0 && (r * 7 + c * 13) % 5 < 2;
    cells.push({ v: lit ? 0.12 : 0 });
  }
  return { cols, rows, cells };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/features/specimen/snapshot.test.ts`
Expected: PASS, 6 tests

- [ ] **Step 5: Commit**

```bash
git add src/features/specimen/snapshot.ts src/features/specimen/snapshot.test.ts
git commit -m "Add specimen snapshot loader with validation, upsample, and placeholder"
```

---

### Task 6: Hardware snapshot script and data

**Files:**
- Create: `scripts/specimen/hardware.py`
- Create: `src/features/specimen/data/hardware.json` (generated)

**Interfaces:**
- Produces: `hardware.json` conforming to `SpecimenSnapshot` with `cols: 48, rows: 48`

This script runs against `/Users/jay/DroneNexus` with its `services/core` on `PYTHONPATH`. It builds the same ridge scenario DroneNexus's own end-to-end test uses, sizes the demand grid to 48 x 48 cells, picks four sensors greedily, and writes `plan.covered` as the values with the chosen sensor positions as labels.

- [ ] **Step 1: Write the script**

```python
# scripts/specimen/hardware.py
"""Emit the hardware specimen snapshot from a real DroneNexus siting run.

Run from the portfolio repo root:

  PYTHONPATH=/Users/jay/DroneNexus/packages/shared/python:/Users/jay/DroneNexus/services/core:/Users/jay/DroneNexus/services/sensor \
    python3 scripts/specimen/hardware.py > src/features/specimen/data/hardware.json

The scenario is DroneNexus's own hand-checkable case: a north-south ridge with
demand on both sides. Nothing here is invented; the numbers are what the
optimizer computed.
"""
from __future__ import annotations

import datetime as dt
import json
import sys
from pathlib import Path

import numpy as np

from siting.coverage import coverage_matrix
from siting.greedy import greedy_select
from siting.model import Candidate, build_demand_grid
from terrain.model import Terrain
from terrain.synthetic import ridge

DRONENEXUS = Path("/Users/jay/DroneNexus")
CELLS = 48
RESOLUTION_M = 50.0
RADIUS_M = CELLS * RESOLUTION_M / 2.0
ORIGIN = (1500.0, -1500.0, 0.0)
SENSORS = 4


def head_sha(repo: Path) -> str:
    """Resolve HEAD by reading .git files. No git subprocess."""
    head = (repo / ".git" / "HEAD").read_text().strip()
    if not head.startswith("ref:"):
        return head
    ref = repo / ".git" / head.split(" ", 1)[1]
    if ref.exists():
        return ref.read_text().strip()
    packed = (repo / ".git" / "packed-refs").read_text().splitlines()
    for line in packed:
        if line.endswith(head.split(" ", 1)[1]):
            return line.split(" ")[0]
    raise SystemExit("could not resolve HEAD")


def candidates() -> list[Candidate]:
    """A 6 x 6 lattice of ten metre masts across the square."""
    out = []
    for i in range(6):
        for j in range(6):
            east = 250.0 + 500.0 * i
            north = -250.0 - 500.0 * j
            out.append(Candidate(position=(east, north, 10.0), range_m=1800.0, label=f"{i}{j}"))
    return out


def nearest_cell(demand, east: float, north: float) -> int:
    band = demand.band_slice(0)
    d = (demand.east[band] - east) ** 2 + (demand.north[band] - north) ** 2
    return int(np.argmin(d))


def main() -> int:
    terrain = Terrain(layers=(ridge(rows=300, cols=300, base=90.0, peak=260.0, resolution_m=10.0),))
    demand = build_demand_grid(
        origin=ORIGIN, terrain=terrain, radius_m=RADIUS_M,
        resolution_m=RESOLUTION_M, altitudes_agl_m=(40.0,),
    )
    if demand.shape != (CELLS, CELLS):
        raise SystemExit(f"expected {CELLS}x{CELLS}, got {demand.shape}")
    cands = candidates()
    plan = greedy_select(coverage_matrix(cands, demand, terrain), k=SENSORS)
    covered = plan.covered[demand.band_slice(0)]
    values = [round(float(v), 4) for v in covered]
    labels = {}
    for order, pick in enumerate(plan.chosen, start=1):
        c = cands[pick]
        labels[str(nearest_cell(demand, c.position[0], c.position[1]))] = str(order)
    snapshot = {
        "persona": "hardware",
        "cols": CELLS,
        "rows": CELLS,
        "values": values,
        "labels": labels,
        "source": {
            "repo": "NyXkim5/DroneNexus",
            "commit": head_sha(DRONENEXUS),
            "path": "services/core/siting/",
            "how": "python3 scripts/specimen/hardware.py (ridge terrain, 48x48 demand at 50 m, 36 candidates, k=4)",
            "observedAt": dt.date.today().isoformat(),
            "note": f"expected_fraction={plan.expected_fraction:.4f} chosen={list(plan.chosen)} marginal={[round(g, 1) for g in plan.marginal_gain]}",
        },
    }
    json.dump(snapshot, sys.stdout, indent=None, separators=(",", ":"))
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

- [ ] **Step 2: Run it**

```bash
mkdir -p src/features/specimen/data
PYTHONPATH=/Users/jay/DroneNexus/packages/shared/python:/Users/jay/DroneNexus/services/core:/Users/jay/DroneNexus/services/sensor python3 scripts/specimen/hardware.py > src/features/specimen/data/hardware.json
echo "exit=$?"
```

Expected: `exit=0`. If `ImportError: csontology`, the shared package path is wrong: `ls /Users/jay/DroneNexus/packages/shared/python` and adjust. If `expected 48x48, got (47, 47)`, floating point truncation in `build_demand_grid`; change `RADIUS_M` to `CELLS * RESOLUTION_M / 2.0 + 0.5`.

- [ ] **Step 3: Verify the output shape**

```bash
python3 -c "
import json; d=json.load(open('src/features/specimen/data/hardware.json'))
assert d['cols']==48 and d['rows']==48 and len(d['values'])==2304, 'shape'
assert all(0<=v<=1 for v in d['values']), 'range'
assert len(d['labels'])==4, 'labels'
print('ok', d['source']['note'])
"
```

Expected: `ok expected_fraction=0.xxxx chosen=[...] marginal=[...]`. Write the printed `note` into your task summary; it is the real number the site will show.

- [ ] **Step 4: Commit**

```bash
git add scripts/specimen/hardware.py src/features/specimen/data/hardware.json
git commit -m "Add hardware specimen snapshot from a DroneNexus siting run"
```

---

### Task 7: Software snapshot script and data

**Files:**
- Create: `scripts/specimen/software.py`
- Create: `src/features/specimen/data/software.json` (generated)

**Interfaces:**
- Produces: `software.json` conforming to `SpecimenSnapshot` with `cols: 8, rows: 7` (later upsampled x2 by the adapter)

Reads ArchvBrain's committed eval baseline. No Postgres, no model calls. The grid is one cell per review-grid cell: 7 eligible documents by 8 columns, 56 cells. Values encode the cell state distribution from the baseline. Three cells carry labels for the three numbers that matter.

- [ ] **Step 1: Write the script**

```python
# scripts/specimen/software.py
"""Emit the software specimen snapshot from ArchvBrain's committed eval baseline.

Run from the portfolio repo root:

  python3 scripts/specimen/software.py > src/features/specimen/data/software.json

Reads eval_data/verified_extraction_baseline.json. Every value comes from that
file. The commit hash is the one the baseline says it was measured against.
"""
from __future__ import annotations

import datetime as dt
import json
import sys
from pathlib import Path

BASELINE = Path("/Users/jay/ArchvBrain/eval_data/verified_extraction_baseline.json")
COLS = 8  # review-grid columns in the fixture corpus
STATE_VALUE = {"answered": 1.0, "needs_review": 0.55, "not_found": 0.15, "pending": 0.05, "not_applicable": 0.0, "error": 0.0}


def main() -> int:
    d = json.loads(BASELINE.read_text())
    totals = d["totals"]
    dist = d["stateDistribution"]
    rows = int(totals["documentsEligible"])
    if rows * COLS != int(totals["cellsTotal"]):
        raise SystemExit(f"grid {rows}x{COLS} != cellsTotal {totals['cellsTotal']}")
    ordered = ["answered", "needs_review", "not_found", "pending", "not_applicable", "error"]
    values: list[float] = []
    for state in ordered:
        values.extend([STATE_VALUE[state]] * int(dist.get(state, 0)))
    if len(values) != rows * COLS:
        raise SystemExit(f"state distribution sums to {len(values)}, expected {rows * COLS}")
    labels = {
        "0": str(totals["quotesStoredTextExact"]),
        str(COLS - 1): str(totals["quotes"]),
        str(rows * COLS - 1): str(totals["falseAnchors"]),
    }
    snapshot = {
        "persona": "software",
        "cols": COLS,
        "rows": rows,
        "values": values,
        "labels": labels,
        "source": {
            "repo": "ArchvBrain",
            "commit": d["measuredAgainst"]["commit"],
            "path": "eval_data/verified_extraction_baseline.json",
            "how": "python3 scripts/specimen/software.py (stateDistribution laid out row-major, labels = quotesStoredTextExact, quotes, falseAnchors)",
            "observedAt": dt.date.today().isoformat(),
            "note": f"verifiedQuoteRate={d['rates']['verifiedQuoteRate']} falseAnchorRate={d['rates']['falseAnchorRate']}",
        },
    }
    json.dump(snapshot, sys.stdout, separators=(",", ":"))
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

- [ ] **Step 2: Run and verify**

```bash
python3 scripts/specimen/software.py > src/features/specimen/data/software.json; echo "exit=$?"
python3 -c "
import json; d=json.load(open('src/features/specimen/data/software.json'))
assert d['cols']==8 and d['rows']==7 and len(d['values'])==56
assert d['labels']['0']=='13' and d['labels']['7']=='18' and d['labels']['55']=='0'
print('ok', d['source']['note'])
"
```

Expected: `exit=0` then `ok verifiedQuoteRate=0.7222 falseAnchorRate=0.0`

- [ ] **Step 3: Commit**

```bash
git add scripts/specimen/software.py src/features/specimen/data/software.json
git commit -m "Add software specimen snapshot from the ArchvBrain eval baseline"
```

---

### Task 8: Adapters

**Files:**
- Create: `src/features/specimen/adapters.ts`
- Test: `src/features/specimen/adapters.test.ts`

**Interfaces:**
- Consumes: `snapshotToFrame`, `upsample`, `placeholderFrame` from Task 5; `PersonaKey`, `getPersona` from Task 1; the two JSON files
- Produces: `frameFor(persona: PersonaKey): SpecimenFrame`, `snapshotFor(persona): SpecimenSnapshot | null`

- [ ] **Step 1: Write the failing tests**

```ts
// src/features/specimen/adapters.test.ts
import { describe, it, expect } from "vitest";
import { frameFor, snapshotFor } from "./adapters";
import { PERSONA_KEYS } from "@/features/persona/personas";

describe("adapters", () => {
  it("returns a 48x48 frame with four numbered sensors for hardware", () => {
    const f = frameFor("hardware");
    expect(f.cols).toBe(48);
    expect(f.rows).toBe(48);
    const labels = f.cells.filter((c) => c.label !== undefined).map((c) => c.label).sort();
    expect(labels).toEqual(["1", "2", "3", "4"]);
  });

  it("returns a 16x14 upsampled frame for software with the three headline labels", () => {
    const f = frameFor("software");
    expect(f.cols).toBe(16);
    expect(f.rows).toBe(14);
    const labels = f.cells.filter((c) => c.label !== undefined).map((c) => c.label);
    expect(labels).toEqual(["13", "18", "0"]);
  });

  it("returns a placeholder for personas that are not live", () => {
    for (const key of ["product", "business"] as const) {
      const f = frameFor(key);
      expect(f.cells.every((c) => c.label === undefined)).toBe(true);
      expect(snapshotFor(key)).toBeNull();
    }
  });

  it("carries a source with a commit for every live persona", () => {
    for (const key of PERSONA_KEYS) {
      const s = snapshotFor(key);
      if (!s) continue;
      expect(s.source.commit).toMatch(/^[0-9a-f]{7,40}$/);
      expect(s.source.observedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("fails loudly on a corrupted snapshot (mutation check)", async () => {
    const mod = await import("./data/hardware.json");
    const bad = { ...mod.default, values: [...mod.default.values] };
    bad.values[0] = 2;
    const { snapshotToFrame } = await import("./snapshot");
    expect(() => snapshotToFrame(bad as never)).toThrow(/range/);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/features/specimen/adapters.test.ts`
Expected: FAIL, cannot find module `./adapters`

- [ ] **Step 3: Write the implementation**

```ts
// src/features/specimen/adapters.ts
import { getPersona, type PersonaKey } from "@/features/persona/personas";
import { placeholderFrame, snapshotToFrame, upsample, type SpecimenSnapshot } from "./snapshot";
import type { SpecimenFrame } from "./types";
import hardware from "./data/hardware.json";
import software from "./data/software.json";

const PLACEHOLDER_COLS = 24;
const PLACEHOLDER_ROWS = 24;

const SNAPSHOTS: Partial<Record<PersonaKey, SpecimenSnapshot>> = {
  hardware: hardware as SpecimenSnapshot,
  software: software as SpecimenSnapshot,
};

export function snapshotFor(persona: PersonaKey): SpecimenSnapshot | null {
  return SNAPSHOTS[persona] ?? null;
}

export function frameFor(persona: PersonaKey): SpecimenFrame {
  const snapshot = snapshotFor(persona);
  if (!snapshot || !getPersona(persona).live) {
    return placeholderFrame(PLACEHOLDER_COLS, PLACEHOLDER_ROWS);
  }
  const frame = snapshotToFrame(snapshot);
  return persona === "software" ? upsample(frame, 2) : frame;
}
```

If TypeScript complains about importing JSON, confirm `tsconfig.json` has `"resolveJsonModule": true` (Next's default does). If not, add it under `compilerOptions`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/features/specimen/adapters.test.ts`
Expected: PASS, 5 tests

- [ ] **Step 5: Commit**

```bash
git add src/features/specimen/adapters.ts src/features/specimen/adapters.test.ts
git commit -m "Add specimen adapters with placeholder for personas not yet live"
```

---

### Task 9: Persona state helpers and hook

**Files:**
- Create: `src/features/persona/usePersona.ts`
- Test: `src/features/persona/usePersona.test.ts`

**Interfaces:**
- Consumes: `PersonaKey`, `DEFAULT_PERSONA`, `isPersonaKey` from Task 1
- Produces: `parsePersona(raw: string | null | undefined): PersonaKey | null`, `readStoredPersona(storage: StorageLike | null): PersonaKey`, `writeStoredPersona(storage: StorageLike | null, key: PersonaKey): void`, `usePersona(): { persona: PersonaKey; setPersona: (k: PersonaKey) => void }`, `STORAGE_KEY`

- [ ] **Step 1: Write the failing tests**

```ts
// src/features/persona/usePersona.test.ts
import { describe, it, expect } from "vitest";
import { parsePersona, readStoredPersona, writeStoredPersona, STORAGE_KEY } from "./usePersona";

function memoryStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
  };
}

function throwingStorage() {
  return {
    getItem: () => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("blocked");
    },
  };
}

describe("parsePersona", () => {
  it("accepts known keys and rejects everything else", () => {
    expect(parsePersona("software")).toBe("software");
    expect(parsePersona("war")).toBeNull();
    expect(parsePersona(null)).toBeNull();
    expect(parsePersona(undefined)).toBeNull();
  });
});

describe("readStoredPersona", () => {
  it("returns the stored key when valid", () => {
    expect(readStoredPersona(memoryStorage({ [STORAGE_KEY]: "product" }))).toBe("product");
  });

  it("falls back to the default when missing, invalid, null, or throwing", () => {
    expect(readStoredPersona(memoryStorage())).toBe("hardware");
    expect(readStoredPersona(memoryStorage({ [STORAGE_KEY]: "nope" }))).toBe("hardware");
    expect(readStoredPersona(null)).toBe("hardware");
    expect(readStoredPersona(throwingStorage())).toBe("hardware");
  });
});

describe("writeStoredPersona", () => {
  it("writes and survives a throwing storage", () => {
    const s = memoryStorage();
    writeStoredPersona(s, "business");
    expect(s.getItem(STORAGE_KEY)).toBe("business");
    expect(() => writeStoredPersona(throwingStorage(), "business")).not.toThrow();
    expect(() => writeStoredPersona(null, "business")).not.toThrow();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/features/persona/usePersona.test.ts`
Expected: FAIL, cannot find module `./usePersona`

- [ ] **Step 3: Write the implementation**

```ts
// src/features/persona/usePersona.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_PERSONA, isPersonaKey, type PersonaKey } from "./personas";

export const STORAGE_KEY = "jaykim.persona";

export type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

export function parsePersona(raw: string | null | undefined): PersonaKey | null {
  if (!raw) return null;
  return isPersonaKey(raw) ? raw : null;
}

export function readStoredPersona(storage: StorageLike | null): PersonaKey {
  if (!storage) return DEFAULT_PERSONA;
  try {
    return parsePersona(storage.getItem(STORAGE_KEY)) ?? DEFAULT_PERSONA;
  } catch {
    return DEFAULT_PERSONA;
  }
}

export function writeStoredPersona(storage: StorageLike | null, key: PersonaKey): void {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, key);
  } catch {
    // Storage can be blocked in private windows. The choice still applies for this visit.
  }
}

function browserStorage(): StorageLike | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function usePersona(): { persona: PersonaKey; setPersona: (k: PersonaKey) => void } {
  const [persona, setState] = useState<PersonaKey>(DEFAULT_PERSONA);

  useEffect(() => {
    setState(readStoredPersona(browserStorage()));
  }, []);

  const setPersona = useCallback((k: PersonaKey) => {
    setState(k);
    writeStoredPersona(browserStorage(), k);
  }, []);

  return { persona, setPersona };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/features/persona/usePersona.test.ts`
Expected: PASS, 4 tests

- [ ] **Step 5: Commit**

```bash
git add src/features/persona/usePersona.ts src/features/persona/usePersona.test.ts
git commit -m "Add persona state helpers with storage fallbacks"
```

---

### Task 10: Cherry-pick the scramble hook and add artifacts data

**Files:**
- Create: `src/features/persona/useScrambleText.ts` (copied verbatim)
- Create: `src/features/persona/artifacts.ts`
- Test: `src/features/persona/artifacts.test.ts`

**Interfaces:**
- Consumes: `PersonaKey` from Task 1, `findEvidence` from Task 2
- Produces: `useScrambleText(target: string, options?): string`, `Artifact`, `artifactsFor(persona: PersonaKey): Artifact[]`

- [ ] **Step 1: Copy the hook**

```bash
cp /Users/jay/Desktop/jaykim/src/hooks/useScrambleText.ts src/features/persona/useScrambleText.ts
head -3 src/features/persona/useScrambleText.ts
```

Expected: first line is `"use client";`. Do not edit the file. It is a plain file read from the main checkout's working tree, which sits on branch `wip/dossier-terminal`.

- [ ] **Step 2: Write the failing artifacts test**

```ts
// src/features/persona/artifacts.test.ts
import { describe, it, expect } from "vitest";
import { artifactsFor, ARTIFACTS } from "./artifacts";
import { findEvidence } from "@/features/evidence/registry";
import { findStudy } from "@/data/caseStudies";

describe("artifacts", () => {
  it("gives hardware and software three to five cards each", () => {
    expect(artifactsFor("hardware").length).toBeGreaterThanOrEqual(3);
    expect(artifactsFor("hardware").length).toBeLessThanOrEqual(5);
    expect(artifactsFor("software").length).toBeGreaterThanOrEqual(3);
    expect(artifactsFor("software").length).toBeLessThanOrEqual(5);
  });

  it("gives product and business no cards yet", () => {
    expect(artifactsFor("product")).toEqual([]);
    expect(artifactsFor("business")).toEqual([]);
  });

  it("resolves every evidence id and case study slug it references", () => {
    for (const a of ARTIFACTS) {
      if (a.evidenceId) expect(findEvidence(a.evidenceId), a.title).toBeDefined();
      if (a.caseStudySlug) expect(findStudy(a.caseStudySlug), a.title).toBeDefined();
    }
  });

  it("never presents the sonicfly clone or the cactus fork as Jay's work", () => {
    for (const a of ARTIFACTS) {
      expect(a.file).not.toMatch(/sonicfly-patched/);
      expect(a.file).not.toMatch(/cactus/);
    }
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm vitest run src/features/persona/artifacts.test.ts`
Expected: FAIL, cannot find module `./artifacts`

- [ ] **Step 4: Write the artifacts data**

```ts
// src/features/persona/artifacts.ts
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
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm vitest run src/features/persona/artifacts.test.ts`
Expected: PASS, 4 tests

- [ ] **Step 6: Commit**

```bash
git add src/features/persona/useScrambleText.ts src/features/persona/artifacts.ts src/features/persona/artifacts.test.ts
git commit -m "Bring in the scramble hook and add artifact cards for live personas"
```

---

### Task 11: Component test infrastructure

**Files:**
- Modify: `vitest.config.ts`
- Modify: `package.json` (devDependencies via pnpm)

**Interfaces:**
- Produces: `.test.tsx` files run under jsdom when they carry the `@vitest-environment jsdom` pragma

- [ ] **Step 1: Install**

```bash
pnpm add -D jsdom @testing-library/react @testing-library/dom
echo "exit=$?"
```

Expected: `exit=0`

- [ ] **Step 2: Update vitest config**

Replace `vitest.config.ts` with:

```ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  esbuild: {
    jsx: "automatic",
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
```

- [ ] **Step 3: Prove it with a throwaway test**

Create `src/features/persona/smoke.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

function Hello() {
  return <p>hello</p>;
}

describe("jsdom smoke", () => {
  it("renders", () => {
    render(<Hello />);
    expect(screen.getByText("hello")).toBeTruthy();
  });
});
```

Run: `pnpm vitest run src/features/persona/smoke.test.tsx`
Expected: PASS

Then delete it: `rm src/features/persona/smoke.test.tsx`

- [ ] **Step 4: Confirm the full suite still passes**

Run: `pnpm test; echo "exit=$?"`
Expected: `exit=0`

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts package.json pnpm-lock.yaml
git commit -m "Enable tsx component tests under jsdom"
```

---

### Task 12: PersonaSwitch, Readout, Clock

**Files:**
- Create: `src/features/persona/PersonaSwitch.tsx`
- Test: `src/features/persona/PersonaSwitch.test.tsx`
- Create: `src/features/evidence/Readout.tsx`
- Test: `src/features/evidence/Readout.test.tsx`
- Create: `src/features/landing/Clock.tsx`

**Interfaces:**
- Consumes: `PERSONAS`, `Ground`, `PersonaKey` from Task 1; `evidenceFor`, `sourceHref` from Task 2
- Produces: `PersonaSwitch({ value, onChange, ground, asLinks? })`, `Readout({ persona, ground, intervalMs? })`, `Clock({ ground })`

- [ ] **Step 1: Write the failing PersonaSwitch test**

```tsx
// src/features/persona/PersonaSwitch.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PersonaSwitch } from "./PersonaSwitch";

describe("PersonaSwitch", () => {
  it("renders four tabs with bracket labels and marks the active one", () => {
    render(<PersonaSwitch value="software" onChange={() => {}} ground="black" />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(4);
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(tabs[0].textContent).toBe("[HARDWARE]");
  });

  it("calls onChange with the key when a tab is clicked", () => {
    const onChange = vi.fn();
    render(<PersonaSwitch value="hardware" onChange={onChange} ground="black" />);
    fireEvent.click(screen.getByText("[PRODUCT]"));
    expect(onChange).toHaveBeenCalledWith("product");
  });
});
```

- [ ] **Step 2: Write the failing Readout test**

```tsx
// src/features/evidence/Readout.test.tsx
// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Readout } from "./Readout";
import { evidenceFor } from "./registry";

describe("Readout", () => {
  it("shows the first hardware entry's value and its source path", () => {
    const first = evidenceFor("hardware")[0];
    render(<Readout persona="hardware" ground="black" intervalMs={0} />);
    expect(screen.getByText(first.value)).toBeTruthy();
    expect(screen.getByText(first.path)).toBeTruthy();
  });

  it("links private sources to the depth page anchor", () => {
    render(<Readout persona="hardware" ground="black" intervalMs={0} />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toMatch(/^\/hardware#/);
  });
});
```

- [ ] **Step 3: Run both to verify they fail**

Run: `pnpm vitest run src/features/persona/PersonaSwitch.test.tsx src/features/evidence/Readout.test.tsx`
Expected: FAIL, cannot find modules

- [ ] **Step 4: Write PersonaSwitch**

```tsx
// src/features/persona/PersonaSwitch.tsx
"use client";

import { TransitionLink } from "@/components/transitions/TransitionLink";
import { cn } from "@/lib/utils";
import { PERSONAS, type Ground, type PersonaKey } from "./personas";

type Props = {
  value: PersonaKey;
  onChange: (key: PersonaKey) => void;
  ground: Ground;
  asLinks?: boolean;
};

function tabClass(active: boolean, ground: Ground): string {
  const base = "font-mono text-[11px] tracking-[0.18em] uppercase px-1.5 py-0.5 transition-colors";
  if (ground === "black") {
    return cn(base, active ? "bg-white text-black" : "text-white/60 hover:text-white");
  }
  return cn(base, active ? "bg-black text-white" : "text-black/60 hover:text-black");
}

export function PersonaSwitch({ value, onChange, ground, asLinks = false }: Props) {
  return (
    <div role="tablist" aria-label="Persona" className="flex items-center gap-2">
      {PERSONAS.map((p) => {
        const active = p.key === value;
        const label = `[${p.short}]`;
        if (asLinks) {
          return (
            <TransitionLink
              key={p.key}
              href={`/${p.key}`}
              role="tab"
              aria-selected={active}
              className={tabClass(active, ground)}
            >
              {label}
            </TransitionLink>
          );
        }
        return (
          <button
            key={p.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(p.key)}
            className={tabClass(active, ground)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 5: Write Readout**

```tsx
// src/features/evidence/Readout.tsx
"use client";

import { useEffect, useState } from "react";
import type { Ground, PersonaKey } from "@/features/persona/personas";
import { evidenceFor, sourceHref } from "./registry";

type Props = { persona: PersonaKey; ground: Ground; intervalMs?: number };

export function Readout({ persona, ground, intervalMs = 6000 }: Props) {
  const entries = evidenceFor(persona);
  const [i, setI] = useState(0);

  useEffect(() => {
    setI(0);
    if (intervalMs <= 0 || entries.length < 2) return;
    const id = setInterval(() => setI((n) => (n + 1) % entries.length), intervalMs);
    return () => clearInterval(id);
  }, [persona, intervalMs, entries.length]);

  const e = entries[i];
  if (!e) return null;
  const fg = ground === "black" ? "text-white" : "text-black";
  const dim = ground === "black" ? "text-white/50" : "text-black/50";

  return (
    <div className="pointer-events-auto flex w-full items-end justify-between gap-6 font-mono text-[11px] tracking-[0.14em] uppercase">
      <div className={fg}>
        <span className="text-[13px]">{e.value}</span>
        {e.unit && <span className={`ml-2 ${dim}`}>{e.unit}</span>}
      </div>
      <a href={sourceHref(e)} className={`${dim} hover:${fg} underline-offset-4 hover:underline`} aria-label={`Source: ${e.repo} ${e.path}`}>
        {e.path}
      </a>
    </div>
  );
}
```

- [ ] **Step 6: Write Clock**

```tsx
// src/features/landing/Clock.tsx
"use client";

import { useEffect, useState } from "react";
import type { Ground } from "@/features/persona/personas";

function utcNow(): string {
  return new Date().toISOString().slice(11, 19);
}

export function Clock({ ground }: { ground: Ground }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      setTime(utcNow());
      id = setInterval(() => setTime(utcNow()), 1000);
    };
    const stop = () => {
      if (id) clearInterval(id);
      id = null;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const dim = ground === "black" ? "text-white/50" : "text-black/50";
  return (
    <span className={`font-mono text-[11px] tracking-[0.14em] ${dim}`} suppressHydrationWarning>
      {time ? `UTC ${time}` : "UTC"}
    </span>
  );
}
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `pnpm vitest run src/features/persona/PersonaSwitch.test.tsx src/features/evidence/Readout.test.tsx`
Expected: PASS, 4 tests

- [ ] **Step 8: Commit**

```bash
git add src/features/persona/PersonaSwitch.tsx src/features/persona/PersonaSwitch.test.tsx src/features/evidence/Readout.tsx src/features/evidence/Readout.test.tsx src/features/landing/Clock.tsx
git commit -m "Add persona switch, evidence readout, and UTC clock"
```

---

### Task 13: Specimen canvas component

**Files:**
- Create: `src/features/specimen/Specimen.tsx`

**Interfaces:**
- Consumes: `render`, `paint`, `interpolate`, `emptyFrame`, `breathe` from Task 4; `Ground` from Task 1
- Produces: `Specimen({ frame, ground, idle?, className? })`

No unit test. The renderer it drives is fully tested in Task 4. Verify visually in Task 16.

- [ ] **Step 1: Write the component**

```tsx
// src/features/specimen/Specimen.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { Ground } from "@/features/persona/personas";
import { breathe, emptyFrame, interpolate, paint, render } from "./renderer";
import type { SpecimenFrame } from "./types";

type Props = { frame: SpecimenFrame; ground: Ground; idle?: boolean; className?: string };

const DISSOLVE_MS = 600;
const BREATHE_MS = 100;

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function useCanvasSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.floor(width), h: Math.floor(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

function draw(canvas: HTMLCanvasElement, frame: SpecimenFrame, ground: Ground, w: number, h: number) {
  const dpr = window.devicePixelRatio || 1;
  if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
    canvas.width = w * dpr;
    canvas.height = h * dpr;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  paint(ctx, render(frame, w, h, ground), ground);
}

export function Specimen({ frame, ground, idle = true, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shownRef = useRef<SpecimenFrame>(frame);
  const busyRef = useRef(false);
  const { w, h } = useCanvasSize(wrapRef);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || w === 0 || h === 0) return;
    if (reduced) {
      shownRef.current = frame;
      draw(canvas, frame, ground, w, h);
      return;
    }
    let raf = 0;
    let cancelled = false;
    busyRef.current = true;
    const from = shownRef.current;
    const sameDims = from.cols === frame.cols && from.rows === frame.rows;
    const outTarget = sameDims ? frame : emptyFrame(from.cols, from.rows);
    const inStart = sameDims ? null : emptyFrame(frame.cols, frame.rows);
    const t0 = performance.now();
    const step = (now: number) => {
      if (cancelled) return;
      const t = (now - t0) / DISSOLVE_MS;
      if (t < 1) {
        shownRef.current = interpolate(from, outTarget, easeInOut(t));
      } else if (inStart && t < 2) {
        shownRef.current = interpolate(inStart, frame, easeInOut(t - 1));
      } else {
        shownRef.current = frame;
        draw(canvas, frame, ground, w, h);
        busyRef.current = false;
        return;
      }
      draw(canvas, shownRef.current, ground, w, h);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [frame, ground, w, h, reduced]);

  useEffect(() => {
    if (!idle || reduced || w === 0 || h === 0) return;
    let tick = 0;
    const id = setInterval(() => {
      const canvas = canvasRef.current;
      if (!canvas || busyRef.current) return;
      tick += 1;
      draw(canvas, breathe(shownRef.current, 11, tick), ground, w, h);
    }, BREATHE_MS);
    return () => clearInterval(id);
  }, [idle, reduced, ground, w, h]);

  return (
    <div ref={wrapRef} className={className}>
      <canvas ref={canvasRef} aria-hidden="true" style={{ width: w, height: h, display: "block" }} />
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `pnpm type-check; echo "exit=$?"`
Expected: `exit=0`

- [ ] **Step 3: Commit**

```bash
git add src/features/specimen/Specimen.tsx
git commit -m "Add canvas specimen with cell dissolve and idle breathe"
```

---

### Task 14: Landing page

**Files:**
- Create: `src/features/landing/Landing.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/about/page.tsx`

**Interfaces:**
- Consumes: `usePersona` (Task 9), `PersonaSwitch` (Task 12), `Readout` (Task 12), `Clock` (Task 12), `Specimen` (Task 13), `frameFor`, `snapshotFor` (Task 8), `getPersona` (Task 1), `useScrambleText` (Task 10), `usePageTransition` from `@/components/transitions/TransitionProvider`
- Produces: `Landing()`

- [ ] **Step 1: Write Landing**

```tsx
// src/features/landing/Landing.tsx
"use client";

import { useEffect, useMemo } from "react";
import { usePageTransition } from "@/components/transitions/TransitionProvider";
import { getPersona, PERSONAS, type PersonaKey } from "@/features/persona/personas";
import { usePersona } from "@/features/persona/usePersona";
import { useScrambleText } from "@/features/persona/useScrambleText";
import { PersonaSwitch } from "@/features/persona/PersonaSwitch";
import { Readout } from "@/features/evidence/Readout";
import { Specimen } from "@/features/specimen/Specimen";
import { frameFor, snapshotFor } from "@/features/specimen/adapters";
import { Clock } from "./Clock";

function isTypingTarget(e: KeyboardEvent): boolean {
  const tag = (e.target as HTMLElement | null)?.tagName;
  return tag === "INPUT" || tag === "TEXTAREA";
}

function useLandingKeys(setPersona: (k: PersonaKey) => void, enter: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isTypingTarget(e) || e.metaKey || e.ctrlKey || e.altKey) return;
      const byIndex = PERSONAS.find((p) => String(p.index) === e.key);
      if (byIndex) return setPersona(byIndex.key);
      if (e.key === "Enter") enter();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setPersona, enter]);
}

export function Landing() {
  const { persona, setPersona } = usePersona();
  const { navigateTo } = usePageTransition();
  const p = getPersona(persona);
  const frame = useMemo(() => frameFor(persona), [persona]);
  const snapshot = snapshotFor(persona);
  const claim = useScrambleText(p.claim, { speed: 30, staggerPerChar: 12 });
  const enter = () => navigateTo(`/${persona}`);
  useLandingKeys(setPersona, enter);

  const black = p.ground === "black";
  const fg = black ? "text-white" : "text-black";
  const dim = black ? "text-white/50" : "text-black/50";

  return (
    <main
      className="fixed inset-0 overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: black ? "#0a0a0a" : "#ffffff" }}
      data-ground={p.ground}
    >
      <p className="sr-only">
        The figure is a dot matrix rendered from real data. {snapshot ? `${snapshot.source.repo} ${snapshot.source.path}, ${snapshot.source.how}.` : "This persona is in progress."}
      </p>

      <header className="absolute left-5 right-5 top-5 flex items-start justify-between md:left-8 md:right-8 md:top-6">
        <span className={`font-mono text-[13px] font-bold tracking-[0.2em] uppercase ${fg}`}>Jay Kim</span>
        <div className="flex flex-col items-end gap-2">
          <PersonaSwitch value={persona} onChange={setPersona} ground={p.ground} />
          <Clock ground={p.ground} />
        </div>
      </header>

      <div className="absolute inset-x-0 top-[14vh] bottom-[22vh] flex flex-col items-center justify-center gap-8 px-5">
        <Specimen frame={frame} ground={p.ground} className="h-full w-full max-w-[min(80vh,900px)]" />
        <p className={`max-w-xl text-center font-mono text-[13px] leading-relaxed tracking-wide ${fg}`} aria-live="polite">
          {claim}
        </p>
        <button
          type="button"
          onClick={enter}
          className={`font-mono text-[11px] tracking-[0.18em] uppercase px-1.5 py-0.5 ${black ? "bg-white text-black" : "bg-black text-white"}`}
        >
          [ENTER]
        </button>
      </div>

      <footer className="absolute left-5 right-5 bottom-5 md:left-8 md:right-8 md:bottom-6">
        <Readout persona={persona} ground={p.ground} />
        <div className={`mt-2 flex justify-between font-mono text-[11px] tracking-[0.14em] uppercase ${dim}`}>
          <span>Orange County, CA</span>
          <span>{new Date().getUTCFullYear()}</span>
        </div>
      </footer>
    </main>
  );
}
```

- [ ] **Step 2: Wire `/` to Landing**

Replace `src/app/page.tsx`:

```tsx
import type { Metadata } from "next";
import { Landing } from "@/features/landing/Landing";

export const metadata: Metadata = {
  title: "Jay Kim — Software Engineer",
  description:
    "Hardware, software and AI/ML, product, and business. Pick a persona. Every number on this site traces to a file.",
};

export default function Home() {
  return <Landing />;
}
```

- [ ] **Step 3: Keep the bio reachable at `/about`**

Replace `src/app/about/page.tsx`:

```tsx
import type { Metadata } from "next";
import HomeContent from "../HomeContent";

export const metadata: Metadata = {
  title: "About — Jay Kim",
  description: "Software engineer specializing in AI/ML, full-stack development, and design. Based in Orange County, CA.",
};

export default function About() {
  return <HomeContent />;
}
```

- [ ] **Step 4: Type-check and lint**

Run: `pnpm type-check; echo "exit=$?"` then `pnpm lint; echo "exit=$?"`
Expected: `exit=0` both. If lint flags the `enter` arrow being recreated each render in a hook dependency, wrap it in `useCallback(() => navigateTo(\`/${persona}\`), [navigateTo, persona])`.

- [ ] **Step 5: Look at it**

```bash
pnpm dev -p 3999
```

Open `http://localhost:3999`. Expect: black ground, a 48 x 48 dot-matrix with four numbered cells, the hardware claim scrambling in, `[ENTER]`, a readout bottom-left, a path bottom-right, a ticking UTC clock. Press `2`: the figure dissolves in reading order and the software grid resolves. Press `3`: ground flips to white and a dim placeholder shows. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add src/features/landing/Landing.tsx src/app/page.tsx src/app/about/page.tsx
git commit -m "Add single-screen landing with persona switch and specimen"
```

---

### Task 15: Routes, navbar, transitions, sitemap, theme cleanup

**Files:**
- Modify: `src/data/routes.ts`
- Modify: `src/components/layout/Navbar.tsx` (lines 10-12 and 54-71 and 154)
- Modify: `src/components/transitions/TransitionOverlay.tsx` (lines 7-11, 39, 43-52, 343-350, and each effect's use of `BG`)
- Modify: `src/app/sitemap.ts`
- Delete: `src/styles/theme.ts`

**Interfaces:**
- Consumes: `PERSONAS` from Task 1
- Produces: persona routes in `SITE_ROUTES`; `getOverlayColor(route: string): string` inside TransitionOverlay

- [ ] **Step 1: Update routes**

Replace `src/data/routes.ts`:

```ts
import { PERSONAS } from "@/features/persona/personas";

export type SiteRoute = {
  path: string;
  label: string;
  group: "primary" | "secondary";
};

const personaRoutes: SiteRoute[] = PERSONAS.map((p) => ({
  path: `/${p.key}`,
  label: p.short.charAt(0) + p.short.slice(1).toLowerCase(),
  group: "primary",
}));

export const SITE_ROUTES: SiteRoute[] = [
  { path: "/", label: "Home", group: "primary" },
  ...personaRoutes,
  { path: "/contact", label: "Contact", group: "primary" },
  { path: "/lab", label: "Projects", group: "secondary" },
  { path: "/matcha", label: "Recs", group: "secondary" },
  { path: "/music", label: "Music", group: "secondary" },
];

export const PRIMARY_ROUTES = SITE_ROUTES.filter((r) => r.group === "primary");
export const SECONDARY_ROUTES = SITE_ROUTES.filter((r) => r.group === "secondary");
export const NAV_ROUTES = PRIMARY_ROUTES.filter((r) => r.path !== "/" && r.path !== "/contact");
```

- [ ] **Step 2: Stop the Navbar slicing by index**

In `src/components/layout/Navbar.tsx`:

Line 8, change the import to:
```ts
import { NAV_ROUTES, SECONDARY_ROUTES } from "@/data/routes";
```

Lines 10-12, replace with:
```ts
const primaryLinks = NAV_ROUTES.map((r) => ({ label: r.label, href: r.path }));
const moreLinks = SECONDARY_ROUTES.map((r) => ({ label: r.label, href: r.path }));
const allLinks = [...primaryLinks, ...moreLinks, { label: "Contact", href: "/contact" }];
```

Around line 56, change `{primaryLinks.slice(0, 3).map((link) => {` to `{primaryLinks.map((link) => {`.

Everything else in the file stays.

- [ ] **Step 3: Add persona routes and per-target color to TransitionOverlay**

In `src/components/transitions/TransitionOverlay.tsx`:

Add `color: string;` to `EffectProps` (line 7-11):
```ts
type EffectProps = {
  phase: "cover" | "reveal";
  color: string;
  onCoverDone: () => void;
  onRevealDone: () => void;
};
```

Replace the route map (lines 43-52) with:
```ts
const BLACK_PERSONA = /^\/(hardware|software)(\/|$)/;
const WHITE_PERSONA = /^\/(product|business)(\/|$)/;

function getEffect(route: string): React.ComponentType<EffectProps> {
  if (route === "/") return HorizontalBlinds;
  if (BLACK_PERSONA.test(route)) return PixelGrid;
  if (WHITE_PERSONA.test(route)) return BlocksScatter;
  if (route.startsWith("/projects")) return ColumnWipe;
  if (route === "/lab") return PixelGrid;
  if (route === "/contact") return AsciiScramble;
  if (route.startsWith("/writing")) return LineWipe;
  if (route === "/matcha") return BlocksScatter;
  if (route === "/music") return WaveColumns;
  return ColumnWipe;
}

function getOverlayColor(route: string): string {
  if (route === "/" || BLACK_PERSONA.test(route)) return "#0a0a0a";
  return "#ffffff";
}
```

Delete line 39 (`const BG = "#0a0a0a";`).

In each of the seven effect functions, add `color` to the destructured props and replace every use of `BG` with `color`. Example for the first one:

```tsx
function HorizontalBlinds({ phase, color, onCoverDone, onRevealDone }: EffectProps) {
```
and inside its JSX, wherever `background: BG` or `backgroundColor: BG` or `BG` appears, use `color`.

Verify with: `grep -n "BG" src/components/transitions/TransitionOverlay.tsx` which must print nothing.

Replace the export (lines 343-350) with:
```tsx
export function TransitionOverlay({
  target,
  phase,
  onCoverDone,
  onRevealDone,
}: OverlayProps) {
  return createElement(getEffect(target), {
    phase,
    color: getOverlayColor(target),
    onCoverDone,
    onRevealDone,
  });
}
```

- [ ] **Step 4: Update the sitemap**

Replace the `staticPages` array in `src/app/sitemap.ts`:

```ts
  const staticPages = [
    "",
    "/hardware",
    "/software",
    "/product",
    "/business",
    "/about",
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
```

- [ ] **Step 5: Delete the dead theme**

```bash
grep -rn "styles/theme" src; echo "grep exit=$? (1 means no imports)"
rm src/styles/theme.ts
rmdir src/styles
```

Expected: `grep exit=1`. If grep finds an import, do not delete; report it.

- [ ] **Step 6: Gate**

Run: `pnpm test; echo "exit=$?"`, `pnpm type-check; echo "exit=$?"`, `pnpm lint; echo "exit=$?"`
Expected: `exit=0` for all three

- [ ] **Step 7: Commit**

```bash
git add src/data/routes.ts src/components/layout/Navbar.tsx src/components/transitions/TransitionOverlay.tsx src/app/sitemap.ts
git rm -q src/styles/theme.ts
git commit -m "Route personas through nav, transitions, and sitemap"
```

---

### Task 16: Depth page and persona-scoped case study route

**Files:**
- Create: `src/features/persona/PersonaBar.tsx`
- Create: `src/features/depth/PersonaDepth.tsx`
- Create: `src/app/[persona]/page.tsx`
- Create: `src/app/[persona]/[slug]/page.tsx`

**Interfaces:**
- Consumes: `PERSONA_KEYS`, `getPersona`, `isPersonaKey` (Task 1); `artifactsFor` (Task 10); `studiesFor` (Task 3); `findEvidence`, `sourceHref` (Task 2); `frameFor`, `snapshotFor` (Task 8); `Specimen` (Task 13); `PersonaSwitch`, `Clock` (Task 12); `TransitionLink`, `usePageTransition`; `CaseStudyContent` from `@/app/projects/[slug]/CaseStudyContent`
- Produces: `/[persona]` and `/[persona]/[slug]` pages, `PersonaBar({ persona })`

- [ ] **Step 1: Write PersonaBar**

```tsx
// src/features/persona/PersonaBar.tsx
"use client";

import { useEffect } from "react";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { usePageTransition } from "@/components/transitions/TransitionProvider";
import { Clock } from "@/features/landing/Clock";
import { getPersona, type PersonaKey } from "./personas";
import { PersonaSwitch } from "./PersonaSwitch";

export function PersonaBar({ persona }: { persona: PersonaKey }) {
  const { navigateTo } = usePageTransition();
  const p = getPersona(persona);
  const fg = p.ground === "black" ? "text-white" : "text-black";
  const bg = p.ground === "black" ? "bg-[#0a0a0a]/85 border-white/10" : "bg-white/85 border-black/10";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigateTo("/");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigateTo]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 flex h-12 items-center justify-between border-b px-5 backdrop-blur-sm md:px-8 ${bg}`}>
      <TransitionLink href="/" className={`font-mono text-[13px] font-bold tracking-[0.2em] uppercase ${fg}`}>
        Jay Kim
      </TransitionLink>
      <div className="flex items-center gap-6">
        <PersonaSwitch value={persona} onChange={() => {}} ground={p.ground} asLinks />
        <Clock ground={p.ground} />
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Write PersonaDepth**

```tsx
// src/features/depth/PersonaDepth.tsx
"use client";

import { TransitionLink } from "@/components/transitions/TransitionLink";
import { studiesFor } from "@/data/caseStudies";
import { SECONDARY_ROUTES } from "@/data/routes";
import { findEvidence, sourceHref } from "@/features/evidence/registry";
import { artifactsFor, type Artifact } from "@/features/persona/artifacts";
import { PersonaBar } from "@/features/persona/PersonaBar";
import { getPersona, type Ground, type PersonaKey } from "@/features/persona/personas";
import { frameFor, snapshotFor } from "@/features/specimen/adapters";
import { Specimen } from "@/features/specimen/Specimen";

function tone(ground: Ground) {
  const black = ground === "black";
  return {
    bg: black ? "#0a0a0a" : "#ffffff",
    fg: black ? "text-white" : "text-black",
    dim: black ? "text-white/50" : "text-black/50",
    line: black ? "border-white/10" : "border-black/10",
  };
}

function ArtifactCard({ a, ground }: { a: Artifact; ground: Ground }) {
  const t = tone(ground);
  const e = a.evidenceId ? findEvidence(a.evidenceId) : undefined;
  return (
    <article id={a.evidenceId} className={`border-t py-6 ${t.line}`}>
      <p className={`font-mono text-[11px] tracking-[0.14em] uppercase ${t.dim}`}>{a.file}</p>
      <h3 className={`mt-2 text-lg font-semibold ${t.fg}`}>{a.title}</h3>
      <p className={`mt-2 max-w-2xl text-[15px] leading-relaxed ${t.fg}`}>{a.what}</p>
      {e && (
        <p className={`mt-3 font-mono text-[12px] tracking-wide ${t.fg}`}>
          <span className="text-[14px]">{e.value}</span>
          {e.unit && <span className={`ml-2 ${t.dim}`}>{e.unit}</span>}
          <span className={`ml-3 ${t.dim}`}>via {e.how}</span>
          {e.public && (
            <a href={sourceHref(e)} className="ml-3 underline underline-offset-4" target="_blank" rel="noopener noreferrer">
              source
            </a>
          )}
        </p>
      )}
      {a.caseStudySlug && (
        <TransitionLink href={`/${a.persona}/${a.caseStudySlug}`} className={`mt-3 inline-block font-mono text-[11px] tracking-[0.18em] uppercase underline underline-offset-4 ${t.fg}`}>
          Case study
        </TransitionLink>
      )}
    </article>
  );
}

export function PersonaDepth({ persona }: { persona: PersonaKey }) {
  const p = getPersona(persona);
  const t = tone(p.ground);
  const artifacts = artifactsFor(persona);
  const studies = studiesFor(persona);
  const snapshot = snapshotFor(persona);

  return (
    <main className={`min-h-screen pt-12 ${t.fg}`} style={{ backgroundColor: t.bg }}>
      <PersonaBar persona={persona} />

      <section className="px-5 pb-10 pt-16 md:px-8">
        <p className={`font-mono text-[11px] tracking-[0.2em] uppercase ${t.dim}`}>{String(p.index).padStart(2, "0")} / {p.label}</p>
        <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">{p.claim}</h1>
      </section>

      <section className="px-5 md:px-8">
        <Specimen frame={frameFor(persona)} ground={p.ground} idle={false} className="h-[50vh] w-full max-w-3xl" />
        <p className={`mt-3 font-mono text-[11px] tracking-[0.14em] uppercase ${t.dim}`}>
          {snapshot ? `${snapshot.source.repo} · ${snapshot.source.path} · ${snapshot.source.commit.slice(0, 7)} · ${snapshot.source.observedAt}` : "In progress. Nothing here is rendered from data yet."}
        </p>
      </section>

      <section className="px-5 pt-14 md:px-8">
        <h2 className={`font-mono text-[11px] tracking-[0.2em] uppercase ${t.dim}`}>Artifacts</h2>
        {artifacts.length === 0 && <p className={`mt-4 ${t.dim}`}>In progress.</p>}
        <div className="mt-4">{artifacts.map((a) => <ArtifactCard key={a.title} a={a} ground={p.ground} />)}</div>
      </section>

      <section className="px-5 pt-14 md:px-8">
        <h2 className={`font-mono text-[11px] tracking-[0.2em] uppercase ${t.dim}`}>Case studies</h2>
        <ul className="mt-4">
          {studies.map((s) => (
            <li key={s.slug} className={`border-t py-4 ${t.line}`}>
              <TransitionLink href={`/${persona}/${s.slug}`} className="flex items-baseline justify-between gap-6">
                <span className="text-lg font-semibold">{s.title}</span>
                <span className={`font-mono text-[11px] tracking-[0.14em] uppercase ${t.dim}`}>{s.year}</span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </section>

      <footer className={`mt-20 border-t px-5 py-6 md:px-8 ${t.line}`}>
        <span className={`font-mono text-[11px] tracking-[0.2em] uppercase ${t.dim}`}>Off duty</span>
        <div className="mt-2 flex gap-6">
          {SECONDARY_ROUTES.map((r) => (
            <TransitionLink key={r.path} href={r.path} className={`font-mono text-[11px] tracking-[0.14em] uppercase ${t.fg}`}>
              {r.label}
            </TransitionLink>
          ))}
          <TransitionLink href="/about" className={`font-mono text-[11px] tracking-[0.14em] uppercase ${t.fg}`}>About</TransitionLink>
          <TransitionLink href="/contact" className={`font-mono text-[11px] tracking-[0.14em] uppercase ${t.fg}`}>Contact</TransitionLink>
        </div>
      </footer>
    </main>
  );
}
```

- [ ] **Step 3: Write the depth route**

```tsx
// src/app/[persona]/page.tsx
import { notFound } from "next/navigation";
import { getPersona, isPersonaKey, PERSONA_KEYS } from "@/features/persona/personas";
import { PersonaDepth } from "@/features/depth/PersonaDepth";

export function generateStaticParams() {
  return PERSONA_KEYS.map((persona) => ({ persona }));
}

export async function generateMetadata({ params }: { params: Promise<{ persona: string }> }) {
  const { persona } = await params;
  if (!isPersonaKey(persona)) return { title: "Jay Kim" };
  const p = getPersona(persona);
  return { title: `${p.label} — Jay Kim`, description: p.claim };
}

export default async function PersonaPage({ params }: { params: Promise<{ persona: string }> }) {
  const { persona } = await params;
  if (!isPersonaKey(persona)) notFound();
  return <PersonaDepth persona={persona} />;
}
```

- [ ] **Step 4: Write the scoped case study route**

```tsx
// src/app/[persona]/[slug]/page.tsx
import { notFound } from "next/navigation";
import { caseStudies, findStudy } from "@/data/caseStudies";
import { isPersonaKey } from "@/features/persona/personas";
import CaseStudyContent from "@/app/projects/[slug]/CaseStudyContent";

export function generateStaticParams() {
  return caseStudies.flatMap((s) => s.personas.map((persona) => ({ persona, slug: s.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ persona: string; slug: string }> }) {
  const { slug } = await params;
  const study = findStudy(slug);
  return {
    title: study ? `${study.title} — Jay Kim` : "Case Study — Jay Kim",
    description: study?.subtitle,
  };
}

export default async function ScopedCaseStudy({ params }: { params: Promise<{ persona: string; slug: string }> }) {
  const { persona, slug } = await params;
  const study = findStudy(slug);
  if (!isPersonaKey(persona) || !study || !study.personas.includes(persona)) notFound();
  return <CaseStudyContent slug={slug} />;
}
```

If `CaseStudyContent` is not a default export, change the import to `import { CaseStudyContent } from ...` to match `src/app/projects/[slug]/page.tsx` line 2.

- [ ] **Step 5: Confirm `/[persona]` does not swallow existing top-level routes**

Next resolves static segments before dynamic ones, so `/contact`, `/lab`, `/projects`, `/writing`, `/about`, `/matcha`, `/music` keep winning. Verify by running the build and checking the route table:

```bash
pnpm build > /tmp/b.log 2>&1; echo "build exit=$?"; grep -E "^\s*[○●ƒ] /" /tmp/b.log | head -30
```

Expected: `build exit=0`, and the table lists `/[persona]`, `/[persona]/[slug]`, and every pre-existing route.

- [ ] **Step 6: Full gate**

```bash
pnpm test; echo "test exit=$?"
pnpm type-check; echo "tc exit=$?"
pnpm lint; echo "lint exit=$?"
pnpm build; echo "build exit=$?"
```

Expected: all four print `exit=0`.

- [ ] **Step 7: Visual pass**

```bash
pnpm dev -p 3999
```

Walk: `/` → press `2` → click `[ENTER]` → PixelGrid overlay → `/software` depth page with the upsampled eval grid, four artifact cards, three case studies → click Archv → `/software/archv` → Impact section shows three registry-backed metrics → `Esc` → back to `/`. Then `3` → white ground → `[ENTER]` → BlocksScatter overlay in white → `/product` shows "In progress." Stop the server.

- [ ] **Step 8: Commit**

```bash
git add src/features/persona/PersonaBar.tsx src/features/depth/PersonaDepth.tsx "src/app/[persona]/page.tsx" "src/app/[persona]/[slug]/page.tsx"
git commit -m "Add persona depth pages and persona-scoped case study routes"
```

---

## Self-review

**Spec coverage.**
- §3 rules 1, 2, 6: Task 2 registry, Task 3 test that every impact resolves, Task 3 migration. Rule 3: Task 10 test bans sonicfly-patched and cactus in artifact files. Rule 4: Task 3 traction regex. Rule 5: optum entry qualitative. Rule 7: Task 13 reduced-motion branch, Task 4 static frames.
- §4 personas: Task 1. Ground flip: Task 14 background transition, Task 15 overlay color.
- §5 IA: Tasks 14, 15, 16. `/about` kept as the bio.
- §6 landing anatomy: Task 14, with Task 12 pieces. Keyboard `1`-`4`, `Enter`: Task 14. `Esc`: Task 16.
- §7 specimen: Tasks 4, 5, 6, 7, 8, 13. Frame budget benchmark from §7.1 is not in this plan; it is a Phase 2 follow-up and noted below.
- §8 registry: Task 2.
- §9 transitions: Task 15. Landing persona switch uses cell dissolve (§7.3) rather than the overlay; the overlay handles every route change, which is what Jay asked for on 2026-09-05.
- §10 depth pages: Task 16.
- §11 file layout: matches, with `PersonaBar` under persona and `PersonaDepth` under a `depth` feature.
- §12 migration: Task 3, including the two ProjectsContent descriptions.
- §13 testing: Tasks 1, 2, 3, 4, 5, 8, 9, 10, 12. Mutation check: Task 8.
- §14 a11y: Task 13 `aria-hidden` canvas plus Task 14 sr-only paragraph, Task 12 tablist, Clock pauses on hidden tab. AA contrast on both grounds is by token choice (white/black at full and 50 percent). The 120KB landing JS budget is checked by reading the `next build` output in Task 16 step 5; if `/` exceeds 120KB first-load JS, report it, do not fix it in this plan.

**Placeholders.** None. Every step has code or an exact command.

**Type consistency.** `SpecimenFrame`, `Cell`, `Ground`, `PersonaKey`, `Evidence`, `SpecimenSnapshot`, `Artifact` are defined once and imported by path everywhere else. `frameFor` and `snapshotFor` come from `adapters.ts` in Tasks 8, 14, 16. `evidenceFor`/`sourceHref`/`findEvidence` from `registry.ts` in Tasks 2, 3, 10, 12, 16. `studiesFor` from `caseStudies.ts` in Tasks 3, 16.

**Deferred to Phase 2, on purpose.**
- Renderer frame-time benchmark script (§7.1).
- Prose numbers inside case study bodies (`designDecisions[].outcome`, `overview`) that are not `impact[]` entries. Rule 1 applies to them too; migrating them is a content pass, not a system change.
- `product` and `business` snapshots, artifacts, and claims copy.
- Interruptible mid-transition retarget (§7.3). Task 13 cancels and restarts from the shown frame, which is close but not a true retarget.
