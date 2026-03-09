# API Reference — Karen AI

Documentación del protocolo de comunicación WebSocket entre el frontend React y el backend Python.

## Conexión

El backend escucha en `ws://localhost:8765` por defecto (configurable mediante la variable de entorno `VITE_BACKEND_URL`).

```typescript
const ws = new WebSocket('ws://localhost:8765');
```

---

## Comandos del Frontend → Backend

### `ejecutar_ai`

Envía un prompt a la IA seleccionada para obtener una acción estructurada.

**Payload:**
```json
{
  "command": "ejecutar_ai",
  "params": {
    "prompt": "Refactoriza la función calcular_total en utils.py",
    "model": "gemini",
    "api_key": "AIza..."
  }
}
```

| Campo     | Tipo   | Requerido | Valores posibles              |
|-----------|--------|-----------|-------------------------------|
| `prompt`  | string | ✅        | Cualquier texto               |
| `model`   | string | ✅        | `gemini`, `llama3`, `mistral` |
| `api_key` | string | Condicional | Requerido si `model === "gemini"` |

**Respuesta:**
```json
{
  "response": "Ejecutando: refactorizar_funcion",
  "action": {
    "action": "refactorizar_funcion",
    "params": { "archivo": "utils.py" }
  }
}
```

---

### `resumir_web`

Descarga y resume el contenido de texto de una URL.

**Payload:**
```json
{
  "command": "resumir_web",
  "params": {
    "url": "https://ejemplo.com/articulo"
  }
}
```

**Respuesta (éxito):**
```json
{
  "response": "resumen_listo",
  "resumen": "Resumen de https://ejemplo.com/articulo: ..."
}
```

**Respuesta (error):**
```json
{
  "response": "Error: URL no proporcionada."
}
```

---

### `copiar_a_word`

Escribe texto en la aplicación activa del sistema usando PyAutoGUI.

**Payload:**
```json
{
  "command": "copiar_a_word",
  "params": {
    "resumen": "Texto a escribir en la aplicación activa"
  }
}
```

**Respuesta:**
```json
{
  "response": "Resumen copiado a Word."
}
```

> ⚠️ **Nota de seguridad**: Este comando escribe directamente en la aplicación que tenga el foco. Asegúrate de que la ventana correcta está activa antes de ejecutarlo.

---

## Tipos de Datos

Ver [src/shared/types.ts](../src/shared/types.ts) para las definiciones TypeScript completas de todos los tipos del protocolo.

## Códigos de Error

| Mensaje                          | Causa                                     |
|----------------------------------|-------------------------------------------|
| `Error: URL no proporcionada.`   | Campo `url` vacío en `resumir_web`        |
| `Error: Contenido insuficiente`  | La página web tiene menos de 100 caracteres de texto |
| `Error: <excepción>`             | Error genérico del servidor               |
