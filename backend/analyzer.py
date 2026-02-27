from sklearn.ensemble import IsolationForest
import pandas as pd
import numpy as np
from typing import List, Dict

class HealthAnalyzer:
    def __init__(self):
        # contamination is the expected proportion of outliers (anomalies)
        self.model = IsolationForest(contamination=0.1, random_state=42)
        self.is_trained = False
        self.history = []

    def train(self, data: List[Dict]):
        if len(data) < 20: # Need some baseline data to train
            return
        
        df = pd.DataFrame(data)
        features = ["heart_rate", "spo2", "temperature", "activity_level", "sleep_quality"]
        self.model.fit(df[features])
        self.is_trained = True

    def analyze(self, current_data: Dict) -> Dict:
        """
        Analyzes the current data point and returns a risk score and identified risks.
        """
        features = ["heart_rate", "spo2", "temperature", "activity_level", "sleep_quality"]
        values = np.array([[current_data[f] for f in features]])
        
        # If not enough history, return default
        if not self.is_trained:
            return {"risk_score": 0, "anomalies": [], "is_anomaly": False}

        # Isolation forest returns -1 for anomaly, 1 for normal
        prediction = self.model.predict(values)[0]
        # decision_function returns a score where lower values are more anomalous
        raw_score = self.model.decision_function(values)[0]
        
        # Map score to 0-100 (higher means higher risk)
        # raw_score is typically between -0.5 and 0.5. 
        # We want to map it so that -0.5 is 100% risk and 0.5 is 0% risk.
        risk_score = int(max(0, min(100, (0.5 - raw_score) * 100)))

        anomalies = []
        if prediction == -1:
            # Domain specific heuristics to label the anomaly
            if current_data["heart_rate"] > 100 and current_data["activity_level"] < 20:
                anomalies.append("Cardiac Stress Pattern")
            if current_data["temperature"] > 38.0 and current_data["spo2"] < 95:
                anomalies.append("Potential Infection Signal")
            if current_data["sleep_quality"] < 60 and current_data["activity_level"] > 70:
                anomalies.append("High Fatigue Warning")
            
            if not anomalies:
                anomalies.append("Unusual Physiological Correlation")

        return {
            "risk_score": risk_score,
            "anomalies": anomalies,
            "is_anomaly": prediction == -1
        }

analyzer = HealthAnalyzer()
