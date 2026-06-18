import { X } from 'lucide-react';
import { TicketDetail } from './TicketDetail.jsx';

export function TicketDetailModal({ ticket, canManage, onClose, onComment, onUpdate }) {
  if (!ticket) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <section className="modal ticket-detail-modal">
        <div className="modal-head">
          <div>
            <p className="eyebrow">Detalle desde Kanban</p>
            <h2>{ticket.id}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>
        <TicketDetail ticket={ticket} canManage={canManage} onUpdate={onUpdate} onComment={onComment} />
      </section>
    </div>
  );
}
