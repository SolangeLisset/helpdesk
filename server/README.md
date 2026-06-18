# Helpdesk API

API REST para la Mesa de Ayuda. Incluye usuarios, autenticacion JWT, tickets, comentarios, historial, recuperacion de password y adjuntos.

## Requisitos

- Node.js
- PostgreSQL

## Configuracion

1. Copia `.env.example` a `.env`.
2. Ajusta `DATABASE_URL` y `JWT_SECRET`.
3. Crea la base de datos `helpdesk`.
4. Ejecuta el esquema:

```bash
psql "$env:DATABASE_URL" -f server/schema.sql
```

En PowerShell tambien puedes usar:

```powershell
psql "postgres://postgres:postgres@localhost:5432/helpdesk" -f server/schema.sql
```

## Ejecutar

```bash
npm run api:dev
```

La API queda en:

```text
http://127.0.0.1:4000/api
```

## Endpoints principales

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/users`
- `GET /api/users/technicians`
- `GET /api/tickets`
- `POST /api/tickets`
- `GET /api/tickets/:id`
- `PATCH /api/tickets/:id`
- `POST /api/tickets/:id/comments`
- `POST /api/tickets/:ticketId/attachments`
- `GET /api/attachments/:id/download`

## Adjuntos

Los archivos se guardan localmente en `server/uploads`. Para produccion se recomienda moverlos a Supabase Storage, S3 o Cloudinary.
