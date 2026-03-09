#!/usr/bin/env bash
set -e

echo "============================================"
echo " Instalación de Karen AI Backend"
echo "============================================"
echo

echo "[1/2] Instalando dependencias de Python..."
pip install websockets pyautogui keyboard requests beautifulsoup4 python-docx

echo
echo "[2/2] Iniciando servidor Karen AI..."
python src/backend/karen_backend.py
