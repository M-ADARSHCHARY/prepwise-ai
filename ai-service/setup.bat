@echo off
REM Setup FastAPI AI Service on Windows

echo Setting up PrepWise AI Service...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found. Please install Python 3.8+
    echo Download from: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo ✓ Python found
echo.

REM Create virtual environment
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    echo ✓ Virtual environment created
) else (
    echo ✓ Virtual environment already exists
)

echo.
echo Activating virtual environment...
call venv\Scripts\activate.bat

echo ✓ Virtual environment activated
echo.

REM Install dependencies
echo Installing dependencies from requirements.txt...
pip install -r requirements.txt
echo ✓ Dependencies installed
echo.

echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo To start the service, run:
echo   uvicorn app.main:app --reload
echo.
echo Then open: http://localhost:8000/docs
echo.
pause
