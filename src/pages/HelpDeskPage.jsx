import { useMemo, useState } from 'react';
import { Dashboard } from '../components/Dashboard.jsx';
import { Header } from '../components/Header.jsx';
import { KanbanBoard } from '../components/KanbanBoard.jsx';
import { Sidebar } from '../components/Sidebar.jsx';
import { TicketDetail } from '../components/TicketDetail.jsx';
import { TicketDetailModal } from '../components/TicketDetailModal.jsx';
import { TicketModal } from '../components/TicketModal.jsx';
import { TicketPanel } from '../components/TicketPanel.jsx';
import { ToastStack } from '../components/common/ToastStack.jsx';
import { useTickets } from '../hooks/useTickets.js';
import { ReportsPage } from './ReportsPage.jsx';
import { users } from '../mockData.js';
import { createFakeJwt, decodeFakeJwt } from '../utils/auth.js';
import { filterTickets, getStats } from '../utils/tickets.js';

export function HelpDeskPage({ session, setSession }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('helpdesk.theme') || 'light');
  const [activeView, setActiveView] = useState('dashboard');
  const [filters, setFilters] = useState({
    search: '',
    priority: 'Todas',
    status: 'Todos',
    technician: 'Todos',
    dateFrom: '',
    dateTo: ''
  });
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [kanbanDetailId, setKanbanDetailId] = useState('');
  const [movedTicketId, setMovedTicketId] = useState('');
  const [toasts, setToasts] = useState([]);

  const currentUser = session.user;
  const isAdmin = currentUser.role === 'Administrador';
  const isTech = currentUser.role === 'Tecnico';
  const canManage = isAdmin || isTech;
  const { tickets, selectedId, setSelectedId, createTicket, updateTicket, addComment } =
    useTickets(currentUser);

  const visibleTickets = useMemo(
    () => filterTickets(tickets, filters, currentUser),
    [tickets, filters, currentUser]
  );
  const selectedTicket =
    tickets.find((ticket) => ticket.id === selectedId) ?? visibleTickets[0] ?? tickets[0];
  const stats = useMemo(() => getStats(tickets), [tickets]);

  function notify(message, type = 'success') {
    const id = crypto.randomUUID();
    setToasts((items) => [...items, { id, message, type }]);
    window.setTimeout(() => dismissToast(id), 3200);
  }

  function dismissToast(id) {
    setToasts((items) => items.filter((toast) => toast.id !== id));
  }

  function toggleTheme() {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('helpdesk.theme', next);
      notify(next === 'dark' ? 'Modo oscuro activado' : 'Modo claro activado', 'info');
      return next;
    });
  }

  function switchUser(userId) {
    const user = users.find((item) => item.id === userId);
    const jwt = createFakeJwt(user);
    setSession({ jwt, user: decodeFakeJwt(jwt) });
  }

  function handleCreateTicket(ticket) {
    createTicket(ticket);
    setActiveView('tickets');
    setNewTicketOpen(false);
    notify('Ticket creado correctamente.');
  }

  function openKanbanDetail(ticketId) {
    setKanbanDetailId(ticketId);
  }

  function handleMoveTicket(ticketId, status) {
    const ticket = tickets.find((item) => item.id === ticketId);
    if (!ticket || ticket.status === status) return;
    updateTicket(ticketId, { status });
    setMovedTicketId(ticketId);
    window.setTimeout(() => setMovedTicketId(''), 900);
    notify(`Ticket ${ticketId} movido a ${status}.`);
  }

  function handleTicketUpdate(ticketId, patch) {
    updateTicket(ticketId, patch);
    notify('Ticket actualizado.');
  }

  function handleComment(ticketId, body) {
    addComment(ticketId, body);
    if (body.trim()) notify('Comentario agregado.');
  }

  const kanbanDetailTicket = tickets.find((ticket) => ticket.id === kanbanDetailId);

  return (
    <div className="app-shell" data-theme={theme}>
      <Sidebar
        activeView={activeView}
        theme={theme}
        user={currentUser}
        jwt={session.jwt}
        onLogout={() => setSession(null)}
        onSwitchUser={switchUser}
        onThemeToggle={toggleTheme}
        onView={setActiveView}
      />
      <main className="workspace">
        <Header activeView={activeView} onCreate={() => setNewTicketOpen(true)} />
        {(activeView === 'dashboard' || activeView === 'tickets') && <Dashboard stats={stats} />}
        {activeView === 'reports' ? (
          <ReportsPage tickets={visibleTickets} />
        ) : activeView === 'kanban' ? (
          <KanbanBoard
            canManage={canManage}
            movedTicketId={movedTicketId}
            tickets={visibleTickets}
            onOpen={openKanbanDetail}
            onMove={handleMoveTicket}
          />
        ) : (
          <section className="content-grid">
            <TicketPanel
              tickets={visibleTickets}
              selectedId={selectedTicket?.id}
              filters={filters}
              onFilter={setFilters}
              onSelect={setSelectedId}
            />
            {selectedTicket && (
              <TicketDetail
                ticket={selectedTicket}
                canManage={canManage}
                onUpdate={(patch) => handleTicketUpdate(selectedTicket.id, patch)}
                onComment={(body) => handleComment(selectedTicket.id, body)}
              />
            )}
          </section>
        )}
      </main>
      {newTicketOpen && <TicketModal onClose={() => setNewTicketOpen(false)} onCreate={handleCreateTicket} />}
      <TicketDetailModal
        ticket={kanbanDetailTicket}
        canManage={canManage}
        onClose={() => setKanbanDetailId('')}
        onUpdate={(patch) => kanbanDetailTicket && handleTicketUpdate(kanbanDetailTicket.id, patch)}
        onComment={(body) => kanbanDetailTicket && handleComment(kanbanDetailTicket.id, body)}
      />
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
