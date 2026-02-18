import random
import time
import sys
import os

# Add the parent directory to sys.path to allow importing 'ai' module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ai.forecasting import predict_traffic

# Global simulation state
SIMULATION_SPEED = 1 # 1 hour per tick (for demo purposes)
current_sim_hour = 6.0 # Start at 6 AM
current_weather = "Clear"

def generate_city_data():
    """
    Generates simulated city data for UrbanPulse using AI forecasting.
    """
    global current_sim_hour
    
    # Advance time
    current_sim_hour += 0.25 # Advance 15 mins per tick
    if current_sim_hour >= 24:
        current_sim_hour = 0

    # --- Weather Simulation ---
    # Change weather occasionally (Moved to start to impact current tick)
    global current_weather
    if random.random() < 0.05: # 5% chance to change weather each tick
        current_weather = random.choice(["Clear", "Rain", "Cloudy", "Storm"])

    # Weather Impacts
    weather_traffic_mult = 0
    weather_response_add = 0
    weather_incident_mult = 1.0

    if current_weather == "Rain":
        weather_traffic_mult = 10  # +10% density (slower speeds)
        weather_response_add = 2   # +2 mins delay
        weather_incident_mult = 1.5 # 50% higher chance
    elif current_weather == "Storm":
        weather_traffic_mult = 20  # +20% density
        weather_response_add = 5   # +5 mins delay
        weather_incident_mult = 3.0 # 3x higher chance!
        
    # Simulate data for a few key locations/districts
    districts = ["Downtown", "Uptown", "Industrial District", "Suburbs"]
    
    district_data_list = []
    total_health_score = 0

    for district in districts:
        # Get AI prediction for current time (base traffic)
        base_traffic = predict_traffic(current_sim_hour)
        
        # Add some random variance for "real-time" fluctuation per district
        offset = 0
        if district == "Industrial District":
            offset = -1 # Peaks earlier
        elif district == "Uptown":
            offset = 1 # Peaks later
            
        # Get forecast for next hour
        forecasted_traffic = predict_traffic(current_sim_hour + 1 + offset)
        
        # Check for active interventions
        intervention = _get_intervention_effect(district)
        traffic_modifier = 0
        
        if intervention == "OPTIMIZE_TRAFFIC":
            traffic_modifier = -20 # Reduce traffic by 20%
        elif intervention == "EMERGENCY_ROUTE":
            traffic_modifier = -50 # Drastically reduce traffic (cleared roads)
            
        # Current traffic is forecast + random variance + intervention + WEATHER
        current_traffic = predict_traffic(current_sim_hour + offset) + random.uniform(-5, 5) + traffic_modifier + weather_traffic_mult
        current_traffic = max(0, min(100, current_traffic))
        
        # --- Correlated Metrics ---
        # AQI depends on Traffic + Random Variance
        # Base AQI = 30. Traffic adds up to 100.
        aqi = 30 + (current_traffic * 1.2) + random.uniform(-10, 20)
        aqi = max(20, aqi)
        
        # Noise (dB) depends on Traffic
        # Base 40dB. Traffic adds up to 50dB.
        noise = 40 + (current_traffic * 0.5) + random.uniform(-5, 5)
        
        # response_time (mins) depends on Traffic + WEATHER
        # Base 5 mins. Traffic adds delayed mins.
        response_time = 5 + (current_traffic * 0.15) + random.uniform(0, 5) + weather_response_add
        
        if intervention == "EMERGENCY_ROUTE":
            response_time = response_time * 0.5 # Half the response time
        
        # Active incidents (higher traffic -> higher chance)
        if intervention == "RESOLVE_INCIDENT":
            active_incidents = 0
        else:
            incident_chance = (current_traffic / 200.0) * weather_incident_mult # Adjusted by weather
            active_incidents = 1 if random.random() < incident_chance else 0
            if current_traffic > 80: active_incidents += random.randint(0, 2)

        # Energy Demand
        energy_demand = current_traffic * 2 + random.uniform(20, 50)

        data_point = {
            "name": district,
            "traffic_density": current_traffic, # 0-100 score
            "forecasted_traffic": forecasted_traffic,
            "air_quality_index": aqi, 
            "noise_level": noise, 
            "active_incidents": active_incidents,
            "energy_demand": energy_demand, 
            "emergency_response_time": response_time
        }
        district_data_list.append(data_point)
        
        # District Health Score (Higher is better)
        # Components: Traffic (40%), AQI (30%), Response (30%)
        # Normalize metrics to 0-1 (0 is good, 1 is bad)
        norm_traffic = current_traffic / 100.0
        norm_aqi = min(1.0, aqi / 200.0)
        norm_response = min(1.0, response_time / 30.0)
        
        district_health_penalty = (norm_traffic * 0.4) + (norm_aqi * 0.3) + (norm_response * 0.3)
        total_health_score += (1.0 - district_health_penalty) * 100

    avg_health_score = total_health_score / len(districts)

    data = {
        "timestamp": time.time(),
        "simulated_hour": current_sim_hour,
        "city_health_score": round(avg_health_score, 1),
        "weather": current_weather,
        "districts": district_data_list
    }
    
    return data

# Dictionary to store active interventions
# Key: district_name, Value: { "type": action_type, "expires_at": simulated_hour }
active_interventions = {}

def apply_intervention(district_name, action_type):
    """
    Applies a user intervention to the simulation.
    """
    global active_interventions, current_sim_hour
    
    print(f"Applying intervention: {action_type} in {district_name}")
    
    # Store intervention with an expiry (e.g., lasts for 2 simulation hours)
    active_interventions[district_name] = {
        "type": action_type,
        "expires_at": (current_sim_hour + 6.0) % 24
    }
    
    return {"status": "success", "message": f"{action_type} applied to {district_name}"}

def _get_intervention_effect(district_name):
    """Helper to get current effect of interventions."""
    if district_name not in active_interventions:
        return None
        
    intervention = active_interventions[district_name]
    
    # Check expiry (simple check, handle wrap-around loosely for demo)
    if current_sim_hour > intervention["expires_at"] and abs(current_sim_hour - intervention["expires_at"]) < 20:
        del active_interventions[district_name]
        return None
        
    return intervention["type"]
