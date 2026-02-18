import unittest
from fastapi.testclient import TestClient
from backend.main import app
from backend.simulation import active_interventions, current_sim_hour

client = TestClient(app)

class TestControls(unittest.TestCase):
    def setUp(self):
        # Clear interventions before each test
        active_interventions.clear()

    def test_apply_intervention_api(self):
        """Test the API endpoint for applying interventions."""
        response = client.post("/api/control", json={"district": "Downtown", "action": "OPTIMIZE_TRAFFIC"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "success")
        
        # Verify it was stored in simulation state
        self.assertIn("Downtown", active_interventions)
        self.assertEqual(active_interventions["Downtown"]["type"], "OPTIMIZE_TRAFFIC")

    def test_intervention_expiry(self):
        """Test that interventions have an expiry time."""
        client.post("/api/control", json={"district": "Uptown", "action": "RESOLVE_INCIDENT"})
        
        intervention = active_interventions["Uptown"]
        self.assertIn("expires_at", intervention)
        
        # Expiry should be roughly current time + 2 hours
        expected_expiry = (current_sim_hour + 2.0) % 24
        # Allow small float difference
        self.assertAlmostEqual(intervention["expires_at"], expected_expiry, delta=0.1)

if __name__ == '__main__':
    unittest.main()
