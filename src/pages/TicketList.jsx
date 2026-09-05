/**
 * TicketList — Student Ticket Tracking
 * Filterable list, status badges, search, navigation to detail
 * Dark mode support via shared useDarkMode hook
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TICKET_STATUS_CONFIG } from '../utils/constants'
import { formatRelativeTime } from '../utils/formatters'
import { useDarkMode } from '../hooks/useDarkMode'

const MOCK_TICKETS = [
  { id: 42, trackingId: 'UNILAG-00042', title: 'Broken AC in Lecture Hall B', status: 'under_review', category: 'Infrastructure', urgency: 'high', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 38, trackingId: 'UNILAG-00038', title: 'Water supply outage in Hall 4', status: 'resolved', category: 'Facilities', urgency: 'medium', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 35, trackingId: 'UNILAG-00035', title: 'Slow internet on student portal', status: 'pending', category: 'Admin', urgency: 'low', createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 33, trackingId: 'UNILAG-00033', title: 'Broken projector in CS Lab 3', status: 'escalated', category: 'Infrastructure', urgency: 'high', createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: 30, trackingId: 'UNILAG-00030', title: 'Exam timetable conflict for 300L', status: 'resolved', category: 'Academic', urgency: 'high', createdAt: new Date(Date.now() - 432000000).toISOString() },
  { id: 28, trackingId: 'UNILAG-00028', title: 'Request for extended library hours', status: 'resolved', category: 'General', urgency: 'low', createdAt: new Date(Date.now() - 604800000).toISOString() },
  { id: 25, trackingId: 'UNILAG-00025', title: 'Fee payment discrepancy for 200L', status: 'under_review', category: 'Admin', urgency: 'medium', createdAt: new Date(Date.now() - 691200000).toISOString() },
]

const STATUS_FILTERS = ['all', 'pending', 'under_review', 'resolved', 'escalated']
const CATEGORY_FILTERS = ['all', 'Academic', 'Infrastructure', 'Admin', 'General']

export default function TicketList() {
  const navigate = useNavigate()
  const dark = useDarkMode()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const filtered = MOCK_TICKETS.filter(t => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.trackingId.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    const matchCategory = categoryFilter === 'all' || t.category === categoryFilter
    return matchSearch && matchStatus && matchCategory
  })

  const text1 = dark ? 'text-white' : 'text-ink'
  const text2 = dark ? 'text-slate-300' : 'text-ink/40'
  const text3 = dark ? 'text-slate-400' : 'text-ink/25'
  const card = dark ? 'bg-[#1e293b]' : 'bg-paper'
  const cardBorder = dark ? 'border-white/6' : 'border-mist/50'
  const hoverBg = dark ? 'hover:border-white/10 hover:bg-white/5' : 'hover:border-maroon/15 hover:shadow-[0_4px_16px_rgba(128,0,0,0.04)]'
  const inputBg = dark ? 'bg-[#0f172a] border-white/8 text-white placeholder:text-slate-500' : 'bg-white border-mist/80 text-ink placeholder:text-ink/25'
  const filterActive = dark ? 'bg-[#1266f1] text-white' : 'bg-maroon text-white'
  const filterInactive = dark ? 'bg-[#1e293b] border border-white/8 text-slate-400' : 'bg-paper border border-mist/50 text-ink/40'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-[1.8rem] font-bold ${text1} tracking-tight`}>My Tickets</h1>
        <p className={`text-[14px] ${text2} mt-1`}>Track all your submitted feedback</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${dark ? 'text-slate-500' : 'text-ink/20'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title or tracking ID..."
          className={`w-full pl-11 pr-4 py-3 text-[14px] rounded-xl border ${inputBg} focus:outline-none focus:ring-2 focus:ring-maroon/15 focus:border-maroon/40 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]`}
        />
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {STATUS_FILTERS.map(s => {
          const config = s === 'all' ? null : TICKET_STATUS_CONFIG[s]
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all ${
                statusFilter === s ? filterActive : filterInactive
              }`}
            >
              {s === 'all' ? 'All' : config?.label || s}
            </button>
          )
        })}
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {CATEGORY_FILTERS.map(c => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all ${
              categoryFilter === c
                ? dark ? 'bg-[#ffa900]/20 text-[#ffa900] border border-[#ffa900]/30' : 'bg-gold/10 text-gold-dark border border-gold/20'
                : filterInactive
            }`}
          >
            {c === 'all' ? 'All Categories' : c}
          </button>
        ))}
      </div>

      {/* Ticket List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className={`text-[14px] ${text2}`}>No tickets match your filters</p>
          </div>
        ) : (
          filtered.map(ticket => {
            const status = TICKET_STATUS_CONFIG[ticket.status]
            return (
              <button
                key={ticket.id}
                onClick={() => navigate(`/student/ticket/${ticket.id}`)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl ${card} border ${cardBorder} ${hoverBg} transition-all text-left group`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-mono ${text3}`}>{ticket.trackingId}</span>
                    <span className={`text-[10px] ${text3}/15`}>·</span>
                    <span className={`text-[10px] ${text3}`}>{ticket.category}</span>
                  </div>
                  <p className={`text-[14px] font-semibold ${text1} truncate group-hover:text-[#1266f1] transition-colors`}>{ticket.title}</p>
                  <p className={`text-[11px] ${text3} mt-1`}>{formatRelativeTime(ticket.createdAt)}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.08em]"
                    style={{ color: status?.color, backgroundColor: status?.bgColor }}
                  >
                    {status?.label}
                  </span>
                  {ticket.urgency === 'high' && (
                    <span className="text-[9px] font-bold text-[#D32F2F] uppercase tracking-wider">Urgent</span>
                  )}
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
