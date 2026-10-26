import os

import clickhouse_connect


def get_client():
    """Create a ClickHouse client using environment-based credentials."""
    required = (
        "CLICKHOUSE_HOST",
        "CLICKHOUSE_USER",
        "CLICKHOUSE_PASSWORD",
    )
    missing = [name for name in required if not os.getenv(name)]
    if missing:
        raise RuntimeError(
            "Missing ClickHouse environment variables: "
            + ", ".join(missing)
        )

    return clickhouse_connect.get_client(
        host=os.environ["CLICKHOUSE_HOST"],
        port=int(os.getenv("CLICKHOUSE_HTTP_PORT", "8123")),
        username=os.environ["CLICKHOUSE_USER"],
        password=os.environ["CLICKHOUSE_PASSWORD"],
        database=os.getenv("CLICKHOUSE_DATABASE", "cognistream"),
        secure=os.getenv("CLICKHOUSE_SECURE", "false").lower() == "true",
    )


def get_event_count():
    """Return the number of developer events stored in ClickHouse."""
    client = get_client()
    try:
        result = client.query(
            "SELECT count() FROM cognistream.developer_events"
        )
        return result.result_rows[0][0]
    finally:
        client.close()

def insert_new_events(rows):
    """Insert events whose event IDs are not already stored."""
    if not rows:
        return 0

    client = get_client()
    try:
        existing_result = client.query(
            """
            SELECT event_id
            FROM cognistream.developer_events
            WHERE event_id IN {event_ids:Array(String)}
            """,
            parameters={
                "event_ids": [str(row[0]) for row in rows],
            },
        )
        existing_ids = {row[0] for row in existing_result.result_rows}

        new_rows = [
            row for row in rows
            if str(row[0]) not in existing_ids
        ]

        if new_rows:
            client.insert(
                "developer_events",
                new_rows,
                column_names=[
                    "event_id",
                    "developer_id",
                    "timestamp",
                    "source",
                    "event_type",
                    "duration_minutes",
                    "team",
                    "role",
                ],
            )

        return len(new_rows)
    finally:
        client.close()
