# Documentacion tecnica

## Arquitectura

La aplicacion esta construida con React y Vite. El frontend usa datos demo locales, JWT simulado y persistencia en `localStorage`.

## Estructura principal

```text
server/
  index.js       API Express.
  schema.sql     Esquema PostgreSQL.
  routes/        Endpoints REST.
src/
  components/     Componentes reutilizables de interfaz.
  hooks/          Hooks de estado y persistencia.
  pages/          Pantallas principales de la aplicacion.
  utils/          Reglas de negocio y helpers testeables.
  constants.js    Listas y constantes compartidas.
  mockData.js     Usuarios, tecnicos y tickets de ejemplo.
```

## Flujo de datos

1. `LoginPage` genera un JWT simulado para el usuario seleccionado.
2. `HelpDeskPage` coordina la vista activa, filtros, sesion y tickets.
3. `useTickets` centraliza creacion, edicion, comentarios y persistencia.
4. `utils/tickets.js` contiene reglas puras para SLA, auditoria, filtros y estadisticas.

## Persistencia

Los tickets se guardan en `localStorage` con la clave `helpdesk.tickets.v1`. Esto permite conservar cambios al recargar la pagina sin depender de backend.

## SLA

El SLA se calcula por prioridad:

- Alta: 4 horas.
- Media: 24 horas.
- Baja: 72 horas.

El resultado puede ser `ok`, `risk` o `expired`, y se muestra en el dashboard, lista, detalle y Kanban.

## Auditoria

Cada cambio de estado, prioridad o tecnico genera una entrada en `history`. La auditoria registra autor, rol, campo modificado, valor anterior, nuevo valor y fecha.

## Reportes

La vista de reportes reutiliza los tickets filtrados por rol, busqueda y rango de fecha. Incluye:

- Tickets por estado.
- Tickets por prioridad.
- Tickets por tecnico.
- Tickets vencidos por tecnico.
- Tiempo promedio de resolucion.
- Exportacion CSV.
- Vista imprimible para guardar como PDF desde el navegador.

## Experiencia de usuario

La aplicacion incluye modo oscuro persistido en `localStorage`, toasts de confirmacion, estados vacios reutilizables, animaciones suaves en Kanban y modal de detalle para inspeccionar tickets sin salir del tablero.

## Backend REST

La carpeta `server/` contiene una API REST con Express y PostgreSQL:

- `POST /api/auth/register` registra usuarios con password hasheado mediante bcrypt.
- `POST /api/auth/login` firma JWT con expiracion.
- `POST /api/auth/forgot-password` genera token de recuperacion.
- `POST /api/auth/reset-password` actualiza la password usando un token valido.
- `GET /api/tickets` lista tickets segun rol y filtros.
- `POST /api/tickets` crea tickets.
- `PATCH /api/tickets/:id` actualiza estado, prioridad o tecnico.
- `POST /api/tickets/:id/comments` agrega comentarios.
- `POST /api/tickets/:ticketId/attachments` sube adjuntos con Multer.

El esquema SQL esta en `server/schema.sql`. Para produccion, los adjuntos deberian moverse desde almacenamiento local hacia Supabase Storage, S3 o Cloudinary.

## Tests

Los tests usan `node:test` y validan reglas de negocio:

- Creacion de tickets.
- Auditoria de cambios.
- Clasificacion de SLA.
- Estadisticas del dashboard.

Ejecutar:

```bash
npm test
```

## Calidad

Comandos disponibles:

```bash
npm run lint
npm run format:check
npm run format
```
