import { describe, it, expect } from "vitest";
import {
  CREDENTIALS,
  credentialsInProgress,
  earnedCredentials,
  findCredential,
} from "./credentials";

describe("credentials", () => {
  it("has unique ids", () => {
    const ids = CREDENTIALS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("finds by id and returns undefined for unknown", () => {
    expect(findCredential("fema.is100c")?.issuer).toBe("FEMA Emergency Management Institute");
    expect(findCredential("nope")).toBeUndefined();
  });

  it("splits earned from everything else with no overlap", () => {
    const earned = earnedCredentials().map((c) => c.id);
    const pending = credentialsInProgress().map((c) => c.id);
    expect(earned.filter((id) => pending.includes(id))).toEqual([]);
    expect(earned.length + pending.length).toBe(CREDENTIALS.length);
  });
});

describe("credentials honesty rules", () => {
  it("never renders a credential that has not been awarded", () => {
    for (const c of earnedCredentials()) {
      expect(c.status, c.id).toBe("earned");
    }
  });

  it("requires an issue date on anything marked earned", () => {
    // This is the rule that stops a credential being published by flipping one
    // field. Claiming it also means dating it.
    for (const c of earnedCredentials()) {
      expect(c.issuedOn, `${c.id} is marked earned but carries no issue date`).toMatch(
        /^\d{4}-\d{2}-\d{2}$/,
      );
    }
  });

  it("never dates a credential that has not been awarded", () => {
    for (const c of credentialsInProgress()) {
      expect(c.issuedOn, `${c.id} is not earned but carries an issue date`).toBeUndefined();
    }
  });

  it("gives every credential a reason for pursuing it", () => {
    for (const c of CREDENTIALS) {
      expect(c.rationale.length, c.id).toBeGreaterThan(10);
    }
  });

  it("uses no em dash or en dash in any credential string", () => {
    const dash = /[‒-―]/;
    for (const c of CREDENTIALS) {
      for (const text of [c.name, c.issuer, c.rationale, c.remaining ?? ""]) {
        expect(text, c.id).not.toMatch(dash);
      }
    }
  });

  it("holds nothing as earned today, because no exam has been taken", () => {
    // Delete this test the day the first certificate arrives. Until then it is
    // the thing standing between a plan and a claim.
    expect(earnedCredentials()).toEqual([]);
  });
});
