/**
 * AdminComplaints — Complaint Management for Admins
 * Filterable table, status updates, bulk actions
 */
import { useState } from 'react'
import { TICKET_STATUS_CONFIG } from '../utils/constants'
import { formatRelativeTime } from '../utils/formatters'

const MOCK_COMPLAINTS = [
  { id: 42, trackingId: 'UNILAG-00042', title: 'Broken AC in Lecture Hall B', status: 'under_review', category: 'Infrastructure', subcategory: 'Lecture Hall', urgency: 'high', dept: 'Works & Maintenance', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 41, trackingId: 'UNILAG-00041', title: 'Portal crashing during registration', status: 'escalated', category: 'Admin', subcategory: 'Portal Errors', urgency: 'high', dept: 'ICT Centre', createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 40, trackingId: 'UNILAG-00040', title: 'Poor lighting in Hostel 3 corridor', status: 'pending', category: 'Infrastructure', subcategory: 'Electricity', urgency: 'medium', dept: 'Works & Maintenance', createdAt: new Date(Date.now() - 14400000).toISOString() },
  { id: 39, trackingId: 'UNILAG-00039', title: 'Lecturer frequently cancels classes', status: 'under_review', category: 'Academic', subcategory: 'Lecture Quality', urgency: 'medium', dept: 'Faculty of Science', createdAt: new Date(Date.now() - 28800000).toISOString() },
  { id: 38, trackingId: 'UNILAG-00038', title: 'Water supply outage in Hall 4', status: 'resolved', category: 'Infrastructure', subcategory: 'Water Supply', urgency: 'high', dept: 'Works & Maintenance', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 37, trackingId: 'UNILAG-00037', title: 'Fee payment discrepancy for 200L', status: 'under_review', category: 'Admin', subcategory: 'Fee Payment', urgency: 'medium', dept: 'Bursary', createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 36, trackingId: 'UNILAG-00036', title: 'Security concern near faculty parking', status: 'escalated', category: 'Welfare', subcategory: 'Security', urgency: 'high', dept: 'Security Unit', createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: 35, trackingId: 'UNILAG-00035', title: 'Slow internet on student portal', status: 'pending', category: 'Admin', subcategory: 'Portal Errors', urgency: 'low', dept: 'ICT Centre', createdAt: new Date(Date.now() - 345600000).toISOString() },
]

const CATEGORIES = ['all', 'Academic', 'Infrastructure', 'Admin', 'Welfare', 'General']
const STATUSES = ['all', 'pending', 'under_review', 'resolved', 'escalated']

export default function AdminComplaints() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const filtered = MOCK_COMPLAINTS.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.trackingId.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    const matchCategory = categoryFilter === 'all' || c.category === categoryFilter
    return matchSearch && matchStatus && matchCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold text-gold-dark uppercase tracking-[0.15em] mb-1">Complaints</p>
          <h1 className="text-[1.8rem] lg:text-[2.2rem] font-bold text-ink leading-tight tracking-tight">Management</h1>
        </div>
        <div className="text-[12px] text-ink/30">
          {filtered.length} complaint{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Pending', count: MOCK_COMPLAINTS.filter(c => c.status === 'pending').length, color: '#ED6C02' },
          { label: 'Under Review', count: MOCK_COMPLAINTS.filter(c => c.status === 'under_review').length, color: '#1976D2' },
          { label: 'Escalated', count: MOCK_COMPLAINTS.filter(c => c.status === 'escalated').length, color: '#D32F2F' },
          { label: 'Resolved', count: MOCK_COMPLAINTS.filter(c => c.status === 'resolved').length, color: '#2E7D32' },
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
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.08em]"
                        style={{ color: status?.color, backgroundColor: status?.bgColor }}
                      >
                        {status?.label}
                      </span>
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
                      <button className="text-[11px] text-maroon font-semibold hover:text-maroon-dark transition-colors">
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
