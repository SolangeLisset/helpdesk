import {
  BarChart3,
  KanbanSquare,
  KeyRound,
  LayoutList,
  LogOut,
  PieChart,
  ShieldCheck,
  SunMoon,
  Ticket,
  Users
} from 'lucide-react';
import { users } from '../mockData.js';

export function Sidebar({ activeView, theme, user, jwt, onLogout, onSwitchUser, onThemeToggle, onView }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Ticket size={22} />
        </div>
        <div>
          <strong>Mesa de Ayuda</strong>
          <span>Help Desk Enterprise</span>
        </div>
      </div>

      <nav className="nav-list" aria-label="Principal">
        <button
          className={activeView === 'dashboard' ? 'active' : ''}
          type="button"
          onClick={() => onView('dashboard')}
        >
          <BarChart3 size={18} />
          Dashboard
        </button>
        <button
          className={activeView === 'tickets' ? 'active' : ''}
          type="button"
          onClick={() => onView('tickets')}
        >
          <LayoutList size={18} />
          Tickets
        </button>
        <button
          className={activeView === 'kanban' ? 'active' : ''}
          type="button"
          onClick={() => onView('kanban')}
        >
          <KanbanSquare size={18} />
          Kanban
        </button>
        <button
          className={activeView === 'reports' ? 'active' : ''}
          type="button"
          onClick={() => onView('reports')}
        >
          <PieChart size={18} />
          Reportes
        </button>
        <button type="button" onClick={() => onView('dashboard')}>
          <Users size={18} />
          Tecnicos
        </button>
        <button type="button" onClick={() => onView('dashboard')}>
          <ShieldCheck size={18} />
          Seguridad
        </button>
      </nav>

      <div className="session-card">
        <div className="avatar">{user.name.slice(0, 2).toUpperCase()}</div>
        <div>
          <strong>{user.name}</strong>
          <span>{user.role}</span>
        </div>
      </div>

      <label className="field compact">
        <span>Cambiar rol</span>
        <select value={user.id} onChange={(event) => onSwitchUser(event.target.value)}>
          {users.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} - {item.role}
            </option>
          ))}
        </select>
      </label>

      <div className="token-box" id="seguridad">
        <div>
          <KeyRound size={16} />
          JWT activo
        </div>
        <code>{jwt}</code>
      </div>

      <button className="ghost-button" type="button" onClick={onThemeToggle}>
        <SunMoon size={16} />
        {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
      </button>

      <button className="ghost-button" type="button" onClick={onLogout}>
        <LogOut size={16} />
        Cerrar sesion
      </button>
    </aside>
  );
}
