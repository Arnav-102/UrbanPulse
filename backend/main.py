import asyncio
import json
import random
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from .simulation import generate_city_data

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "UrbanPulse Backend is running"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Generate simulated data
            data = generate_city_data()
            # Send data to client
            await websocket.send_text(json.dumps(data))
            # Broadcast every 2 seconds
            await asyncio.sleep(2)
    except Exception as e:
        print(f"Connection closed: {e}")

from pydantic import BaseModel

class ControlRequest(BaseModel):
    district: str
    action: str

from .simulation import apply_intervention

@app.post("/api/control")
async def control_simulation(request: ControlRequest):
    result = apply_intervention(request.district, request.action)
    return result
