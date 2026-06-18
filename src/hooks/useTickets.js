import { useEffect, useState } from 'react';
import { seedTickets } from '../mockData.js';
import { STORAGE_KEY } from '../constants.js';
import {
  addTicketComment,
  applyTicketPatch,
  createTicketRecord,
  loadStoredTickets
} from '../utils/tickets.js';
import { writeJsonStorage } from '../utils/storage.js';

export function useTickets(currentUser) {
  const [tickets, setTickets] = useState(loadStoredTickets);
  const [selectedId, setSelectedId] = useState(seedTickets[0].id);

  useEffect(() => {
    writeJsonStorage(STORAGE_KEY, tickets);
  }, [tickets]);

  function createTicket(ticket) {
    const nextTicket = createTicketRecord(ticket, currentUser, tickets.length);
    setTickets((items) => [nextTicket, ...items]);
    setSelectedId(nextTicket.id);
    return nextTicket;
  }

  function updateTicket(ticketId, patch) {
    setTickets((items) =>
      items.map((ticket) => (ticket.id === ticketId ? applyTicketPatch(ticket, patch, currentUser) : ticket))
    );
  }

  function addComment(ticketId, body) {
    if (!body.trim()) return;
    setTickets((items) =>
      items.map((ticket) => (ticket.id === ticketId ? addTicketComment(ticket, body, currentUser) : ticket))
    );
  }

  return {
    tickets,
    selectedId,
    setSelectedId,
    createTicket,
    updateTicket,
    addComment
  };
}
