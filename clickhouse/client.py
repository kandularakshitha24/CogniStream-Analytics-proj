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
