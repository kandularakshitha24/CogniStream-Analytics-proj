
from pathlib import Path

import polars as pl


PROJECT_ROOT = Path(__file__).resolve().parent.parent
INPUT_FILE = (
    PROJECT_ROOT / "data" / "processed" / "developer_events_clean.csv"
)
OUTPUT_DIR = PROJECT_ROOT / "data" / "processed"


def main():
    print("COGNISTREAM TEAM ANALYTICS")
    print("=" * 40)

    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            f"Dataset not found: {INPUT_FILE}\n"
            "Run src/ingest_events.py first."
        )

    df = pl.read_csv(INPUT_FILE).with_columns(
        pl.col("timestamp").str.to_datetime()
    ).sort(["developer_id", "timestamp"])

    # Compare activity across teams.
    team_activity = (
        df.group_by("team")
        .agg(
            pl.len().alias("total_events"),
            pl.col("developer_id").n_unique().alias("developer_count"),
            pl.col("source").n_unique().alias("unique_sources"),
            pl.col("duration_minutes").sum().alias(
                "total_recorded_duration_minutes"
            ),
            pl.col("duration_minutes").mean().round(2).alias(
                "average_event_duration_minutes"
            ),
        )
        .with_columns(
            (
                pl.col("total_events") / pl.col("developer_count")
            ).round(2).alias("events_per_developer")
        )
        .sort("team")
    )

    # Compare consecutive event sources within each developer.
    transitions = df.with_columns(
        pl.col("source")
        .shift(1)
        .over("developer_id")
        .alias("previous_source")
    ).filter(
        pl.col("previous_source").is_not_null()
    ).with_columns(
        (
            pl.col("source") != pl.col("previous_source")
        ).cast(pl.Int64).alias("source_changed")
    )

    team_switches = (
        transitions.group_by("team")
        .agg(
            pl.len().alias("consecutive_event_pairs"),
            pl.col("source_changed").sum().alias(
                "source_change_count"
            ),
        )
        .with_columns(
            (
                pl.col("source_change_count")
                / pl.col("consecutive_event_pairs")
                * 100
            ).round(2).alias("source_change_rate_percent")
        )
        .sort("team")
    )

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    team_activity.write_csv(
        OUTPUT_DIR / "team_activity_summary.csv"
    )
    team_switches.write_csv(
        OUTPUT_DIR / "team_flow_summary.csv"
    )

    print("\nTEAM ACTIVITY SUMMARY")
    print(team_activity)

    print("\nTEAM FLOW INDICATORS")
    print(team_switches)

    print("\nCreated:")
    print("data/processed/team_activity_summary.csv")
    print("data/processed/team_flow_summary.csv")
    print("\nRESULT: TEAM ANALYTICS COMPLETED")


if __name__ == "__main__":
    main()
