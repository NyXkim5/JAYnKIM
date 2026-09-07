"""Render the committed hardware snapshot as a PNG for the projects page.

Run from the portfolio repo root:

  python3 scripts/specimen/render_coverage.py

Reads src/features/specimen/data/hardware.json (a real siting run) and writes
public/projects/siting-coverage.png. Nothing here is invented; the pixels are
the optimizer's coverage probabilities, the pink cells are its chosen sites.
"""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw

SRC = Path("src/features/specimen/data/hardware.json")
OUT = Path("public/projects/siting-coverage.png")
CELL = 20
GAP = 2
BG = (10, 10, 10)
PINK = (255, 105, 180)


def gray(v: float) -> tuple[int, int, int]:
    level = int(round((0.12 + v * 0.8) * 255))
    return (level, level, level)


def main() -> int:
    d = json.loads(SRC.read_text())
    cols, rows, values, labels = d["cols"], d["rows"], d["values"], d["labels"]
    img = Image.new("RGB", (cols * CELL, rows * CELL), BG)
    draw = ImageDraw.Draw(img)
    for i, v in enumerate(values):
        r, c = divmod(i, cols)
        x, y = c * CELL + GAP // 2, r * CELL + GAP // 2
        fill = PINK if str(i) in labels else gray(v)
        if v > 0.02 or str(i) in labels:
            draw.rectangle([x, y, x + CELL - GAP, y + CELL - GAP], fill=fill)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, optimize=True)
    print(f"wrote {OUT} {img.size[0]}x{img.size[1]} from commit {d['source']['commit'][:7]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
