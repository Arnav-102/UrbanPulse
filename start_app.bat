@echo off
TITLE UrbanPulse Launcher
CLS

ECHO ======================================================
ECHO                URBAN PULSE LAUNCHER
ECHO ======================================================
ECHO.

:: Check for Python
python --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    ECHO [ERROR] Python is not installed or not in PATH.
    PAUSE
    EXIT /B
)

:: Check for Node.js
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    ECHO [ERROR] Node.js is not installed or not in PATH.
    PAUSE
    EXIT /B
)

ECHO [INFO] Environment verified. Starting services...
ECHO.

:: Start Backend
ECHO [1/2] Launching Backend Server...
:: Install dependencies and run from root to support 'backend' package imports
start "UrbanPulse Backend" cmd /k "pip install -r backend\requirements.txt && uvicorn backend.main:app --reload --port 8001"

:: Wait a bit for backend to initialize
timeout /t 5 /nobreak >nul

:: Start Frontend
ECHO [2/2] Launching Frontend Dashboard...
start "UrbanPulse Frontend" cmd /k "cd frontend && npm install && npm run dev"

ECHO.
ECHO [SUCCESS] Application launched!
ECHO Please verify the two new terminal windows.
ECHO.
PAUSE
