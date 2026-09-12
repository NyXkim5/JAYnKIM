"""Render the sea state chart from the measured sweep CSV."""
from __future__ import annotations

import csv
import sys

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import MultipleLocator

BG = "#0a0a0a"
INK = "#d8d8d8"
SUB = "#8a8a8a"
FAINT = "#6e6e6e"
GRID = "#1f1f1f"
SERIES = ("#e0407f", "#3d7fd6", "#2e9e6b", "#b8862b")

# Series order is fixed: sea-skimmer, closing-swarm, multi-axis,
# crossing-civilian, which is also increasing swarm altitude.
# label_dy nudges two crowded labels apart. The marks stay on the data.
PLOTTED = (
    ("sea-skimmer", "sea-skimmer", "8 m", 0.0),
    ("closing-swarm", "closing-swarm", "30 m", -0.022),
    ("multi-axis", "multi-axis", "40 m", 0.022),
    ("crossing-civilian", "crossing-civilian", "60 m", 0.0),
)

HS = ("0.0", "0.1", "0.5", "1.3", "2.5", "4.0", "6.0", "9.0", "14", "18")


def load(path: str) -> dict[str, list[dict[str, str]]]:
    rows = list(csv.DictReader(open(path)))
    out: dict[str, list[dict[str, str]]] = {}
    for row in rows:
        out.setdefault(row["scenario"], []).append(row)
    for values in out.values():
        values.sort(key=lambda r: int(r["sea_state"]))
    return out


def main() -> int:
    data = load(sys.argv[1])
    dest = sys.argv[2]

    plt.rcParams.update({
        "font.family": "DejaVu Sans",
        "font.size": 10,
        "axes.facecolor": BG,
        "figure.facecolor": BG,
        "savefig.facecolor": BG,
        "text.color": INK,
    })

    fig, (ax_top, ax_bot) = plt.subplots(
        2, 1, figsize=(9.2, 7.35), dpi=200, sharex=True,
        gridspec_kw={"height_ratios": [1.0, 1.8], "hspace": 0.46},
    )
    fig.subplots_adjust(left=0.078, right=0.99, top=0.845, bottom=0.205)

    xs = list(range(10))
    xmax = 12.6

    for ax in (ax_top, ax_bot):
        ax.set_facecolor(BG)
        for side in ("top", "right"):
            ax.spines[side].set_visible(False)
        for side in ("left", "bottom"):
            ax.spines[side].set_color("#2b2b2b")
            ax.spines[side].set_linewidth(0.8)
        ax.yaxis.grid(True, color=GRID, linewidth=0.7)
        ax.set_axisbelow(True)
        ax.tick_params(colors=SUB, labelsize=9, length=3, width=0.8)
        ax.set_xlim(-0.35, xmax)

    # Top panel. Clutter contacts per tick, measured on the same four runs.
    for color, (key, _, _, _) in zip(SERIES, PLOTTED):
        ys = [float(r["radar_clutter_per_tick"]) for r in data[key]]
        ax_top.plot(xs, ys, color=color, lw=1.1, marker="o", ms=3.0,
                    mew=0, alpha=0.95, clip_on=False, zorder=3)

    ax_top.set_ylim(0, 4.5)
    ax_top.yaxis.set_major_locator(MultipleLocator(1))
    ax_top.set_ylabel("contacts per tick", color=SUB, fontsize=9.5, labelpad=7)
    ax_top.set_title("Clutter contacts the radar reports each tick",
                     color=INK, fontsize=11.5, loc="left", pad=8)
    ax_top.text(9.30, 4.03, "all four scenarios,\none curve",
                color=INK, fontsize=9.5, va="center", ha="left", linespacing=1.4)
    ax_top.text(0.55, 3.45, "0.04 per tick on a glassy sea.\n4.1 on a phenomenal one.",
                color=SUB, fontsize=9, linespacing=1.5, va="top")

    # Bottom panel. Radar hits per target per tick, the detection side.
    ends: dict[str, float] = {}
    for color, (key, label, alt, dy) in zip(SERIES, PLOTTED):
        ys = [float(r["radar_true_per_contact_per_tick"]) for r in data[key]]
        ax_bot.plot(xs, ys, color=color, lw=1.35, marker="o", ms=3.4,
                    mew=0, clip_on=False, zorder=3)
        ends[key] = ys[-1]
        ax_bot.text(9.30, ys[-1] + dy + 0.017, label, color=color, fontsize=10.2,
                    va="center", ha="left", zorder=4)
        ax_bot.text(9.30, ys[-1] + dy - 0.030, f"{alt} altitude, {ys[-1]:.2f}",
                    color=SUB, fontsize=8.8, va="center", ha="left", zorder=4)

    ax_bot.set_ylim(0.24, 0.95)
    ax_bot.yaxis.set_major_locator(MultipleLocator(0.1))
    ax_bot.set_ylabel("hits per target, per tick", color=SUB, fontsize=9.5, labelpad=7)
    ax_bot.set_title("Radar detections on each target it is trying to hold",
                     color=INK, fontsize=11.5, loc="left", pad=28)
    ax_bot.set_xticks(xs)
    ax_bot.set_xticklabels([f"{n}\n{h}" for n, h in zip(xs, HS)], linespacing=1.7)
    ax_bot.set_xlabel("Douglas sea state, and significant wave height in metres",
                      color=SUB, fontsize=9.5, labelpad=8)

    ax_bot.text(0.0, 1.028,
                "The radar gets one look at each target per tick, so this is detection probability.",
                transform=ax_bot.transAxes, color=SUB, fontsize=9, ha="left", va="bottom")
    ax_bot.text(0.40, 0.885, "every swarm starts level near 0.85", color=SUB, fontsize=9)
    ax_bot.text(0.15, 0.445,
                "At sea state 9 the wavetop swarm returns\nhalf the hits of the swarm at 60 metres.",
                color=SUB, fontsize=9, ha="left", va="center", linespacing=1.5)

    fig.text(0.078, 0.972, "Sea state charges a shipboard radar twice",
             color=INK, fontsize=16, ha="left", va="center")
    fig.text(0.078, 0.934,
             "A rising sea floods the radar with clutter and takes hits off the target.",
             color=SUB, fontsize=10.2, ha="left", va="center")
    fig.text(0.078, 0.905,
             "Only the second cost depends on how low the drone flies.",
             color=SUB, fontsize=10.2, ha="left", va="center")

    fig.text(0.078, 0.066,
             "Aeacus maritime scenario library. Ten sea states by four named scenarios, "
             "replayed on the real harness at seed 20260910.",
             color=SUB, fontsize=8.6, ha="left", va="center")
    fig.text(0.078, 0.041,
             "Fusion confirmed zero false tracks at every sea state, so the clutter arrives as load "
             "rather than as phantom tracks.",
             color=FAINT, fontsize=8.6, ha="left", va="center")
    fig.text(0.078, 0.016,
             "sequential-waves mixes two altitudes and sensor-degradation cuts the radar mid-run, "
             "so neither is plotted here.",
             color=FAINT, fontsize=8.6, ha="left", va="center")

    fig.savefig(dest, dpi=200, facecolor=BG)
    print(f"wrote {dest}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
