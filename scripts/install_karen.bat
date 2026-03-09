@echo off
echo ============================================
echo  Instalacion de Karen AI Backend
echo ============================================
echo.

echo [1/2] Instalando dependencias de Python...
pip install websockets pyautogui keyboard requests beautifulsoup4 python-docx
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Fallo la instalacion de dependencias.
    exit /b 1
)

echo.
echo [2/2] Iniciando servidor Karen AI...
python src\backend\karen_backend.py
