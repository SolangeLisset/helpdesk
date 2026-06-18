import { getReportMetrics, getSla } from './tickets.js';

export function exportTicketsCsv(tickets) {
  const headers = [
    'ID',
    'Titulo',
    'Solicitante',
    'Categoria',
    'Prioridad',
    'Estado',
    'Tecnico',
    'Creado',
    'SLA'
  ];
  const rows = tickets.map((ticket) => [
    ticket.id,
    ticket.title,
    ticket.requester,
    ticket.category,
    ticket.priority,
    ticket.status,
    ticket.assignee,
    ticket.createdAt,
    getSla(ticket).label
  ]);
  const csv = [headers, ...rows].map((row) => row.map(escapeCsvValue).join(',')).join('\n');
  downloadBlob(csv, 'reporte-tickets.csv', 'text/csv;charset=utf-8');
}

export function exportTicketsPdf(tickets) {
  const metrics = getReportMetrics(tickets);
  const reportWindow = window.open('', '_blank', 'width=1000,height=800');
  if (!reportWindow) return;

  reportWindow.document.write(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Reporte Mesa de Ayuda</title>
        <style>
          body { font-family: Arial, sans-serif; color: #17212f; padding: 32px; }
          h1 { margin-bottom: 4px; }
          p { color: #475569; }
          table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 12px; }
          th, td { border: 1px solid #dbe4ed; padding: 8px; text-align: left; }
          th { background: #eef3f7; }
          .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 24px; }
          .metric { border: 1px solid #dbe4ed; border-radius: 8px; padding: 12px; }
          .metric strong { display: block; font-size: 24px; }
          @media print { button { display: none; } body { padding: 0; } }
        </style>
      </head>
      <body>
        <button onclick="window.print()">Guardar como PDF</button>
        <h1>Reporte Mesa de Ayuda</h1>
        <p>Generado el ${new Date().toLocaleString('es-CL')}</p>
        <section class="metrics">
          <article class="metric"><span>Tickets</span><strong>${tickets.length}</strong></article>
          <article class="metric"><span>Promedio resolucion</span><strong>${metrics.averageResolutionHours}h</strong></article>
          <article class="metric"><span>Estados</span><strong>${Object.keys(metrics.byStatus).length}</strong></article>
          <article class="metric"><span>Tecnicos</span><strong>${Object.keys(metrics.byTechnician).length}</strong></article>
        </section>
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Titulo</th><th>Prioridad</th><th>Estado</th><th>Tecnico</th><th>SLA</th>
            </tr>
          </thead>
          <tbody>
            ${tickets
              .map(
                (ticket) => `
                  <tr>
                    <td>${escapeHtml(ticket.id)}</td>
                    <td>${escapeHtml(ticket.title)}</td>
                    <td>${escapeHtml(ticket.priority)}</td>
                    <td>${escapeHtml(ticket.status)}</td>
                    <td>${escapeHtml(ticket.assignee)}</td>
                    <td>${escapeHtml(getSla(ticket).label)}</td>
                  </tr>
                `
              )
              .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `);
  reportWindow.document.close();
  reportWindow.focus();
}

function escapeCsvValue(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
