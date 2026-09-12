"""Sea state sweep with the radar's own contacts tallied, split clutter vs real.

Nothing in the repo is modified. The real replay driver, the real sea state
model and the real metrics run untouched. The only addition is a subclass of
the harness's own SeaClutterSensorSource that counts what it already returns,
substituted into scenarios.harness for the duration of the sweep.
"""
from __future__ import annotations
import csv, sys

from scenarios import harness
from scenarios.harness import SeaClutterSensorSource, replay
from scenarios.library import build_scenario, scenario_names
from scenarios.metrics import compute_metrics
from scenarios.sea_state import MAX_SEA_STATE, SeaState

RADAR_ID = "masthead-radar"
SEED = 20260910
_tally: dict[str, int] = {}


class CountingSource(SeaClutterSensorSource):
    """Counts radar clutter contacts and radar contacts on truth, per run."""

    def sample_once(self):
        dets = super().sample_once()
        for d in dets:
            if d.sensor_id != RADAR_ID:
                continue
            key = "radar_clutter" if "-fa-" in d.id else "radar_true"
            _tally[key] = _tally.get(key, 0) + 1
        return dets


harness.SeaClutterSensorSource = CountingSource

rows = []
for name in scenario_names():
    base = build_scenario(name)
    n_contacts = sum(a.count for a in base.scenario.approaches) + len(base.scenario.transits)
    alt = min(a.altitude_m for a in base.scenario.approaches)
    for n in range(MAX_SEA_STATE + 1):
        ss = SeaState(n)
        _tally.clear()
        result = replay(base.with_sea_state(ss), seed=SEED)
        m = compute_metrics(result)
        ticks = m.ticks
        clutter = _tally.get("radar_clutter", 0)
        true_hits = _tally.get("radar_true", 0)
        rows.append({
            "scenario": name,
            "swarm_alt_m": alt,
            "contacts": n_contacts,
            "sea_state": n,
            "hs_m": ss.significant_wave_height_m,
            "model_false_alarm_rate": round(ss.radar_false_alarm_rate, 4),
            "ticks": ticks,
            "radar_clutter_per_tick": round(clutter / ticks, 4),
            "radar_true_per_tick": round(true_hits / ticks, 4),
            "radar_true_per_contact_per_tick": round(true_hits / ticks / n_contacts, 4),
            "hostile_hold_fraction": round(m.hostile_hold_fraction, 4),
            "mean_detections_per_tick": round(m.mean_detections_per_tick, 4),
            "mean_false_tracks": round(m.mean_false_tracks, 4),
            "max_false_tracks": m.max_false_tracks,
            "continuity": round(m.continuity, 4),
            "identity_switches": m.identity_switches,
            "first_hold_s": m.first_hold_s,
            "p95_error_m": None if m.p95_error_m is None else round(m.p95_error_m, 2),
        })
        print(f"{name:<20} ss{n} clutter/tick={clutter/ticks:6.3f} "
              f"true/tick={true_hits/ticks:6.3f} hold={m.hostile_hold_fraction:.3f}",
              file=sys.stderr)

out = sys.argv[1]
with open(out, "w", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=list(rows[0]))
    w.writeheader()
    w.writerows(rows)
print(f"wrote {len(rows)} rows -> {out}", file=sys.stderr)
