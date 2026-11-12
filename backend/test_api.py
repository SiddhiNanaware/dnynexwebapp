import unittest
from fastapi.testclient import TestClient
from backend.main import app

class TestDnyanexApi(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health(self):
        res = self.client.get("/health")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["team"], "MahaMinds")

    def test_auth_login(self):
        payload = {"username": "siddhi", "password": "dnyanex2026"}
        res = self.client.post("/api/auth/login", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["user"]["name"], "Siddhi Nanaware")

    def test_team_members(self):
        res = self.client.get("/api/team")
        self.assertEqual(res.status_code, 200)
        team = res.json()
        names = [m["name"] for m in team]
        self.assertIn("Siddhi Nanaware", names)
        self.assertIn("Sonakshi Nazarkar", names)
        self.assertIn("Mhd Zahur Rizvi", names)
        self.assertIn("Parineeta Meshram", names)

    def test_projects(self):
        res = self.client.get("/api/projects")
        self.assertEqual(res.status_code, 200)
        projects = res.json()
        self.assertGreaterEqual(len(projects), 1)

    def test_voice_notes(self):
        res = self.client.get("/api/ai/notes")
        self.assertEqual(res.status_code, 200)
        notes = res.json()
        self.assertGreaterEqual(len(notes), 1)

    def test_notifications(self):
        res = self.client.get("/api/notifications")
        self.assertEqual(res.status_code, 200)

    def test_analytics_overview(self):
        res = self.client.get("/api/analytics/overview")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("status_distribution", data)
        self.assertIn("task_categories", data)
        self.assertIn("growth_history", data)

    def test_claims(self):
        res = self.client.get("/api/claims")
        self.assertEqual(res.status_code, 200)
        claims = res.json()
        self.assertGreaterEqual(len(claims), 5)

if __name__ == "__main__":
    unittest.main()
