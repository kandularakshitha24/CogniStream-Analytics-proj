
from pathlib import Path

import polars as pl


# Project paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
INPUT_FILE = PROJECT_ROOT / "data" / "processed" / "developer_events_clean.csv"
OUTPUT_DIR = PROJECT_ROOT / "data" / "processed"


def main():
    print("COGNISTREAM FLOW ANALYTICS")
    print("=" * 40)

    # Step 1: Load the cleaned dataset
    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            f"Cleaned dataset not found: {INPUT_FILE}\n"
            "Run src/ingest_events.py first."
        )

    df = pl.read_csv(INPUT_FILE)

    # Step 2: Prepare and order events
    df = df.with_columns(
        pl.col("timestamp").str.to_datetime()
    ).sort(["developer_id", "timestamp"])

    print(f"\nLoaded events: {df.height}")
    print(f"Unique developers: {df['developer_id'].n_unique()}")
    print(f"Activity sources: {df['source'].n_unique()}")

    # Step 3: Developer-level activity summary
    developer_summary = (
        df.group_by(["developer_id", "team", "role"])
        .agg(
            pl.len().alias("total_events"),
            pl.col("duration_minutes").sum().alias(
                "total_recorded_duration_minutes"
            ),
            pl.col("duration_minutes").mean().round(2).alias(
                "average_event_duration_minutes"
            ),
            pl.col("source").n_unique().alias("unique_sources"),
        )
        .sort("developer_id")
    )

    # Step 4: Activity breakdown by source
    source_summary = (
        df.group_by("source")
        .agg(
            pl.len().alias("total_events"),
            pl.col("duration_minutes").sum().alias(
                "total_recorded_duration_minutes"
            ),
            pl.col("duration_minutes").mean().round(2).alias(
                "average_event_duration_minutes"
            ),
        )
        .sort("total_events", descending=True)
    )

    # Step 5: Identify consecutive source changes per developer
    sequenced = df.with_columns(
        pl.col("source")
        .shift(1)
        .over("developer_id")
        .alias("previous_source"),

        pl.col("timestamp")
        .shift(1)
        .over("developer_id")
        .alias("previous_timestamp"),
    )

    transitions = (
        sequenced
        .filter(pl.col("previous_timestamp").is_not_null())
        .with_columns(
            (
                (pl.col("timestamp") - pl.col("previous_timestamp"))
                .dt.total_minutes()
            ).alias("gap_minutes")
        )
        .with_columns(
            (
                pl.col("source") != pl.col("previous_source")
            ).alias("source_changed")
        )
        .with_columns(
            (
                pl.col("source_changed")
                & (pl.col("gap_minutes") >= 0)
                & (pl.col("gap_minutes") <= 15)
            ).alias("rapid_source_change"),

            (pl.col("gap_minutes") > 60).alias("long_inactivity_gap"),
        )
    )

    switch_summary = (
        transitions.group_by(["developer_id", "team", "role"])
        .agg(
            pl.len().alias("consecutive_event_pairs"),
            pl.col("source_changed")
            .cast(pl.Int64)
            .sum()
            .alias("source_change_count"),
            pl.col("rapid_source_change")
            .cast(pl.Int64)
            .sum()
            .alias("rapid_source_change_count"),
            pl.col("long_inactivity_gap")
            .cast(pl.Int64)
            .sum()
            .alias("long_inactivity_gap_count"),
            pl.col("gap_minutes").mean().round(2).alias(
                "average_gap_minutes"
            ),
        )
        .sort("developer_id")
    )


    # Step 6: Save the reports
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    developer_summary.write_csv(
        OUTPUT_DIR / "developer_activity_summary.csv"
    )
    source_summary.write_csv(
        OUTPUT_DIR / "source_activity_summary.csv"
    )
    switch_summary.write_csv(
        OUTPUT_DIR / "context_switch_summary.csv"
    )

    # Step 7: Display a quick report
    print("\nDEVELOPER ACTIVITY SUMMARY")
    print(developer_summary)

    print("\nACTIVITY BY SOURCE")
    print(source_summary)

    print("\nPOTENTIAL CONTEXT-SWITCH INDICATORS")
    print(switch_summary)

    print("\nOUTPUT FILES")
    print("1. data/processed/developer_activity_summary.csv")
    print("2. data/processed/source_activity_summary.csv")
    print("3. data/processed/context_switch_summary.csv")

    print("\nRESULT: FLOW ANALYTICS COMPLETED")


if __name__ == "__main__":
    main()
