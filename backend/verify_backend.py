import requests
import sys
import time

def verify():
    url = "http://127.0.0.1:8001/"
    for i in range(10):
        try:
            response = requests.get(url)
            if response.status_code == 200:
                print("Backend is running!")
                print("Response:", response.json())
                return
        except requests.exceptions.ConnectionError:
            print(f"Waiting for backend... ({i+1}/10)")
            time.sleep(1)
    
    print("Backend failed to start or is not reachable.")
    sys.exit(1)

if __name__ == "__main__":
    verify()
