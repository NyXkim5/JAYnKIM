export type PersonaKey = "projects" | "design" | "work" | "stealth";
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

// Tab order is keyboard order. Jay set the four names on 2026-09-06.
export const PERSONAS: readonly Persona[] = [
  {
    key: "projects",
    label: "Projects",
    short: "PROJECTS",
    ground: "black",
    index: 1,
    claim: "Hardware and software, every project on one page, every number traced to a file.",
    live: true,
  },
  {
    key: "design",
    label: "Design",
    short: "DESIGN",
    ground: "white",
    index: 2,
    claim: "I ship to the App Store, then grade my own app a B and fix what I found.",
    live: false,
  },
  {
    key: "work",
    label: "Work",
    short: "WORK",
    ground: "white",
    index: 3,
    claim: "I measure whether my AI is lying before I let it answer.",
    live: true,
  },
  {
    key: "stealth",
    label: "Stealth",
    short: "STEALTH",
    ground: "black",
    index: 4,
    claim: "Some of the work cannot be shown yet.",
    live: false,
  },
] as const;

export const PERSONA_KEYS: readonly PersonaKey[] = PERSONAS.map((p) => p.key);
export const DEFAULT_PERSONA: PersonaKey = "projects";

export function isPersonaKey(x: string): x is PersonaKey {
  return (PERSONA_KEYS as readonly string[]).includes(x);
}

export function getPersona(key: PersonaKey): Persona {
  const found = PERSONAS.find((p) => p.key === key);
  if (!found) throw new Error(`unknown persona: ${key}`);
  return found;
}

// Studio is the zoomed-out default view of the landing. It is not a persona
// and never appears in the switch; a visitor reaches it first and returns to
// it with Esc, 0, or the wordmark.
export const STUDIO = "studio" as const;
export type LandingView = PersonaKey | typeof STUDIO;
export const DEFAULT_VIEW: LandingView = STUDIO;
export const STUDIO_CLAIM = "Four disciplines, one rule. Every number on this site traces to a file.";

export function isLandingView(x: string): x is LandingView {
  return x === STUDIO || isPersonaKey(x);
}
