import { getSla } from '../../utils/tickets.js';

export function SlaPanel({ ticket }) {
  const sla = getSla(ticket);

  return (
    <div className={`sla-panel ${sla.tone}`}>
      <div>
        <strong>{sla.label}</strong>
        <span>{sla.detail}</span>
      </div>
      <small>Objetivo: {sla.limitHours}h desde creacion</small>
    </div>
  );
}
