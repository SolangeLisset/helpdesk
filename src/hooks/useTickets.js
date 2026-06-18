import { useCallback, useEffect, useState } from 'react';
import { api } from '../utils/apiClient.js';
import { normalizeTicket } from '../utils/normalizers.js';

export function useTickets(session, filters, onUnauthorized) {
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleError = useCallback(
    (err) => {
      if (err.status === 401) {
        onUnauthorized?.();
        return;
      }
      setError(err.message || 'No se pudo conectar con la API');
    },
    [onUnauthorized]
  );

  const refreshTickets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const rows = await api.tickets(session.jwt, filters);
      const normalized = rows.map(normalizeTicket);
      setTickets(normalized);
      setSelectedId((current) => current || normalized[0]?.id || '');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [filters, handleError, session.jwt]);

  useEffect(() => {
    refreshTickets();
  }, [refreshTickets]);

  const loadTicketDetails = useCallback(
    async (ticketId) => {
      if (!ticketId) return null;
      try {
        const detail = normalizeTicket(await api.ticket(session.jwt, ticketId));
        setTickets((items) => {
          const exists = items.some((ticket) => ticket.id === ticketId);
          return exists
            ? items.map((ticket) => (ticket.id === ticketId ? detail : ticket))
            : [detail, ...items];
        });
        return detail;
      } catch (err) {
        handleError(err);
        return null;
      }
    },
    [handleError, session.jwt]
  );

  useEffect(() => {
    loadTicketDetails(selectedId);
  }, [loadTicketDetails, selectedId]);

  async function createTicket(ticket) {
    const { files = [], ...payload } = ticket;
    const created = normalizeTicket(await api.createTicket(session.jwt, payload));
    await uploadFiles(created.id, files);
    const detail = await loadTicketDetails(created.id);
    await refreshTickets();
    setSelectedId(created.id);
    return detail ?? created;
  }

  async function updateTicket(ticketId, patch) {
    await api.updateTicket(session.jwt, ticketId, patch);
    await loadTicketDetails(ticketId);
    await refreshTickets();
  }

  async function addComment(ticketId, body) {
    if (!body.trim()) return;
    await api.addComment(session.jwt, ticketId, { body: body.trim() });
    await loadTicketDetails(ticketId);
  }

  async function uploadFiles(ticketId, files) {
    for (const file of files) {
      await api.uploadAttachment(session.jwt, ticketId, file);
    }
  }

  async function downloadAttachment(attachment) {
    const response = await fetch(api.attachmentDownloadUrl(attachment.id), {
      headers: {
        Authorization: `Bearer ${session.jwt}`
      }
    });
    if (!response.ok) throw new Error('No se pudo descargar el adjunto');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = attachment.name;
    link.click();
    URL.revokeObjectURL(url);
  }

  return {
    tickets,
    selectedId,
    setSelectedId,
    loading,
    error,
    refreshTickets,
    createTicket,
    updateTicket,
    addComment,
    downloadAttachment
  };
}
