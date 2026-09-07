import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const yml = readFileSync(new URL("../../../.github/workflows/contributions.yml", import.meta.url), "utf8");
const py = readFileSync(new URL("../../../scripts/work/fetch_contributions.py", import.meta.url), "utf8");

describe("contributions workflow", () => {
  it("schedules both UTC hours that map to 9 am Los Angeles and allows manual runs", () => {
    expect(yml).toContain('cron: "0 16 * * *"');
    expect(yml).toContain('cron: "0 17 * * *"');
    expect(yml).toMatch(/^\s*workflow_dispatch:/m);
  });

  it("runs the fetch script, commits only the JSON, and prefers CONTRIB_TOKEN", () => {
    expect(yml).toContain("python3 scripts/work/fetch_contributions.py");
    expect(yml).toContain("git add src/features/work/data/contributions.json");
    expect(yml).toContain("secrets.CONTRIB_TOKEN || secrets.GITHUB_TOKEN");
    expect(yml).toMatch(/permissions:\s+contents: write/);
  });

  it("gates the scheduled run on the Los Angeles hour and writes the JSON path the page reads", () => {
    expect(py).toContain('ZoneInfo("America/Los_Angeles")');
    expect(py).toContain(".hour == 9");
    expect(py).toContain('"GITHUB_EVENT_NAME") == "schedule"');
    expect(py).toContain('"contributions.json"');
  });
});
