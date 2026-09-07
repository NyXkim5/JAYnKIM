// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { ContributionGraph } from "./ContributionGraph";
import { levelFor, maxCount, monthLabels, padWeek, type ContributionDay, type Contributions } from "./contributions";

const DAY = 86_400_000;

function weeksFrom(startUtc: number, count: number, countFor: (i: number) => number): ContributionDay[][] {
  const weeks: ContributionDay[][] = [];
  let i = 0;
  for (let w = 0; w < count; w++) {
    const week: ContributionDay[] = [];
    for (let d = 0; d < 7; d++) {
      week.push({ date: new Date(startUtc + i * DAY).toISOString().slice(0, 10), count: countFor(i) });
      i++;
    }
    weeks.push(week);
  }
  return weeks;
}

// 53 full weeks from Sunday 2025-09-07, counts cycling 0..8 so every level appears.
function fixture(): Contributions {
  return {
    login: "NyXkim5",
    fetchedAt: "2026-09-06T09:00:00-07:00",
    total: 1234,
    commits: 200,
    weeks: weeksFrom(Date.UTC(2025, 8, 7), 53, (i) => i % 9),
  };
}

afterEach(cleanup);

describe("ContributionGraph", () => {
  it("renders 371 day cells that span all five levels", () => {
    const { container } = render(<ContributionGraph data={fixture()} />);
    const cells = Array.from(container.querySelectorAll("[data-level]"));
    expect(cells.length).toBe(371);
    expect([...new Set(cells.map((c) => c.getAttribute("data-level")))].sort()).toEqual(["0", "1", "2", "3", "4"]);
    expect(cells[0].getAttribute("title")).toBe("0 contributions on 2025-09-07");
    expect(cells[1].getAttribute("title")).toBe("1 contribution on 2025-09-08");
  });

  it("shows the total, the updated date, the evidence id, and the GitHub link", () => {
    const { getByText, getByRole } = render(<ContributionGraph data={fixture()} />);
    expect(getByText("1,234")).toBeTruthy();
    expect(getByText("updated 2026-09-06")).toBeTruthy();
    expect(getByText("github.contributions.total")).toBeTruthy();
    const link = getByRole("link", { name: "github.com/NyXkim5" });
    expect(link.getAttribute("href")).toBe("https://github.com/NyXkim5");
  });

  it("leaves the slots of a partial last week empty instead of inventing days", () => {
    const data = fixture();
    data.weeks[52] = data.weeks[52].slice(0, 1);
    const { container } = render(<ContributionGraph data={data} />);
    expect(container.querySelectorAll("[data-level]").length).toBe(365);
  });
});

describe("contribution helpers", () => {
  it("maps counts to five levels relative to the max", () => {
    expect([0, 1, 2, 3, 4, 5, 6, 7, 8].map((c) => levelFor(c, 8))).toEqual([0, 1, 1, 2, 2, 3, 3, 4, 4]);
    expect(levelFor(3, 0)).toBe(0);
    expect(levelFor(100, 100)).toBe(4);
    expect(maxCount(fixture().weeks)).toBe(8);
  });

  it("pads a partial week to seven slots by weekday, Sunday first", () => {
    const sunday = padWeek([{ date: "2026-09-06", count: 20 }]);
    expect(sunday[0]?.count).toBe(20);
    expect(sunday.filter(Boolean).length).toBe(1);
    const thuFri = padWeek([{ date: "2026-09-03", count: 1 }, { date: "2026-09-04", count: 2 }]);
    expect(thuFri[4]?.date).toBe("2026-09-03");
    expect(thuFri[5]?.date).toBe("2026-09-04");
  });

  it("labels each month change and drops a label crowded by the next", () => {
    const labels = monthLabels(fixture().weeks);
    expect(labels.slice(0, 2)).toEqual([{ col: 0, label: "Sep" }, { col: 4, label: "Oct" }]);
    for (let i = 1; i < labels.length; i++) expect(labels[i].col - labels[i - 1].col).toBeGreaterThanOrEqual(3);
    const crowded = monthLabels(weeksFrom(Date.UTC(2025, 8, 28), 6, () => 0));
    expect(crowded[0]).toEqual({ col: 1, label: "Oct" });
  });
});
