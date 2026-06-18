import { CheckCircle2, Info, X } from 'lucide-react';

export function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <article className={`toast ${toast.type}`} key={toast.id}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <Info size={18} />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => onDismiss(toast.id)} aria-label="Cerrar notificacion">
            <X size={15} />
          </button>
        </article>
      ))}
    </div>
  );
}
