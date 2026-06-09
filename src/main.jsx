import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clock3,
  Filter,
  KeyRound,
  LogOut,
  MessageSquare,
  Paperclip,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Ticket,
  UserCog,
  Users,
  X
} from 'lucide-react';
import { seedTickets, technicians, users } from './mockData.js';
import { createFakeJwt, decodeFakeJwt } from './utils/auth.js';
import './styles.css';

const priorities = ['Alta', 'Media', 'Baja'];
const statuses = ['Abierto', 'En progreso', 'Pendiente', 'Resuelto'];
const categories = ['Hardware', 'Software', 'Red', 'Accesos', 'Seguridad', 'General'];

function App() {
  const [session, setSession] = useState(() => {
    const jwt = createFakeJwt(users[0]);
    return { jwt, user: decodeFakeJwt(jwt) };
  });
  const [tickets, setTickets] = useState(seedTickets);
  const [selectedId, setSelectedId] = useState(seedTickets[0].id);
  const [filters, setFilters] = useState({
    search: '',
    priority: 'Todas',
    status: 'Todos',
    technician: 'Todos'
  });
  const [newTicketOpen, setNewTicketOpen] = useState(false);

  const currentUser = session.user;
  const isAdmin = currentUser.role === 'Administrador';
  const isTech = currentUser.role === 'Tecnico';

  const visibleTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const text = `${ticket.title} ${ticket.requester} ${ticket.category} ${ticket.description}`.toLowerCase();
      const matchesSearch = text.includes(filters.search.toLowerCase());
      const matchesPriority = filters.priority === 'Todas' || ticket.priority === filters.priority;
      const matchesStatus = filters.status === 'Todos' || ticket.status === filters.status;
      const matchesTech = filters.technician === 'Todos' || ticket.assignee === filters.technician;
      const matchesRole = isAdmin || isTech || ticket.requesterEmail === currentUser.email;
      return matchesSearch && matchesPriority && matchesStatus && matchesTech && matchesRole;
    });
  }, [tickets, filters, currentUser, isAdmin, isTech]);

  const selectedTicket = tickets.find((ticket) => ticket.id === selectedId) ?? visibleTickets[0] ?? tickets[0];
  const stats = useMemo(() => getStats(tickets), [tickets]);

  function switchUser(userId) {
    const user = users.find((item) => item.id === userId);
    const jwt = createFakeJwt(user);
    setSession({ jwt, user: decodeFakeJwt(jwt) });
  }

  function createTicket(ticket) {
    const nextTicket = {
      ...ticket,
      id: `HD-${String(tickets.length + 101).padStart(4, '0')}`,
      createdAt: new Date().toISOString(),
      requester: currentUser.name,
      requesterEmail: currentUser.email,
      comments: [
        {
          author: currentUser.name,
          role: currentUser.role,
          body: 'Ticket creado desde el portal de mesa de ayuda.',
          at: new Date().toISOString()
        }
      ]
    };
    setTickets((items) => [nextTicket, ...items]);
    setSelectedId(nextTicket.id);
    setNewTicketOpen(false);
  }

  function updateTicket(ticketId, patch) {
    setTickets((items) => items.map((ticket) => (ticket.id === ticketId ? { ...ticket, ...patch } : ticket)));
  }

  function addComment(ticketId, body) {
    if (!body.trim()) return;
    const comment = {
      author: currentUser.name,
      role: currentUser.role,
      body: body.trim(),
      at: new Date().toISOString()
    };
    setTickets((items) =>
      items.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, comments: [...ticket.comments, comment] } : ticket
      )
    );
  }

  return (
    <div className="app-shell">
      <Sidebar user={currentUser} jwt={session.jwt} onSwitchUser={switchUser} />
      <main className="workspace">
        <Header onCreate={() => setNewTicketOpen(true)} />
        <Dashboard stats={stats} />
        <section className="content-grid">
          <TicketPanel
            tickets={visibleTickets}
            selectedId={selectedTicket?.id}
            filters={filters}
            onFilter={setFilters}
            onSelect={setSelectedId}
          />
          {selectedTicket && (
            <TicketDetail
              ticket={selectedTicket}
              canManage={isAdmin || isTech}
              onUpdate={(patch) => updateTicket(selectedTicket.id, patch)}
              onComment={(body) => addComment(selectedTicket.id, body)}
            />
          )}
        </section>
      </main>
      {newTicketOpen && <TicketModal onClose={() => setNewTicketOpen(false)} onCreate={createTicket} />}
    </div>
  );
}

function Sidebar({ user, jwt, onSwitchUser }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><Ticket size={22} /></div>
        <div>
          <strong>Mesa de Ayuda</strong>
          <span>Help Desk Enterprise</span>
        </div>
      </div>

      <nav className="nav-list" aria-label="Principal">
        <a className="active" href="#dashboard"><BarChart3 size={18} />Dashboard</a>
        <a href="#tickets"><Ticket size={18} />Tickets</a>
        <a href="#equipo"><Users size={18} />Tecnicos</a>
        <a href="#seguridad"><ShieldCheck size={18} />Seguridad</a>
      </nav>

      <div className="session-card">
        <div className="avatar">{user.name.slice(0, 2).toUpperCase()}</div>
        <div>
          <strong>{user.name}</strong>
          <span>{user.role}</span>
        </div>
      </div>

      <label className="field compact">
        <span>Cambiar rol</span>
        <select value={user.id} onChange={(event) => onSwitchUser(event.target.value)}>
          {users.map((item) => (
            <option key={item.id} value={item.id}>{item.name} - {item.role}</option>
          ))}
        </select>
      </label>

      <div className="token-box" id="seguridad">
        <div><KeyRound size={16} />JWT activo</div>
        <code>{jwt}</code>
      </div>

      <button className="ghost-button" type="button"><LogOut size={16} />Cerrar sesion</button>
    </aside>
  );
}

function Header({ onCreate }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Operacion TI</p>
        <h1>Centro de soporte</h1>
      </div>
      <button className="primary-button" type="button" onClick={onCreate}>
        <Plus size={18} />Crear ticket
      </button>
    </header>
  );
}

function Dashboard({ stats }) {
  return (
    <section className="dashboard" id="dashboard">
      <Metric icon={<Ticket />} label="Tickets totales" value={stats.total} trend="+12% esta semana" />
      <Metric icon={<AlertCircle />} label="Alta prioridad" value={stats.high} trend={`${stats.slaRisk} con riesgo SLA`} />
      <Metric icon={<Clock3 />} label="En progreso" value={stats.inProgress} trend="Tiempo medio 3.4h" />
      <Metric icon={<CheckCircle2 />} label="Resueltos" value={stats.resolved} trend="Satisfaccion 94%" />
    </section>
  );
}

function Metric({ icon, label, value, trend }) {
  return (
    <article className="metric">
      <div className="metric-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{trend}</small>
    </article>
  );
}

function TicketPanel({ tickets, selectedId, filters, onFilter, onSelect }) {
  return (
    <section className="panel" id="tickets">
      <div className="panel-title">
        <div>
          <p className="eyebrow">Bandeja</p>
          <h2>Tickets</h2>
        </div>
        <SlidersHorizontal size={20} />
      </div>
      <div className="filters">
        <label className="search-field">
          <Search size={17} />
          <input
            value={filters.search}
            onChange={(event) => onFilter({ ...filters, search: event.target.value })}
            placeholder="Buscar ticket, usuario o categoria"
          />
        </label>
        <SelectFilter icon={<Filter size={16} />} value={filters.priority} onChange={(priority) => onFilter({ ...filters, priority })} options={['Todas', ...priorities]} />
        <SelectFilter value={filters.status} onChange={(status) => onFilter({ ...filters, status })} options={['Todos', ...statuses]} />
        <SelectFilter value={filters.technician} onChange={(technician) => onFilter({ ...filters, technician })} options={['Todos', ...technicians.map((item) => item.name)]} />
      </div>
      <div className="ticket-list">
        {tickets.map((ticket) => (
          <button
            className={`ticket-row ${ticket.id === selectedId ? 'selected' : ''}`}
            key={ticket.id}
            type="button"
            onClick={() => onSelect(ticket.id)}
          >
            <div>
              <strong>{ticket.title}</strong>
              <span>{ticket.id} · {ticket.requester}</span>
            </div>
            <div className="row-meta">
              <Pill tone={ticket.priority}>{ticket.priority}</Pill>
              <small>{ticket.status}</small>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function SelectFilter({ icon, value, onChange, options }) {
  return (
    <label className="select-filter">
      {icon}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function TicketDetail({ ticket, canManage, onUpdate, onComment }) {
  const [comment, setComment] = useState('');

  function submitComment(event) {
    event.preventDefault();
    onComment(comment);
    setComment('');
  }

  return (
    <section className="panel detail-panel">
      <div className="detail-header">
        <div>
          <p className="eyebrow">{ticket.id} · {ticket.category}</p>
          <h2>{ticket.title}</h2>
        </div>
        <Pill tone={ticket.priority}>{ticket.priority}</Pill>
      </div>

      <p className="description">{ticket.description}</p>

      <div className="detail-controls">
        <label className="field">
          <span>Estado</span>
          <select disabled={!canManage} value={ticket.status} onChange={(event) => onUpdate({ status: event.target.value })}>
            {statuses.map((status) => <option key={status}>{status}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Asignado a</span>
          <select disabled={!canManage} value={ticket.assignee} onChange={(event) => onUpdate({ assignee: event.target.value })}>
            {technicians.map((tech) => <option key={tech.id}>{tech.name}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Prioridad</span>
          <select disabled={!canManage} value={ticket.priority} onChange={(event) => onUpdate({ priority: event.target.value })}>
            {priorities.map((priority) => <option key={priority}>{priority}</option>)}
          </select>
        </label>
      </div>

      <div className="attachments">
        <h3><Paperclip size={17} />Adjuntos</h3>
        {ticket.attachments.map((attachment) => (
          <a key={attachment.name} href={attachment.url} className="attachment">
            <Paperclip size={15} />{attachment.name}<span>{attachment.size}</span>
          </a>
        ))}
      </div>

      <div className="comments">
        <h3><MessageSquare size={17} />Comentarios</h3>
        {ticket.comments.map((item, index) => (
          <article className="comment" key={`${item.at}-${index}`}>
            <div>
              <strong>{item.author}</strong>
              <span>{item.role} · {formatDate(item.at)}</span>
            </div>
            <p>{item.body}</p>
          </article>
        ))}
      </div>

      <form className="comment-form" onSubmit={submitComment}>
        <input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Agregar comentario interno o respuesta al usuario" />
        <button className="secondary-button" type="submit">Comentar</button>
      </form>
    </section>
  );
}

function TicketModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: categories[0],
    priority: 'Media',
    status: 'Abierto',
    assignee: technicians[0].name,
    attachments: []
  });

  function submit(event) {
    event.preventDefault();
    const attachments = form.attachments.length
      ? form.attachments
      : [{ name: 'sin-adjuntos.txt', size: '0 KB', url: '#' }];
    onCreate({ ...form, attachments });
  }

  function handleFiles(files) {
    setForm({
      ...form,
      attachments: Array.from(files).map((file) => ({
        name: file.name,
        size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        url: '#'
      }))
    });
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <form className="modal" onSubmit={submit}>
        <div className="modal-head">
          <div>
            <p className="eyebrow">Nuevo caso</p>
            <h2>Crear ticket</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>
        </div>
        <label className="field">
          <span>Titulo</span>
          <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        </label>
        <label className="field">
          <span>Descripcion</span>
          <textarea required rows="4" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        </label>
        <div className="form-grid">
          <label className="field">
            <span>Categoria</span>
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Prioridad</span>
            <select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
              {priorities.map((priority) => <option key={priority}>{priority}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Tecnico</span>
            <select value={form.assignee} onChange={(event) => setForm({ ...form, assignee: event.target.value })}>
              {technicians.map((tech) => <option key={tech.id}>{tech.name}</option>)}
            </select>
          </label>
        </div>
        <label className="dropzone">
          <Paperclip size={18} />
          <span>{form.attachments.length ? `${form.attachments.length} adjunto(s) seleccionado(s)` : 'Agregar adjuntos'}</span>
          <input type="file" multiple onChange={(event) => handleFiles(event.target.files)} />
        </label>
        <button className="primary-button full" type="submit">Crear ticket</button>
      </form>
    </div>
  );
}

function Pill({ tone, children }) {
  return <span className={`pill ${tone.toLowerCase().replace(' ', '-')}`}>{children}</span>;
}

function getStats(tickets) {
  return {
    total: tickets.length,
    high: tickets.filter((ticket) => ticket.priority === 'Alta').length,
    inProgress: tickets.filter((ticket) => ticket.status === 'En progreso').length,
    resolved: tickets.filter((ticket) => ticket.status === 'Resuelto').length,
    slaRisk: tickets.filter((ticket) => ticket.priority === 'Alta' && ticket.status !== 'Resuelto').length
  };
}

function formatDate(value) {
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

createRoot(document.getElementById('root')).render(<App />);
