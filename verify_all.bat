@echo off
TITLE UrbanPulse - Master Verification
CLS

ECHO ======================================================
ECHO           URBAN PULSE - VERIFICATION MODE
ECHO ======================================================
ECHO.
ECHO [1/2] Running Self-Tests...
ECHO.

call run_tests.bat
IF %ERRORLEVEL% NEQ 0 (
    ECHO.
    ECHO [CRITICAL] Tests Failed! Aborting application launch.
    ECHO Please check the error logs above.
    PAUSE
    EXIT /B
)

ECHO.
ECHO [SUCCESS] All Systems Green.
ECHO.
ECHO [2/2] Launching Application...
timeout /t 2 /nobreak >nul

call start_app.bat
