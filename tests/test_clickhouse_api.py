
import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient
from backend.main import app


class TestClickHouseHealthEndpoint(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    @patch("backend.main.get_event_count", return_value=1000)
    def test_clickhouse_health_success(self, mock_count):
        response = self.client.get("/clickhouse/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "status": "healthy",
                "service": "clickhouse",
                "event_count": 1000,
            },
        )
        mock_count.assert_called_once()

    @patch(
        "backend.main.get_event_count",
        side_effect=RuntimeError("Database unavailable"),
    )
    def test_clickhouse_health_unavailable(self, mock_count):
        response = self.client.get("/clickhouse/health")

        self.assertEqual(response.status_code, 503)
        self.assertEqual(
            response.json()["detail"],
            "ClickHouse is unavailable or could not be queried.",
        )
        mock_count.assert_called_once()


if __name__ == "__main__":
    unittest.main()
