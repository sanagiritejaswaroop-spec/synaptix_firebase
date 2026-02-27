import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from simulator import generate_health_data
from analyzer import analyzer
from database import save_health_record, get_health_history, save_anomaly, get_anomalies
from datetime import datetime

app = FastAPI(title="Healthcare Monitoring API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Shared state for real-time broadcast
connected_clients = set()

async def data_simulator_loop():
    """Background task to generate data and analyze it."""
    while True:
        data = generate_health_data()
        
        # Analyze current data
        # Fetch recent history to train/update model if needed
        history = await get_health_history(limit=100)
        if len(history) >= 20:
             # Train on historical features
             analyzer.train([{k:v for k,v in h.items() if k not in ["_id", "timestamp", "anomaly_injected"]} for h in history])
        
        analysis = analyzer.analyze(data)
        data.update(analysis)
        
        # Save to DB
        await save_health_record(data)
        if data["is_anomaly"]:
            await save_anomaly({
                "timestamp": data["timestamp"],
                "risks": data["anomalies"],
                "risk_score": data["risk_score"],
                "data_snapshot": data
            })

        # Broadcast to all connected WebSockets
        if connected_clients:
            message = json.dumps(data)
            await asyncio.gather(*[client.send_text(message) for client in connected_clients])
        
        await asyncio.sleep(2) # Update every 2 seconds

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(data_simulator_loop())

@app.get("/history")
async def fetch_history(limit: int = 50):
    history = await get_health_history(limit)
    # Convert _id to string for JSON serialization
    for item in history:
        item["_id"] = str(item["_id"])
    return history

@app.get("/anomalies")
async def fetch_anomalies(limit: int = 20):
    anomalies = await get_anomalies(limit)
    for item in anomalies:
        item["_id"] = str(item["_id"])
    return anomalies

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.add(websocket)
    try:
        while True:
            await websocket.receive_text() # Keep connection alive
    except WebSocketDisconnect:
        connected_clients.remove(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
