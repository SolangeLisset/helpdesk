export function EmptyState({ title, message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">!</div>
      <strong>{title}</strong>
      <p>{message}</p>
      {action}
    </div>
  );
}
