# Karen AI - Asistente Inteligente de Escritorio

Karen AI es un asistente de escritorio avanzado que combina una interfaz moderna con automatización en Python para ayudarte a gestionar tareas complejas, resumir contenido web y controlar tu entorno local.

## Características
- **Interfaz Glassmorphism:** Diseño moderno, ajustable y movible.
- **Automatización Python:** Controla aplicaciones, busca archivos y realiza tareas complejas.
- **Inteligencia Artificial:** Basado en Gemini API para entender tus intenciones.
- **Modo Offline:** Opción para instalar modelos locales (Llama/Mistral).
- **Efecto KITT:** Visualización de pulso neón estilo "El Auto Increíble".

## Instalación

### 1. Requisitos
- Python 3.x instalado.
- Node.js instalado.

### 2. Configuración del Backend
1. Descarga el archivo `karen_backend.py` desde la configuración de la app.
2. Ejecuta el script de instalación automática `install_karen.bat` (Windows) en la misma carpeta donde descargaste el archivo:
   ```batch
   @echo off
   echo Instalando dependencias...
   pip install websockets pyautogui keyboard requests beautifulsoup4 python-docx
   echo.
   echo Iniciando servidor...
   python karen_backend.py
   ```

### 3. Ejecución del Frontend
1. Asegúrate de tener configurada tu API Key de Gemini en el entorno.
2. Inicia la aplicación web.

## Configuración
Puedes acceder al panel de configuración haciendo clic en el icono de engranaje en la esquina superior derecha de la ventana de Karen AI. Desde allí podrás:
- Descargar el script del backend.
- Alternar entre el uso de Gemini o modelos de IA locales.

## Contribución
Este proyecto es de código abierto. Si deseas colaborar, siéntete libre de hacer un fork del repositorio, realizar tus mejoras y enviar un Pull Request.
