import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
db = client.health_monitoring

health_records = db.health_records
anomaly_logs = db.anomaly_logs

async def save_health_record(record):
    await health_records.insert_one(record)

async def get_health_history(limit=50):
    return await health_records.find().sort("_id", -1).limit(limit).to_list(limit)

async def save_anomaly(anomaly):
    await anomaly_logs.insert_one(anomaly)

async def get_anomalies(limit=20):
    return await anomaly_logs.find().sort("_id", -1).limit(limit).to_list(limit)
