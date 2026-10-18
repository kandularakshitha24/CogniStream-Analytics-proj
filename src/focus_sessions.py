
from pathlib import Path
import polars as pl


# Locate the project and input/output files
PROJECT_ROOT = Path(__file__).resolve().parent.parent

INPUT_FILE = PROJECT_ROOT / "data" / "processed" / "developer_events_clean.csv"
OUTPUT_FILE = PROJECT_ROOT / "data" / "processed" / "ide_session_summary.csv"

SESSION_GAP_MINUTES = 15
MIN_EVENTS_FOR_CANDIDATE = 3


def main():
    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            f"Input dataset not found: {INPUT_FILE}\n"
            "Run the ingestion pipeline first: python src/ingest_events.py"
        )

    # Load the cleaned event dataset
    df = pl.read_csv(
        INPUT_FILE,
        try_parse_dates=True
    )

    # Keep only IDE events and order them chronologically
    ide = (
        df.filter(pl.col("source") == "IDE")
        .with_columns(
            pl.col("timestamp").cast(pl.Datetime, strict=False)
        )
        .sort(["developer_id", "timestamp"])
    )

    if ide.is_empty():
        print("No IDE events found. No session report was generated.")
        return

    # Find the time gap from each developer's previous IDE event
    ide = ide.with_columns(
        pl.col("timestamp")
        .shift(1)
        .over("developer_id")
        .alias("previous_timestamp")
    )

    ide = ide.with_columns(
        (
            (pl.col("timestamp") - pl.col("previous_timestamp"))
            .dt.total_minutes()
        ).alias("gap_minutes")
    )

    # Start a new session for the first event or after a gap over 15 minutes
    ide = ide.with_columns(
        (
            pl.col("previous_timestamp").is_null()
            | (pl.col("gap_minutes") > SESSION_GAP_MINUTES)
        )
        .cast(pl.Int64)
        .alias("new_session")
    )

    # Number sessions separately for each developer
    ide = ide.with_columns(
        pl.col("new_session")
        .cum_sum()
        .over("developer_id")
        .alias("session_number")
    )

    # Summarize each candidate IDE session
    sessions = (
        ide.group_by(
            ["developer_id", "team", "role", "session_number"]
        )
        .agg(
            pl.len().alias("ide_event_count"),
            pl.col("timestamp").min().alias("session_start"),
            pl.col("timestamp").max().alias("session_end"),
            pl.col("duration_minutes")
            .sum()
            .alias("sum_recorded_event_duration_minutes"),
        )
        .with_columns(
            (
                (pl.col("session_end") - pl.col("session_start"))
                .dt.total_minutes()
            ).alias("elapsed_minutes")
        )
        .with_columns(
            (
                pl.col("ide_event_count") >= MIN_EVENTS_FOR_CANDIDATE
            ).alias("candidate_focus_session")
        )
        .sort(["developer_id", "session_start"])
    )

    # Save the report
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    sessions.write_csv(OUTPUT_FILE)

    candidate_count = sessions.filter(
        pl.col("candidate_focus_session")
    ).height

    print("\nIDE Focus Session Analysis")
    print("=" * 40)
    print(f"IDE events analyzed: {ide.height}")
    print(f"Total IDE sessions: {sessions.height}")
    print(f"Candidate focus sessions: {candidate_count}")
    print(f"Session gap threshold: {SESSION_GAP_MINUTES} minutes")
    print(f"Minimum IDE events per candidate: {MIN_EVENTS_FOR_CANDIDATE}")
    print(f"\nReport saved to: {OUTPUT_FILE}")

    print("\nSample sessions:")
    print(sessions.head(10))


if __name__ == "__main__":
    main()
