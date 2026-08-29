/**
 * FacultyDashboard — Warm Palette Redesign
 */
import Card from '../components/common/Card/Card'
import Badge from '../components/common/Badge/Badge'

const mockPeerReviews = [
  { id: 1, colleague: 'Dr. Akinwale', department: 'Computer Science', status: 'pending' },
  { id: 2, colleague: 'Prof. Nwosu', department: 'Mathematics', status: 'completed' },
  { id: 3, colleague: 'Dr. Olatunde', department: 'Physics', status: 'completed' },
]

const mockMetrics = [
  { label: 'Avg. Rating', value: '4.2', suffix: '/5.0', change: '+0.3' },
  { label: 'Completion', value: '78', suffix: '%', change: '+5%' },
  { label: 'Dept. Complaints', value: '23', suffix: '', change: '-8%' },
  { label: 'Resolution Rate', value: '85', suffix: '%', change: '+12%' },
]

export default function FacultyDashboard() {
  return (
    <div className="space-y-8">
      <div className="pt-2">
        <p className="text-[11px] font-semibold text-gold-dark uppercase tracking-widest mb-2">Faculty Portal</p>
        <h1 className="text-[2rem] text-ink font-bold tracking-tight">Faculty Dashboard</h1>
        <p className="text-ink/40 text-sm mt-1">Peer reviews and department metrics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {mockMetrics.map((m) => (
          <div key={m.label} className="bg-paper rounded-xl border border-mist/60 p-4">
            <p className="text-[11px] font-semibold text-ink/40 uppercase tracking-widest mb-2">{m.label}</p>
            <p className="text-[1.8rem] font-bold text-ink leading-none tracking-tight">
              {m.value}<span className="text-ink/30 text-sm font-body">{m.suffix}</span>
            </p>
            <span className={`text-[11px] font-mono font-semibold mt-2 inline-block ${m.change.startsWith('+') ? 'text-resolved' : 'text-escalated'}`}>
              {m.change} vs last semester
            </span>
          </div>
        ))}
      </div>

      <Card title="Peer Reviews" subtitle="Your review assignments">
        <div>
          {mockPeerReviews.map((review) => (
            <div key={review.id} className="flex items-center gap-4 py-3 border-b border-mist/20 last:border-0">
              <div className="w-9 h-9 rounded-full bg-maroon-light flex items-center justify-center text-maroon text-xs font-bold shrink-0">
                {review.colleague.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-ink">{review.colleague}</p>
                <p className="text-[11px] text-ink/35">{review.department}</p>
              </div>
              <Badge variant={review.status === 'completed' ? 'resolved' : 'pending'} size="sm">
                {review.status === 'completed' ? 'Done' : 'Pending'}
              </Badge>
              {review.status === 'pending' && (
                <button className="text-[11px] text-gold-dark hover:text-gold font-semibold uppercase tracking-wide transition-colors">Review</button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
