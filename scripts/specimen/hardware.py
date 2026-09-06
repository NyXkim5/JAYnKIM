# scripts/specimen/hardware.py
"""Emit the hardware specimen snapshot from a real DroneNexus siting run.

Run from the portfolio repo root:

  PYTHONPATH=/Users/jay/DroneNexus/packages/shared/python:/Users/jay/DroneNexus/services/core:/Users/jay/DroneNexus/services/sensor \
    python3 scripts/specimen/hardware.py > src/features/specimen/data/hardware.json

The scenario is DroneNexus's own hand-checkable case: a north-south ridge with
demand on both sides. Nothing here is invented; the numbers are what the
optimizer computed.
"""
from __future__ import annotations

import datetime as dt
import json
import sys
from pathlib import Path

import numpy as np

from siting.coverage import coverage_matrix
from siting.greedy import greedy_select
from siting.model import Candidate, build_demand_grid
from terrain.model import Terrain
from terrain.synthetic import ridge

DRONENEXUS = Path("/Users/jay/DroneNexus")
CELLS = 48
RESOLUTION_M = 50.0
RADIUS_M = CELLS * RESOLUTION_M / 2.0
ORIGIN = (1500.0, -1500.0, 0.0)
SENSORS = 4


def head_sha(repo: Path) -> str:
    """Resolve HEAD by reading .git files. No git subprocess."""
    head = (repo / ".git" / "HEAD").read_text().strip()
    if not head.startswith("ref:"):
        return head
    ref = repo / ".git" / head.split(" ", 1)[1]
    if ref.exists():
        return ref.read_text().strip()
    packed = (repo / ".git" / "packed-refs").read_text().splitlines()
    for line in packed:
        if line.endswith(head.split(" ", 1)[1]):
            return line.split(" ")[0]
    raise SystemExit("could not resolve HEAD")


def candidates() -> list[Candidate]:
    """A 6 x 6 lattice of ten metre masts across the square."""
    out = []
    for i in range(6):
        for j in range(6):
            east = 250.0 + 500.0 * i
            north = -250.0 - 500.0 * j
            out.append(Candidate(position=(east, north, 10.0), range_m=1800.0, label=f"{i}{j}"))
    return out


def nearest_cell(demand, east: float, north: float) -> int:
    band = demand.band_slice(0)
    d = (demand.east[band] - east) ** 2 + (demand.north[band] - north) ** 2
    return int(np.argmin(d))


def main() -> int:
    terrain = Terrain(layers=(ridge(rows=300, cols=300, base=90.0, peak=260.0, resolution_m=10.0),))
    demand = build_demand_grid(
        origin=ORIGIN, terrain=terrain, radius_m=RADIUS_M,
        resolution_m=RESOLUTION_M, altitudes_agl_m=(40.0,),
    )
    if demand.shape != (CELLS, CELLS):
        raise SystemExit(f"expected {CELLS}x{CELLS}, got {demand.shape}")
    cands = candidates()
    plan = greedy_select(coverage_matrix(cands, demand, terrain), k=SENSORS)
    covered = plan.covered[demand.band_slice(0)]
    values = [round(float(v), 4) for v in covered]
    labels = {}
    for order, pick in enumerate(plan.chosen, start=1):
        c = cands[pick]
        labels[str(nearest_cell(demand, c.position[0], c.position[1]))] = str(order)
    snapshot = {
        "persona": "hardware",
        "cols": CELLS,
        "rows": CELLS,
        "values": values,
        "labels": labels,
        "source": {
            "repo": "NyXkim5/DroneNexus",
            "commit": head_sha(DRONENEXUS),
            "path": "services/core/siting/",
            "how": "python3 scripts/specimen/hardware.py (ridge terrain, 48x48 demand at 50 m, 36 candidates, k=4)",
            "observedAt": dt.date.today().isoformat(),
            "note": f"expected_fraction={plan.expected_fraction:.4f} chosen={list(plan.chosen)} marginal={[round(g, 1) for g in plan.marginal_gain]}",
        },
    }
    json.dump(snapshot, sys.stdout, indent=None, separators=(",", ":"))
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
