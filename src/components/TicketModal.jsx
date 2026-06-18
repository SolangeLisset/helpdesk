import { Paperclip, X } from 'lucide-react';
import { useState } from 'react';
import { categories, priorities } from '../constants.js';
import { technicians } from '../mockData.js';

export function TicketModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: categories[0],
    priority: 'Media',
    status: 'Abierto',
    assignee: technicians[0].name,
    attachments: []
  });

  function submit(event) {
    event.preventDefault();
    const attachments = form.attachments.length
      ? form.attachments
      : [{ name: 'sin-adjuntos.txt', size: '0 KB', url: '#' }];
    onCreate({ ...form, attachments });
  }

  function handleFiles(files) {
    setForm({
      ...form,
      attachments: Array.from(files).map((file) => ({
        name: file.name,
        size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        url: '#'
      }))
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
              value={form.assignee}
              onChange={(event) => setForm({ ...form, assignee: event.target.value })}
            >
              {technicians.map((tech) => (
                <option key={tech.id}>{tech.name}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="dropzone">
          <Paperclip size={18} />
          <span>
            {form.attachments.length
              ? `${form.attachments.length} adjunto(s) seleccionado(s)`
              : 'Agregar adjuntos'}
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
