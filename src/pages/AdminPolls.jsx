/**
 * AdminPolls — Targeted Polls & Surveys
 * Create, manage, and view poll results
 */
import { useState } from 'react'

const MOCK_POLLS = [
  { id: 1, title: 'Campus Security Survey', description: 'Rate your sense of safety on campus', status: 'active', responses: 342, target: 'All Students', deadline: '2026-09-15', options: ['Very Safe', 'Safe', 'Neutral', 'Unsafe', 'Very Unsafe'], results: [45, 120, 98, 52, 27] },
  { id: 2, title: 'Proposed Fee Structure Change', description: 'Student sentiment on the proposed fee adjustment for next semester', status: 'active', responses: 189, target: 'All Students', deadline: '2026-09-20', options: ['Strongly Support', 'Support', 'Neutral', 'Oppose', 'Strongly Oppose'], results: [23, 45, 67, 34, 20] },
  { id: 3, title: 'Library Hours Extension', description: 'Should the library extend operating hours during exams?', status: 'closed', responses: 567, target: 'All Students', deadline: '2026-08-01', options: ['Yes, extend to 10pm', 'Yes, extend to 11pm', 'Current hours are fine', 'No opinion'], results: [234, 189, 98, 46] },
]

export default function AdminPolls() {
  const [activeTab, setActiveTab] = useState('active')
  const [showCreate, setShowCreate] = useState(false)

  const polls = MOCK_POLLS.filter(p => activeTab === 'all' || p.status === activeTab)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold text-gold-dark uppercase tracking-[0.15em] mb-1">Engagement</p>
          <h1 className="text-[1.8rem] lg:text-[2.2rem] font-bold text-ink leading-tight tracking-tight">Polls & Surveys</h1>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-5 py-2.5 rounded-xl bg-maroon text-white font-semibold text-[13px] shadow-[0_2px_8px_rgba(128,0,0,0.2)] hover:bg-maroon-dark transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create Poll
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-paper rounded-2xl border border-mist/50 p-6">
          <h2 className="text-[15px] font-bold text-ink mb-4">New Poll</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-2">Title</label>
              <input placeholder="e.g., Academic Calendar Feedback" className="w-full px-4 py-3 text-[14px] rounded-xl bg-cream border border-mist/50 text-ink placeholder:text-ink/25 focus:outline-none focus:ring-2 focus:ring-maroon/15 transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-2">Description</label>
              <textarea placeholder="What is this poll about?" rows={2} className="w-full px-4 py-3 text-[13px] rounded-xl bg-cream border border-mist/50 text-ink placeholder:text-ink/25 focus:outline-none focus:ring-2 focus:ring-maroon/15 transition-all resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-2">Target Audience</label>
                <select className="w-full px-4 py-3 text-[14px] rounded-xl bg-cream border border-mist/50 text-ink focus:outline-none focus:ring-2 focus:ring-maroon/15 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20fill%3D%22%23800000%22%20d%3D%22M4.5%206l3.5%204%203.5-4z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]">
                  <option>All Students</option>
                  <option>Specific Faculty</option>
                  <option>Specific Department</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-2">Deadline</label>
                <input type="date" className="w-full px-4 py-3 text-[14px] rounded-xl bg-cream border border-mist/50 text-ink focus:outline-none focus:ring-2 focus:ring-maroon/15 transition-all" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-3 rounded-xl border border-mist/70 text-ink/60 font-semibold text-[13px] hover:bg-cream transition-all">Cancel</button>
              <button className="flex-1 py-3 rounded-xl bg-maroon text-white font-semibold text-[13px] shadow-[0_2px_8px_rgba(128,0,0,0.2)] hover:bg-maroon-dark transition-all">Create Poll</button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {['active', 'closed', 'all'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${
              activeTab === tab ? 'bg-maroon text-white shadow-sm' : 'bg-paper border border-mist/50 text-ink/40 hover:text-ink/60'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab !== 'all' && `(${MOCK_POLLS.filter(p => p.status === tab).length})`}
          </button>
        ))}
      </div>

      {/* Polls */}
      <div className="space-y-4">
        {polls.map(poll => {
          const maxResult = Math.max(...poll.results)
          return (
            <div key={poll.id} className="bg-paper rounded-2xl border border-mist/50 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-bold text-ink">{poll.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      poll.status === 'active' ? 'bg-resolved/10 text-resolved' : 'bg-mist text-ink/30'
                    }`}>
                      {poll.status}
                    </span>
                  </div>
                  <p className="text-[13px] text-ink/40">{poll.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[1.2rem] font-bold text-ink font-mono">{poll.responses}</p>
                  <p className="text-[10px] text-ink/25">responses</p>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-2">
                {poll.options.map((opt, i) => {
                  const pct = Math.round((poll.results[i] / poll.responses) * 100)
                  const isMax = poll.results[i] === maxResult
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between text-[12px] mb-1">
                        <span className="text-ink/50">{opt}</span>
                        <span className="font-mono text-ink/60 font-semibold">{pct}%</span>
                      </div>
                      <div className="h-2 bg-mist-light rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${isMax ? 'bg-maroon' : 'bg-gold/60'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-mist/20">
                <span className="text-[11px] text-ink/25">Target: {poll.target}</span>
                <span className="text-[11px] text-ink/25">Deadline: {poll.deadline}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
