
import csv
import sys
from datetime import datetime
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
INPUT_FILE = PROJECT_ROOT / "data" / "raw" / "developer_events.csv"

REQUIRED_FIELDS = {
    "event_id", "developer_id", "timestamp",
    "source", "event_type", "duration_minutes"
}

VALID_SOURCES = {"GitHub", "Slack", "Jira", "IDE"}


def validate_events():
    if not INPUT_FILE.exists():
        print(f"ERROR: Dataset not found: {INPUT_FILE}")
        return False

    with INPUT_FILE.open(
        "r", newline="", encoding="utf-8"
    ) as file:
        reader = csv.DictReader(file)

        if not reader.fieldnames:
            print("ERROR: Missing CSV header.")
            return False

        missing_columns = REQUIRED_FIELDS - set(reader.fieldnames)
        if missing_columns:
            print(f"ERROR: Missing columns: {sorted(missing_columns)}")
            return False

        rows = list(reader)

    errors = []
    event_ids = set()
    developer_ids = set()

    for line_number, row in enumerate(rows, start=2):
        if any(not row[field] or not row[field].strip()
               for field in REQUIRED_FIELDS):
            errors.append(f"Line {line_number}: Missing required value")
            continue

        event_id = row["event_id"].strip()
        developer_ids.add(row["developer_id"].strip())

        if event_id in event_ids:
            errors.append(f"Line {line_number}: Duplicate ID {event_id}")
        event_ids.add(event_id)

        try:
            datetime.fromisoformat(row["timestamp"])
        except ValueError:
            errors.append(f"Line {line_number}: Invalid timestamp")

        if row["source"] not in VALID_SOURCES:
            errors.append(f"Line {line_number}: Invalid source")

        try:
            duration = int(row["duration_minutes"])
            if duration <= 0:
                errors.append(f"Line {line_number}: Invalid duration")
        except ValueError:
            errors.append(f"Line {line_number}: Duration must be an integer")

    print("\nCOGNISTREAM DATA QUALITY REPORT")
    print("-" * 35)
    print(f"Total records: {len(rows)}")
    print(f"Unique event IDs: {len(event_ids)}")
    print(f"Unique developers: {len(developer_ids)}")
    print(f"Validation errors: {len(errors)}")

    for error in errors[:20]:
        print("FAIL:", error)

    if len(errors) > 20:
        print(f"... and {len(errors) - 20} more errors")

    if errors:
        print("RESULT: FAILED")
        return False

    print("RESULT: PASSED")
    return True


if __name__ == "__main__":
    sys.exit(0 if validate_events() else 1)
