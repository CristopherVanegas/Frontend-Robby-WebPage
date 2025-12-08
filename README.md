# Frontend - Sistema de Gestión Académica

Aplicación React + TypeScript + Vite para la gestión de profesores y reuniones.

## Características

- ✅ Vista de Profesores con CRUD completo
- ✅ Upload de fotos de profesores
- ✅ Vista de Reuniones con CRUD completo
- ✅ Interfaz moderna con Bootstrap 5
- ✅ TypeScript para type safety
- ✅ Vite para desarrollo rápido

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar en modo desarrollo:
```bash
npm run dev
```

La aplicación se abrirá automáticamente en http://localhost:3000

## Build para Producción

```bash
npm run build
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── Profesores.tsx   # Gestión de profesores
│   ├── Profesores.css
│   ├── Reuniones.tsx    # Gestión de reuniones
│   └── Reuniones.css
├── services/            # Servicios API
│   ├── profesores.service.ts
│   └── reuniones.service.ts
├── types/               # Tipos TypeScript
│   ├── profesor.ts
│   └── reunion.ts
├── App.tsx              # Componente principal
└── main.tsx             # Entry point
```

## Funcionalidades

### Profesores
- Listar todos los profesores
- Ver ficha detallada con horarios
- Crear nuevo profesor (con foto)
- Editar profesor existente
- Eliminar profesor (soft delete)
- Upload de fotos

### Reuniones
- Listar todas las reuniones
- Ver detalles con asistentes y ausentes
- Crear nueva reunión
- Editar reunión existente
- Eliminar reunión (soft delete)
- Seguimiento de asistencia
