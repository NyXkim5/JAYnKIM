"""Render the Pantheon fusion benchmark as two panels of grouped bars.

Reads the Cartesian benchmark table verbatim from the Theia handoff on the
DroneNexus feature/pantheon-wave2 branch. Every number drawn comes from that
table: MOTA and IDF1 on the left, milliseconds per update on the right, for
the native IMM/JPDA tracker and the Theia (Stone Soup JPDA) backend over the
same 216 detections. Run from the portfolio worktree root:

  python3 scripts/figures/fusion-benchmark.py
"""
from __future__ import annotations

import logging
import subprocess
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
logging.getLogger("matplotlib.font_manager").setLevel(logging.ERROR)
import matplotlib.pyplot as plt  # noqa: E402

REPO = Path("/Users/jay/DroneNexus")
REF = "feature/pantheon-wave2"
DOC = "docs/superpowers/handoffs/theia-2026-09-08.md"
OUT = Path("public/projects/fusion-benchmark.png")
SCRIPT = "scripts/figures/fusion-benchmark.py"

BG = "#0a0a0a"
FG = "#ffffff"
PINK = "#ff69b4"
MONO = ["JetBrains Mono", "DejaVu Sans Mono", "Menlo", "monospace"]
COLUMNS = ("backend", "MOTA", "IDF1", "MOTP(m)", "update(ms)", "confirmed")


def read_doc() -> str:
    return subprocess.run(
        ["git", "-C", str(REPO), "show", f"{REF}:{DOC}"],
        check=True, capture_output=True, text=True,
    ).stdout


def read_cartesian_table(text: str) -> tuple[str, list[dict[str, str]]]:
    """Return the scenario line and the rows of the first Cartesian table."""
    lines = text.splitlines()
    start = next(i for i, ln in enumerate(lines) if ln.startswith("scenario=cartesian"))
    scenario = lines[start]
    rows: list[dict[str, str]] = []
    for ln in lines[start + 3:]:
        cells = ln.split()
        if len(cells) != len(COLUMNS):
            break
        rows.append(dict(zip(COLUMNS, cells)))
    if not rows:
        raise ValueError("Cartesian benchmark table not found in the handoff")
    return scenario, rows


def style(ax: plt.Axes) -> None:
    ax.set_facecolor(BG)
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    for side in ("left", "bottom"):
        ax.spines[side].set_color(FG)
    ax.tick_params(colors=FG, labelsize=12)
    ax.yaxis.label.set_color(FG)
    ax.grid(axis="y", color=FG, alpha=0.12, linewidth=0.8)


def bars(ax: plt.Axes, rows: list[dict[str, str]], metrics: tuple[str, ...], fmt: str) -> None:
    width = 0.34
    for i, row in enumerate(rows):
        native = row["backend"] == "native"
        color = PINK if native else FG
        xs = [g + (i - 0.5) * width for g in range(len(metrics))]
        ys = [float(row[m]) for m in metrics]
        ax.bar(xs, ys, width=width * 0.92, color=color if native else BG,
               edgecolor=color, linewidth=1.5,
               label="native IMM/JPDA" if native else "Theia (Stone Soup JPDA)")
        top = max(float(r[m]) for r in rows for m in metrics)
        for x, y in zip(xs, ys):
            ax.text(x, y + top * 0.015, fmt.format(y), ha="center", va="bottom", color=color, fontsize=11)
    ax.set_xticks(range(len(metrics)))
    ax.set_xticklabels([m.replace("(ms)", "") for m in metrics], fontsize=13)
    ax.set_xlim(-0.6, len(metrics) - 0.4)


def draw(scenario: str, rows: list[dict[str, str]]) -> None:
    plt.rcParams["font.family"] = MONO
    fig, (left, right) = plt.subplots(1, 2, figsize=(16, 8), dpi=100, facecolor=BG,
                                      gridspec_kw={"width_ratios": [2, 1]})
    style(left)
    style(right)
    bars(left, rows, ("MOTA", "IDF1"), "{:.3f}")
    left.set_ylim(0, 1.15)
    left.set_ylabel("score, 25 m match radius", fontsize=12)
    bars(right, rows, ("update(ms)",), "{:.2f}")
    right.set_ylim(0, max(float(r["update(ms)"]) for r in rows) * 1.25)
    right.set_ylabel("milliseconds per update", fontsize=12)
    legend = left.legend(frameon=False, fontsize=12, loc="upper right")
    for text in legend.get_texts():
        text.set_color(FG)
    footer = (f"{scenario}\nsource: {REPO.name} {REF}:{DOC}\nscript: {SCRIPT}")
    fig.text(0.01, 0.01, footer, color=FG, alpha=0.7, fontsize=9, va="bottom")
    fig.subplots_adjust(left=0.06, right=0.98, top=0.95, bottom=0.2, wspace=0.25)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(OUT, facecolor=BG)


if __name__ == "__main__":
    scenario_line, table = read_cartesian_table(read_doc())
    draw(scenario_line, table)
    for r in table:
        print(r["backend"], {m: r[m] for m in COLUMNS[1:]})
    print(f"wrote {OUT}")
