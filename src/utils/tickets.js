import { seedTickets } from '../mockData.js';
import { slaHoursByPriority, STORAGE_KEY } from '../constants.js';
import { readJsonStorage } from './storage.js';

export function filterTickets(tickets, filters, currentUser) {
  const isAdmin = currentUser.role === 'Administrador';
  const isTech = currentUser.role === 'Tecnico';

  return tickets.filter((ticket) => {
    const text = `${ticket.title} ${ticket.requester} ${ticket.category} ${ticket.description}`.toLowerCase();
    const matchesSearch = text.includes(filters.search.toLowerCase());
    const matchesPriority = filters.priority === 'Todas' || ticket.priority === filters.priority;
    const matchesStatus = filters.status === 'Todos' || ticket.status === filters.status;
    const matchesTech = filters.technician === 'Todos' || ticket.assignee === filters.technician;
    const matchesRole = isAdmin || isTech || ticket.requesterEmail === currentUser.email;
    return matchesSearch && matchesPriority && matchesStatus && matchesTech && matchesRole;
  });
}

export function createTicketRecord(ticket, currentUser, ticketCount, now = new Date().toISOString()) {
  return {
    ...ticket,
    id: `HD-${String(ticketCount + 101).padStart(4, '0')}`,
    createdAt: now,
    requester: currentUser.name,
    requesterEmail: currentUser.email,
    comments: [
      {
        author: currentUser.name,
        role: currentUser.role,
        body: 'Ticket creado desde el portal de mesa de ayuda.',
        at: now
      }
    ],
    history: [
      {
        author: currentUser.name,
        role: currentUser.role,
        action: 'Ticket creado',
        field: 'ticket',
        from: '',
        to: 'Abierto',
        at: now
      }
    ]
  };
}

export function applyTicketPatch(ticket, patch, currentUser, now = new Date().toISOString()) {
  const auditedFields = ['status', 'priority', 'assignee'];
  const historyEntries = auditedFields
    .filter((field) => patch[field] !== undefined && patch[field] !== ticket[field])
    .map((field) => ({
      author: currentUser.name,
      role: currentUser.role,
      action: getAuditLabel(field),
      field,
      from: ticket[field],
      to: patch[field],
      at: now
    }));

  return {
    ...ticket,
    ...patch,
    history: [...(ticket.history ?? []), ...historyEntries]
  };
}

export function addTicketComment(ticket, body, currentUser, now = new Date().toISOString()) {
  const comment = {
    author: currentUser.name,
    role: currentUser.role,
    body: body.trim(),
    at: now
  };

  return {
    ...ticket,
    comments: [...ticket.comments, comment]
  };
}

export function getStats(tickets, now = Date.now()) {
  return {
    total: tickets.length,
    high: tickets.filter((ticket) => ticket.priority === 'Alta').length,
    inProgress: tickets.filter((ticket) => ticket.status === 'En progreso').length,
    resolved: tickets.filter((ticket) => ticket.status === 'Resuelto').length,
    slaRisk: tickets.filter((ticket) => {
      const sla = getSla(ticket, now);
      return sla.tone === 'risk' || sla.tone === 'expired';
    }).length,
    slaExpired: tickets.filter((ticket) => getSla(ticket, now).tone === 'expired').length
  };
}

export function getSla(ticket, now = Date.now()) {
  const limitHours = slaHoursByPriority[ticket.priority] ?? 24;

  if (ticket.status === 'Resuelto') {
    return {
      tone: 'ok',
      label: 'SLA cumplido',
      shortLabel: 'SLA OK',
      detail: 'Ticket resuelto dentro del flujo de atencion.',
      limitHours
    };
  }

  const createdAt = new Date(ticket.createdAt).getTime();
  const dueAt = createdAt + limitHours * 60 * 60 * 1000;
  const remainingMs = dueAt - now;
  const absoluteHours = Math.max(1, Math.ceil(Math.abs(remainingMs) / (60 * 60 * 1000)));

  if (remainingMs < 0) {
    return {
      tone: 'expired',
      label: 'SLA vencido',
      shortLabel: 'Vencido',
      detail: `Vencio hace ${absoluteHours}h.`,
      limitHours
    };
  }

  if (remainingMs <= limitHours * 60 * 60 * 1000 * 0.25) {
    return {
      tone: 'risk',
      label: 'SLA por vencer',
      shortLabel: 'Riesgo SLA',
      detail: `Quedan ${absoluteHours}h para cumplir el objetivo.`,
      limitHours
    };
  }

  return {
    tone: 'ok',
    label: 'SLA en plazo',
    shortLabel: 'En plazo',
    detail: `Quedan ${absoluteHours}h para cumplir el objetivo.`,
    limitHours
  };
}

export function loadStoredTickets() {
  const stored = readJsonStorage(STORAGE_KEY, null);
  return Array.isArray(stored) ? normalizeTickets(stored) : normalizeTickets(seedTickets);
}

export function normalizeTickets(tickets) {
  return tickets.map((ticket) => ({
    ...ticket,
    history: ticket.history?.length
      ? ticket.history
      : [
          {
            author: 'Sistema',
            role: 'Auditoria',
            action: 'Ticket registrado',
            field: 'ticket',
            from: '',
            to: ticket.status,
            at: ticket.createdAt
          }
        ]
  }));
}

export function getAuditLabel(field) {
  const labels = {
    status: 'Estado actualizado',
    priority: 'Prioridad actualizada',
    assignee: 'Tecnico reasignado'
  };
  return labels[field] ?? 'Ticket actualizado';
}
