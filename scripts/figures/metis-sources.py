"""Render the Metis curated source registry by tier and by connector kind.

Parses CURATED_REGISTRY in services/ingest/src/sources/registry.ts from the
Metis repo. Each entry is a top-level object literal in that array. Left
panel: entries per tier, enabled entries filled, disabled entries hollow,
state-controlled entries in pink. Right panel: entries per connector kind.
Every number drawn is parsed from that file. Run from the portfolio
worktree root: python3 scripts/figures/metis-sources.py
"""
from __future__ import annotations

import re
from collections import Counter
from pathlib import Path

import logging

import matplotlib

matplotlib.use("Agg")
logging.getLogger("matplotlib.font_manager").setLevel(logging.ERROR)
import matplotlib.pyplot as plt  # noqa: E402

SOURCE = Path("/Users/jay/Desktop/metis/services/ingest/src/sources/registry.ts")
OUT = Path("public/projects/metis-sources.png")
SCRIPT = "scripts/figures/metis-sources.py"

BG = "#0a0a0a"
FG = "#ffffff"
PINK = "#ff69b4"
MONO = ["JetBrains Mono", "DejaVu Sans Mono", "Menlo", "monospace"]
TIERS = ("T1", "T2", "T3", "T4", "T5", "T6", "T7")
TIER_NAMES = {"T1": "primary", "T2": "wire", "T3": "specialist",
              "T4": "national", "T5": "regional", "T6": "state/social",
              "T7": "anon-social"}


def entries(text: str) -> list[dict[str, str]]:
    """Split CURATED_REGISTRY into entry dicts of the scalar fields we use."""
    lines = text.split("\n")
    start = next(i for i, l in enumerate(lines)
                 if l.startswith("export const CURATED_REGISTRY"))
    end = next(i for i, l in enumerate(lines) if i > start and l.startswith("];"))
    out: list[dict[str, str]] = []
    block: list[str] | None = None
    for line in lines[start:end]:
        if line == "  {":
            block = []
        elif line == "  }," and block is not None:
            out.append(fields("\n".join(block)))
            block = None
        elif block is not None:
            block.append(line)
    return out


def fields(block: str) -> dict[str, str]:
    row: dict[str, str] = {}
    for key in ("id", "kind", "tier", "enabled", "state_controlled"):
        match = re.search(rf'^\s*{key}: ("?[\w\-.]+"?)', block, re.M)
        row[key] = match.group(1).strip('"') if match else ""
    if not row["id"] or not row["tier"]:
        raise ValueError(f"unparsed registry entry: {block[:80]}")
    return row


def style(ax: plt.Axes) -> None:
    ax.set_facecolor(BG)
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    for side in ("left", "bottom"):
        ax.spines[side].set_color(FG)
    ax.tick_params(colors=FG, labelsize=11)
    ax.grid(axis="y", color=FG, alpha=0.1)


def draw_tiers(ax: plt.Axes, rows: list[dict[str, str]]) -> dict[str, tuple]:
    style(ax)
    stats: dict[str, tuple] = {}
    for x, tier in enumerate(TIERS):
        group = [r for r in rows if r["tier"] == tier]
        state = sum(r["state_controlled"] == "true" for r in group)
        enabled = sum(r["enabled"] == "true" for r in group) - state
        disabled = len(group) - enabled - state
        stats[tier] = (len(group), enabled, disabled, state)
        if enabled:
            ax.bar(x, enabled, width=0.62, color=FG, edgecolor=FG)
        if disabled:
            ax.bar(x, disabled, bottom=enabled, width=0.62, color=BG,
                   edgecolor=FG, linewidth=1.4)
        if state:
            ax.bar(x, state, bottom=enabled + disabled, width=0.62,
                   color=PINK, edgecolor=PINK)
        ax.text(x, len(group) + 0.6, str(len(group)), ha="center",
                color=FG, fontsize=12)
    ax.set_xticks(range(len(TIERS)))
    ax.set_xticklabels([f"{t}\n{TIER_NAMES[t]}" for t in TIERS], fontsize=10)
    ax.set_ylim(0, max(s[0] for s in stats.values()) * 1.18)
    ax.set_ylabel("registry entries", color=FG, fontsize=11)
    ax.set_xlabel("filled = enabled, hollow = disabled, pink = state_controlled "
                  "(never standalone)", color=FG, fontsize=10)
    return stats


def draw_kinds(ax: plt.Axes, rows: list[dict[str, str]]) -> Counter:
    style(ax)
    kinds = Counter(r["kind"] for r in rows)
    order = [k for k, _ in kinds.most_common()]
    for x, kind in enumerate(order):
        ax.bar(x, kinds[kind], width=0.62, color=BG, edgecolor=FG, linewidth=1.4)
        ax.text(x, kinds[kind] + 0.6, str(kinds[kind]), ha="center",
                color=FG, fontsize=12)
    ax.set_xticks(range(len(order)))
    ax.set_xticklabels(order, rotation=30, ha="right", fontsize=10)
    ax.set_ylim(0, max(kinds.values()) * 1.18)
    ax.set_xlabel("connector kind (primary-doc = tier-only, never fetched)",
                  color=FG, fontsize=10)
    return kinds


def draw(rows: list[dict[str, str]]) -> None:
    plt.rcParams["font.family"] = MONO
    fig, (left, right) = plt.subplots(
        1, 2, figsize=(16, 8), dpi=100, facecolor=BG,
        gridspec_kw={"width_ratios": [1.5, 1]})
    stats = draw_tiers(left, rows)
    kinds = draw_kinds(right, rows)
    enabled = sum(r["enabled"] == "true" for r in rows)
    state = sum(r["state_controlled"] == "true" for r in rows)
    footer = (f"CURATED_REGISTRY: {len(rows)} entries, {enabled} enabled, "
              f"{state} state_controlled\nsource: {SOURCE}\nscript: {SCRIPT}")
    fig.text(0.01, 0.01, footer, color=FG, alpha=0.7, fontsize=9, va="bottom")
    fig.subplots_adjust(left=0.06, right=0.98, top=0.96, bottom=0.24, wspace=0.25)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(OUT, facecolor=BG)
    print("tiers (total, enabled, disabled, state):", stats)
    print("kinds:", dict(kinds))
    print("state_controlled:", [r["id"] for r in rows if r["state_controlled"] == "true"])


if __name__ == "__main__":
    draw(entries(SOURCE.read_text()))
    print(f"wrote {OUT}")
