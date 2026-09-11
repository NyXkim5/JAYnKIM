#!/usr/bin/env python3
"""Render the pink dot-matrix horse for /stealth and the phone gate.

Source: Eadweard Muybridge, "Sallie Gardner at a Gallop" (1878), the animated
sequence on Wikimedia Commons (Muybridge_race_horse_animated.gif). Muybridge
died in 1904, so the photographs are in the public domain everywhere.

Each frame becomes a grid of pink dots on transparency: the darker a cell of
the photograph, the larger its dot. The frames are written as PNGs and then
encoded three ways for the browsers in HorseVideo.tsx.

Usage:
  python3 scripts/stealth/horse.py <muybridge.gif> [out dir]
"""
from __future__ import annotations

import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

REPO_ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = REPO_ROOT / "public" / "stealth"
PINK = (255, 105, 180, 255)
WIDTH, HEIGHT = 480, 400
CELL = 16
COLS, ROWS = WIDTH // CELL, HEIGHT // CELL
FPS = 10
# Darkness below this is paper, not horse.
FLOOR = 0.42
# Whole-clip crop of the photograph, as fractions: the strip is 300 by 200 and
# the horse and rider fill the middle band of it.
CROP = (0.0, 0.08, 1.0, 0.82)


def frames_of(gif: Path) -> list[Image.Image]:
    im = Image.open(gif)
    out = []
    for i in range(im.n_frames):
        im.seek(i)
        out.append(im.convert("L"))
    return out


def darkness_grid(frame: Image.Image) -> np.ndarray:
    w, h = frame.size
    box = (int(CROP[0] * w), int(CROP[1] * h), int(CROP[2] * w), int(CROP[3] * h))
    small = frame.crop(box).resize((COLS, ROWS), Image.BOX)
    dark = 1.0 - np.asarray(small, dtype=np.float32) / 255.0
    return np.clip((dark - FLOOR) / (1.0 - FLOOR), 0.0, 1.0)


def draw_dots(grid: np.ndarray) -> Image.Image:
    im = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    for r in range(ROWS):
        for c in range(COLS):
            v = float(grid[r, c])
            if v <= 0.0:
                continue
            radius = (CELL / 2 - 1) * (0.35 + 0.65 * v)
            cx, cy = c * CELL + CELL / 2, r * CELL + CELL / 2
            d.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=PINK)
    return im


# The ground the page paints behind the horse. The no-alpha fallback is
# composited onto this exact colour, not onto pure black, so the video's own
# rectangle cannot show as a darker box against the page.
GROUND = "#0a0a0a"


def encode(frames_dir: Path, out: Path) -> None:
    """Write the three sources the player offers, in order of preference.

    Two of them must carry real transparency. The earlier version composited
    the HEVC onto black with the same filter as the mp4 fallback, so Safari,
    which picks the HEVC first, got an opaque rectangle. The frames are RGBA,
    so alpha only survives if the encoder is handed them directly.
    """
    pattern = str(frames_dir / "%03d.png")
    base = ["ffmpeg", "-v", "error", "-y", "-framerate", str(FPS), "-i", pattern]

    # WebM with alpha for Chrome and Firefox. yuva420p keeps the alpha plane.
    subprocess.run(
        base + ["-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "30",
                str(out / "horse.webm")],
        check=True,
    )

    # HEVC with alpha for Safari. VideoToolbox carries alpha when it is given a
    # bgra source and an explicit alpha quality. It must NOT be composited.
    subprocess.run(
        base + ["-c:v", "hevc_videotoolbox", "-pix_fmt", "bgra", "-alpha_quality", "0.9",
                "-q:v", "60", "-tag:v", "hvc1", "-movflags", "+faststart",
                str(out / "horse-hevc.mov")],
        check=True,
    )

    # Last resort, no alpha. Composite onto the page ground so the rectangle is
    # invisible even here.
    ground = "color=%s:s=%dx%d" % (GROUND, WIDTH, HEIGHT)
    on_ground = ["-f", "lavfi", "-i", ground,
                 "-filter_complex", "[1:v][0:v]overlay=shortest=1,format=yuv420p"]
    subprocess.run(
        base + on_ground + ["-c:v", "libx264", "-crf", "20", "-movflags", "+faststart",
                            str(out / "horse.mp4")],
        check=True,
    )


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    gif = Path(sys.argv[1])
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else OUT_DIR
    out.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="horse-"))
    try:
        for i, frame in enumerate(frames_of(gif)):
            draw_dots(darkness_grid(frame)).save(tmp / f"{i:03d}.png")
        draw_dots(darkness_grid(frames_of(gif)[0])).save(out / "horse-frame.png")
        encode(tmp, out)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    for name in ("horse.webm", "horse.mp4", "horse-hevc.mov"):
        print(name, (out / name).stat().st_size, "bytes")
    return 0


if __name__ == "__main__":
    sys.exit(main())
