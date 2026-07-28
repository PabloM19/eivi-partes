# Eiviplant · Mock de partes

Prototipo navegable de la futura aplicación de partes de Eiviplant.

## Qué incluye

- Login de demostración.
- Dashboard de administración.
- Gestión y filtrado de partes.
- Detalle y revisión de un parte.
- Alta unificada de empleado y acceso.
- Clientes, casas/obras y catálogos.
- Informes e impresión simulada.
- Archivo histórico.
- Experiencia móvil de operario.
- Creación interactiva de partes con tareas repetibles.

Todos los datos son ficticios y viven únicamente en la interfaz. El proyecto no
envía ni modifica información de Joomla o WordPress.

## Ejecutar en local

Requiere Node.js 22 o posterior.

```bash
npm install
npm run dev
```

Después, abre `http://localhost:3000`.

## Verificar la compilación

```bash
npm run build
```

La interfaz principal está en `app/page.tsx` y el sistema visual en
`app/globals.css`.
