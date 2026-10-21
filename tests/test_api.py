import unittest
from fastapi.testclient import TestClient
from backend.main import app


class TestCogniStreamAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_root_endpoint(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("project"), "CogniStream")

    def test_health_endpoint(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("status"), "healthy")
        self.assertEqual(data.get("service"), "cognistream-api")

    def test_cors_headers(self):
        response = self.client.get(
            "/health",
            headers={"Origin": "http://localhost:5173"},
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.headers.get("access-control-allow-origin"),
            "http://localhost:5173",
        )
        self.assertEqual(
            response.headers.get("access-control-allow-credentials"),
            "true",
        )

    def test_developers_endpoint(self):
        response = self.client.get("/developers")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("count"), 10)
        self.assertEqual(len(data.get("data", [])), 10)

        # Verify filter by team
        team_a_res = self.client.get("/developers?team=Team%20A")
        self.assertEqual(team_a_res.status_code, 200)
        team_a_data = team_a_res.json()
        self.assertEqual(team_a_data.get("count"), 5)
        for dev in team_a_data.get("data", []):
            self.assertEqual(dev.get("team"), "Team A")

    def test_sources_endpoint(self):
        response = self.client.get("/sources")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("count"), 4)
        sources = {row["source"] for row in data.get("data", [])}
        self.assertEqual(sources, {"GitHub", "Slack", "Jira", "IDE"})
        total_events = sum(row["total_events"] for row in data.get("data", []))
        self.assertEqual(total_events, 1000)

    def test_teams_endpoint(self):
        response = self.client.get("/teams")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("count"), 2)
        teams = {row["team"] for row in data.get("data", [])}
        self.assertEqual(teams, {"Team A", "Team B"})
        total_events = sum(row["total_events"] for row in data.get("data", []))
        self.assertEqual(total_events, 1000)

    def test_team_flow_endpoint(self):
        response = self.client.get("/team-flow")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("count"), 2)
        for row in data.get("data", []):
            self.assertIn("source_change_rate_percent", row)
            self.assertGreater(row["source_change_rate_percent"], 0)

    def test_sessions_endpoint(self):
        response = self.client.get("/sessions?limit=500")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("count"), 225)

        # Test candidates_only filter
        candidate_res = self.client.get("/sessions?candidates_only=true&limit=500")
        self.assertEqual(candidate_res.status_code, 200)
        cand_data = candidate_res.json()
        self.assertGreater(cand_data.get("count"), 0)
        for session in cand_data.get("data", []):
            self.assertTrue(session.get("candidate_focus_session"))

    def test_context_switches_endpoint(self):
        response = self.client.get("/context-switches")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("count"), 10)
        for dev in data.get("data", []):
            self.assertIn("rapid_source_change_count", dev)
            self.assertIn("long_inactivity_gap_count", dev)


if __name__ == "__main__":
    unittest.main()
