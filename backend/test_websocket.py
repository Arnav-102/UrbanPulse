import asyncio
import websockets
import json
import sys

async def test_websocket():
    uri = "ws://127.0.0.1:8001/ws"
    try:
        async with websockets.connect(uri) as websocket:
            print(f"Connected to {uri}")
            
            # Receive one message
            message = await websocket.recv()
            data = json.loads(message)
            
            print(f"Received data: {json.dumps(data, indent=2)}")
            
            # Verify structure
            if "districts" not in data:
                print("Error: 'districts' not in data")
                sys.exit(1)
            
            # Verify forecasting field
            for district in data["districts"]:
                if "forecasted_traffic" not in district:
                    print(f"Error: 'forecasted_traffic' missing in district {district.get('name')}")
                    sys.exit(1)
                if "energy_demand" not in district:
                    print(f"Error: 'energy_demand' missing in district {district.get('name')}")
                    sys.exit(1)
                if "emergency_response_time" not in district:
                    print(f"Error: 'emergency_response_time' missing in district {district.get('name')}")
                    sys.exit(1)
            
            print("WebSocket test passed: 'forecasted_traffic', 'energy_demand', and 'emergency_response_time' fields present.")

    except Exception as e:
        print(f"WebSocket connection failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(test_websocket())
