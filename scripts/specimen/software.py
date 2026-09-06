"""Emit the software specimen snapshot from ArchvBrain's committed eval baseline.

Run from the portfolio repo root:

  python3 scripts/specimen/software.py > src/features/specimen/data/software.json

Reads eval_data/verified_extraction_baseline.json. Every value comes from that
file. The commit hash is the one the baseline says it was measured against.
"""
from __future__ import annotations

import datetime as dt
import json
import sys
from pathlib import Path

BASELINE = Path("/Users/jay/ArchvBrain/eval_data/verified_extraction_baseline.json")
COLS = 8  # review-grid columns in the fixture corpus
STATE_VALUE = {"answered": 1.0, "needs_review": 0.55, "not_found": 0.15, "pending": 0.05, "not_applicable": 0.0, "error": 0.0}


def main() -> int:
    d = json.loads(BASELINE.read_text())
    totals = d["totals"]
    dist = d["stateDistribution"]
    rows = int(totals["documentsEligible"])
    if rows * COLS != int(totals["cellsTotal"]):
        raise SystemExit(f"grid {rows}x{COLS} != cellsTotal {totals['cellsTotal']}")
    ordered = ["answered", "needs_review", "not_found", "pending", "not_applicable", "error"]
    values: list[float] = []
    for state in ordered:
        values.extend([STATE_VALUE[state]] * int(dist.get(state, 0)))
    if len(values) != rows * COLS:
        raise SystemExit(f"state distribution sums to {len(values)}, expected {rows * COLS}")
    labels = {
        "0": str(totals["quotesStoredTextExact"]),
        str(COLS - 1): str(totals["quotes"]),
        str(rows * COLS - 1): str(totals["falseAnchors"]),
    }
    snapshot = {
        "persona": "software",
        "cols": COLS,
        "rows": rows,
        "values": values,
        "labels": labels,
        "source": {
            "repo": "ArchvBrain",
            "commit": d["measuredAgainst"]["commit"],
            "path": "eval_data/verified_extraction_baseline.json",
            "how": "python3 scripts/specimen/software.py (stateDistribution laid out row-major, labels = quotesStoredTextExact, quotes, falseAnchors)",
            "observedAt": dt.date.today().isoformat(),
            "note": f"verifiedQuoteRate={d['rates']['verifiedQuoteRate']} falseAnchorRate={d['rates']['falseAnchorRate']}",
        },
    }
    json.dump(snapshot, sys.stdout, separators=(",", ":"))
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
