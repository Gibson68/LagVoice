import api from './api'
import { TICKET_STATUS } from '../utils/constants'

export const ticketService = {
  async getTickets(filters = {}) {
    const params = new URLSearchParams()
    if (filters.status && filters.status !== 'all') params.append('status', filters.status)
    if (filters.category && filters.category !== 'all') params.append('category', filters.category)
    if (filters.search) params.append('search', filters.search)
    
    // axios returns response.data due to the interceptor
    return await api.get(`/tickets?${params.toString()}`)
  },

  async getTicketById(id) {
    const response = await api.get(`/tickets/${id}`)
    return response.ticket // Since our backend returns { success: true, ticket: { ... } }
  },

  async createTicket(data) {
    const formData = new FormData()
    
    // Append standard fields
    Object.keys(data).forEach(key => {
      if (key !== 'images') {
        formData.append(key, data[key])
      }
    })
    
    // Append files if they exist
    if (data.images && data.images.length > 0) {
      Array.from(data.images).forEach(file => {
        formData.append('images', file)
      })
    }

    return await api.post('/tickets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  async updateStatus(id, status) {
    return api.put(`/tickets/${id}/status`, { status });
  },

  async addComment(ticketId, comment) {
    const response = await api.post(`/tickets/${ticketId}/comments`, { message: comment })
    return response.comment
  },

  async updateTicketStatus(ticketId, status) {
    const response = await api.put(`/tickets/${ticketId}/status`, { status })
    return response.ticket
  },

  async reopenTicket(ticketId) {
    // We just update status to pending
    const response = await api.put(`/tickets/${ticketId}/status`, { status: TICKET_STATUS.PENDING })
    return { success: true, message: 'Ticket has been reopened.', ticket: response.ticket }
  },
}
