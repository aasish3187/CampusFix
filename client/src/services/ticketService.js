import { tickets } from '../data/mockData';

// Replace these mock methods with Axios calls once /api/v1 is available.
export const ticketService = {
  getAll: async () => new Promise((resolve) => setTimeout(() => resolve(tickets), 250)),
  getById: async (id) => tickets.find((ticket) => ticket.id === id) || tickets[0],
  create: async (payload) => ({ ...payload, id: `CF-2026-${Math.floor(1000 + Math.random() * 9000)}`, status: 'Submitted' })
};
