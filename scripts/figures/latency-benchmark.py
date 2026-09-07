"""Render the DroneNexus detector latency benchmark as grouped bars.

Reads the measured-results table from docs/perception/latency-benchmark.md
in the DroneNexus repo. Every number drawn comes from that table. Run from
the portfolio worktree root: python3 scripts/figures/latency-benchmark.py
"""
from __future__ import annotations

import re
from pathlib import Path

import logging

import matplotlib

matplotlib.use("Agg")
logging.getLogger("matplotlib.font_manager").setLevel(logging.ERROR)
import matplotlib.pyplot as plt  # noqa: E402

SOURCE = Path("/Users/jay/DroneNexus/docs/perception/latency-benchmark.md")
OUT = Path("public/projects/latency-benchmark.png")
SCRIPT = "scripts/figures/latency-benchmark.py"

BG = "#0a0a0a"
FG = "#ffffff"
PINK = "#ff69b4"
MONO = ["JetBrains Mono", "DejaVu Sans Mono", "Menlo", "monospace"]
METRICS = ("Mean (ms)", "p50 (ms)", "p95 (ms)")


def read_table(path: Path) -> list[dict[str, str]]:
    """Parse the first markdown table in the doc into row dicts."""
    lines = [ln for ln in path.read_text().splitlines() if ln.startswith("|")]
    header = [c.strip() for c in lines[0].strip("|").split("|")]
    rows: list[dict[str, str]] = []
    for line in lines[2:]:
        cells = [c.strip() for c in line.strip("|").split("|")]
        rows.append(dict(zip(header, cells)))
    return rows


def read_context(path: Path) -> str:
    """Pull the device line so the caption states the test rig honestly."""
    text = path.read_text()
    match = re.search(r"Device: (.+?)\n(.+?)\n", text)
    if match is None:
        raise ValueError("Device line not found in benchmark doc")
    return f"{match.group(1)} {match.group(2)}".strip()


def style(ax: plt.Axes) -> None:
    ax.set_facecolor(BG)
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    for side in ("left", "bottom"):
        ax.spines[side].set_color(FG)
    ax.tick_params(colors=FG, labelsize=12)
    ax.yaxis.label.set_color(FG)


def draw(rows: list[dict[str, str]], context: str) -> None:
    plt.rcParams["font.family"] = MONO
    fig, ax = plt.subplots(figsize=(16, 8), dpi=100, facecolor=BG)
    style(ax)
    width = 0.24
    for i, row in enumerate(rows):
        is_onnx = "ONNX" in row["Model"]
        color = PINK if is_onnx else FG
        xs = [g + (i - 1) * width for g in range(len(METRICS))]
        ys = [float(row[m]) for m in METRICS]
        ax.bar(xs, ys, width=width * 0.92, color=color if is_onnx else BG,
               edgecolor=color, linewidth=1.5, label=row["Model"])
        for x, y in zip(xs, ys):
            ax.text(x, y + 0.8, f"{y:.2f}", ha="center", va="bottom",
                    color=color, fontsize=11)
    ax.set_xticks(range(len(METRICS)))
    ax.set_xticklabels([m.replace(" (ms)", "") for m in METRICS], fontsize=13)
    ax.set_ylabel("single-frame inference latency (ms)", fontsize=12)
    ax.set_ylim(0, max(float(r["p95 (ms)"]) for r in rows) * 1.18)
    ax.grid(axis="y", color=FG, alpha=0.12, linewidth=0.8)
    legend = ax.legend(frameon=False, fontsize=12, loc="upper left")
    for text in legend.get_texts():
        text.set_color(FG)
    footer = (f"{context}\nsource: {SOURCE}\nscript: {SCRIPT}")
    fig.text(0.01, 0.01, footer, color=FG, alpha=0.7, fontsize=9, va="bottom")
    fig.subplots_adjust(left=0.07, right=0.98, top=0.95, bottom=0.2)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(OUT, facecolor=BG)


if __name__ == "__main__":
    table = read_table(SOURCE)
    draw(table, read_context(SOURCE))
    for r in table:
        print(r["Model"], {m: r[m] for m in METRICS}, "FPS", r["FPS"])
    print(f"wrote {OUT}")
