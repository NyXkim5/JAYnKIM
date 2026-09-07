"""Render the sensor siting run as a two-panel figure for the Projects page.

Same scenario as scripts/specimen/hardware.py, DroneNexus's hand-checkable
case: a north-south ridge with demand on both sides, 36 candidate masts on a
6 x 6 lattice, four sensors chosen greedily at 900 m range. Left: the terrain
with every candidate, the chosen sites and their range rings. Right: the
expected coverage each demand cell receives. Every number drawn is what the
optimizer computed. Run from the portfolio repo root:

  PYTHONPATH=/Users/jay/DroneNexus/packages/shared/python:/Users/jay/DroneNexus/services/core:/Users/jay/DroneNexus/services/sensor \\
    python3 scripts/figures/siting-coverage.py
"""
from __future__ import annotations

import logging
import sys
from pathlib import Path

import matplotlib
import numpy as np

matplotlib.use("Agg")
logging.getLogger("matplotlib.font_manager").setLevel(logging.ERROR)
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.colors import LinearSegmentedColormap, PowerNorm  # noqa: E402
from matplotlib.patches import Circle  # noqa: E402

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "specimen"))
from hardware import DRONENEXUS, ORIGIN, RADIUS_M, RESOLUTION_M, SENSORS, candidates, head_sha  # noqa: E402
from siting.coverage import coverage_matrix  # noqa: E402
from siting.greedy import greedy_select  # noqa: E402
from siting.model import build_demand_grid  # noqa: E402
from terrain.model import Terrain  # noqa: E402
from terrain.synthetic import ridge  # noqa: E402

OUT = Path("public/projects/siting-plan.png")
SCRIPT = "scripts/figures/siting-coverage.py"
BG = "#0a0a0a"
FG = "#ffffff"
PINK = "#ff69b4"
MONO = ["JetBrains Mono", "DejaVu Sans Mono", "Menlo", "monospace"]
PINKS = LinearSegmentedColormap.from_list("pinks", [BG, "#54273d", "#913e68", "#ce5692", PINK])
GRAYS = LinearSegmentedColormap.from_list("grays", ["#121212", "#4a4a4a", "#a8a8a8"])
ALTITUDE_AGL_M = 40.0


def scenario():
    terrain = Terrain(layers=(ridge(rows=300, cols=300, base=90.0, peak=260.0, resolution_m=10.0),))
    demand = build_demand_grid(
        origin=ORIGIN, terrain=terrain, radius_m=RADIUS_M,
        resolution_m=RESOLUTION_M, altitudes_agl_m=(ALTITUDE_AGL_M,),
    )
    cands = candidates()
    plan = greedy_select(coverage_matrix(cands, demand, terrain), k=SENSORS)
    return terrain, demand, cands, plan


def style(ax: plt.Axes, title: str) -> None:
    ax.set_facecolor(BG)
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    for side in ("left", "bottom"):
        ax.spines[side].set_color(FG)
    ax.tick_params(colors=FG, labelsize=10)
    ax.set_xlabel("east (m)", color=FG, fontsize=10)
    ax.set_ylabel("north (m)", color=FG, fontsize=10)
    ax.set_title(title, color=FG, fontsize=12, loc="left", pad=10)
    ax.set_aspect("equal")


def draw_sites(ax: plt.Axes, cands, plan, rings: bool, color: str) -> None:
    ax.scatter([c.position[0] for c in cands], [c.position[1] for c in cands],
               s=14, color=FG, alpha=0.55, linewidths=0, zorder=3)
    for order, pick in enumerate(plan.chosen, start=1):
        east, north, _ = cands[pick].position
        ax.scatter([east], [north], s=90, marker="s", color=color, edgecolor=BG, linewidths=1, zorder=5)
        ax.text(east + 55, north + 55, str(order), color=color, fontsize=11, weight="bold", zorder=6)
        if rings:
            ax.add_patch(Circle((east, north), cands[pick].range_m, fill=False, edgecolor=PINK,
                                linewidth=1, alpha=0.75, linestyle=(0, (4, 3)), zorder=4))


def draw(terrain, demand, cands, plan) -> None:
    plt.rcParams["font.family"] = MONO
    band = demand.band_slice(0)
    east, north = demand.east[band], demand.north[band]
    lo_e, hi_e, lo_n, hi_n = east.min(), east.max(), north.min(), north.max()
    fig, (left, right) = plt.subplots(1, 2, figsize=(16, 8), dpi=100, facecolor=BG)

    # Pad the frame so the outer lattice of masts and the range rings stay in view.
    pad = 2 * RESOLUTION_M
    ee, nn = np.meshgrid(np.linspace(lo_e - pad, hi_e + pad, 260), np.linspace(lo_n - pad, hi_n + pad, 260))
    heights = terrain.height_at_many(ee.ravel(), nn.ravel()).reshape(ee.shape)
    style(left, "terrain, 36 candidate masts, the 4 chosen sites and their 900 m rings")
    # The ridge is a narrow crest on a flat base, so a power norm lifts its
    # flanks into view instead of drawing one bright line.
    left.pcolormesh(ee, nn, heights, cmap=GRAYS, shading="nearest",
                    norm=PowerNorm(gamma=0.45, vmin=float(heights.min()), vmax=float(heights.max())))
    crest_e = float(ee.ravel()[int(np.argmax(heights))])
    left.text(crest_e + 40, lo_n - pad + 40, f"ridge crest {heights.max():.0f} m, base {heights.min():.0f} m",
              color=FG, alpha=0.8, fontsize=9, va="bottom")
    draw_sites(left, cands, plan, rings=True, color=PINK)
    left.set_xlim(lo_e - pad, hi_e + pad)
    left.set_ylim(lo_n - pad, hi_n + pad)

    rows, cols = demand.shape
    style(right, f"expected coverage per demand cell, {ALTITUDE_AGL_M:.0f} m AGL")
    mesh = right.pcolormesh(east.reshape(rows, cols), north.reshape(rows, cols),
                            plan.covered[band].reshape(rows, cols), cmap=PINKS, vmin=0, vmax=1, shading="nearest")
    draw_sites(right, cands, plan, rings=False, color=FG)
    right.set_xlim(lo_e - pad, hi_e + pad)
    right.set_ylim(lo_n - pad, hi_n + pad)
    bar = fig.colorbar(mesh, ax=right, fraction=0.046, pad=0.03)
    bar.ax.tick_params(colors=FG, labelsize=9)
    bar.outline.set_edgecolor(FG)

    gains = ", ".join(f"{g:.0f}" for g in plan.marginal_gain)
    header = (f"GREEDY SENSOR SITING  ·  k={SENSORS} of {len(cands)} candidates  ·  range 900 m  ·  "
              f"expected coverage {plan.expected_fraction * 100:.1f}%  ·  marginal gains {gains} cells  ·  bound 1 - 1/e")
    fig.text(0.01, 0.965, header, color=PINK, fontsize=11, va="top")
    footer = (f"scenario: north-south ridge, {rows}x{cols} demand cells at {RESOLUTION_M:.0f} m, "
              f"chosen candidates {list(plan.chosen)}\n"
              f"source: NyXkim5/DroneNexus@{head_sha(DRONENEXUS)[:7]} services/core/siting/   "
              f"snapshot: src/features/specimen/data/hardware.json   script: {SCRIPT}")
    fig.text(0.01, 0.01, footer, color=FG, alpha=0.7, fontsize=9, va="bottom")
    fig.subplots_adjust(left=0.05, right=0.98, top=0.86, bottom=0.14, wspace=0.18)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(OUT, facecolor=BG)


if __name__ == "__main__":
    terrain, demand, cands, plan = scenario()
    draw(terrain, demand, cands, plan)
    print(f"expected_fraction={plan.expected_fraction:.4f} chosen={list(plan.chosen)} "
          f"marginal={[round(g, 1) for g in plan.marginal_gain]}")
    print(f"wrote {OUT}")
