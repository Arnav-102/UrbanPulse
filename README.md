# 🏙️ UrbanPulse - AI Smart City Dashboard

**UrbanPulse** is a real-time smart city simulation that uses AI to forecast traffic, monitor air quality, and manage emergency incidents.

![Status](https://img.shields.io/badge/Status-Active-success)
![Stack](https://img.shields.io/badge/Stack-FastAPI%20%7C%20React-blue)

## ✨ Key Features

*   **Real-Time Simulation**: Watch traffic flow, AQI changes, and energy demand evolve minute-by-minute.
*   **🧠 AI Forecasting**: Predictive models (Random Forest) forecast traffic trends 1 hour into the future.
*   **🌦️ Dynamic Weather**: Rain and Storms visually appear and *physically* impact traffic speeds and accident rates.
*   **🚑 Emergency Response**: Trigger an "Emergency Route" to instantly clear traffic for first responders.
*   **🌗 Day/Night Cycle**: The UI automatically shifts between a bright Day mode and a glowing Night mode based on simulation time.
*   **Interactive Map**: Hover for details, click for controls, and watch live traffic particles.

## 🚀 How to Run

### Prerequisites
*   **Git**: To clone the repository.
*   **Docker Desktop**: For the easiest (production-like) experience.
*   *(Optional) Node.js & Python 3.9+*: If running manually without Docker.

### 1. Clone the Repository
Open your terminal or command prompt and run:
```bash
git clone https://github.com/Arnav-102/UrbanPulse.git
cd UrbanPulse
```

### 2. Run with Docker (Recommended)
This is the simplest way to see the app running as intended in a production environment.
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```
*   **Frontend**: Open [http://localhost](http://localhost)
*   **Backend**: Running at [http://localhost:8001](http://localhost:8001)

### 3. Run Manually (Windows 🪟)
If you don't have Docker, you can use our automated script:
1.  Double-click **`start_app.bat`** in the project folder.
2.  Wait for it to install dependencies and launch the browser.

### 4. Run Manually (Mac/Linux 🍎/🐧)
```bash
# Terminal 1: Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

## 🛠️ Technology Stack

*   **Backend**: Python, FastAPI, WebSockets (`/ws`), Scikit-Learn (AI Model).
*   **Frontend**: React, Vite, Recharts, CSS3 (Glassmorphism, Animations).
*   **Infrastructure**: Docker, Batch Automation.

## 🧪 Simulation Logic
*   **Rain**: +10% Traffic Density, +2 min Response Time.
*   **Storm**: +20% Traffic Density, +5 min Response Time, 3x Accident Risk.
*   **Emergency Mode**: Cuts traffic by 50% and halves response time.

