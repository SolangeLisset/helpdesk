export function normalizeTicket(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    priority: row.priority,
    status: row.status,
    assignee: row.assignee_name || 'Sin asignar',
    assigneeId: row.assignee_id || '',
    requester: row.requester_name || row.requester || 'Usuario',
    requesterEmail: row.requester_email || '',
    requesterId: row.requester_id,
    createdAt: row.created_at || row.createdAt,
    updatedAt: row.updated_at || row.updatedAt,
    attachments: (row.attachments ?? []).map(normalizeAttachment),
    comments: (row.comments ?? []).map(normalizeComment),
    history: (row.history ?? []).map(normalizeHistory)
  };
}

export function normalizeTechnician(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

function normalizeComment(comment) {
  return {
    author: comment.author_name || comment.author || 'Usuario',
    role: comment.author_role || comment.role || '',
    body: comment.body,
    at: comment.created_at || comment.at
  };
}

function normalizeHistory(item) {
  return {
    author: item.author_name || item.author || 'Sistema',
    role: item.author_role || item.role || '',
    action: item.action,
    field: item.field,
    from: item.old_value ?? item.from ?? '',
    to: item.new_value ?? item.to ?? '',
    at: item.created_at || item.at
  };
}

function normalizeAttachment(attachment) {
  return {
    id: attachment.id,
    name: attachment.original_name || attachment.name,
    filename: attachment.filename,
    size: attachment.size_bytes
      ? `${Math.max(1, Math.round(attachment.size_bytes / 1024))} KB`
      : attachment.size,
    url: attachment.url || '#'
  };
}
