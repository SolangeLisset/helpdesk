import { MessageSquare, Paperclip, ShieldCheck } from 'lucide-react';
import { priorities, statuses } from '../constants.js';
import { technicians } from '../mockData.js';
import { formatDate } from '../utils/format.js';
import { Pill } from './common/Pill.jsx';
import { SlaPanel } from './sla/SlaPanel.jsx';
import { useState } from 'react';

export function TicketDetail({ ticket, canManage, onUpdate, onComment }) {
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
          <p className="eyebrow">
            {ticket.id} - {ticket.category}
          </p>
          <h2>{ticket.title}</h2>
        </div>
        <Pill tone={ticket.priority}>{ticket.priority}</Pill>
      </div>

      <SlaPanel ticket={ticket} />
      <p className="description">{ticket.description}</p>

      <div className="detail-controls">
        <label className="field">
          <span>Estado</span>
          <select
            disabled={!canManage}
            value={ticket.status}
            onChange={(event) => onUpdate({ status: event.target.value })}
          >
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Asignado a</span>
          <select
            disabled={!canManage}
            value={ticket.assignee}
            onChange={(event) => onUpdate({ assignee: event.target.value })}
          >
            {technicians.map((tech) => (
              <option key={tech.id}>{tech.name}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Prioridad</span>
          <select
            disabled={!canManage}
            value={ticket.priority}
            onChange={(event) => onUpdate({ priority: event.target.value })}
          >
            {priorities.map((priority) => (
              <option key={priority}>{priority}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="attachments">
        <h3>
          <Paperclip size={17} />
          Adjuntos
        </h3>
        {ticket.attachments.map((attachment) => (
          <a key={attachment.name} href={attachment.url} className="attachment">
            <Paperclip size={15} />
            {attachment.name}
            <span>{attachment.size}</span>
          </a>
        ))}
      </div>

      <div className="comments">
        <h3>
          <MessageSquare size={17} />
          Comentarios
        </h3>
        {ticket.comments.map((item, index) => (
          <article className="comment" key={`${item.at}-${index}`}>
            <div>
              <strong>{item.author}</strong>
              <span>
                {item.role} - {formatDate(item.at)}
              </span>
            </div>
            <p>{item.body}</p>
          </article>
        ))}
      </div>

      <div className="history">
        <h3>
          <ShieldCheck size={17} />
          Historial de cambios
        </h3>
        {(ticket.history ?? []).map((item, index) => (
          <article className="history-item" key={`${item.at}-${index}`}>
            <div>
              <strong>{item.action}</strong>
              <span>
                {item.author} - {formatDate(item.at)}
              </span>
            </div>
            <p>{item.from ? `${item.from} -> ${item.to}` : item.to}</p>
          </article>
        ))}
      </div>

      <form className="comment-form" onSubmit={submitComment}>
        <input
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Agregar comentario interno o respuesta al usuario"
        />
        <button className="secondary-button" type="submit">
          Comentar
        </button>
      </form>
    </section>
  );
}
