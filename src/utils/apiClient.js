const API_URL = import.meta.env.VITE_API_URL || 'https://helpdesk-7i2e.onrender.com/api';
const SESSION_KEY = 'helpdesk.session.v1';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function getStoredSession() {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    const session = JSON.parse(stored);
    if (!session?.jwt || isTokenExpired(session.jwt)) {
      clearStoredSession();
      return null;
    }
    return session;
  } catch {
    clearStoredSession();
    return null;
  }
}

export function saveStoredSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 <= Date.now();
}

export function decodeJwtPayload(token) {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replaceAll('-', '+').replaceAll('_', '/');
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
}

export async function apiRequest(path, { token, method = 'GET', body, headers } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined
  });

  const contentType = response.headers.get('content-type') ?? '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(data?.error || data?.message || 'Error de API', response.status);
  }

  return data;
}

export const api = {
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: credentials }),
  register: (payload) => apiRequest('/auth/register', { method: 'POST', body: payload }),
  forgotPassword: (payload) => apiRequest('/auth/forgot-password', { method: 'POST', body: payload }),
  resetPassword: (payload) => apiRequest('/auth/reset-password', { method: 'POST', body: payload }),
  technicians: (token) => apiRequest('/users/technicians', { token }),
  tickets: (token, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'Todos') params.set('status', filters.status);
    if (filters.priority && filters.priority !== 'Todas') params.set('priority', filters.priority);
    if (filters.dateFrom) params.set('from', filters.dateFrom);
    if (filters.dateTo) params.set('to', filters.dateTo);
    const query = params.toString();
    return apiRequest(`/tickets${query ? `?${query}` : ''}`, { token });
  },
  ticket: (token, id) => apiRequest(`/tickets/${id}`, { token }),
  createTicket: (token, payload) => apiRequest('/tickets', { token, method: 'POST', body: payload }),
  updateTicket: (token, id, patch) => apiRequest(`/tickets/${id}`, { token, method: 'PATCH', body: patch }),
  addComment: (token, id, payload) =>
    apiRequest(`/tickets/${id}/comments`, { token, method: 'POST', body: payload }),
  uploadAttachment: (token, ticketId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest(`/tickets/${ticketId}/attachments`, {
      token,
      method: 'POST',
      body: formData
    });
  },
  attachmentDownloadUrl: (id) => `${API_URL}/attachments/${id}/download`
};
