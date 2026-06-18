import { useState } from 'react';
import { statuses } from '../constants.js';
import { Pill } from './common/Pill.jsx';
import { SlaBadge } from './sla/SlaBadge.jsx';

export function KanbanBoard({ canManage, tickets, onOpen, onMove }) {
  const [dragOverStatus, setDragOverStatus] = useState('');
  const groupedTickets = statuses.map((status) => ({
    status,
    tickets: tickets.filter((ticket) => ticket.status === status)
  }));

  function handleDrop(event, status) {
    event.preventDefault();
    const ticketId = event.dataTransfer.getData('text/plain');
    setDragOverStatus('');
    if (ticketId && canManage) {
      onMove(ticketId, status);
    }
  }

  return (
    <section className="kanban-board">
      {groupedTickets.map((column) => (
        <article
          className={`kanban-column ${dragOverStatus === column.status ? 'drag-over' : ''}`}
          key={column.status}
          onDragOver={(event) => {
            if (!canManage) return;
            event.preventDefault();
            setDragOverStatus(column.status);
          }}
          onDragLeave={() => setDragOverStatus('')}
          onDrop={(event) => handleDrop(event, column.status)}
        >
          <header>
            <h2>{column.status}</h2>
            <span>{column.tickets.length}</span>
          </header>
          <div className="kanban-list">
            {column.tickets.map((ticket) => (
              <div
                className="kanban-card"
                draggable={canManage}
                key={ticket.id}
                onDragStart={(event) => event.dataTransfer.setData('text/plain', ticket.id)}
              >
                <button className="kanban-open" type="button" onClick={() => onOpen(ticket.id)}>
                  <strong>{ticket.title}</strong>
                  <span>
                    {ticket.id} - {ticket.requester}
                  </span>
                </button>
                <div className="kanban-meta">
                  <Pill tone={ticket.priority}>{ticket.priority}</Pill>
                  <small>{ticket.assignee}</small>
                </div>
                <SlaBadge ticket={ticket} />
                {canManage && (
                  <label className="move-field">
                    <span>Mover a</span>
                    <select value={ticket.status} onChange={(event) => onMove(ticket.id, event.target.value)}>
                      {statuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
            ))}
            {!column.tickets.length && <p className="empty-column">Sin tickets</p>}
          </div>
        </article>
      ))}
    </section>
  );
}
