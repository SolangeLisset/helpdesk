create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  role text not null check (role in ('Administrador', 'Tecnico', 'Usuario')),
  created_at timestamptz not null default now()
);

create table if not exists tickets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null,
  priority text not null check (priority in ('Alta', 'Media', 'Baja')),
  status text not null check (status in ('Abierto', 'En progreso', 'Pendiente', 'Resuelto')),
  requester_id uuid not null references users(id) on delete restrict,
  assignee_id uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ticket_comments (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references tickets(id) on delete cascade,
  author_id uuid not null references users(id) on delete restrict,
  body text not null,
  internal boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists ticket_attachments (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references tickets(id) on delete cascade,
  uploaded_by uuid not null references users(id) on delete restrict,
  filename text not null,
  original_name text not null,
  mime_type text not null,
  size_bytes integer not null,
  url text not null,
  created_at timestamptz not null default now()
);

create table if not exists ticket_history (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references tickets(id) on delete cascade,
  author_id uuid not null references users(id) on delete restrict,
  action text not null,
  field text not null,
  old_value text,
  new_value text,
  created_at timestamptz not null default now()
);

create table if not exists password_reset_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_tickets_requester on tickets(requester_id);
create index if not exists idx_tickets_assignee on tickets(assignee_id);
create index if not exists idx_tickets_status on tickets(status);
create index if not exists idx_password_reset_tokens_token on password_reset_tokens(token);
