# Mesa de Ayuda (Help Desk)

Sistema web de mesa de ayuda creado con React y Vite. Permite gestionar tickets de soporte con una interfaz ordenada tipo empresarial.

## Autora

SolangeLisset

## Funciones

- Dashboard con metricas de tickets.
- Creacion de tickets.
- Prioridad: Alta, Media y Baja.
- Estado: Abierto, En progreso, Pendiente y Resuelto.
- Asignacion a tecnico.
- Comentarios por ticket.
- Adjuntos simulados.
- Filtros por busqueda, prioridad, estado y tecnico.
- Roles simulados: Administrador, Tecnico y Usuario.
- JWT simulado para representar sesion activa.

## Tecnologias

- React
- Vite
- Lucide React
- CSS modular separado del HTML

## Instalacion

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Luego abre la URL que muestra Vite, normalmente:

```text
http://127.0.0.1:5173
```

## Crear build de produccion

```bash
npm run build
```

## Estructura

```text
helpdesk-react/
  index.html
  package.json
  src/
    main.jsx
    mockData.js
    styles.css
    utils/
      auth.js
```

## Nota

El JWT y los roles estan simulados en frontend para fines demostrativos. Para produccion se recomienda conectar la app a un backend con autenticacion real, base de datos, almacenamiento de adjuntos y control de permisos en servidor.
