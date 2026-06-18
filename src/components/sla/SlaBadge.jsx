import { getSla } from '../../utils/tickets.js';

export function SlaBadge({ ticket, compact = false }) {
  const sla = getSla(ticket);
  return <span className={`sla-badge ${sla.tone} ${compact ? 'compact' : ''}`}>{sla.shortLabel}</span>;
}
