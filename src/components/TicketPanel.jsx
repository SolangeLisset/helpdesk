import { Filter, Search, SlidersHorizontal } from 'lucide-react';
import { priorities, statuses } from '../constants.js';
import { EmptyState } from './common/EmptyState.jsx';
import { Pill } from './common/Pill.jsx';
import { SelectFilter } from './common/SelectFilter.jsx';
import { SlaBadge } from './sla/SlaBadge.jsx';

export function TicketPanel({ tickets, selectedId, filters, technicians, onFilter, onSelect }) {
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
        <SelectFilter
          icon={<Filter size={16} />}
          value={filters.priority}
          onChange={(priority) => onFilter({ ...filters, priority })}
          options={['Todas', ...priorities]}
        />
        <SelectFilter
          value={filters.status}
          onChange={(status) => onFilter({ ...filters, status })}
          options={['Todos', ...statuses]}
        />
        <SelectFilter
          value={filters.technician}
          onChange={(technician) => onFilter({ ...filters, technician })}
          options={['Todos', ...technicians.map((item) => item.name)]}
        />
        <div className="date-filters">
          <label className="field">
            <span>Desde</span>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(event) => onFilter({ ...filters, dateFrom: event.target.value })}
            />
          </label>
          <label className="field">
            <span>Hasta</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(event) => onFilter({ ...filters, dateTo: event.target.value })}
            />
          </label>
        </div>
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
              <span>
                {ticket.id} - {ticket.requester}
              </span>
            </div>
            <div className="row-meta">
              <Pill tone={ticket.priority}>{ticket.priority}</Pill>
              <SlaBadge ticket={ticket} compact />
              <small>{ticket.status}</small>
            </div>
          </button>
        ))}
        {!tickets.length && (
          <EmptyState
            title="Sin tickets para mostrar"
            message="Ajusta los filtros o crea un nuevo ticket para iniciar la atencion."
          />
        )}
      </div>
    </section>
  );
}
