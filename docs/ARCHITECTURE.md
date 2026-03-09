# Arquitectura de Karen AI

Este documento describe la arquitectura del sistema **Karen AI**.

## Visión General

Karen AI es una aplicación de asistente de escritorio que combina:

- **Frontend**: Interfaz web React + TypeScript servida por Vite
- **Backend**: Servidor WebSocket Python para automatización local
- **IA**: Integración con Gemini API y modelos locales vía Ollama

```
┌─────────────────────────────────────────────┐
│                  Usuario                     │
│         (voz / teclado / ratón)              │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│             Frontend (React/TS)              │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │ KarenAI  │  │ Historia │  │  Config   │  │
│  │  Panel   │  │  Panel   │  │  Modal    │  │
│  └──────────┘  └──────────┘  └───────────┘  │
│                                              │
│  ┌─────────────────────────────────────────┐ │
│  │         Web Speech API (STT)            │ │
│  └─────────────────────────────────────────┘ │
└──────────────────┬──────────────────────────┘
                   │ WebSocket (ws://localhost:8765)
┌──────────────────▼──────────────────────────┐
│           Backend Python                     │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │         WebSocket Handler             │    │
│  └─────────┬──────────────┬────────────┘    │
│            │              │                  │
│  ┌─────────▼───┐  ┌───────▼──────────┐      │
│  │ Gemini API  │  │   Ollama (local) │      │
│  └─────────────┘  └──────────────────┘      │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │     Automatización (PyAutoGUI)       │    │
│  └──────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

## Componentes

### Frontend (`src/frontend/`)

| Archivo       | Responsabilidad                                     |
|---------------|-----------------------------------------------------|
| `App.tsx`     | Componente principal; gestiona estado y lógica      |
| `main.tsx`    | Punto de entrada React                              |
| `index.css`   | Estilos globales y Tailwind CSS                     |

**Estado Global** (manejado en `App.tsx` con React Hooks):

| Estado          | Tipo                     | Descripción                            |
|-----------------|--------------------------|----------------------------------------|
| `history`       | `ChatMessage[]`          | Historial de la conversación           |
| `isListening`   | `boolean`                | Micrófono activo/inactivo              |
| `selectedModel` | `AIModel`                | Modelo de IA seleccionado              |
| `pendingSummary`| `string \| null`         | Resumen web pendiente de copiar        |

### Backend (`src/backend/`)

| Archivo              | Responsabilidad                               |
|----------------------|-----------------------------------------------|
| `karen_backend.py`   | Servidor WebSocket + lógica de automatización |

**Comandos WebSocket:**

| Comando          | Parámetros               | Respuesta                          |
|------------------|--------------------------|------------------------------------|
| `ejecutar_ai`    | `prompt`, `model`, `api_key` | `{ response, action }`         |
| `resumir_web`    | `url`                    | `{ response: "resumen_listo", resumen }` |
| `copiar_a_word`  | `resumen`                | `{ response: "Resumen copiado" }` |

### Shared (`src/shared/`)

Definiciones de tipos TypeScript compartidas entre frontend y la documentación del protocolo de comunicación.

## Flujo de Datos

```
Usuario escribe/habla
       │
       ▼
processCommand(cmd)
       │
       ▼
WebSocket.send({ command: "ejecutar_ai", params: { prompt, model } })
       │
       ▼ (Backend Python)
call_gemini() | call_ollama()
       │
       ▼
WebSocket.send({ response: "...", action: {...} })
       │
       ▼
setHistory([...prev, { role: "ai", text: response }])
       │
       ▼
Interfaz actualizada
```

## Decisiones de Diseño

- **WebSocket sobre HTTP**: Permite comunicación bidireccional en tiempo real para streaming de respuestas.
- **Sin Electron**: La app corre en el navegador para máxima portabilidad; el backend Python gestiona la automatización local.
- **Tailwind CSS + Glassmorphism**: Estética moderna y consistente con mínimo CSS custom.
- **Gemini API**: Elegido por su capacidad multimodal y acceso gratuito via AI Studio.
