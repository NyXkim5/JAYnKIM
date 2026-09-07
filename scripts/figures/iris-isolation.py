"""Render the IRIS tenant isolation suite as counts read from the test file.

Reads backend/tests/test_tenant_isolation.py from the Iris repo. Left panel:
registered route cases (@case decorators) grouped by the first path segment,
with the cases whose refusal is decided in Python (sql_scoped=False) in pink.
Right panel: test functions per proof layer, split by the file's own section
headers. Every number drawn is parsed from that file. Run from the portfolio
worktree root: python3 scripts/figures/iris-isolation.py
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

SOURCE = Path("/Users/jay/Iris/backend/tests/test_tenant_isolation.py")
OUT = Path("public/projects/iris-isolation.png")
SCRIPT = "scripts/figures/iris-isolation.py"

BG = "#0a0a0a"
FG = "#ffffff"
PINK = "#ff69b4"
MONO = ["JetBrains Mono", "DejaVu Sans Mono", "Menlo", "monospace"]

CASE_RE = re.compile(
    r'@case\(\s*"(?P<method>\w+)",\s*"(?P<path>[^"]+)"(?P<rest>.*?)\)\n',
    re.S)
# The file's own section headers, in file order. Each test function belongs
# to the last header above it.
LAYERS = (
    ("# 1. Coverage", "1. coverage gate"),
    ("# 2. The routes", "2. routes"),
    ("# 3. Retrieval", "3. retrieval"),
    ("# 4. The database", "4. RLS policies"),
    ("# 5. The role the deployment", "5. deployed roles"),
    ("# FORCE, which", "5. FORCE RLS"),
    ("# Proving the proof", "mutation proof"),
)


def route_cases(text: str) -> tuple[Counter, Counter]:
    """Count @case registrations per surface, and the python-decided ones."""
    total: Counter = Counter()
    python_decided: Counter = Counter()
    for match in CASE_RE.finditer(text):
        surface = "/" + match.group("path").split("/")[1]
        total[surface] += 1
        if "sql_scoped=False" in match.group("rest"):
            python_decided[surface] += 1
    return total, python_decided


def layer_counts(text: str) -> list[tuple[str, int]]:
    """Count test functions under each section header, in file order."""
    tests = [m.start() for m in re.finditer(r"^(?:async )?def test_", text, re.M)]
    anchors: list[tuple[int, str]] = []
    for header, label in LAYERS:
        pos = text.find("\n" + header)
        if pos < 0:
            raise ValueError(f"section header not found: {header!r}")
        anchors.append((pos, label))
    counts: Counter = Counter()
    for pos in tests:
        label = next(lb for p, lb in reversed(anchors) if p < pos)
        counts[label] += 1
    out = [(label, counts[label]) for _, label in LAYERS]
    assert sum(n for _, n in out) == len(tests), (counts, out)
    return out


def style(ax: plt.Axes) -> None:
    ax.set_facecolor(BG)
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    for side in ("left", "bottom"):
        ax.spines[side].set_color(FG)
    ax.tick_params(colors=FG, labelsize=11)
    ax.grid(axis="x", color=FG, alpha=0.1)


def draw_routes(ax: plt.Axes, total: Counter, python_decided: Counter) -> None:
    style(ax)
    order = [k for k, _ in total.most_common()]
    ys = list(range(len(order)))[::-1]
    for y, key in zip(ys, order):
        sql = total[key] - python_decided[key]
        ax.barh(y, sql, height=0.6, color=BG, edgecolor=FG, linewidth=1.4)
        if python_decided[key]:
            ax.barh(y, python_decided[key], left=sql, height=0.6, color=PINK,
                    edgecolor=PINK)
        ax.text(total[key] + 0.2, y, str(total[key]), va="center", color=FG,
                fontsize=11)
    ax.set_yticks(ys)
    ax.set_yticklabels(order)
    ax.set_xlim(0, max(total.values()) * 1.2)
    ax.set_xlabel(f"route isolation cases by surface (n={sum(total.values())}); "
                  f"pink = refusal decided in Python, not SQL "
                  f"({sum(python_decided.values())})", color=FG, fontsize=10)


def draw_layers(ax: plt.Axes, layers: list[tuple[str, int]]) -> None:
    style(ax)
    ys = list(range(len(layers)))[::-1]
    for y, (label, n) in zip(ys, layers):
        color = PINK if label == "mutation proof" else FG
        ax.barh(y, n, height=0.6, color=BG, edgecolor=color, linewidth=1.4)
        ax.text(n + 0.15, y, str(n), va="center", color=color, fontsize=11)
    ax.set_yticks(ys)
    ax.set_yticklabels([l for l, _ in layers])
    ax.set_xlim(0, max(n for _, n in layers) * 1.25)
    ax.set_xlabel(f"test functions per proof layer "
                  f"(n={sum(n for _, n in layers)})", color=FG, fontsize=10)


def draw(text: str) -> None:
    plt.rcParams["font.family"] = MONO
    total, python_decided = route_cases(text)
    layers = layer_counts(text)
    fig, (left, right) = plt.subplots(
        1, 2, figsize=(16, 8.5), dpi=100, facecolor=BG,
        gridspec_kw={"width_ratios": [1.2, 1]})
    draw_routes(left, total, python_decided)
    draw_layers(right, layers)
    footer = (f"{len(text.splitlines())} lines. Route cases run against a real "
              f"Postgres, no mocks.\nsource: {SOURCE}\nscript: {SCRIPT}")
    fig.text(0.01, 0.01, footer, color=FG, alpha=0.7, fontsize=9, va="bottom")
    fig.subplots_adjust(left=0.1, right=0.98, top=0.96, bottom=0.2, wspace=0.5)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(OUT, facecolor=BG)
    print(dict(total), dict(python_decided), layers)


if __name__ == "__main__":
    draw(SOURCE.read_text())
    print(f"wrote {OUT}")
