/**
 * StudentDashboard — Modern clean design, full-width, dark mode support
 * Pulls submitted complaints from localStorage, shows in history
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatRelativeTime } from '../utils/formatters'
import { TICKET_STATUS_CONFIG } from '../utils/constants'
import { useDarkMode } from '../hooks/useDarkMode'

const defaultStats = [
  { label: 'Active', value: 3, color: '#1266f1', gradient: 'from-[#1266f1] to-[#0e52c1]', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  )},
  { label: 'Resolved', value: 8, color: '#00b74a', gradient: 'from-[#00b74a] to-[#009639]', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  )},
  { label: 'Evaluations Due', value: 2, color: '#f93154', gradient: 'from-[#f93154] to-[#d42843]', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
  )},
  { label: 'Total Submissions', value: 13, color: '#ffa900', gradient: 'from-[#ffa900] to-[#cc8800]', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
  )},
]

const defaultActivity = [
  { id: 1, text: 'Your complaint #UNILAG-00042 has been updated', time: new Date(Date.now() - 3600000).toISOString(), color: '#ffa900' },
  { id: 2, text: 'New poll: Campus Security Survey', time: new Date(Date.now() - 7200000).toISOString(), color: '#1266f1' },
  { id: 3, text: 'Evaluation period ends in 3 days', time: new Date(Date.now() - 14400000).toISOString(), color: '#b23cfd' },
  { id: 4, text: 'Complaint #UNILAG-00038 resolved', time: new Date(Date.now() - 86400000).toISOString(), color: '#00b74a' },
]

const defaultTickets = [
  { id: 42, trackingId: 'UNILAG-00042', title: 'Broken AC in Lecture Hall B', status: 'under_review', category: 'Infrastructure' },
  { id: 38, trackingId: 'UNILAG-00038', title: 'Water supply outage in Hall 4', status: 'resolved', category: 'Facilities' },
  { id: 35, trackingId: 'UNILAG-00035', title: 'Slow internet on student portal', status: 'pending', category: 'Admin' },
]

export default function StudentDashboard() {
  const navigate = useNavigate()
  const [submittedComplaints, setSubmittedComplaints] = useState([])
  const [userName, setUserName] = useState('Student')
  const dark = useDarkMode()

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lagvoice_user')
      if (stored) {
        const u = JSON.parse(stored)
        if (u.name) setUserName(u.name.split(' ')[0])
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lagvoice_complaints')
      if (stored) {
        const complaints = JSON.parse(stored)
        setSubmittedComplaints(complaints.map(c => ({
          id: c.id, trackingId: c.trackingId, title: c.title,
          status: c.status || 'pending', category: c.category, createdAt: c.createdAt,
        })))
      }
    } catch {}
  }, [])

  const allTickets = [...submittedComplaints, ...defaultTickets]

  const cardBg = dark ? 'bg-[#1e293b]' : 'bg-white'
  const cardBorder = dark ? 'border-white/5' : 'border-[#E4E8EE]'
  const textPrimary = dark ? 'text-white' : 'text-[#262626]'
  const textSecondary = dark ? 'text-white/60' : 'text-[#4f4f4f]'
  const textMuted = dark ? 'text-white/30' : 'text-[#9fa6b2]'
  const hoverBg = dark ? 'hover:bg-white/5' : 'hover:bg-[#F5F7FA]'
  const dividerColor = dark ? 'border-white/5' : 'border-[#E4E8EE]/30'

  return (
    <div className="space-y-7 opacity-0 animate-slide-in-up">

      {/* ═══ Welcome Banner ═══ */}
      <div className="relative rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1266f1 0%, #0e52c1 50%, #0a3d94 100%)' }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-[#ffa900] rounded-full blur-[60px]" />
          <div className="absolute -bottom-4 left-1/3 w-32 h-32 bg-white rounded-full blur-[50px]" />
        </div>
        <div className="relative z-10 p-7 lg:p-9 flex items-center justify-between">
          <div>
            <p className="text-[13px] text-white/50 font-medium uppercase tracking-wider mb-1">Student Portal</p>
            <h1 className="text-[1.7rem] lg:text-[2.2rem] font-bold text-white leading-tight tracking-tight">
              Good morning, {userName}
            </h1>
            <p className="text-[14px] text-white/45 mt-2">Here is what is happening with your feedback</p>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <div className="w-28 h-20 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <p className="text-[1.6rem] font-bold text-white font-mono leading-none">3</p>
                <p className="text-[9px] text-white/50 uppercase tracking-wider mt-1">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Stats Row ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {defaultStats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl p-5 group hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br ${stat.gradient} text-white shadow-lg relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <p className="text-[13px] font-semibold text-white/70 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-[2rem] font-bold leading-none tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Share Your Voice CTA ═══ */}
      <button
        onClick={() => navigate('/student/feedback')}
        className="w-full bg-gradient-to-r from-[#ffa900] to-[#cc8800] text-white rounded-2xl p-6 flex items-center gap-5
          hover:from-[#cc8800] hover:to-[#a67000] transition-all duration-300 group relative overflow-hidden shadow-lg shadow-[#ffa900]/15"
      >
        <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/15 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <div className="relative z-10 text-left flex-1">
          <p className="font-bold text-[16px]">Share Your Voice</p>
          <p className="text-white/70 text-[14px] mt-0.5">Submit feedback or report an issue, anonymously if you choose</p>
        </div>
        <svg className="relative z-10 w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ═══ Two Column: Activity + Tickets ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className={`${cardBg} rounded-2xl border ${cardBorder} overflow-hidden`}>
          <div className={`flex items-center justify-between px-6 py-5 border-b ${cardBorder}/50`}>
            <h2 className={`text-[17px] font-bold ${textPrimary}`}>Recent Activity</h2>
            <button className={`text-[11px] text-[#1266f1] hover:text-[#0e52c1] font-semibold transition-colors`}>
              View All
            </button>
          </div>
          <div>
            {defaultActivity.map((a) => (
              <div key={a.id} className={`flex items-start gap-3.5 px-6 py-4 border-b ${dividerColor} last:border-0 ${hoverBg} transition-colors`}>
                <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: a.color }} />
                <div className="flex-1 min-w-0">
                  <p className={`text-[14px] ${textSecondary} leading-relaxed`}>{a.text}</p>
                  <p className={`text-[11px] ${textMuted} mt-0.5 font-mono`}>{formatRelativeTime(a.time)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Tickets */}
        <div className={`${cardBg} rounded-2xl border ${cardBorder} overflow-hidden`}>
          <div className={`flex items-center justify-between px-6 py-5 border-b ${cardBorder}/50`}>
            <h2 className={`text-[17px] font-bold ${textPrimary}`}>
              My Tickets
              {submittedComplaints.length > 0 && (
                <span className="ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#1266f1]/10 text-[#1266f1]">
                  {submittedComplaints.length} new
                </span>
              )}
            </h2>
            <button onClick={() => navigate('/student/tickets')} className="text-[11px] text-[#1266f1] hover:text-[#0e52c1] font-semibold transition-colors">
              See All
            </button>
          </div>
          <div>
            {allTickets.map((ticket) => {
              const status = TICKET_STATUS_CONFIG[ticket.status]
              const isSubmitted = submittedComplaints.some(c => c.trackingId === ticket.trackingId)
              return (
                <button
                  key={ticket.id}
                  onClick={() => navigate(`/student/ticket/${ticket.id}`)}
                  className={`w-full flex items-center gap-4 px-6 py-4 border-b ${dividerColor} last:border-0 ${hoverBg} transition-colors text-left group`}
                >
                  {isSubmitted && (
                    <span className="w-2 h-2 rounded-full bg-[#1266f1] shrink-0 animate-pulse" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-[14px] font-semibold ${textPrimary} truncate group-hover:text-[#1266f1] transition-colors`}>{ticket.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] ${textMuted} font-mono`}>{ticket.trackingId}</span>
                      <span className={`text-[10px] ${textMuted}/40`}>·</span>
                      <span className={`text-[10px] ${textMuted}`}>{ticket.category}</span>
                      {ticket.createdAt && (
                        <>
                          <span className={`text-[10px] ${textMuted}/40`}>·</span>
                          <span className={`text-[10px] ${textMuted}`}>{formatRelativeTime(ticket.createdAt)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.06em]"
                    style={{ color: status?.color, backgroundColor: status?.bgColor }}
                  >
                    {status?.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ═══ Active Polls ═══ */}
      <div className={`${cardBg} rounded-2xl border ${cardBorder} overflow-hidden`}>
        <div className={`flex items-center justify-between px-6 py-5 border-b ${cardBorder}/50`}>
          <h2 className={`text-[17px] font-bold ${textPrimary}`}>
            Active Polls
            <span className="ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#b23cfd]/10 text-[#b23cfd]">
              2 new
            </span>
          </h2>
          <button onClick={() => navigate('/student/polls')} className="text-[11px] text-[#1266f1] hover:text-[#0e52c1] font-semibold transition-colors">
            View All
          </button>
        </div>
        <div className={`divide-y ${dividerColor}`}>
          {[
            { id: 1, title: 'Campus Security Survey', desc: 'Rate your sense of safety on campus', responses: 342, deadline: '2026-09-15' },
            { id: 2, title: 'Proposed Fee Structure Change', desc: 'Student sentiment on the proposed fee adjustment', responses: 189, deadline: '2026-09-20' },
          ].map(poll => (
            <button
              key={poll.id}
              onClick={() => navigate('/student/polls')}
              className={`w-full flex items-center gap-4 px-6 py-4 ${hoverBg} transition-colors text-left group`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#b23cfd]/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#b23cfd]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[14px] font-semibold ${textPrimary} truncate group-hover:text-[#1266f1] transition-colors`}>{poll.title}</p>
                <p className={`text-[11px] ${textMuted} mt-0.5`}>{poll.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#00b74a]/10 text-[#00b74a]">Vote Now</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
