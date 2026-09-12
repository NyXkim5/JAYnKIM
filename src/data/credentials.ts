/**
 * Credentials Jay holds, and credentials he is working toward.
 *
 * The distinction is enforced, not documented. `status` gates display: only an
 * `earned` entry is ever returned for rendering, and an `earned` entry is
 * required to carry the date it was issued. A credential that has not been
 * awarded cannot reach the page by editing one field, because the tests in
 * credentials.test.ts fail if an earned entry has no issue date.
 *
 * Nothing here is a claim until the certificate exists.
 */

export type CredentialStatus = "earned" | "in-progress" | "planned";

export interface Credential {
  id: string;
  name: string;
  issuer: string;
  /** Undefined until the credential is actually awarded. */
  issuedOn?: string;
  /** Public verification URL, where the issuer provides one. */
  verifyUrl?: string;
  status: CredentialStatus;
  /** Why this credential, in one line. Shown on earned entries. */
  rationale: string;
  /** What is left to do. Shown to Jay, never rendered publicly. */
  remaining?: string;
}

export const CREDENTIALS: readonly Credential[] = [
  {
    id: "fema.is100c",
    name: "IS-100.c: Introduction to the Incident Command System, ICS 100",
    issuer: "FEMA Emergency Management Institute",
    status: "planned",
    rationale: "The command structure every US emergency response is organised under.",
    remaining: "Register a FEMA SID, then take the exam. 75 percent to pass, unlimited retakes.",
  },
  {
    id: "fema.is200c",
    name: "IS-200.c: Basic Incident Command System for Initial Response, ICS-200",
    issuer: "FEMA Emergency Management Institute",
    status: "planned",
    rationale: "Incident action planning and transfer of command, one level above ICS 100.",
    remaining: "Requires IS-100.c first.",
  },
  {
    id: "fema.is700b",
    name: "IS-700.b: An Introduction to the National Incident Management System",
    issuer: "FEMA Emergency Management Institute",
    status: "planned",
    rationale: "Resource management and the coordination structures above the incident.",
    remaining: "Take the exam.",
  },
  {
    id: "fema.is800d",
    name: "IS-800.d: National Response Framework, An Introduction",
    issuer: "FEMA Emergency Management Institute",
    status: "planned",
    rationale: "How federal response is organised, and what stabilising a community lifeline means.",
    remaining: "Take the exam. The course teaches the fourth edition, which says seven lifelines.",
  },
  {
    id: "palantir.builder-foundations",
    name: "Foundry & AIP Builder Foundations",
    issuer: "Palantir Technologies",
    status: "planned",
    rationale: "The Ontology model underneath the platform, which is what the work is actually about.",
    remaining:
      "The Ontology half is already built offline in palantir-ontology-seed, so the reading is done and the gap is the platform itself. Sign up for the free AIP Developer Tier, run the Speedrun course inside it, then take the quiz. Prepare for one attempt. The quiz page says retakes are unlimited and the FAQ says a failed quiz triggers a cool off period.",
  },
];

/** Only credentials that have actually been awarded. This is what the page renders. */
export function earnedCredentials(): Credential[] {
  return CREDENTIALS.filter((c) => c.status === "earned");
}

export function credentialsInProgress(): Credential[] {
  return CREDENTIALS.filter((c) => c.status !== "earned");
}

export function findCredential(id: string): Credential | undefined {
  return CREDENTIALS.find((c) => c.id === id);
}
