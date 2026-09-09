#!/usr/bin/env python3
"""Fetch NyXkim5's GitHub contribution calendar and write it as JSON.

The Work page reads src/features/work/data/contributions.json at build time.
.github/workflows/contributions.yml runs this script once a day. GitHub
starts scheduled runs late, often by hours, so the script never checks the
clock: whenever it runs, it refreshes.

Auth order: CONTRIB_TOKEN, then GH_TOKEN, then GITHUB_TOKEN. With gh on PATH
the query goes through `gh api graphql`, otherwise through urllib.
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

LOGIN = "NyXkim5"
LOS_ANGELES = ZoneInfo("America/Los_Angeles")
REPO_ROOT = Path(__file__).resolve().parents[2]
OUT = REPO_ROOT / "src" / "features" / "work" / "data" / "contributions.json"
QUERY = """
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      totalCommitContributions
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}
"""


def token_from_env() -> str | None:
    for key in ("CONTRIB_TOKEN", "GH_TOKEN", "GITHUB_TOKEN"):
        value = os.environ.get(key)
        if value:
            return value
    return None


def query_with_gh() -> dict:
    env = dict(os.environ)
    if os.environ.get("CONTRIB_TOKEN"):
        env["GH_TOKEN"] = os.environ["CONTRIB_TOKEN"]
    cmd = ["gh", "api", "graphql", "-f", f"query={QUERY}", "-F", f"login={LOGIN}"]
    done = subprocess.run(cmd, check=True, capture_output=True, text=True, env=env)
    return json.loads(done.stdout)


def query_with_urllib(token: str) -> dict:
    body = json.dumps({"query": QUERY, "variables": {"login": LOGIN}}).encode()
    headers = {
        "Authorization": f"bearer {token}",
        "Content-Type": "application/json",
        "User-Agent": "jaykim.studio contributions refresh",
    }
    req = urllib.request.Request("https://api.github.com/graphql", data=body, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def fetch() -> dict:
    if shutil.which("gh"):
        return query_with_gh()
    token = token_from_env()
    if not token:
        raise SystemExit("no gh on PATH and none of CONTRIB_TOKEN, GH_TOKEN, GITHUB_TOKEN is set")
    return query_with_urllib(token)


def shape(payload: dict, fetched_at: datetime) -> dict:
    if payload.get("errors"):
        raise SystemExit(f"GraphQL errors: {json.dumps(payload['errors'])}")
    collection = payload["data"]["user"]["contributionsCollection"]
    calendar = collection["contributionCalendar"]
    weeks = [
        [{"date": d["date"], "count": d["contributionCount"]} for d in w["contributionDays"]]
        for w in calendar["weeks"]
    ]
    # `commits` counts commits in public repositories only. GitHub folds every
    # private-repository contribution into `restricted` without a type.
    return {
        "login": LOGIN,
        "fetchedAt": fetched_at.astimezone(LOS_ANGELES).isoformat(timespec="seconds"),
        "total": calendar["totalContributions"],
        "commits": collection["totalCommitContributions"],
        "restricted": collection["restrictedContributionsCount"],
        "weeks": weeks,
    }


def main() -> int:
    now = datetime.now(timezone.utc)
    data = shape(fetch(), now)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, indent=2) + "\n")
    print(f"wrote {OUT.relative_to(REPO_ROOT)}: total={data['total']} weeks={len(data['weeks'])}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
