"""Render the ArchvBrain verified-extraction baseline as a case matrix.

Reads eval_data/verified_extraction_baseline.json from the ArchvBrain repo.
Left panel: one row per eval case, one column per verification flag, a
filled dot where the flag is true. Right panel: the totals block. Every
number drawn comes from that JSON. Run from the portfolio worktree root:
python3 scripts/figures/archv-eval.py
"""
from __future__ import annotations

import json
from pathlib import Path

import logging

import matplotlib

matplotlib.use("Agg")
logging.getLogger("matplotlib.font_manager").setLevel(logging.ERROR)
import matplotlib.pyplot as plt  # noqa: E402

SOURCE = Path("/Users/jay/ArchvBrain/eval_data/verified_extraction_baseline.json")
OUT = Path("public/projects/archv-eval.png")
SCRIPT = "scripts/figures/archv-eval.py"

BG = "#0a0a0a"
FG = "#ffffff"
PINK = "#ff69b4"
MONO = ["JetBrains Mono", "DejaVu Sans Mono", "Menlo", "monospace"]
FLAGS = ("passageVerified", "storedTextExact", "anchored", "falseAnchor")
TOTALS = ("quotes", "quotesPassageVerified", "quotesStoredTextExact",
          "quotesAnchored", "quotesVerifiedAndAnchored", "falseAnchors")


def load() -> dict:
    with SOURCE.open() as fh:
        return json.load(fh)


def style(ax: plt.Axes) -> None:
    ax.set_facecolor(BG)
    for spine in ax.spines.values():
        spine.set_color(FG)
    ax.tick_params(colors=FG, labelsize=11)


def draw_matrix(ax: plt.Axes, cases: dict[str, dict]) -> None:
    style(ax)
    names = list(cases)
    for row, name in enumerate(names):
        y = len(names) - 1 - row
        for col, flag in enumerate(FLAGS):
            on = bool(cases[name][flag])
            fill = PINK if (on and flag == "falseAnchor") else FG
            ax.scatter(col, y, s=170, facecolors=fill if on else BG,
                       edgecolors=fill, linewidths=1.3, zorder=3)
        ax.text(len(FLAGS) - 0.5, y, cases[name]["status"], va="center",
                ha="left", color=FG, alpha=0.7, fontsize=10)
    ax.set_xlim(-0.6, len(FLAGS) + 1.6)
    ax.set_ylim(-0.8, len(names) - 0.2)
    ax.set_xticks(range(len(FLAGS)))
    ax.set_xticklabels(FLAGS, rotation=30, ha="right")
    ax.set_yticks(range(len(names)))
    ax.set_yticklabels(reversed(names))
    ax.xaxis.tick_top()
    ax.grid(color=FG, alpha=0.08)
    for spine in ("right", "bottom"):
        ax.spines[spine].set_visible(False)


def draw_totals(ax: plt.Axes, totals: dict[str, int]) -> None:
    style(ax)
    keys = list(TOTALS)
    values = [int(totals[k]) for k in keys]
    ys = list(range(len(keys)))[::-1]
    for y, key, value in zip(ys, keys, values):
        color = PINK if key == "falseAnchors" else FG
        ax.barh(y, value, height=0.55, color=BG, edgecolor=color, linewidth=1.5)
        ax.text(value + 0.3, y, str(value), va="center", color=color,
                fontsize=13, weight="bold")
    ax.set_yticks(ys)
    ax.set_yticklabels(keys)
    ax.set_xlim(0, max(values) * 1.25)
    ax.set_xlabel("count (of cellsWithQuotes)", color=FG, fontsize=11)
    ax.grid(axis="x", color=FG, alpha=0.1)
    for spine in ("top", "right"):
        ax.spines[spine].set_visible(False)


def draw(data: dict) -> None:
    plt.rcParams["font.family"] = MONO
    fig, (left, right) = plt.subplots(
        1, 2, figsize=(16, 9), dpi=100, facecolor=BG,
        gridspec_kw={"width_ratios": [1.15, 1]})
    draw_matrix(left, data["caseOutcomes"])
    draw_totals(right, data["totals"])
    t, r = data["totals"], data["rates"]
    footer = (
        f"mode={data['mode']} schemaVersion={data['schemaVersion']} "
        f"documentsEligible={t['documentsEligible']}/{t['documentsRequested']} "
        f"cellsTotal={t['cellsTotal']} cellsWithQuotes={t['cellsWithQuotes']} "
        f"verifiedQuoteRate={r['verifiedQuoteRate']} "
        f"falseAnchorRate={r['falseAnchorRate']} "
        f"measuredAgainst commit {data['measuredAgainst']['commit'][:12]}\n"
        f"source: {SOURCE}\nscript: {SCRIPT}")
    fig.text(0.01, 0.01, footer, color=FG, alpha=0.7, fontsize=9, va="bottom")
    fig.subplots_adjust(left=0.16, right=0.98, top=0.88, bottom=0.14, wspace=0.55)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(OUT, facecolor=BG)


if __name__ == "__main__":
    baseline = load()
    draw(baseline)
    print({k: baseline["totals"][k] for k in TOTALS})
    print(baseline["rates"])
    print(f"wrote {OUT}")
