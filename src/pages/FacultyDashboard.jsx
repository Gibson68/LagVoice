/**
 * FacultyDashboard — Warm Palette Redesign
 */
import Card from '../components/common/Card/Card'
import Badge from '../components/common/Badge/Badge'

export default function FacultyDashboard() {
  const metrics = [
    { label: 'Avg. Rating', value: '-', suffix: '', change: '' },
    { label: 'Completion', value: '-', suffix: '', change: '' },
    { label: 'Dept. Complaints', value: '-', suffix: '', change: '' },
    { label: 'Resolution Rate', value: '-', suffix: '', change: '' },
  ]
  const peerReviews = []

  return (
    <div className="space-y-8">
      <div className="pt-2">
        <p className="text-[11px] font-semibold text-gold-dark uppercase tracking-widest mb-2">Faculty Portal</p>
        <h1 className="text-[2rem] text-ink font-bold tracking-tight">Faculty Dashboard</h1>
        <p className="text-ink/40 text-sm mt-1">Peer reviews and department metrics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="bg-paper rounded-xl border border-mist/60 p-4">
            <p className="text-[11px] font-semibold text-ink/40 uppercase tracking-widest mb-2">{m.label}</p>
            <p className="text-[1.8rem] font-bold text-ink leading-none tracking-tight">
              {m.value}<span className="text-ink/30 text-sm font-body">{m.suffix}</span>
            </p>
          </div>
        ))}
      </div>

      <Card title="Peer Reviews" subtitle="Your review assignments">
        <div className="py-8 text-center text-ink/40 text-[13px]">
          No peer reviews assigned at this time.
        </div>
      </Card>
    </div>
  )
}
