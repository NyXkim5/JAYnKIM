# jaykim.studio redesign: persona instrument

Date: 2026-09-05
Status: draft for review
Branch: `worktree-portfolio-update` off `origin/main`

## 1. Purpose

Rebuild jaykim.studio so it demonstrates five disciplines without arguing all five at once. The reader picks a persona. Each persona is a narrow, confident, single-claim site. Switching personas is the signature move.

The site is itself the proof. Every number on screen traces to a file in Jay's repos.

## 2. Thesis

Jay builds systems that tell the truth about themselves. Discovery found this habit in six unrelated codebases:

| Codebase | The self-check |
|---|---|
| ArchvBrain | `eval_verified_extraction.py` measures `falseAnchorRate`, the rate at which its own citations point at text that is not there |
| Iris | Found its own tenant-isolation hole, closed it three ways, wrote a 3,928-line adversarial suite to keep it closed |
| Metis | `scripts/eval-briefs.ts` prints projected dollar cost before running; the LLM judge is advisory-only by design |
| DroneNexus | `siting/greedy.py` states its 1-1/e approximation bound; docs say plainly no hardware is wired into `RealSensorSource` |
| sonicfly-research | `BEARING_REGRESSION.md` reports a fix that improved range RMSE and slightly worsened bearing MAE |
| Bamboo | `docs/UX_AUDIT.md` grades the app B and names the coherence bug in its core value prop |

This thesis is the site's spine. Copy, specimens, and readouts all serve it.

## 3. Non-negotiable rules

1. **Every claim traces to a source.** A metric appears on screen only if it is backed by an entry in the evidence registry (section 8) naming the repo, file path, and the command or line that produced it. Qualitative claims ("tens of thousands of RFPs") need an entry too, with `how` naming who stated it and when. No entry, no claim.
2. **No decorative fake data.** No fake status dots, fake hex codes, fake progress bars. The July 2026 design pass removed these for a reason. The dot-matrix specimen is allowed only because it renders real data.
3. **Attribution guardrails.** `cactus` (the cactus-compute fork) and `sonicfly-patched` (Duke's SonicFly clone) never appear as Jay's work. SonicFly appears only as "found and benchmarked a covariance bug in a published lab's code."
4. **No traction claims.** No "signed," "customers," "pilots," or "users" language anywhere unless a signed document exists on disk. Discovery found none. Business persona argues judgment, not results.
5. **Optum rules stand.** RFP automation platform only. No cloud provider named. No parsing-accuracy figure.
6. **Existing metrics migrate or die.** Every `impact[]` entry in `src/data/caseStudies.ts` is re-verified against a source. Unverifiable entries are removed, not softened.
7. **Reduced motion is first-class.** Every canvas and transition has a static fallback that carries the same information.

## 4. Personas

Four now. A fifth, `war`, is planned and out of scope for this spec. The system is built so adding a persona means adding one config object and one specimen adapter.

| Key | Label | Ground | Specimen data source | Lead artifacts |
|---|---|---|---|---|
| `hardware` | Hardware & Systems | black | Coverage grid from `DroneNexus/services/core/siting/coverage.py` output | Siting optimizer, terrain LOS, SonicFly bearing regression, YOLO latency benchmark |
| `software` | Software & AI/ML | black | Citation-verification eval run from `ArchvBrain/eval_verified_extraction.py` fixture mode | Verified-extraction harness, Iris hybrid retrieval + RLS, Metis cost-capped judge |
| `product` | Product & Design | white | Bamboo screen inventory scored by `nutrition-app/docs/UX_AUDIT.md` | Bamboo (shipped, ASC 6784845593), UX audit, PPI scope, transition system |
| `business` | Business & Strategy | white | Three-lane market map from `defense-provenance-venture/02-competitive-landscape.md` | Lodestar doc set, Aeacus repositioning, a16z script, summer-2027-role-index |

Ground flips between black and white personas. That flip is part of the transition.

Merging Product and Design into one persona is a decision, not an oversight: every product artifact Jay has is also a design artifact, and splitting them would produce two thin personas instead of one strong one.

## 5. Information architecture

```
/                      landing, single screen, no scroll
/[persona]             depth page for one persona, scrolls
/[persona]/[slug]      case study, scoped to that persona
/contact               unchanged
/writing/*             unchanged, still gated
```

Retired from primary nav: `/lab`, `/matcha`, `/music`. They stay reachable from the footer of a depth page under a single "Off duty" link. Their code is not deleted in this pass.

Persona is URL state, not client state. `/hardware` is shareable. The landing at `/` remembers the last persona in `localStorage` and defaults to `hardware` on first visit.

## 6. Landing screen anatomy

One viewport. Nothing scrolls. Grammar borrowed from kargo-studio.com and barbianaliu.com: metadata pinned to the corners, one object at dead center, nothing else.

```
JAY KIM                                          [HARDWARE] [SOFTWARE] [PRODUCT] [BUSINESS]
                                                                                  UTC 21:49:23

                                   <specimen>

                          one line of persona copy
                          [ENTER]

3,800 tests collected                                  services/ · pytest --collect-only
Orange County, CA                                                                  2026
```

- **Top left**: name.
- **Top right**: persona switch. Bracket-label style from barbianaliu.com. Active persona filled black-on-white or white-on-black depending on ground.
- **Center**: the specimen (section 7). Below it one sentence of persona copy that resolves via scramble, then a single `[ENTER]` that goes to `/[persona]`.
- **Bottom left**: one live readout from the evidence registry for the active persona. Cycles slowly through that persona's readouts.
- **Bottom right**: the source path for the readout currently showing. Clickable. Opens the file on GitHub when the repo is public, otherwise opens the case study section that quotes it.
- **Live clock**: UTC, under the switch. Both reference sites run one. Jay's dossier version already had one.

Keyboard: `1` to `4` switch persona, `Enter` enters, `Esc` returns to landing from a depth page. Tab order follows reading order.

## 7. The specimen

A canvas dot-matrix renderer in the Nothing / BUCK Playground language: a coarse grid of square cells, grayscale, on the persona ground. Some cells carry a number instead of a fill. The figure reads as an object at distance and as data up close.

### 7.1 Renderer

`features/specimen/renderer.ts`. Pure function of `(SpecimenFrame, viewport) -> draw calls`. No React inside.

- Grid resolution: 48 x 64 cells at desktop, 32 x 48 at mobile. Cell size derived from viewport.
- Each cell: `{ value: 0..1, label?: string }`. `value` maps to gray. `label` when present renders as a small numeral in a white cell, rotated 90 degrees as in the reference frame.
- Renders with `requestAnimationFrame`, DPI-aware, `ResizeObserver` for reflow. Same discipline as `aeacus-site/src/features/scope/ppi-scope.tsx`.
- Frame budget: under 4ms per frame at 48 x 64 on an M1. Verified by a benchmark script, not assumed.

### 7.2 Adapters

One adapter per persona at `features/specimen/adapters/[persona].ts`. Each exports `buildFrames(): SpecimenFrame[]` from a static JSON snapshot committed to the repo under `features/specimen/data/[persona].json`.

The snapshot is generated offline from the real source (a Python script in DroneNexus, a fixture run in ArchvBrain, and so on) and committed with a `source` header recording repo, commit hash, file, and command. The site never calls those repos at runtime.

| Persona | Snapshot content | Numeric cells show |
|---|---|---|
| `hardware` | Coverage probability grid from one siting run, plus the chosen sensor sites | Sensor index at each chosen site |
| `software` | One fixture-mode eval run, one cell per test document, value = verified quote rate | Count of false anchors where nonzero |
| `product` | Bamboo screen inventory, one cell cluster per screen, value = audit grade | The grade |
| `business` | Three market lanes as three regions, value = openness score from the landscape doc | Vehicle size where sourced |

### 7.3 Motion

Idle: cells breathe slightly, numerals occasionally re-resolve. Under 1 percent of cells change per second. Calm, not busy.

Persona switch: the current figure dissolves cell by cell in reading order over 600ms, the ground flips if needed, and the next figure resolves cell by cell. Numerals use the scramble hook. Total under 1.4s. Interruptible: switching mid-transition retargets without snapping.

Reduced motion: no idle animation, persona switch is a 200ms crossfade, numerals appear resolved.

## 8. Evidence registry

`features/evidence/registry.ts`. The single source of truth for every number on the site.

```ts
type Evidence = {
  id: string;                 // "dronenexus.tests.collected"
  persona: PersonaKey[];      // where it may appear
  value: string;              // "3,800"
  unit?: string;              // "tests collected"
  repo: string;               // "NyXkim5/DroneNexus"
  path: string;               // "services/"
  how: string;                // "python3 -m pytest --collect-only -q services/"
  observedAt: string;         // "2026-09-05"
  public: boolean;            // controls whether bottom-right link goes to GitHub
};
```

A test asserts every `impact[]` metric in `caseStudies.ts` and every landing readout resolves to a registry entry. Unresolvable metrics fail the build.

Initial registry is seeded from discovery. Each entry below was produced by a command run on 2026-09-05:

- `3,800` tests collected, DroneNexus `services/`, pytest collect-only
- `221` test files, DroneNexus `services/`, find
- `77,616` lines, DroneNexus `services/core`, wc
- `57.63ms -> 40.65ms` YOLO mean latency, `docs/perception/latency-benchmark.md`, M1 Max CPU, 100 runs
- `2.292m -> 0.605m` range RMSE, `sonicfly-research/BEARING_REGRESSION.md`
- `3,928` lines, Iris `backend/tests/test_tenant_isolation.py`, wc
- `22` gold fixtures, `12,200` lines, Iris `backend/tests/fixtures/*/gold.json`
- `135` curated sources, `130` enabled, Metis `registry.ts`, grep
- `313` test files, Bamboo `src/`, find
- `1,979` vitest and `697` jest passing, Bamboo `HANDOFF.md` gate table dated 2026-08-07
- `533` live rows, summer-2027-role-index `stats.json` dated 2026-09-04

Entries that exist on the live site today and could not be verified are listed in section 12 for removal.

## 9. Persona transition

Reuse, do not rebuild.

- `src/components/transitions/TransitionOverlay.tsx` already maps route to effect with seven clipPath wipes. It gains a second axis: persona-to-persona transitions on the landing use `PixelGrid` for black-to-black and white-to-white, and `BlocksScatter` when the ground flips.
- `src/hooks/useScrambleText.ts` from branch `wip/dossier-terminal` is cherry-picked into `features/persona/useScrambleText.ts`. The Hangul-to-Latin resolve stays. It is the one personal flourish on the landing.
- Ground flip is a full-viewport background transition coordinated with the overlay, so the page never shows a white flash between two black states.

## 10. Depth pages

`/[persona]` scrolls. Layout is one column, wide margins, same corner metadata persistent as a thin bar.

Sections in order:

1. **Claim.** One sentence. The persona's single argument.
2. **Specimen, annotated.** The same figure from the landing, now with numerals labeled and each label linked to its registry entry.
3. **Artifacts.** Three to five cards. Each card is one file or one output, not one project: a docstring, a benchmark table, a migration, an audit finding. Cards link to the case study that contains them.
4. **Case studies.** Filtered to this persona. Existing `caseStudies.ts` entries gain a `personas: PersonaKey[]` field.
5. **Off duty.** Footer link to `/lab`, `/matcha`, `/music`.

Case study pages keep the existing `NewspaperLayout.tsx` for now. Redesigning them is a later spec.

## 11. File layout

Feature-based, per the global CLAUDE.md.

```
src/features/persona/
  personas.ts             persona config: key, label, ground, copy, keyboard index
  PersonaSwitch.tsx
  usePersona.ts           URL <-> state, localStorage default
  useScrambleText.ts      cherry-picked from wip/dossier-terminal
  persona.test.ts
src/features/specimen/
  renderer.ts             pure canvas draw, no React
  Specimen.tsx            raf loop, resize, reduced-motion switch
  adapters/hardware.ts    + software.ts, product.ts, business.ts
  data/hardware.json      + software.json, product.json, business.json
  renderer.test.ts
  adapters.test.ts
src/features/evidence/
  registry.ts
  Readout.tsx             cycling bottom-left readout + bottom-right source link
  registry.test.ts
src/features/landing/
  Landing.tsx             composes the corners, specimen, copy, enter
src/app/page.tsx                          renders Landing
src/app/[persona]/page.tsx                depth page
src/app/[persona]/[slug]/page.tsx         case study scoped to persona
```

`src/styles/theme.ts` is deleted. It is a dead dark-palette leftover with no imports.

## 12. Content migration

Every `impact[]` metric in `caseStudies.ts` is checked against the registry. Current status:

| Slug | Metric | Status |
|---|---|---|
| optum | Tens of thousands, One platform, Parsing accuracy | Keep. Qualitative by rule. |
| archv | Review Time -71%, Verification -82%, Latency <2s | Unverified. Remove unless Jay names the source. |
| archv | NVIDIA Inception: Admitted | Keep if the acceptance email is on disk. Otherwise remove. |
| archv | Early Adoption: Signed | Remove. Rule 4. No signed document found. |
| cactus | 60x, <1s, 1-2 days, Shipped | Unverified. This is a work project with no repo on disk. Remove or Jay names the source. |
| medvanta | <5 min, ~5hrs/wk, 1 week | Unverified. Remove unless Jay names the source. |
| drone-dashboard | Tests 76+ | Replace with `3,800 tests collected`, registry-backed. |
| drone-dashboard | 2-50, 10Hz, <100ms, 18 endpoints | Re-verify against DroneNexus. Keep what a command reproduces. |
| drone-virtual-env | 6, 8+, Live | Re-verify against `drone-sim/`. |
| va-gov-mvp | 10, 4, AA | Re-verify against `VA.GOV-MVP-V1`. AA needs an axe run on disk. |

Jay decides the unverified rows. Default on silence is removal.

## 13. Testing

Vitest, co-located.

- `registry.test.ts`: every metric referenced anywhere resolves. Every entry has `how` and `observedAt`. No entry older than 90 days without a warning.
- `adapters.test.ts`: each adapter produces frames of the declared grid size, values in `[0, 1]`, labels only where the data says so. A mutation check: corrupt one JSON value out of range and assert the test fails.
- `renderer.test.ts`: given a frame, the draw-call list is deterministic. Reduced-motion frame equals the final resolved frame.
- `persona.test.ts`: URL round-trips, keyboard indices, default on first visit, localStorage fallback when storage throws.
- `PersonaSwitch` and `Readout` render tests with testing-library.

Gate before any merge: `pnpm test`, `pnpm type-check`, `pnpm lint`, `pnpm build`, all exit 0, checked directly and not through a pipe.

## 14. Performance and accessibility

- Landing ships no images. The specimen is canvas. Total JS for the landing under 120KB gzipped, measured by `next build` output.
- Canvas is `aria-hidden`. A visually hidden paragraph states what the specimen shows and its source.
- Persona switch is a `role="tablist"`. Bracket labels are real buttons.
- All text meets AA on both grounds. Gray cells are decorative and exempt.
- `prefers-reduced-motion` honored in every component, tested.
- Live clock updates once per second and pauses when the tab is hidden.

## 15. Out of scope

- The `war` persona. Planned. Slot exists in the config type.
- GitHub cleanup: pruning public repos, fixing `summer-2027-role-index` license and homepage, correcting the stale 372. Separate task, high value, unrelated to this build.
- Case study page redesign.
- Resume.
- Replacing Inter and JetBrains Mono. Open question below.
- Any use of shadergradient, Paper Shaders, or react-three-fiber. Discovery showed canvas is Jay's signature and none of these earn a dependency.

## 16. Open questions for Jay

1. Typeface. Inter + JetBrains Mono is loaded and costs nothing. Kargo uses a geometric grotesk. Keep, or pick a display face now?
2. The two inspiration screenshots. Re-send from Desktop. They may change the depth-page layout in section 10.
3. Which unverified metrics in section 12 have a source you can name?
4. Does the `archv` case study sit under Software, Product, or both?
5. Is the NVIDIA Inception acceptance on disk?

## 17. Build order

**Phase 1, this spec.** Persona system, evidence registry, specimen renderer, landing, transitions, depth page shell. Two personas live: `hardware` and `software`. The other two switch positions render with a placeholder frame and the depth page shows "in progress" copy. Content migration for all case studies.

**Phase 2.** `product` and `business` specimens and depth content.

**Phase 3.** `war`.

Each phase gets its own implementation plan via the writing-plans skill.
