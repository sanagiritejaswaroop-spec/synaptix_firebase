import random
import time
from datetime import datetime

def generate_health_data():
    """Generates a realistic health data point with occasional anomalies."""
    base_hr = 75
    base_spo2 = 98
    base_temp = 36.6
    base_activity = 20
    base_sleep = 85

    # Random noise
    hr = base_hr + random.randint(-5, 15)
    spo2 = base_spo2 - random.uniform(0, 2)
    temp = base_temp + random.uniform(-0.2, 0.5)
    activity = max(0, base_activity + random.randint(-10, 30))
    sleep = base_sleep + random.randint(-5, 5)

    # Inject occasional anomalies (5% chance)
    anomaly_type = None
    if random.random() < 0.05:
        r = random.random()
        if r < 0.33:
            # Cardiac Stress: High HR, Low Activity
            hr += 40
            activity = random.randint(0, 10)
            anomaly_type = "Cardiac Stress"
        elif r < 0.66:
            # Infection: High Temp, Low SpO2
            temp += 2.0
            spo2 -= 5
            anomaly_type = "Infection Risk"
        else:
            # Fatigue: Low Sleep, High Activity
            sleep -= 30
            activity += 40
            anomaly_type = "High Fatigue"

    return {
        "timestamp": datetime.utcnow().isoformat(),
        "heart_rate": round(hr, 1),
        "spo2": round(spo2, 1),
        "temperature": round(temp, 1),
        "activity_level": round(activity, 1),
        "sleep_quality": round(sleep, 1),
        "anomaly_injected": anomaly_type
    }
