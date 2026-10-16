
import sys
from pathlib import Path

import pandas as pd
from validate_events import validate_events

ROOT = Path(__file__).resolve().parent.parent

RAW_FILE = ROOT / "data" / "raw" / "developer_events.csv"
DEVELOPERS_FILE = ROOT / "data" / "sample" / "developers.csv"
OUTPUT_FILE = ROOT / "data" / "processed" / "developer_events_clean.csv"


def ingest_events():
    print("COGNISTREAM DATA INGESTION")
    print("=" * 35)

    # Step 1: Validate the raw event dataset.
    print("\nStep 1: Validating raw events...")
    if not validate_events():
        print("Ingestion stopped: validation failed.")
        return False

    # Step 2: Load the raw events and developer profiles.
    print("\nStep 2: Loading datasets...")
    events = pd.read_csv(RAW_FILE)
    developers = pd.read_csv(DEVELOPERS_FILE)

    # Step 3: Validate developer references.
    known_developers = set(developers["developer_id"].astype(str))
    event_developers = set(events["developer_id"].astype(str))

    unknown_developers = event_developers - known_developers

    if unknown_developers:
        print(
            "ERROR: Unknown developer IDs:",
            sorted(unknown_developers),
        )
        return False

    # Step 4: Normalize and sort the event data.
    events["timestamp"] = pd.to_datetime(
        events["timestamp"], errors="coerce"
    )

    if events["timestamp"].isna().any():
        print("ERROR: Invalid timestamps found during ingestion.")
        return False

    events["duration_minutes"] = pd.to_numeric(
        events["duration_minutes"], errors="coerce"
    )

    if (
        events["duration_minutes"].isna().any()
        or (events["duration_minutes"] <= 0).any()
    ):
        print("ERROR: Invalid event durations found.")
        return False

    events["developer_id"] = events["developer_id"].astype(str)
    events["source"] = events["source"].str.strip()
    events["event_type"] = events["event_type"].str.strip()

    events = events.sort_values(
        ["developer_id", "timestamp", "event_id"]
    ).reset_index(drop=True)

    # Step 5: Attach team and role information.
    events = events.merge(
        developers[["developer_id", "team", "role"]],
        on="developer_id",
        how="left",
        validate="many_to_one",
    )

    # Step 6: Save the processed dataset.
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    events.to_csv(OUTPUT_FILE, index=False)

    print("\nINGESTION SUMMARY")
    print("-" * 35)
    print(f"Processed events: {len(events)}")
    print(f"Unique developers: {events['developer_id'].nunique()}")
    print(f"Teams: {events['team'].nunique()}")
    print(f"Missing values: {int(events.isna().sum().sum())}")
    print(f"Output file: {OUTPUT_FILE}")
    print("\nRESULT: INGESTION PASSED")

    return True


if __name__ == "__main__":
    sys.exit(0 if ingest_events() else 1)
