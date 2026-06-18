import { useMemo, useState } from 'react';
import { Dashboard } from '../components/Dashboard.jsx';
import { Header } from '../components/Header.jsx';
import { KanbanBoard } from '../components/KanbanBoard.jsx';
import { Sidebar } from '../components/Sidebar.jsx';
import { TicketDetail } from '../components/TicketDetail.jsx';
import { TicketModal } from '../components/TicketModal.jsx';
import { TicketPanel } from '../components/TicketPanel.jsx';
import { useTickets } from '../hooks/useTickets.js';
import { ReportsPage } from './ReportsPage.jsx';
import { users } from '../mockData.js';
import { createFakeJwt, decodeFakeJwt } from '../utils/auth.js';
import { filterTickets, getStats } from '../utils/tickets.js';

export function HelpDeskPage({ session, setSession }) {
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

  function switchUser(userId) {
    const user = users.find((item) => item.id === userId);
    const jwt = createFakeJwt(user);
    setSession({ jwt, user: decodeFakeJwt(jwt) });
  }

  function handleCreateTicket(ticket) {
    createTicket(ticket);
    setActiveView('tickets');
    setNewTicketOpen(false);
  }

  function openTicket(ticketId) {
    setSelectedId(ticketId);
    setActiveView('tickets');
  }

  return (
    <div className="app-shell">
      <Sidebar
        activeView={activeView}
        user={currentUser}
        jwt={session.jwt}
        onLogout={() => setSession(null)}
        onSwitchUser={switchUser}
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
            tickets={visibleTickets}
            onOpen={openTicket}
            onMove={(ticketId, status) => updateTicket(ticketId, { status })}
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
                onUpdate={(patch) => updateTicket(selectedTicket.id, patch)}
                onComment={(body) => addComment(selectedTicket.id, body)}
              />
            )}
          </section>
        )}
      </main>
      {newTicketOpen && <TicketModal onClose={() => setNewTicketOpen(false)} onCreate={handleCreateTicket} />}
    </div>
  );
}
