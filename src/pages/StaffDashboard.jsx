/**
 * AdminComplaints — Complaint Management for Admins
 * Filterable table, status updates, bulk actions
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TICKET_STATUS_CONFIG } from '../utils/constants'
import { ticketService } from '../services/ticketService'
import { formatRelativeTime } from '../utils/formatters'

const CATEGORIES = ['all', 'Academic', 'Infrastructure', 'Admin', 'Welfare', 'General']
const STATUSES = ['all', 'pending', 'under_review', 'resolved', 'escalated']

export default function StaffDashboard() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  const handleStatusChange = async (id, newStatus) => {
    try {
      await ticketService.updateStatus(id, newStatus)
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t))
    } catch (e) {
      alert('Failed to update status')
    }
  }

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await ticketService.getTickets()
        setTickets(data.tickets || [])
      } catch (e) {
        console.error('Failed to load tickets', e)
      } finally {
        setLoading(false)
      }
    }
    loadTickets()
  }, [])

  const filtered = tickets.filter(c => {
    const trackingIdStr = c.trackingId || `UNILAG-TKT-${c.id}`
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || trackingIdStr.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    const matchCategory = categoryFilter === 'all' || c.category === categoryFilter
    return matchSearch && matchStatus && matchCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold text-gold-dark uppercase tracking-[0.15em] mb-1">Quality Assurance</p>
          <h1 className="text-[1.8rem] lg:text-[2.2rem] font-bold text-ink leading-tight tracking-tight">Helpdesk</h1>
        </div>
        <div className="text-[12px] text-ink/30">
          {filtered.length} ticket{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Pending', count: tickets.filter(c => c.status === 'pending').length, color: '#ED6C02' },
          { label: 'Under Review', count: tickets.filter(c => c.status === 'under_review').length, color: '#1976D2' },
          { label: 'Escalated', count: tickets.filter(c => c.status === 'escalated').length, color: '#D32F2F' },
          { label: 'Resolved', count: tickets.filter(c => c.status === 'resolved').length, color: '#2E7D32' },
        ].map(s => (
          <div key={s.label} className="bg-paper rounded-xl border border-mist/50 p-3">
            <p className="text-[10px] text-ink/30 uppercase tracking-[0.12em] font-semibold">{s.label}</p>
            <p className="text-[1.5rem] font-bold font-mono mt-1" style={{ color: s.color }}>{s.count}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search complaints..."
            className="w-full pl-10 pr-4 py-2.5 text-[13px] rounded-xl bg-white border border-mist/80 text-ink placeholder:text-ink/25 focus:outline-none focus:ring-2 focus:ring-maroon/15 focus:border-maroon/40 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 text-[13px] rounded-xl bg-white border border-mist/80 text-ink focus:outline-none focus:ring-2 focus:ring-maroon/15 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20fill%3D%22%23800000%22%20d%3D%22M4.5%206l3.5%204%203.5-4z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center]"
        >
          {STATUSES.map(s => <option key={s} value={s}>{s === 'all' ? 'All Status' : TICKET_STATUS_CONFIG[s]?.label || s}</option>)}
        </select>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-2.5 text-[13px] rounded-xl bg-white border border-mist/80 text-ink focus:outline-none focus:ring-2 focus:ring-maroon/15 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20fill%3D%22%23800000%22%20d%3D%22M4.5%206l3.5%204%203.5-4z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center]"
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
        </select>
      </div>

      {/* Complaints Table */}
      <div className="bg-paper rounded-2xl border border-mist/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-mist/30">
                <th className="text-left text-[10px] font-bold text-ink/30 uppercase tracking-[0.12em] px-5 py-3">Ticket</th>
                <th className="text-left text-[10px] font-bold text-ink/30 uppercase tracking-[0.12em] px-5 py-3">Category</th>
                <th className="text-left text-[10px] font-bold text-ink/30 uppercase tracking-[0.12em] px-5 py-3">Department</th>
                <th className="text-left text-[10px] font-bold text-ink/30 uppercase tracking-[0.12em] px-5 py-3">Status</th>
                <th className="text-left text-[10px] font-bold text-ink/30 uppercase tracking-[0.12em] px-5 py-3">Urgency</th>
                <th className="text-left text-[10px] font-bold text-ink/30 uppercase tracking-[0.12em] px-5 py-3">Time</th>
                <th className="text-right text-[10px] font-bold text-ink/30 uppercase tracking-[0.12em] px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const status = TICKET_STATUS_CONFIG[c.status]
                return (
                  <tr key={c.id} className="border-b border-mist/15 last:border-0 hover:bg-cream/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-semibold text-ink truncate max-w-[200px]">{c.title}</p>
                      <p className="text-[10px] text-ink/25 font-mono mt-0.5">{c.trackingId}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[12px] text-ink/50">{c.category}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[12px] text-ink/50">{c.dept}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusChange(c.id, e.target.value)}
                        className="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-[0.08em] border border-mist outline-none cursor-pointer"
                        style={{ color: status?.color, backgroundColor: status?.bgColor }}
                      >
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="escalated">Escalated</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        c.urgency === 'high' ? 'text-escalated' : c.urgency === 'medium' ? 'text-gold-dark' : 'text-ink/30'
                      }`}>
                        {c.urgency}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[11px] text-ink/25 font-mono">{formatRelativeTime(c.createdAt)}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => navigate(`/staff/ticket/${c.id}`)} className="text-[11px] text-maroon font-semibold hover:text-maroon-dark transition-colors">
                        View
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
