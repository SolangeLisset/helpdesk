import { AlertCircle, CheckCircle2, Clock3, Ticket } from 'lucide-react';

export function Dashboard({ stats }) {
  return (
    <section className="dashboard" id="dashboard">
      <Metric icon={<Ticket />} label="Tickets totales" value={stats.total} trend="+12% esta semana" />
      <Metric
        icon={<AlertCircle />}
        label="Alta prioridad"
        value={stats.high}
        trend={`${stats.slaRisk} con riesgo SLA`}
      />
      <Metric icon={<Clock3 />} label="En progreso" value={stats.inProgress} trend="Tiempo medio 3.4h" />
      <Metric
        icon={<CheckCircle2 />}
        label="SLA vencidos"
        value={stats.slaExpired}
        trend={`${stats.resolved} tickets resueltos`}
      />
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
