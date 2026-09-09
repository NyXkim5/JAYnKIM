import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const yml = readFileSync(new URL("../../../.github/workflows/contributions.yml", import.meta.url), "utf8");
const py = readFileSync(new URL("../../../scripts/work/fetch_contributions.py", import.meta.url), "utf8");

describe("contributions workflow", () => {
  // GitHub starts scheduled runs late, often by hours, so one morning cron
  // that refreshes whenever it lands beats two crons and a clock check that
  // almost never passed.
  it("schedules one morning cron and allows manual runs", () => {
    expect(yml).toContain('cron: "0 16 * * *"');
    expect(yml.match(/cron:/g)).toHaveLength(1);
    expect(yml).toMatch(/^\s*workflow_dispatch:/m);
  });

  it("runs the fetch script, commits only the JSON, and prefers CONTRIB_TOKEN", () => {
    expect(yml).toContain("python3 scripts/work/fetch_contributions.py");
    expect(yml).toContain("git add src/features/work/data/contributions.json");
    expect(yml).toContain("secrets.CONTRIB_TOKEN || secrets.GITHUB_TOKEN");
    expect(yml).toMatch(/permissions:\s+contents: write/);
  });

  it("refreshes on every run with no clock gate and writes the JSON path the page reads", () => {
    expect(py).not.toContain(".hour == 9");
    expect(py).not.toContain("GITHUB_EVENT_NAME");
    expect(py).toContain('"contributions.json"');
  });
});
