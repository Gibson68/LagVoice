/**
 * ExternalDashboard — Warm Palette Redesign
 */
import { useState, useEffect } from 'react'
import Card from '../components/common/Card/Card'
import { analyticsService } from '../services/analyticsService'
import { formatNumber } from '../utils/formatters'

export default function ExternalDashboard() {
  const [stats, setStats] = useState(null)
  
  useEffect(() => {
    analyticsService.getKpiOverview().then(res => {
      setStats([
        { label: 'Reports Generated', value: 12 }, // Keeping static since we don't track PDF gens
        { label: 'Total Complaints Analyzed', value: formatNumber(res.data?.totalComplaints?.thisMonth || 0) },
        { label: 'Resolution Rate', value: `${res.data?.resolutionRate?.percentage || 0}%` },
        { label: 'Avg. Satisfaction', value: `${res.data?.satisfactionScore?.percentage || 0}%` },
      ])
    })
  }, [])

  return (
    <div className="space-y-8">
      <div className="pt-2">
        <p className="text-[11px] font-semibold text-gold-dark uppercase tracking-widest mb-2">External Access</p>
        <h1 className="text-[2rem] text-ink font-bold tracking-tight">Accreditation Dashboard</h1>
        <p className="text-ink/40 text-sm mt-1">Read-only view for quality assurance reporting</p>
      </div>

      <div className="px-4 py-3.5 rounded-xl bg-maroon-light/50 border border-maroon/10">
        <div className="flex items-start gap-3">
          <svg className="w-4 h-4 text-maroon shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[13px] text-ink/60 leading-relaxed">
            <span className="font-semibold text-ink/80">Limited access.</span> You can view aggregate reports and departmental summaries. Contact the QA office for detailed data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats ? stats.map((s) => (
          <div key={s.label} className="bg-paper rounded-xl border border-mist/60 p-4">
            <p className="text-[11px] font-semibold text-ink/40 uppercase tracking-widest mb-2">{s.label}</p>
            <p className="text-[1.8rem] font-bold text-ink leading-none tracking-tight">{s.value}</p>
          </div>
        )) : (
          <div className="col-span-4 p-4 text-ink/40">Loading metrics...</div>
        )}
      </div>

      <Card title="Available Reports" subtitle="Download accreditation documents">
        <div className="space-y-2">
          {[
            { name: 'NUC Accreditation Report 2026', type: 'PDF', size: '2.4 MB' },
            { name: 'Institutional Self-Study Report', type: 'PDF', size: '5.1 MB' },
            { name: 'Departmental Quality Review', type: 'PDF', size: '1.8 MB' },
          ].map((report) => (
            <div key={report.name} className="flex items-center gap-4 p-3.5 rounded-lg border border-mist/40 hover:bg-cream/50 hover:border-mist transition-colors">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <span className="text-escalated text-[10px] font-bold">PDF</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-ink truncate">{report.name}</p>
                <p className="text-[11px] text-ink/30 font-mono">{report.type} · {report.size}</p>
              </div>
              <button className="text-[11px] text-gold-dark hover:text-gold font-semibold uppercase tracking-wide transition-colors shrink-0">Download</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
