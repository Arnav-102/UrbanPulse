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

## 🚀 Quick Start (Windows)

We've made running this project incredibly simple.

### Option 1: The "One-Click" Launch (Recommended)
Simply double-click **`start_app.bat`**.
*   This script auto-installs dependencies (Python/Node).
*   Launches the Backend (Port 8001).
*   Launches the Frontend (Port 5173).
*   Opens your browser automatically.

### Option 2: The "Safe" Launch
Double-click **`verify_all.bat`**.
*   Runs the full **Unit Test Suite** first.
*   Only launches the app if all tests pass.

### Option 3: Docker
If you have Docker Desktop installed:
```bash
docker-compose up --build
```

## 🛠️ Technology Stack

*   **Backend**: Python, FastAPI, WebSockets (`/ws`), Scikit-Learn (AI Model).
*   **Frontend**: React, Vite, Recharts, CSS3 (Glassmorphism, Animations).
*   **Infrastructure**: Docker, Batch Automation.

## 🧪 Simulation Logic
*   **Rain**: +10% Traffic Density, +2 min Response Time.
*   **Storm**: +20% Traffic Density, +5 min Response Time, 3x Accident Risk.
*   **Emergency Mode**: Cuts traffic by 50% and halves response time.

