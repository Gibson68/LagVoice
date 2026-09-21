/**
 * TicketList — Student Ticket Tracking
 * Real submissions from the feedback form appear at the top (newest first),
 * followed by demo tickets. Filterable list, status badges, search.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TICKET_STATUS_CONFIG } from '../utils/constants'
import { formatRelativeTime } from '../utils/formatters'
import { useDarkMode } from '../hooks/useDarkMode'
import StatusPill from '../components/common/StatusPill/StatusPill'
import { STORAGE_KEYS, readArray } from '../utils/storage'

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

/** Feedback form stores status 'submitted' — normalise it to a status the UI knows. */
const normaliseStatus = (status) => (status === 'submitted' ? 'pending' : status || 'pending')

export default function TicketList() {
  const navigate = useNavigate()
  const dark = useDarkMode()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [submitted] = useState(() =>
    readArray(STORAGE_KEYS.complaints)
      .filter((c) => c && typeof c === 'object' && c.id)
      .map((c) => ({
        id: c.id,
        trackingId: c.trackingId || `UNILAG-${c.id}`,
        title: c.title || 'Untitled feedback',
        status: normaliseStatus(c.status),
        category: c.category || 'General',
        categoryId: c.categoryId,
        urgency: c.urgency || 'medium',
        createdAt: c.createdAt || new Date().toISOString(),
        mine: true,
      })),
  )

  const tickets = [...submitted, ...MOCK_TICKETS].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  )

  const filtered = tickets.filter(t => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.trackingId.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    const matchCategory = categoryFilter === 'all' || t.category === categoryFilter
    return matchSearch && matchStatus && matchCategory
  })

  const text1 = dark ? 'text-white' : 'text-[#262626]'
  const text2 = dark ? 'text-slate-300' : 'text-[#4f4f4f]'
  const text3 = dark ? 'text-slate-400' : 'text-[#9fa6b2]'
  const card = dark ? 'bg-[#1e293b]' : 'bg-white'
  const cardBorder = dark ? 'border-white/10' : 'border-[#E4E8EE]'
  const hoverBg = dark ? 'hover:border-white/20 hover:bg-white/5' : 'hover:border-[#1266f1]/20 hover:shadow-[0_4px_16px_rgba(18,102,241,0.06)]'
  const inputBg = dark ? 'bg-[#0f172a] border-white/10 text-white placeholder:text-slate-500' : 'bg-white border-[#E4E8EE] text-[#262626] placeholder:text-[#9fa6b2]'
  const filterActive = 'bg-[#1266f1] text-white'
  const filterInactive = dark ? 'bg-[#1e293b] border border-white/10 text-slate-400' : 'bg-white border border-[#E4E8EE] text-[#4f4f4f]'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className={`text-[1.8rem] font-bold ${text1} tracking-tight`}>My Tickets</h1>
          <p className={`text-[14px] ${text2} mt-1`}>Track all your submitted feedback</p>
        </div>
        <button
          onClick={() => navigate('/student/feedback')}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-[#1266f1] text-white text-[13px] font-semibold shadow-[0_2px_8px_rgba(18,102,241,0.25)] hover:bg-[#0e52c1] transition-all"
        >
          + New
        </button>
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
          className={`w-full pl-11 pr-4 py-3 text-[14px] rounded-xl border ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#1266f1]/20 focus:border-[#1266f1]/40 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]`}
        />
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
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
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        {CATEGORY_FILTERS.map(c => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all ${
              categoryFilter === c
                ? 'bg-[#ffa900]/15 text-[#cc8800] border border-[#ffa900]/30 dark:text-[#ffa900]'
                : filterInactive
            }`}
          >
            {c === 'all' ? 'All categories' : c}
          </button>
        ))}
      </div>

      {/* Ticket List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className={`text-center py-12 ${card} rounded-2xl border ${cardBorder}`}>
            <div className={`w-12 h-12 mx-auto rounded-full ${dark ? 'bg-white/5' : 'bg-[#F5F7FA]'} flex items-center justify-center mb-4`}>
              <svg className={`w-6 h-6 ${text3}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className={`text-[14px] font-semibold ${text1} mb-1`}>
              {tickets.length === 0 ? 'No tickets yet' : 'No tickets match your filters'}
            </p>
            {tickets.length === 0 ? (
              <>
                <p className={`text-[13px] ${text3} mb-4`}>Submit your first feedback and it will appear here.</p>
                <button
                  onClick={() => navigate('/student/feedback')}
                  className="px-5 py-2.5 rounded-xl bg-[#1266f1] text-white text-[13px] font-semibold hover:bg-[#0e52c1] transition-all"
                >
                  Submit Feedback
                </button>
              </>
            ) : (
              <button
                onClick={() => { setSearch(''); setStatusFilter('all'); setCategoryFilter('all') }}
                className={`text-[13px] font-semibold text-[#1266f1] hover:underline`}
              >
                Clear filters
              </button>
            )}
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
                    <span className={`text-[10px] ${dark ? 'text-slate-600' : 'text-[#9fa6b2]/40'}`}>·</span>
                    <span className={`text-[10px] ${text3}`}>{ticket.category}</span>
                    {ticket.mine && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#00b74a]/10 text-[#00b74a] uppercase tracking-wider">You</span>
                    )}
                  </div>
                  <p className={`text-[14px] font-semibold ${text1} truncate group-hover:text-[#1266f1] transition-colors`}>{ticket.title}</p>
                  <p className={`text-[11px] ${text3} mt-1`}>{formatRelativeTime(ticket.createdAt)}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <StatusPill status={status} />
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
