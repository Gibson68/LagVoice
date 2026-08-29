/**
 * TicketDetail — Full ticket view with intelligent tracking pipeline
 * Complaint lifecycle adapts based on category and current stage
 */
import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TICKET_STATUS_CONFIG } from '../utils/constants'
import { formatRelativeTime } from '../utils/formatters'

// ── Intelligent Pipeline Steps ──
// The full pipeline adapts based on complaint category
const FULL_PIPELINE = [
  { key: 'submitted', label: 'Complaint Submitted', description: 'Your feedback has been received and assigned a tracking ID.' },
  { key: 'received_qa', label: 'Received by Quality Assurance', description: 'SERICOM/QA office has acknowledged your complaint.' },
  { key: 'assigned_dsa', label: 'Assigned to DSA', description: 'The complaint has been assigned to the Dean of Student Affairs for review.' },
  { key: 'dsa_reviewing', label: 'DSA Reviewing Complaint', description: 'The DSA team is reviewing the complaint details and evidence.' },
  { key: 'forwarded_dept', label: 'Forwarded to Relevant Department', description: 'The complaint has been forwarded to the department responsible for resolution.' },
  { key: 'dept_working', label: 'Department Working on Issue', description: 'The assigned department is actively working on resolving the issue.' },
  { key: 'resolution_submitted', label: 'Resolution Submitted', description: 'The department has submitted a proposed resolution for QA review.' },
  { key: 'resolved', label: 'Resolved', description: 'The issue has been resolved. You can reopen this ticket if the problem persists.' },
]

// Pipeline varies by category - some categories skip DSA and go directly to the department
const CATEGORY_PIPELINES = {
  infrastructure: FULL_PIPELINE,
  academic: [
    { key: 'submitted', label: 'Complaint Submitted', description: 'Your feedback has been received and assigned a tracking ID.' },
    { key: 'received_qa', label: 'Received by Quality Assurance', description: 'SERICOM/QA office has acknowledged your complaint.' },
    { key: 'assigned_dept', label: 'Assigned to Faculty', description: 'The complaint has been forwarded to the Faculty of the course in question.' },
    { key: 'hod_reviewing', label: 'HOD Reviewing', description: 'The Head of Department is reviewing the complaint.' },
    { key: 'dept_working', label: 'Action in Progress', description: 'The department is taking action on the reported issue.' },
    { key: 'resolution_submitted', label: 'Resolution Submitted', description: 'A proposed resolution has been submitted for QA review.' },
    { key: 'resolved', label: 'Resolved', description: 'The issue has been resolved.' },
  ],
  welfare: [
    { key: 'submitted', label: 'Complaint Submitted', description: 'Your feedback has been received and assigned a tracking ID.' },
    { key: 'received_qa', label: 'Received by Quality Assurance', description: 'SERICOM/QA office has acknowledged your complaint.' },
    { key: 'assigned_dsa', label: 'Assigned to DSA', description: 'This welfare concern has been routed directly to the Dean of Student Affairs.' },
    { key: 'dsa_reviewing', label: 'DSA Reviewing', description: 'The DSA team is reviewing your welfare concern.' },
    { key: 'intervention', label: 'Intervention in Progress', description: 'Active steps are being taken to address your welfare concern.' },
    { key: 'resolved', label: 'Resolved', description: 'The issue has been addressed.' },
  ],
  admin: [
    { key: 'submitted', label: 'Complaint Submitted', description: 'Your feedback has been received and assigned a tracking ID.' },
    { key: 'received_qa', label: 'Received by Quality Assurance', description: 'SERICOM/QA office has acknowledged your complaint.' },
    { key: 'assigned_ict', label: 'Assigned to ICT/Admin', description: 'Forwarded to the relevant administrative or ICT unit.' },
    { key: 'dept_working', label: 'Working on Issue', description: 'The team is actively working on the administrative issue.' },
    { key: 'resolution_submitted', label: 'Resolution Submitted', description: 'A proposed resolution has been submitted for QA review.' },
    { key: 'resolved', label: 'Resolved', description: 'The issue has been resolved.' },
  ],
  general: [
    { key: 'submitted', label: 'Complaint Submitted', description: 'Your feedback has been received and assigned a tracking ID.' },
    { key: 'received_qa', label: 'Received by Quality Assurance', description: 'SERICOM/QA office has acknowledged your feedback.' },
    { key: 'under_review', label: 'Under Review', description: 'Your feedback is being reviewed by the QA team.' },
    { key: 'resolved', label: 'Acknowledged', description: 'Your feedback has been reviewed and acknowledged.' },
  ],
}

// Map timeline steps to status keys for progress calculation
function getProgressPercent(currentStatus, pipeline) {
  const idx = pipeline.findIndex(s => s.key === currentStatus)
  if (idx === -1) return 0
  return Math.round(((idx + 1) / pipeline.length) * 100)
}

// Mock ticket data - will be loaded from localStorage or fallback
const MOCK_TICKET = {
  id: 42,
  trackingId: 'UNILAG-00042',
  title: 'Broken AC in Lecture Hall B',
  description: 'The air conditioning system in Lecture Hall B has been non-functional for over a week. The room temperature makes it extremely difficult to concentrate during lectures, especially during afternoon sessions. Multiple students have complained about the heat.',
  status: 'assigned_dsa',
  category: 'Infrastructure',
  categoryId: 'infrastructure',
  subcategory: 'Lecture Hall',
  urgency: 'high',
  anonymous: true,
  location: 'Lecture Hall B, Faculty of Science',
  gpsLat: 6.5174,
  gpsLng: 3.3926,
  images: ['lecture-hall-ac.jpg'],
  createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
}

const MOCK_TIMELINE = [
  { step: 'submitted', time: new Date(Date.now() - 3600000 * 24).toISOString(), by: 'System' },
  { step: 'received_qa', time: new Date(Date.now() - 3600000 * 20).toISOString(), by: 'SERICOM Office' },
  { step: 'assigned_dsa', time: new Date(Date.now() - 3600000 * 16).toISOString(), by: 'Dr. Funke Adeyemi' },
]

const MOCK_COMMENTS = [
  { id: 1, author: 'SERICOM Office', role: 'admin', text: 'We have received your complaint and assigned it to the maintenance team. An inspection will be carried out shortly.', time: new Date(Date.now() - 3600000 * 20).toISOString() },
  { id: 2, author: 'DSA Office', role: 'admin', text: 'The complaint has been reviewed and forwarded to the Works and Maintenance department. They will conduct an on-site inspection within 48 hours.', time: new Date(Date.now() - 3600000 * 12).toISOString() },
]

function PipelineIcon({ step, isDone, isCurrent }) {
  if (isDone) {
    return (
      <div className="w-8 h-8 rounded-full bg-[#00b74a]/15 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-[#00b74a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    )
  }
  if (isCurrent) {
    return (
      <div className="w-8 h-8 rounded-full bg-[#1266f1]/15 flex items-center justify-center shrink-0 ring-4 ring-[#1266f1]/10">
        <div className="w-3 h-3 rounded-full bg-[#1266f1] animate-pulse" />
      </div>
    )
  }
  return (
    <div className="w-8 h-8 rounded-full bg-[#E4E8EE] flex items-center justify-center shrink-0">
      <div className="w-2 h-2 rounded-full bg-[#9fa6b2]/40" />
    </div>
  )
}

export default function TicketDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState(MOCK_COMMENTS)

  // Determine pipeline based on category
  const ticket = MOCK_TICKET
  const pipeline = CATEGORY_PIPELINES[ticket.categoryId] || CATEGORY_PIPELINES.infrastructure
  const currentStepIdx = pipeline.findIndex(s => s.key === ticket.status)
  const progress = getProgressPercent(ticket.status, pipeline)
  const status = TICKET_STATUS_CONFIG[ticket.status]

  const addComment = () => {
    if (!comment.trim()) return
    setComments(prev => [...prev, {
      id: Date.now(),
      author: 'Chidinma Okafor',
      role: 'student',
      text: comment,
      time: new Date().toISOString(),
    }])
    setComment('')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back */}
      <button onClick={() => navigate('/student/tickets')} className="flex items-center gap-2 text-[13px] text-[#9fa6b2] hover:text-[#262626] mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All Tickets
      </button>

      {/* Ticket Header */}
      <div className="bg-white rounded-2xl border border-[#E4E8EE] p-6 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[10px] font-mono text-[#9fa6b2]">{ticket.trackingId}</span>
            <h1 className="text-[1.3rem] font-bold text-[#262626] mt-1">{ticket.title}</h1>
          </div>
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.08em]"
            style={{ color: status?.color, backgroundColor: status?.bgColor }}
          >
            {status?.label}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[10px] text-[#9fa6b2] mb-1.5">
            <span>Progress</span>
            <span className="font-mono">{progress}%</span>
          </div>
          <div className="h-1.5 bg-[#E4E8EE] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#1266f1] to-[#00b74a] rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[12px]">
          <div className="bg-[#F5F7FA] rounded-xl p-3">
            <p className="text-[10px] text-[#9fa6b2] uppercase tracking-wider font-semibold mb-0.5">Category</p>
            <p className="text-[13px] font-semibold text-[#262626]">{ticket.category}</p>
          </div>
          <div className="bg-[#F5F7FA] rounded-xl p-3">
            <p className="text-[10px] text-[#9fa6b2] uppercase tracking-wider font-semibold mb-0.5">Subcategory</p>
            <p className="text-[13px] font-semibold text-[#262626]">{ticket.subcategory}</p>
          </div>
          <div className="bg-[#F5F7FA] rounded-xl p-3">
            <p className="text-[10px] text-[#9fa6b2] uppercase tracking-wider font-semibold mb-0.5">Location</p>
            <p className="text-[13px] font-semibold text-[#262626]">{ticket.location || 'Not specified'}</p>
          </div>
          <div className="bg-[#F5F7FA] rounded-xl p-3">
            <p className="text-[10px] text-[#9fa6b2] uppercase tracking-wider font-semibold mb-0.5">Submitted</p>
            <p className="text-[13px] font-semibold text-[#262626]">{formatRelativeTime(ticket.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* ═══ Interactive Tracking Pipeline ═══ */}
      <div className="bg-white rounded-2xl border border-[#E4E8EE] p-6 mb-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] font-bold text-[#262626]">Tracking Pipeline</h2>
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#1266f1]/10 text-[#1266f1]">
            Step {currentStepIdx + 1} of {pipeline.length}
          </span>
        </div>

        <div className="space-y-0">
          {pipeline.map((step, i) => {
            const isDone = i < currentStepIdx
            const isCurrent = i === currentStepIdx
            const isFuture = i > currentStepIdx
            const timelineEntry = MOCK_TIMELINE.find(t => t.step === step.key)

            return (
              <div key={step.key} className="flex gap-3 relative">
                {/* Vertical connector line */}
                {i < pipeline.length - 1 && (
                  <div className={`absolute left-[15px] top-[32px] w-[2px] h-[calc(100%-8px)] ${isDone ? 'bg-[#00b74a]/30' : isCurrent ? 'bg-[#1266f1]/20' : 'bg-[#E4E8EE]'}`} />
                )}

                <PipelineIcon step={step.key} isDone={isDone} isCurrent={isCurrent} />

                <div className={`flex-1 pb-5 ${isFuture ? 'opacity-40' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-[13px] font-semibold ${isCurrent ? 'text-[#1266f1]' : isDone ? 'text-[#262626]' : 'text-[#9fa6b2]'}`}>
                        {step.label}
                      </p>
                      <p className={`text-[11px] mt-0.5 leading-relaxed ${isDone || isCurrent ? 'text-[#9fa6b2]' : 'text-[#9fa6b2]/50'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {timelineEntry && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-[#9fa6b2] font-mono">{formatRelativeTime(timelineEntry.time)}</span>
                      <span className="text-[10px] text-[#9fa6b2]/40">&middot;</span>
                      <span className="text-[10px] text-[#9fa6b2]">by {timelineEntry.by}</span>
                    </div>
                  )}
                  {isCurrent && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1266f1]/10 text-[#1266f1] text-[10px] font-semibold">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1266f1] animate-pulse" />
                      In Progress
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl border border-[#E4E8EE] p-6 mb-4">
        <h2 className="text-[15px] font-bold text-[#262626] mb-3">Description</h2>
        <p className="text-[14px] text-[#4f4f4f] leading-relaxed">{ticket.description}</p>
        {ticket.gpsLat && ticket.gpsLng && (
          <div className="mt-3 flex items-center gap-2 text-[12px] text-[#9fa6b2]">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Geo-tagged: {ticket.gpsLat.toFixed(4)}, {ticket.gpsLng.toFixed(4)}</span>
          </div>
        )}
        {ticket.anonymous && (
          <div className="mt-2 flex items-center gap-2 text-[12px] text-[#1266f1]">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
            <span>Submitted anonymously</span>
          </div>
        )}
      </div>

      {/* Comments */}
      <div className="bg-white rounded-2xl border border-[#E4E8EE] p-6 mb-4">
        <h2 className="text-[15px] font-bold text-[#262626] mb-4">Comments & Updates</h2>
        <div className="space-y-4 mb-4">
          {comments.map(c => (
            <div key={c.id} className={`flex gap-3 ${c.role === 'student' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                c.role === 'admin' ? 'bg-[#1266f1]/10 text-[#1266f1]' : 'bg-[#ffa900]/10 text-[#ffa900]'
              }`}>
                {c.author.charAt(0)}
              </div>
              <div className={`max-w-[80%] ${c.role === 'student' ? 'text-right' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] font-semibold text-[#262626]">{c.author}</span>
                  <span className="text-[10px] text-[#9fa6b2] font-mono">{formatRelativeTime(c.time)}</span>
                </div>
                <div className={`text-[13px] text-[#4f4f4f] leading-relaxed rounded-xl p-3 ${
                  c.role === 'admin' ? 'bg-[#F5F7FA] text-left' : 'bg-[#1266f1]/[0.05] text-left'
                }`}>
                  {c.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Comment */}
        <div className="flex gap-2 pt-3 border-t border-[#E4E8EE]">
          <input
            value={comment}
            onChange={e => setComment(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addComment()}
            placeholder="Add a comment or follow-up..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#F5F7FA] border border-[#E4E8EE] text-[13px] text-[#262626] placeholder:text-[#9fa6b2] focus:outline-none focus:ring-2 focus:ring-[#1266f1]/15 focus:border-[#1266f1]/40 transition-all"
          />
          <button
            onClick={addComment}
            disabled={!comment.trim()}
            className="px-4 py-2.5 rounded-xl bg-[#1266f1] text-white text-[13px] font-semibold hover:bg-[#0e52c1] transition-all disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>

      {/* Actions */}
      {ticket.status === 'resolved' && (
        <button className="w-full py-3 rounded-xl border border-[#E4E8EE] text-[#4f4f4f] font-semibold text-[14px] hover:bg-[#F5F7FA] transition-all flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reopen Ticket
        </button>
      )}
    </div>
  )
}
