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
