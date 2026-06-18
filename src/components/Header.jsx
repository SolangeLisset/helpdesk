import { Plus } from 'lucide-react';

const titleByView = {
  dashboard: 'Centro de soporte',
  tickets: 'Gestion de tickets',
  kanban: 'Tablero Kanban',
  reports: 'Reportes'
};

export function Header({ activeView, onCreate }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Operacion TI</p>
        <h1>{titleByView[activeView]}</h1>
      </div>
      <button className="primary-button" type="button" onClick={onCreate}>
        <Plus size={18} />
        Crear ticket
      </button>
    </header>
  );
}
