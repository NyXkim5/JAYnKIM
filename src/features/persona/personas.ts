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
