"""
Karen AI - Backend WebSocket Server
Servidor de automatización y procesamiento que conecta con el frontend de Karen AI.

Usage:
    python karen_backend.py

Requirements:
    pip install websockets pyautogui keyboard requests beautifulsoup4 python-docx
"""

import asyncio
import json
import os

import requests
import websockets
from bs4 import BeautifulSoup

try:
    import pyautogui
    _PYAUTOGUI_AVAILABLE = True
except ImportError:
    _PYAUTOGUI_AVAILABLE = False


def call_gemini(prompt: str, api_key: str) -> dict:
    """Call the Gemini API and return a parsed action."""
    # Simplified router — extend with actual Gemini REST call as needed
    return {"action": "analizar_codigo", "params": {"archivo": "main.py"}}


def call_ollama(prompt: str, model: str) -> dict:
    """Call a locally running Ollama model and return a parsed action."""
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": model, "prompt": prompt},
        timeout=30,
    )
    response.raise_for_status()
    return {"action": "refactorizar_funcion", "params": {"archivo": "main.py"}}


async def handler(websocket) -> None:
    """Handle incoming WebSocket messages from the Karen AI frontend."""
    async for message in websocket:
        try:
            data = json.loads(message)
            action = data.get("command")
            params = data.get("params", {})

            if action == "ejecutar_ai":
                prompt = params.get("prompt", "")
                model = params.get("model", "gemini")
                api_key = params.get("api_key", os.getenv("GEMINI_API_KEY", ""))

                if model == "gemini":
                    result = call_gemini(prompt, api_key)
                else:
                    result = call_ollama(prompt, model)

                await websocket.send(
                    json.dumps(
                        {"response": f"Ejecutando: {result['action']}", "action": result}
                    )
                )

            elif action == "resumir_web":
                url = params.get("url")
                if not url:
                    await websocket.send(
                        json.dumps({"response": "Error: URL no proporcionada."})
                    )
                    continue

                try:
                    response = requests.get(url, timeout=10)
                    response.raise_for_status()

                    soup = BeautifulSoup(response.text, "html.parser")
                    for script in soup(["script", "style"]):
                        script.extract()

                    texto = soup.get_text(separator=" ", strip=True)

                    if len(texto) < 100:
                        raise ValueError("Contenido insuficiente para resumir.")

                    resumen = f"Resumen de {url}: {texto[:500]}..."
                    await websocket.send(
                        json.dumps({"response": "resumen_listo", "resumen": resumen})
                    )

                except Exception as e:
                    await websocket.send(json.dumps({"response": f"Error: {str(e)}"}))

            elif action == "copiar_a_word":
                resumen = params.get("resumen", "")
                if not _PYAUTOGUI_AVAILABLE:
                    await websocket.send(
                        json.dumps({"response": "Error: pyautogui no está instalado."})
                    )
                    continue
                pyautogui.write(resumen)
                await websocket.send(json.dumps({"response": "Resumen copiado a Word."}))

        except Exception as e:
            print(f"Error en handler: {e}")


async def main() -> None:
    """Start the Karen AI WebSocket server on localhost:8765."""
    print("Karen AI Backend iniciado en ws://localhost:8765")
    async with websockets.serve(handler, "localhost", 8765):
        await asyncio.Future()


def run() -> None:
    """Synchronous entry point for console_scripts."""
    asyncio.run(main())


if __name__ == "__main__":
    run()
