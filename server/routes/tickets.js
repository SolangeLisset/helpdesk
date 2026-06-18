import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const ticketsRouter = Router();

ticketsRouter.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const params = [];
    const filters = [];

    if (req.user.role === 'Usuario') {
      params.push(req.user.id);
      filters.push(`t.requester_id = $${params.length}`);
    }

    if (req.query.status) {
      params.push(req.query.status);
      filters.push(`t.status = $${params.length}`);
    }

    if (req.query.priority) {
      params.push(req.query.priority);
      filters.push(`t.priority = $${params.length}`);
    }

    if (req.query.from) {
      params.push(req.query.from);
      filters.push(`t.created_at >= $${params.length}`);
    }

    if (req.query.to) {
      params.push(`${req.query.to} 23:59:59`);
      filters.push(`t.created_at <= $${params.length}`);
    }

    const where = filters.length ? `where ${filters.join(' and ')}` : '';
    const result = await query(
      `select t.*, requester.name as requester_name, assignee.name as assignee_name
       from tickets t
       join users requester on requester.id = t.requester_id
       left join users assignee on assignee.id = t.assignee_id
       ${where}
       order by t.created_at desc`,
      params
    );

    return res.json(result.rows);
  })
);

ticketsRouter.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { title, description, category, priority, assignee_id } = req.body;

    if (!title || !description || !category || !priority) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const result = await query(
      `insert into tickets (title, description, category, priority, status, requester_id, assignee_id)
       values ($1, $2, $3, $4, 'Abierto', $5, $6)
       returning *`,
      [title, description, category, priority, req.user.id, assignee_id || null]
    );

    await addHistory(result.rows[0].id, req.user.id, 'Ticket creado', 'ticket', null, 'Abierto');
    return res.status(201).json(result.rows[0]);
  })
);

ticketsRouter.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const ticket = await getTicketForUser(req.params.id, req.user);
    if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });

    const [comments, attachments, history] = await Promise.all([
      query(
        `select c.*, u.name as author_name, u.role as author_role
         from ticket_comments c
         join users u on u.id = c.author_id
         where c.ticket_id = $1
         order by c.created_at asc`,
        [req.params.id]
      ),
      query('select * from ticket_attachments where ticket_id = $1 order by created_at desc', [
        req.params.id
      ]),
      query(
        `select h.*, u.name as author_name, u.role as author_role
         from ticket_history h
         join users u on u.id = h.author_id
         where h.ticket_id = $1
         order by h.created_at asc`,
        [req.params.id]
      )
    ]);

    return res.json({
      ...ticket,
      comments: comments.rows,
      attachments: attachments.rows,
      history: history.rows
    });
  })
);

ticketsRouter.patch(
  '/:id',
  requireAuth,
  requireRole('Administrador', 'Tecnico'),
  asyncHandler(async (req, res) => {
    const current = await getTicketForUser(req.params.id, req.user);
    if (!current) return res.status(404).json({ error: 'Ticket no encontrado' });

    const allowedFields = ['status', 'priority', 'assignee_id'];
    const updates = allowedFields.filter((field) => req.body[field] !== undefined);

    if (!updates.length) {
      return res.status(400).json({ error: 'No hay campos validos para actualizar' });
    }

    const values = updates.map((field) => req.body[field]);
    const setSql = updates.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const result = await query(
      `update tickets set ${setSql}, updated_at = now()
       where id = $${updates.length + 1}
       returning *`,
      [...values, req.params.id]
    );

    await Promise.all(
      updates
        .filter((field) => current[field] !== req.body[field])
        .map((field) =>
          addHistory(req.params.id, req.user.id, getAuditLabel(field), field, current[field], req.body[field])
        )
    );

    return res.json(result.rows[0]);
  })
);

ticketsRouter.post(
  '/:id/comments',
  requireAuth,
  asyncHandler(async (req, res) => {
    const ticket = await getTicketForUser(req.params.id, req.user);
    if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });

    const { body, internal = false } = req.body;
    if (!body) return res.status(400).json({ error: 'Comentario requerido' });

    const result = await query(
      `insert into ticket_comments (ticket_id, author_id, body, internal)
       values ($1, $2, $3, $4)
       returning *`,
      [req.params.id, req.user.id, body, internal]
    );

    return res.status(201).json(result.rows[0]);
  })
);

async function getTicketForUser(ticketId, user) {
  const params = [ticketId];
  const ownerFilter = user.role === 'Usuario' ? 'and requester_id = $2' : '';
  if (ownerFilter) params.push(user.id);

  const result = await query(`select * from tickets where id = $1 ${ownerFilter}`, params);
  return result.rows[0];
}

function getAuditLabel(field) {
  const labels = {
    status: 'Estado actualizado',
    priority: 'Prioridad actualizada',
    assignee_id: 'Tecnico reasignado'
  };
  return labels[field] ?? 'Ticket actualizado';
}

function addHistory(ticketId, authorId, action, field, oldValue, newValue) {
  return query(
    `insert into ticket_history (ticket_id, author_id, action, field, old_value, new_value)
     values ($1, $2, $3, $4, $5, $6)`,
    [ticketId, authorId, action, field, oldValue, newValue]
  );
}
