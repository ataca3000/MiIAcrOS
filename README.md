# Karen AI — Asistente Inteligente de Escritorio

<div align="center">

![Karen AI](https://img.shields.io/badge/Karen%20AI-v1.0.0-cyan?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Karen AI** es un asistente de escritorio avanzado con interfaz glassmorphism, automatización Python y soporte para Gemini API y modelos locales de IA.

</div>

---

## ✨ Características

- **🎨 Interfaz Glassmorphism** — Ventana flotante arrastrable y redimensionable con diseño moderno
- **🔴 Efecto KITT** — Visualización de pulso neón estilo "El Auto Increíble"
- **🤖 Gemini API** — Procesamiento de lenguaje natural con Google Gemini
- **🏠 Modo Offline** — Soporte para modelos locales Llama 3 y Mistral vía Ollama
- **🎤 Reconocimiento de Voz** — Comandos por voz en español usando Web Speech API
- **�� Resumen Web** — Extrae y resume el contenido de cualquier página web
- **📝 Copiar a Word** — Escribe texto directamente en aplicaciones del sistema
- **⌨️ Atajos de Teclado** — Controla Karen AI sin usar el ratón

---

## 🚀 Instalación

### Requisitos

| Herramienta | Versión       |
|-------------|---------------|
| Node.js     | 18.x o superior |
| Python      | 3.9 o superior  |

### 1. Clonar el repositorio

```bash
git clone https://github.com/ataca3000/MiIAcrOS.git
cd MiIAcrOS
```

### 2. Instalar dependencias del frontend

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y añade tu `GEMINI_API_KEY` (obtén una gratis en [AI Studio](https://aistudio.google.com/app/apikey)).

### 4. Instalar dependencias del backend

**Windows:**
```batch
scripts\install_karen.bat
```

**Linux / macOS:**
```bash
bash scripts/install_karen.sh
```

**Manual:**
```bash
pip install -r requirements.txt
```

---

## 💻 Uso

### Iniciar el frontend

```bash
npm run dev
# Abre http://localhost:3000
```

### Iniciar el backend (en otra terminal)

```bash
python src/backend/karen_backend.py
```

### Atajos de Teclado

| Atajo      | Acción                       |
|------------|------------------------------|
| `Alt + M`  | Activar/desactivar micrófono |
| `Alt + S`  | Abrir/cerrar configuración   |
| `Alt + R`  | Expandir/contraer ventana    |

---

## 📁 Estructura del Proyecto

```
MiIAcrOS/
├── src/
│   ├── frontend/           # Interfaz React + TypeScript
│   │   ├── App.tsx         # Componente principal
│   │   ├── main.tsx        # Punto de entrada
│   │   └── index.css       # Estilos globales
│   ├── backend/            # Scripts Python
│   │   └── karen_backend.py  # Servidor WebSocket
│   └── shared/             # Tipos compartidos
│       └── types.ts
├── docs/                   # Documentación
│   ├── DEVELOPMENT.md      # Guía de desarrollo
│   ├── ARCHITECTURE.md     # Arquitectura del sistema
│   └── API.md              # Referencia del protocolo
├── scripts/                # Scripts de utilidad
│   ├── install_karen.bat   # Instalación Windows
│   └── install_karen.sh    # Instalación Linux/macOS
├── tests/                  # Tests
├── .env.example            # Variables de entorno ejemplo
├── package.json            # Dependencias npm
├── requirements.txt        # Dependencias Python
├── setup.py                # Configuración del módulo Python
├── tsconfig.json           # Configuración TypeScript
├── vite.config.ts          # Configuración Vite
└── index.html              # Punto de entrada HTML
```

---

## ⚙️ Configuración

Desde el panel de Karen AI, haz clic en el icono de **engranaje** (⚙️) para:

- **Descargar el Backend** — Descarga `karen_backend.py`
- **Seleccionar Modelo IA** — Cambia entre Gemini, Llama 3 y Mistral

---

## 📚 Documentación

- [Guía de Desarrollo](docs/DEVELOPMENT.md)
- [Arquitectura del Sistema](docs/ARCHITECTURE.md)
- [Referencia de API](docs/API.md)
- [Guía de Contribución](CONTRIBUTING.md)
- [Código de Conducta](CODE_OF_CONDUCT.md)
- [Changelog](CHANGELOG.md)

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Lee la [Guía de Contribución](CONTRIBUTING.md) para empezar.

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).
