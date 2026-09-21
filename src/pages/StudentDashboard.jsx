/**
 * StudentDashboard — Modern clean design, full-width, dark mode support
 * Pulls submitted complaints from backend API
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatRelativeTime } from '../utils/formatters'
import { TICKET_STATUS_CONFIG } from '../utils/constants'
import { useDarkMode } from '../hooks/useDarkMode'
import StatusPill from '../components/common/StatusPill/StatusPill'
import { useAuth } from '../hooks/useAuth'
import { ticketService } from '../services/ticketService'
import { getCoursesForDepartment } from '../utils/courses'

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const dark = useDarkMode()
  
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true)
      try {
        const response = await ticketService.getTickets()
        setTickets(response.tickets || response.data || [])
      } catch (err) {
        console.error('Failed to load tickets', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTickets()
  }, [])

  const userName = user?.name ? user.name.split(' ')[0] : 'Student'
  
  const activeCount = tickets.filter(t => ['pending', 'under_review', 'escalated'].includes(t.status)).length
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length
  const totalCount = tickets.length
  
  const stats = [
    { label: 'Active Tickets', value: loading ? '-' : activeCount, color: '#1266f1', gradient: 'from-[#1266f1] to-[#0e52c1]', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { label: 'Resolved Tickets', value: loading ? '-' : resolvedCount, color: '#00b74a', gradient: 'from-[#00b74a] to-[#009639]', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { label: 'Evaluations Due', value: '-', color: '#f93154', gradient: 'from-[#f93154] to-[#d42843]', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    )},
    { label: 'Total Submissions', value: loading ? '-' : totalCount, color: '#ffa900', gradient: 'from-[#ffa900] to-[#cc8800]', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    )},
  ]

  const recentTickets = tickets.slice(0, 3)

  const text1 = dark ? 'text-white' : 'text-[#262626]'
  const text2 = dark ? 'text-white/60' : 'text-[#4f4f4f]'
  const text3 = dark ? 'text-white/40' : 'text-[#9fa6b2]'
  const card = dark ? 'bg-[#1e293b]' : 'bg-white'
  const cardBorder = dark ? 'border-white/10' : 'border-[#E4E8EE]'

  return (
    <div className="w-full h-full p-4 lg:p-8 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 lg:mb-12">
        <div className="max-w-xl">
          <p className={`text-[12px] font-bold uppercase tracking-[0.15em] mb-2 ${dark ? 'text-gold-light' : 'text-gold-dark'}`}>
            Welcome back
          </p>
          <h1 className={`text-[2rem] lg:text-[2.4rem] font-bold ${text1} leading-tight tracking-tight`}>
            Hello, {userName}
          </h1>
          <p className={`text-[15px] ${text2} mt-2 leading-relaxed`}>
            Track your feedback, complete pending course evaluations, and stay updated on campus issues.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/student/feedback')}
            className="flex-1 lg:flex-none px-6 py-3 rounded-xl bg-[#1266f1] text-white text-[14px] font-semibold shadow-[0_4px_14px_rgba(18,102,241,0.25)] hover:bg-[#0e52c1] hover:shadow-[0_6px_20px_rgba(18,102,241,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            New Complaint
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8 lg:mb-12">
        {stats.map((stat, i) => (
          <div key={i} className={`relative overflow-hidden rounded-2xl ${card} border ${cardBorder} p-5 lg:p-6 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-[0.03] rounded-bl-[100px]`} />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </div>
            </div>
            <p className={`text-[11px] font-semibold uppercase tracking-wider ${text3} mb-1`}>{stat.label}</p>
            <p className={`text-[2rem] font-bold leading-none ${text1}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        <div className="xl:col-span-2 space-y-6 lg:space-y-8">
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-[16px] font-bold ${text1}`}>Recent Complaints</h2>
              <button
                onClick={() => navigate('/student/tickets')}
                className={`text-[12px] font-semibold text-[#1266f1] hover:underline`}
              >
                View all
              </button>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="p-4 text-center text-sm text-ink/40">Loading tickets...</div>
              ) : recentTickets.length === 0 ? (
                <div className="p-4 text-center text-sm text-ink/40">No tickets found.</div>
              ) : (
                recentTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => navigate(`/student/ticket/${ticket.id}`)}
                    className={`group p-4 lg:p-5 rounded-2xl border ${cardBorder} hover:border-[#1266f1]/20 hover:shadow-[0_4px_12px_rgba(18,102,241,0.05)] transition-all cursor-pointer`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-[14px] font-bold ${text1} truncate group-hover:text-[#1266f1] transition-colors`}>{ticket.title}</h4>
                        <div className={`flex items-center gap-2 mt-1.5 text-[11px] font-mono ${text3}`}>
                          <span>{ticket.trackingId}</span>
                          <span>•</span>
                          <span>{ticket.category}</span>
                        </div>
                      </div>
                      <StatusPill status={TICKET_STATUS_CONFIG[ticket.status]} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
