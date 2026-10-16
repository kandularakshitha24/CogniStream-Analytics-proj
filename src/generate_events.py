
import random
import csv
from datetime import datetime, timedelta
from pathlib import Path

random.seed(42)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_FILE = PROJECT_ROOT / "data" / "raw" / "developer_events.csv"

DEVELOPERS = [f"DEV{i:03d}" for i in range(1, 11)]

EVENT_TYPES = {
    "GitHub": ["commit", "pull_request_opened", "pull_request_merged"],
    "Slack": ["message", "notification", "mention"],
    "Jira": ["task_updated", "task_completed", "comment_added"],
    "IDE": ["coding_session", "context_switch", "debugging_session"],
}

start_time = datetime(2026, 10, 1, 9, 0, 0)
events = []

for developer in DEVELOPERS:
    current_time = start_time + timedelta(
        minutes=random.randint(0, 60)
    )

    for _ in range(100):
        source = random.choice(list(EVENT_TYPES.keys()))
        event_type = random.choice(EVENT_TYPES[source])

        # Generate activity during working hours.
        current_time += timedelta(minutes=random.randint(2, 25))

        if current_time.hour >= 18:
            current_time += timedelta(hours=15)

        events.append({
            "event_id": f"EVT{len(events) + 1:05d}",
            "developer_id": developer,
            "timestamp": current_time.isoformat(),
            "source": source,
            "event_type": event_type,
            "duration_minutes": random.randint(1, 60),
        })

OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

with OUTPUT_FILE.open("w", newline="", encoding="utf-8") as file:
    writer = csv.DictWriter(
        file,
        fieldnames=[
            "event_id",
            "developer_id",
            "timestamp",
            "source",
            "event_type",
            "duration_minutes",
        ],
    )
    writer.writeheader()
    writer.writerows(events)

print(f"Dataset created: {OUTPUT_FILE}")
print(f"Total events: {len(events)}")
print(f"Unique developers: {len(DEVELOPERS)}")
print(f"Event sources: {len(EVENT_TYPES)}")
