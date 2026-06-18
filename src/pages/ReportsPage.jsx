import { Download, FileText } from 'lucide-react';
import { BarChart } from '../components/reports/BarChart.jsx';
import { exportTicketsCsv, exportTicketsPdf } from '../utils/exportReports.js';
import { getReportMetrics } from '../utils/tickets.js';

export function ReportsPage({ tickets }) {
  const metrics = getReportMetrics(tickets);

  return (
    <section className="reports-layout">
      <div className="reports-toolbar">
        <div>
          <p className="eyebrow">Analitica</p>
          <h2>Reportes operativos</h2>
        </div>
        <div className="report-actions">
          <button className="secondary-button" type="button" onClick={() => exportTicketsCsv(tickets)}>
            <Download size={17} />
            CSV
          </button>
          <button className="secondary-button" type="button" onClick={() => exportTicketsPdf(tickets)}>
            <FileText size={17} />
            PDF
          </button>
        </div>
      </div>

      <div className="report-summary">
        <article>
          <span>Tiempo promedio de resolucion</span>
          <strong>{metrics.averageResolutionHours}h</strong>
        </article>
        <article>
          <span>Tickets analizados</span>
          <strong>{tickets.length}</strong>
        </article>
        <article>
          <span>Tecnicos activos</span>
          <strong>{Object.keys(metrics.byTechnician).length}</strong>
        </article>
      </div>

      <div className="reports-grid">
        <ReportCard title="Tickets por estado">
          <BarChart data={metrics.byStatus} />
        </ReportCard>
        <ReportCard title="Tickets por prioridad">
          <BarChart data={metrics.byPriority} />
        </ReportCard>
        <ReportCard title="Tickets por tecnico">
          <BarChart data={metrics.byTechnician} />
        </ReportCard>
        <ReportCard title="Tickets vencidos por tecnico">
          <BarChart data={metrics.expiredByTechnician} emptyLabel="No hay tickets vencidos" />
        </ReportCard>
      </div>
    </section>
  );
}

function ReportCard({ title, children }) {
  return (
    <article className="report-card">
      <h3>{title}</h3>
      {children}
    </article>
  );
}
