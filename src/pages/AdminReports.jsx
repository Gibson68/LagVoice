/**
 * AdminReports — Automated Accreditation Reporting
 * NUC reports, departmental reports, export options
 */
import { useState } from 'react'

const REPORT_TYPES = [
  { id: 'nuc', title: 'NUC Accreditation Report', description: 'Generate a formatted report for the National Universities Commission', icon: (
    <svg className="w-5 h-5 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
  )},
  { id: 'institutional', title: 'Institutional Self-Study', description: 'Comprehensive internal quality review report', icon: (
    <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
  )},
  { id: 'departmental', title: 'Departmental Review', description: 'Performance report for a specific department', icon: (
    <svg className="w-5 h-5 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  )},
  { id: 'compliance', title: 'QA Compliance Report', description: 'Quality assurance compliance status and gaps', icon: (
    <svg className="w-5 h-5 text-resolved" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
  )},
]

const MOCK_DEPARTMENTS = [
  { name: 'Computer Science', complaints: 23, resolved: 18, satisfaction: 82 },
  { name: 'Mathematics', complaints: 15, resolved: 12, satisfaction: 78 },
  { name: 'Physics', complaints: 11, resolved: 8, satisfaction: 75 },
  { name: 'Chemistry', complaints: 18, resolved: 14, satisfaction: 80 },
  { name: 'Engineering', complaints: 31, resolved: 24, satisfaction: 76 },
  { name: 'Medicine', complaints: 8, resolved: 7, satisfaction: 88 },
]

export default function AdminReports() {
  const [generating, setGenerating] = useState(null)
  const [dateRange, setDateRange] = useState('this_month')

  const handleGenerate = async (type) => {
    setGenerating(type)
    await new Promise(r => setTimeout(r, 2000))
    setGenerating(null)
    alert(`${REPORT_TYPES.find(r => r.id === type)?.title} generated successfully!`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-[11px] font-bold text-gold-dark uppercase tracking-[0.15em] mb-1">Reporting</p>
        <h1 className="text-[1.8rem] lg:text-[2.2rem] font-bold text-ink leading-tight tracking-tight">Reports</h1>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORT_TYPES.map(r => (
          <div key={r.id} className="bg-paper rounded-2xl border border-mist/50 p-6 hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-maroon/5 flex items-center justify-center shrink-0">
                {r.icon}
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-ink">{r.title}</h3>
                <p className="text-[12px] text-ink/35 mt-0.5">{r.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleGenerate(r.id)}
                disabled={generating === r.id}
                className="flex-1 py-2.5 rounded-xl bg-maroon text-white font-semibold text-[13px] shadow-[0_2px_6px_rgba(128,0,0,0.15)] hover:bg-maroon-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {generating === r.id ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Generating...
                  </>
                ) : 'Generate Report'}
              </button>
              <button className="px-4 py-2.5 rounded-xl border border-mist/70 text-ink/50 font-semibold text-[13px] hover:bg-cream transition-all flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Department Performance */}
      <div className="bg-paper rounded-2xl border border-mist/50 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[16px] font-bold text-ink">Department Performance</h2>
            <p className="text-[12px] text-ink/30 mt-0.5">Complaint metrics by department</p>
          </div>
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="px-3 py-2 text-[12px] rounded-lg bg-cream border border-mist/50 text-ink focus:outline-none focus:ring-2 focus:ring-maroon/15 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20fill%3D%22%23800000%22%20d%3D%22M4.5%206l3.5%204%203.5-4z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_8px_center]"
          >
            <option value="this_month">This Month</option>
            <option value="this_quarter">This Quarter</option>
            <option value="this_year">This Year</option>
          </select>
        </div>
        <div className="space-y-3">
          {MOCK_DEPARTMENTS.map(dept => {
            const resolutionRate = Math.round((dept.resolved / dept.complaints) * 100)
            return (
              <div key={dept.name} className="flex items-center gap-4 p-3 rounded-xl hover:bg-cream/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-ink">{dept.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] text-ink/30">{dept.complaints} complaints</span>
                    <span className="text-[11px] text-ink/15">·</span>
                    <span className="text-[11px] text-resolved">{dept.resolved} resolved</span>
                  </div>
                </div>
                <div className="w-24">
                  <div className="h-1.5 bg-mist-light rounded-full overflow-hidden">
                    <div className="h-full bg-maroon rounded-full" style={{ width: `${resolutionRate}%` }} />
                  </div>
                </div>
                <span className="text-[12px] font-mono font-semibold text-ink/50 w-10 text-right">{resolutionRate}%</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
