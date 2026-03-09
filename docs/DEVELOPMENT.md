# Guía de Desarrollo

Esta guía explica cómo configurar el entorno de desarrollo local para **Karen AI**.

## Requisitos Previos

| Herramienta | Versión mínima |
|-------------|----------------|
| Node.js     | 18.x           |
| npm         | 9.x            |
| Python      | 3.9+           |
| pip         | 23.x           |

## Configuración del Entorno

### 1. Clonar el Repositorio

```bash
git clone https://github.com/ataca3000/MiIAcrOS.git
cd MiIAcrOS
```

### 2. Instalar Dependencias del Frontend

```bash
npm install
```

### 3. Configurar Variables de Entorno

```bash
cp .env.example .env
# Edita .env y añade tu GEMINI_API_KEY
```

### 4. Instalar Dependencias del Backend

```bash
pip install -r requirements.txt
```

## Ejecución en Modo Desarrollo

### Frontend (React + Vite)

```bash
npm run dev
# Abre http://localhost:3000
```

### Backend (Python WebSocket)

```bash
python src/backend/karen_backend.py
# Escucha en ws://localhost:8765
```

Ejecuta ambos procesos simultáneamente para tener la aplicación completa funcionando.

## Scripts Disponibles

| Comando         | Descripción                              |
|-----------------|------------------------------------------|
| `npm run dev`   | Inicia servidor de desarrollo Vite       |
| `npm run build` | Compila la aplicación para producción    |
| `npm run preview` | Previsualiza el build de producción   |
| `npm run lint`  | Verifica tipos con TypeScript            |
| `npm run clean` | Elimina el directorio `dist/`            |

## Estructura del Proyecto

```
MiIAcrOS/
├── src/
│   ├── frontend/       # Componentes React + TypeScript
│   │   ├── App.tsx     # Componente principal
│   │   ├── main.tsx    # Punto de entrada
│   │   └── index.css   # Estilos globales
│   ├── backend/        # Scripts Python
│   │   └── karen_backend.py  # Servidor WebSocket
│   └── shared/         # Tipos compartidos
│       └── types.ts
├── docs/               # Documentación
├── config/             # Archivos de configuración extra
├── tests/              # Tests
├── scripts/            # Scripts de utilidad
├── index.html          # Punto de entrada HTML
├── vite.config.ts      # Configuración de Vite
├── tsconfig.json       # Configuración de TypeScript
├── package.json        # Dependencias npm
├── requirements.txt    # Dependencias Python
└── setup.py            # Configuración del paquete Python
```

## Flujo de Trabajo Git

1. Crea una rama desde `main`: `git checkout -b feature/nombre`
2. Realiza tus cambios
3. Ejecuta `npm run lint` para verificar tipos
4. Haz commit siguiendo [Conventional Commits](https://www.conventionalcommits.org/es/)
5. Abre un Pull Request

## Solución de Problemas Comunes

### El frontend no se conecta al backend

Verifica que el servidor Python esté corriendo en `localhost:8765`.

### Error de API Key

Asegúrate de tener `GEMINI_API_KEY` configurado en `.env`.

### Error de módulo Python no encontrado

Ejecuta `pip install -r requirements.txt` nuevamente.
