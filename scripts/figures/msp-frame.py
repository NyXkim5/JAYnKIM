"""Draw the byte layout of one real MSP frame from the DroneNexus encoder.

Imports MSPEncoder from services/core/msp/protocol.py and the RC constants
from services/core/msp/commands.py, builds the exact MSP_SET_RAW_RC payload
MSPCommander.arm() sends, encodes it, and draws every byte as a cell.

The encoder emits MSP v1 frames ($M< header, XOR checksum). The repo has no
MSP v2 ($X) encoder, so this figure shows the v1 frame it really produces.
Run from the portfolio worktree root: python3 scripts/figures/msp-frame.py
"""
from __future__ import annotations

import struct
import sys
from pathlib import Path

import logging

import matplotlib

matplotlib.use("Agg")
logging.getLogger("matplotlib.font_manager").setLevel(logging.ERROR)
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Rectangle  # noqa: E402

CORE = Path("/Users/jay/DroneNexus/services/core")
MODULE = CORE / "msp/protocol.py"
COMMANDS = CORE / "msp/commands.py"
OUT = Path("public/projects/msp-frame.png")
SCRIPT = "scripts/figures/msp-frame.py"

BG = "#0a0a0a"
FG = "#ffffff"
PINK = "#ff69b4"
MONO = ["JetBrains Mono", "DejaVu Sans Mono", "Menlo", "monospace"]
CHANNELS = ("ROLL", "PITCH", "YAW", "THR", "AUX1", "AUX2", "AUX3", "AUX4")


def build_arm_frame() -> tuple[bytes, list[int], int]:
    """Encode the arm command exactly as MSPCommander.arm() does."""
    sys.path.insert(0, str(CORE))
    from msp import commands  # noqa: E402
    from msp.protocol import MSPCode, MSPEncoder  # noqa: E402

    mid, low, arm = commands.RC_MID, commands.RC_LOW, commands.RC_ARM_THRESHOLD
    channels = [mid, mid, mid, low, arm, mid, mid, mid]
    payload = struct.pack("<" + "H" * len(channels), *channels)
    code = int(MSPCode.MSP_SET_RAW_RC)
    return MSPEncoder.encode(code, payload), channels, code


def field_of(index: int, size: int) -> tuple[str, str]:
    """Return (group label, cell label) for byte position index."""
    if index < 3:
        return "header", ("'$'", "'M'", "'<'")[index]
    if index == 3:
        return "size", f"{size} bytes"
    if index == 4:
        return "code", "SET_RAW_RC"
    if index < 5 + size:
        channel = (index - 5) // 2
        half = "lo" if (index - 5) % 2 == 0 else "hi"
        return f"ch{channel}", f"{CHANNELS[channel]} {half}"
    return "crc", "XOR"


def draw(frame: bytes, channels: list[int], code: int) -> None:
    plt.rcParams["font.family"] = MONO
    n = len(frame)
    size = frame[3]
    fig, ax = plt.subplots(figsize=(16, 6.4), dpi=100, facecolor=BG)
    ax.set_facecolor(BG)
    ax.set_xlim(-0.3, n + 0.3)
    ax.set_ylim(-3.2, 3.4)
    ax.axis("off")
    cell_w = 0.92
    for i, byte in enumerate(frame):
        group, label = field_of(i, size)
        is_crc = group == "crc"
        edge = PINK if is_crc else FG
        ax.add_patch(Rectangle((i, 0), cell_w, 1.6, facecolor=BG,
                               edgecolor=edge, linewidth=1.4))
        ax.text(i + cell_w / 2, 1.05, f"{byte:02x}", ha="center",
                va="center", color=edge, fontsize=15, weight="bold")
        ax.text(i + cell_w / 2, 0.42, str(i), ha="center", va="center",
                color=FG, alpha=0.55, fontsize=9)
        ax.text(i + cell_w / 2, -0.35, label, ha="center", va="top",
                color=edge, fontsize=8.5, rotation=90)
    draw_spans(ax, frame, channels, cell_w)
    draw_footer(fig, frame, code)
    fig.subplots_adjust(left=0.02, right=0.98, top=0.98, bottom=0.02)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(OUT, facecolor=BG)


def draw_spans(ax: plt.Axes, frame: bytes, channels: list[int],
               cell_w: float) -> None:
    """Draw bracket lines over each field group with its decoded value."""
    size = frame[3]
    spans = [(0, 3, "header $M<"), (3, 4, f"size={size}"),
             (4, 5, f"code={frame[4]}")]
    for k, value in enumerate(channels):
        start = 5 + 2 * k
        spans.append((start, start + 2, f"{CHANNELS[k]}={value}"))
    spans.append((5 + size, 6 + size, f"crc=0x{frame[-1]:02x}"))
    for start, end, text in spans:
        is_crc = text.startswith("crc")
        color = PINK if is_crc else FG
        x0, x1 = start + 0.04, end - 1 + cell_w - 0.04
        ax.plot([x0, x0, x1, x1], [1.85, 2.05, 2.05, 1.85], color=color,
                linewidth=1.1)
        ax.text((x0 + x1) / 2, 2.2, text, ha="center", va="bottom",
                color=color, fontsize=9.5, rotation=0 if end - start > 1 else 90)


def draw_footer(fig: plt.Figure, frame: bytes, code: int) -> None:
    hexline = " ".join(f"{b:02x}" for b in frame)
    lines = [
        f"MSP v1 request frame, {len(frame)} bytes: {hexline}",
        f"command: MSPCommander.arm() -> MSP_SET_RAW_RC (code {code}), "
        "8 x uint16 little-endian RC channels, AUX1=1800 arms",
        "checksum: XOR of size, code and every payload byte (encoder in "
        "MSPEncoder.encode)",
        f"encoder: {MODULE}",
        f"channels: {COMMANDS}",
        f"script: {SCRIPT}",
    ]
    fig.text(0.02, 0.03, "\n".join(lines), color=FG, alpha=0.75,
             fontsize=9, va="bottom")


if __name__ == "__main__":
    frame, channels, code = build_arm_frame()
    draw(frame, channels, code)
    print(len(frame), frame.hex(" "))
    print("channels", channels, "code", code)
    print(f"wrote {OUT}")
