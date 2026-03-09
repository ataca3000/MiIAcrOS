# Guía de Contribución

¡Gracias por tu interés en contribuir a **Karen AI**! 🎉

## Cómo Contribuir

### 1. Reportar un Bug

Antes de reportar un bug, por favor:
1. Verifica que no haya un *issue* existente para el mismo problema.
2. Abre un nuevo *issue* con el título **[BUG] Descripción breve**.
3. Incluye pasos detallados para reproducirlo, comportamiento esperado vs. actual, y tu entorno (SO, versión de Node.js/Python).

### 2. Sugerir una Mejora

1. Abre un *issue* con el título **[FEATURE] Descripción breve**.
2. Explica el caso de uso y el beneficio para los usuarios.
3. Si es posible, incluye un boceto o ejemplo de la funcionalidad.

### 3. Enviar un Pull Request

1. Haz un *fork* del repositorio.
2. Crea una rama desde `main`:
   ```bash
   git checkout -b feature/mi-nueva-feature
   ```
3. Realiza tus cambios respetando el estilo de código existente.
4. Verifica que el proyecto compila sin errores:
   ```bash
   npm run lint
   npm run build
   ```
5. Haz *commit* de tus cambios con mensajes descriptivos:
   ```bash
   git commit -m "feat: descripción clara del cambio"
   ```
6. Haz *push* a tu *fork* y abre un Pull Request hacia `main`.

## Convención de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/es/):

| Tipo       | Descripción                               |
|------------|-------------------------------------------|
| `feat`     | Nueva funcionalidad                       |
| `fix`      | Corrección de bug                         |
| `docs`     | Cambios en documentación                  |
| `style`    | Formato, sin cambios de lógica            |
| `refactor` | Refactorización de código                 |
| `test`     | Añadir o modificar tests                  |
| `chore`    | Tareas de mantenimiento                   |

## Estructura del Proyecto

Consulta [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) para entender cómo está organizado el código.

## Código de Conducta

Al participar en este proyecto, aceptas respetar el [Código de Conducta](CODE_OF_CONDUCT.md).
