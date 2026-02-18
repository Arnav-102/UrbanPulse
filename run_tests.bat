@echo off
CLS
ECHO Running UrbanPulse Backend Tests...
ECHO.

:: Install pytest if needed
pip install pytest >nul 2>&1

:: Run tests
pytest backend/tests/test_simulation_logic.py -v

ECHO.
PAUSE
