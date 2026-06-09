# Mesa de Ayuda (Help Desk)

Sistema web de mesa de ayuda creado con React y Vite. Permite gestionar tickets de soporte con una interfaz ordenada tipo empresarial.

## Autora

SolangeLisset

## Funciones

- Dashboard con metricas de tickets.
- Pantalla de login protegida.
- Creacion de tickets.
- Prioridad: Alta, Media y Baja.
- Estado: Abierto, En progreso, Pendiente y Resuelto.
- Asignacion a tecnico.
- Comentarios por ticket.
- Adjuntos simulados.
- Filtros por busqueda, prioridad, estado y tecnico.
- Vista Kanban para revisar y mover tickets por estado.
- Roles simulados: Administrador, Tecnico y Usuario.
- JWT simulado para representar sesion activa.

## Acceso demo

La aplicacion usa usuarios demo para simular roles y permisos.

```text
Clave: demo123
```

Usuarios disponibles:

- Paula Admin - Administrador
- Diego Tecnico - Tecnico
- Marcos Usuario - Usuario

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

## Deploy en Netlify

El proyecto incluye `netlify.toml` con la configuracion correcta:

```text
Build command: npm run build
Publish directory: dist
```

Si Netlify publica la raiz del proyecto en vez de `dist`, puede aparecer un error MIME al cargar `/src/main.jsx`.

## Estructura

```text
helpdesk-react/
  index.html
  netlify.toml
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
