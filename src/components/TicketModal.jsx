import { Paperclip, X } from 'lucide-react';
import { useState } from 'react';
import { categories, priorities } from '../constants.js';

export function TicketModal({ technicians, onClose, onCreate }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: categories[0],
    priority: 'Media',
    status: 'Abierto',
    assignee_id: technicians[0]?.id || '',
    files: []
  });

  function submit(event) {
    event.preventDefault();
    onCreate(form);
  }

  function handleFiles(files) {
    setForm({
      ...form,
      files: Array.from(files)
    });
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <form className="modal" onSubmit={submit}>
        <div className="modal-head">
          <div>
            <p className="eyebrow">Nuevo caso</p>
            <h2>Crear ticket</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>
        <label className="field">
          <span>Titulo</span>
          <input
            required
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
          />
        </label>
        <label className="field">
          <span>Descripcion</span>
          <textarea
            required
            rows="4"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
        </label>
        <div className="form-grid">
          <label className="field">
            <span>Categoria</span>
            <select
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Prioridad</span>
            <select
              value={form.priority}
              onChange={(event) => setForm({ ...form, priority: event.target.value })}
            >
              {priorities.map((priority) => (
                <option key={priority}>{priority}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Tecnico</span>
            <select
              value={form.assignee_id}
              onChange={(event) => setForm({ ...form, assignee_id: event.target.value })}
            >
              <option value="">Sin asignar</option>
              {technicians.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="dropzone">
          <Paperclip size={18} />
          <span>
            {form.files.length ? `${form.files.length} adjunto(s) seleccionado(s)` : 'Agregar adjuntos'}
          </span>
          <input type="file" multiple onChange={(event) => handleFiles(event.target.files)} />
        </label>
        <button className="primary-button full" type="submit">
          Crear ticket
        </button>
      </form>
    </div>
  );
}
