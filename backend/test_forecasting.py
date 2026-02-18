import sys
import os
import unittest
import numpy as np

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ai.forecasting import TrafficForecaster, predict_traffic
from backend.simulation import generate_city_data

class TestForecasting(unittest.TestCase):
    def setUp(self):
        self.forecaster = TrafficForecaster()

    def test_model_training(self):
        """Test that the model trains and produces valid predictions."""
        self.assertTrue(self.forecaster.is_trained)
        prediction = self.forecaster.predict(8) # 8 AM
        self.assertGreater(prediction, 0)
        self.assertLess(prediction, 100)

    def test_rush_hour_patterns(self):
        """Test that 8 AM and 5 PM (17:00) have higher traffic than 2 AM."""
        night_traffic = self.forecaster.predict(2)
        morning_peak = self.forecaster.predict(8)
        evening_peak = self.forecaster.predict(17)

        print(f"2 AM: {night_traffic:.2f}, 8 AM: {morning_peak:.2f}, 5 PM: {evening_peak:.2f}")

        self.assertGreater(morning_peak, night_traffic)
        self.assertGreater(evening_peak, night_traffic)

    def test_simulation_data_structure(self):
        """Test that simulation returns correct data structure with time."""
        data = generate_city_data()
        self.assertIn("simulated_hour", data)
        self.assertIn("districts", data)
        self.assertEqual(len(data["districts"]), 4)
        
        district = data["districts"][0]
        self.assertIn("traffic_density", district)
        self.assertIn("forecasted_traffic", district)
        self.assertNotEqual(district["traffic_density"], district["forecasted_traffic"])

if __name__ == '__main__':
    unittest.main()
