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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(readStoredPersona(browserStorage()));
  }, []);

  const setPersona = useCallback((k: PersonaKey) => {
    setState(k);
    writeStoredPersona(browserStorage(), k);
  }, []);

  return { persona, setPersona };
}
