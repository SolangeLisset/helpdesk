import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { applyTicketPatch, createTicketRecord, getReportMetrics, getSla, getStats } from './tickets.js';

const user = {
  id: 'usr-1',
  name: 'Paula Admin',
  email: 'paula.admin@empresa.cl',
  role: 'Administrador'
};

const baseTicket = {
  id: 'HD-0001',
  title: 'Equipo sin internet',
  description: 'No conecta a la red corporativa.',
  category: 'Red',
  priority: 'Alta',
  status: 'Abierto',
  assignee: 'Camila Torres',
  requester: 'Marcos Usuario',
  requesterEmail: 'marcos.usuario@empresa.cl',
  createdAt: '2026-06-18T10:00:00.000Z',
  attachments: [],
  comments: [],
  history: []
};

describe('ticket business rules', () => {
  it('creates a ticket with requester, comment and audit history', () => {
    const ticket = createTicketRecord(
      {
        title: 'Nueva solicitud',
        description: 'Detalle de prueba',
        category: 'Software',
        priority: 'Media',
        status: 'Abierto',
        assignee: 'Diego Fuentes',
        attachments: []
      },
      user,
      4,
      '2026-06-18T12:00:00.000Z'
    );

    assert.equal(ticket.id, 'HD-0105');
    assert.equal(ticket.requesterEmail, user.email);
    assert.equal(ticket.comments.length, 1);
    assert.equal(ticket.history[0].action, 'Ticket creado');
  });

  it('adds audit entries when tracked fields change', () => {
    const updated = applyTicketPatch(
      baseTicket,
      { status: 'En progreso', priority: 'Media' },
      user,
      '2026-06-18T12:30:00.000Z'
    );

    assert.equal(updated.status, 'En progreso');
    assert.equal(updated.priority, 'Media');
    assert.deepEqual(
      updated.history.map((entry) => entry.action),
      ['Estado actualizado', 'Prioridad actualizada']
    );
  });

  it('classifies SLA as expired after the priority target time', () => {
    const now = new Date('2026-06-18T15:00:00.000Z').getTime();
    const sla = getSla(baseTicket, now);

    assert.equal(sla.tone, 'expired');
    assert.equal(sla.shortLabel, 'Vencido');
  });

  it('calculates dashboard SLA counters', () => {
    const now = new Date('2026-06-18T15:00:00.000Z').getTime();
    const stats = getStats([baseTicket, { ...baseTicket, id: 'HD-0002', status: 'Resuelto' }], now);

    assert.equal(stats.total, 2);
    assert.equal(stats.slaExpired, 1);
    assert.equal(stats.resolved, 1);
  });

  it('groups report metrics by status, priority and technician', () => {
    const metrics = getReportMetrics([
      baseTicket,
      { ...baseTicket, id: 'HD-0002', status: 'Resuelto', priority: 'Baja' }
    ]);

    assert.equal(metrics.byStatus.Abierto, 1);
    assert.equal(metrics.byStatus.Resuelto, 1);
    assert.equal(metrics.byPriority.Alta, 1);
    assert.equal(metrics.byPriority.Baja, 1);
    assert.equal(metrics.byTechnician['Camila Torres'], 2);
  });
});
