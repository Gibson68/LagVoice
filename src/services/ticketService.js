import { TICKET_STATUS } from '../utils/constants'
import { generateTrackingId } from '../utils/formatters'

/**
 * Mock ticket service
 * Replace with real API calls when backend is ready
 */

const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms))

const mockTickets = [
  {
    id: 42,
    trackingId: 'UNILAG-00042',
    title: 'Broken air conditioning in Lecture Hall B',
    description: 'The AC units in Lecture Hall B (Science building) have been non-functional for the past two weeks. This is affecting students during lectures, especially in the afternoon sessions.',
    category: 'infrastructure',
    subcategory: 'Lecture Hall',
    urgency: 'high',
    status: TICKET_STATUS.UNDER_REVIEW,
    isAnonymous: false,
    location: 'Science Building, Lecture Hall B',
    submittedBy: 'Chidinma Okafor',
    submittedAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    images: [],
    comments: [
      {
        id: 1,
        author: 'Dr. Funke Adeyemi (QA Admin)',
        message: 'We have received your complaint and forwarded it to the maintenance department. An inspection is scheduled for tomorrow.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        isAdmin: true,
      },
      {
        id: 2,
        author: 'Chidinma Okafor',
        message: 'Thank you for the quick response. Is there any update on the inspection?',
        createdAt: new Date(Date.now() - 43200000).toISOString(),
        isAdmin: false,
      },
    ],
    timeline: [
      { status: 'submitted', date: new Date(Date.now() - 172800000).toISOString() },
      { status: 'under_review', date: new Date(Date.now() - 86400000).toISOString() },
    ],
  },
  {
    id: 38,
    trackingId: 'UNILAG-00038',
    title: 'Water supply outage in Hall of Residence 4',
    description: 'No water supply in Hall 4 for 3 days. Students are unable to take showers or use the toilet facilities properly.',
    category: 'infrastructure',
    subcategory: 'Water Facility',
    urgency: 'high',
    status: TICKET_STATUS.RESOLVED,
    isAnonymous: false,
    location: 'Hall of Residence 4',
    submittedBy: 'Chidinma Okafor',
    submittedAt: new Date(Date.now() - 604800000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
    images: [],
    comments: [
      {
        id: 3,
        author: 'Maintenance Team',
        message: 'Water pump has been repaired. Supply should be restored within the next 2 hours.',
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        isAdmin: true,
      },
    ],
    timeline: [
      { status: 'submitted', date: new Date(Date.now() - 604800000).toISOString() },
      { status: 'under_review', date: new Date(Date.now() - 518400000).toISOString() },
      { status: 'action_taken', date: new Date(Date.now() - 345600000).toISOString() },
      { status: 'resolved', date: new Date(Date.now() - 259200000).toISOString() },
    ],
  },
  {
    id: 35,
    trackingId: 'UNILAG-00035',
    title: 'Slow internet on student portal',
    description: 'The student portal takes over 30 seconds to load pages. Registration period is starting and this could cause issues for many students.',
    category: 'administrative',
    subcategory: 'Student Portal',
    urgency: 'medium',
    status: TICKET_STATUS.PENDING,
    isAnonymous: true,
    location: 'N/A',
    submittedBy: 'Anonymous',
    submittedAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
    images: [],
    comments: [],
    timeline: [
      { status: 'submitted', date: new Date(Date.now() - 259200000).toISOString() },
    ],
  },
  {
    id: 30,
    trackingId: 'UNILAG-00030',
    title: 'Request for extended library hours during exams',
    description: 'Students are requesting that the university library extend its operating hours during the examination period to accommodate late-night studying.',
    category: 'general',
    subcategory: 'Suggestions',
    urgency: 'low',
    status: TICKET_STATUS.CLOSED,
    isAnonymous: false,
    location: 'University Library',
    submittedBy: 'Chidinma Okafor',
    submittedAt: new Date(Date.now() - 1209600000).toISOString(),
    updatedAt: new Date(Date.now() - 864000000).toISOString(),
    images: [],
    comments: [
      {
        id: 4,
        author: 'Library Administration',
        message: 'Library hours have been extended to 10 PM during the exam period. This will be reviewed after exams.',
        createdAt: new Date(Date.now() - 950400000).toISOString(),
        isAdmin: true,
      },
    ],
    timeline: [
      { status: 'submitted', date: new Date(Date.now() - 1209600000).toISOString() },
      { status: 'under_review', date: new Date(Date.now() - 1123200000).toISOString() },
      { status: 'action_taken', date: new Date(Date.now() - 950400000).toISOString() },
      { status: 'resolved', date: new Date(Date.now() - 864000000).toISOString() },
      { status: 'closed', date: new Date(Date.now() - 864000000).toISOString() },
    ],
  },
]

let nextId = 100

export const ticketService = {
  async getTickets(filters = {}) {
    await delay()
    let filtered = [...mockTickets]
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter((t) => t.status === filters.status)
    }
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter((t) => t.category === filters.category)
    }
    if (filters.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.trackingId.toLowerCase().includes(search)
      )
    }
    return { tickets: filtered, total: filtered.length }
  },

  async getTicketById(id) {
    await delay(300)
    const ticket = mockTickets.find((t) => t.id === id)
    if (!ticket) throw new Error('Ticket not found')
    return ticket
  },

  async createTicket(data) {
    await delay(1000)
    nextId += 1
    const ticket = {
      id: nextId,
      trackingId: generateTrackingId(nextId),
      ...data,
      status: TICKET_STATUS.PENDING,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      timeline: [{ status: 'submitted', date: new Date().toISOString() }],
    }
    return { ticket, trackingId: ticket.trackingId }
  },

  async addComment(ticketId, comment) {
    await delay(400)
    return {
      id: Date.now(),
      author: 'Chidinma Okafor',
      message: comment,
      createdAt: new Date().toISOString(),
      isAdmin: false,
    }
  },

  async reopenTicket(ticketId) {
    await delay(500)
    return { success: true, message: 'Ticket has been reopened.' }
  },
}
