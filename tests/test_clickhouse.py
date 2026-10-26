import os
import unittest

from clickhouse.client import get_event_count


REQUIRED_ENV_VARS = (
    "CLICKHOUSE_HOST",
    "CLICKHOUSE_USER",
    "CLICKHOUSE_PASSWORD",
)


@unittest.skipUnless(
    all(os.getenv(name) for name in REQUIRED_ENV_VARS),
    "ClickHouse connection environment variables are not configured",
)
class TestClickHouse(unittest.TestCase):
    def test_event_count(self):
        self.assertEqual(get_event_count(), 1000)


if __name__ == "__main__":
    unittest.main()
