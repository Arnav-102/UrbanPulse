import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from datetime import datetime

class TrafficForecaster:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.is_trained = False
        self._train_initial_model()

    def _generate_synthetic_data(self, days=30):
        """Generates synthetic traffic data for training."""
        # Simulate hourly data for 'days' days
        hours = np.tile(np.arange(24), days)
        
        # Base traffic pattern: peaks at 8am and 5pm (17:00)
        # Function: base + morning_peak + evening_peak + random_noise
        traffic = []
        for h in hours:
            # Base level (night is low, day is moderate)
            base = 20 if 6 <= h <= 22 else 5
            
            # Morning peak (centered at 8, spread 2)
            morning = 60 * np.exp(-0.5 * ((h - 8) / 2) ** 2)
            
            # Evening peak (centered at 17, spread 2)
            evening = 70 * np.exp(-0.5 * ((h - 17) / 2) ** 2)
            
            # Combine
            level = base + morning + evening
            
            # Add random noise/weather effects
            noise = np.random.normal(0, 5)
            level += noise
            
            # Clip to 0-100
            traffic.append(np.clip(level, 0, 100))
            
        return pd.DataFrame({'hour': hours, 'traffic': traffic})

    def _train_initial_model(self):
        """Trains the model on synthetic data."""
        print("Training traffic forecast model...")
        data = self._generate_synthetic_data()
        X = data[['hour']]
        y = data['traffic']
        
        self.model.fit(X, y)
        self.is_trained = True
        print("Model training complete.")

    def predict(self, hour):
        """Predicts traffic density for a given hour (0-23)."""
        if not self.is_trained:
            self._train_initial_model()
            
        # Ensure hour is within 0-23
        hour = hour % 24
        
        prediction = self.model.predict([[hour]])[0]
        return prediction

# Singleton instance
forecaster = TrafficForecaster()

def predict_traffic(hour):
    """
    Wrapper for compatibility.
    """
    return forecaster.predict(hour)
