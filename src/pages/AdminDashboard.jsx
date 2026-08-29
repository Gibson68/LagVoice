/**
 * AdminDashboard — CleanMac-inspired, spacious and polished
 * Welcome banner, colorful mini stat cards, clean charts, generous spacing
 */
import { useState, useEffect, useRef } from 'react'
import { analyticsService } from '../services/analyticsService'
import { formatNumber, formatRelativeTime } from '../utils/formatters'
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar,
} from 'recharts'

const COLORS = ['#1266f1', '#ffa900', '#00b74a', '#f93154', '#b23cfd', '#39c0ed']

/* ── Animated counter ── */
function AnimatedNumber({ value, suffix = '' }) {
  const [display, setDisplay] = useState('0')
  const ref = useRef(null)

  useEffect(() => {
    const numericStr = String(value).replace(/[^0-9.]/g, '')
    const target = parseFloat(numericStr)
    if (isNaN(target)) { setDisplay(value); return }

    const duration = 900
    const start = performance.now()
    const prefix = String(value).match(/^[^0-9]*/)?.[0] || ''

    function tick(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(target * eased)
      setDisplay(`${prefix}${current.toLocaleString()}${suffix}`)
      if (progress < 1) ref.current = requestAnimationFrame(tick)
    }
    ref.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(ref.current)
  }, [value, suffix])

  return <span>{display}</span>
}

/* ── Mini stat card (CleanMac style) ── */
function MiniStatCard({ label, value, suffix = '', icon, color, stagger = 1 }) {
  return (
    <div
      className={`bg-white rounded-2xl p-5 border border-[#E4E8EE] opacity-0 animate-slide-in-up hover-lift`}
      style={{ animationDelay: `${stagger * 80}ms` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}12` }}>
          <div style={{ color }}>{icon}</div>
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-semibold text-[#9fa6b2] uppercase tracking-wider">{label}</p>
        </div>
      </div>
      <p className="text-[1.8rem] font-bold text-[#262626] leading-none tracking-tight">
        <AnimatedNumber value={value} suffix={suffix} />
      </p>
    </div>
  )
}

/* ── Chart tooltip ── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1E1B4B] text-white px-4 py-3 rounded-xl text-xs shadow-xl">
      <p className="font-medium mb-1.5 text-white/60">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-white/50">{p.name}:</span>
          <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

/* ── Category pill ── */
function CategoryPill({ category, count, total, color }) {
  const pct = Math.round((count / total) * 100)
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}12` }}>
        <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[13px] font-medium text-[#262626] truncate">{category}</span>
          <span className="text-[12px] font-semibold text-[#4f4f4f] ml-2">{count}</span>
        </div>
        <div className="h-1.5 bg-[#F0F3F8] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full animate-progress"
            style={{ width: `${pct}%`, background: color, animationDelay: '600ms' }}
          />
        </div>
      </div>
    </div>
  )
}

/* ── Alert item ── */
function AlertItem({ alert, idx }) {
  const isCritical = alert.severity === 'critical'
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-300 hover-lift ${
        isCritical
          ? 'bg-gradient-to-r from-[#f93154]/[0.04] to-transparent border-[#f93154]/15'
          : 'bg-gradient-to-r from-[#ffa900]/[0.04] to-transparent border-[#ffa900]/15'
      }`}
    >
      <div className="relative mt-1.5 shrink-0">
        <div className={`w-2.5 h-2.5 rounded-full ${isCritical ? 'bg-[#f93154]' : 'bg-[#ffa900]'}`} />
        <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full pulse-dot ${isCritical ? 'bg-[#f93154]' : 'bg-[#ffa900]'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[#262626]">{alert.title}</p>
        <p className="text-[12px] text-[#9fa6b2] mt-0.5 leading-relaxed">{alert.message}</p>
      </div>
      <span className="text-[10px] text-[#9fa6b2] font-mono whitespace-nowrap">{formatRelativeTime(alert.createdAt)}</span>
    </div>
  )
}

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      analyticsService.getKpiOverview(),
      analyticsService.getComplaintTrend(),
      analyticsService.getComplaintsByCategory(),
      analyticsService.getComplaintsByDepartment(),
      analyticsService.getActiveAlerts(),
    ]).then(([kpi, trend, cats, depts, alerts]) => {
      setData({ kpi, trend, cats, depts, alerts })
      setLoading(false)
    })
  }, [])

  if (loading || !data) {
    return (
      <div className="space-y-8 py-8">
        <div className="h-44 rounded-2xl skeleton" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 rounded-2xl skeleton" />)}
        </div>
        <div className="skeleton h-80 rounded-2xl" />
      </div>
    )
  }

  const { kpi, trend, cats, depts, alerts } = data
  const totalCats = cats.reduce((sum, c) => sum + c.count, 0)

  return (
    <div className="py-8">

      {/* ═══ Welcome Banner ═══ */}
      <div
        className="relative rounded-2xl overflow-hidden mb-8 opacity-0 animate-slide-in-up stagger-1"
        style={{ background: 'linear-gradient(135deg, #ffa900 0%, #ff9500 40%, #ffb733 100%)' }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-12 -right-12 w-56 h-56 bg-white rounded-full blur-[60px]" />
          <div className="absolute -bottom-8 right-1/4 w-40 h-40 bg-[#1266f1] rounded-full blur-[50px] opacity-40" />
        </div>
        <div className="relative z-10 p-7 lg:p-9 flex items-center justify-between">
          <div>
            <h1 className="text-[1.8rem] lg:text-[2.2rem] font-bold text-white leading-tight tracking-tight">
              Hello, Barbara!
            </h1>
            <p className="text-[14px] text-white/70 mt-1.5">Welcome back to LagVoice</p>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <div className="w-28 h-20 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <p className="text-[1.6rem] font-bold text-white font-mono leading-none">{formatNumber(kpi.totalComplaints.thisMonth)}</p>
                <p className="text-[9px] text-white/50 uppercase tracking-wider mt-1">This Month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Mini Stat Cards ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <MiniStatCard
          label="Total Complaints"
          value={kpi.totalComplaints.thisMonth}
          color="#1266f1"
          stagger={2}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>}
        />
        <MiniStatCard
          label="Avg. Resolution"
          value={kpi.avgResolutionTime.days}
          suffix="d"
          color="#ffa900"
          stagger={3}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>}
        />
        <MiniStatCard
          label="Satisfaction"
          value={kpi.satisfactionScore.percentage}
          suffix="%"
          color="#00b74a"
          stagger={4}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>}
        />
        <MiniStatCard
          label="Resolution Rate"
          value={kpi.resolutionRate.percentage}
          suffix="%"
          color="#b23cfd"
          stagger={5}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>}
        />
      </div>

      {/* ═══ Alerts ═══ */}
      {alerts.length > 0 && (
        <div className="mb-8 space-y-3 opacity-0 animate-slide-in-up stagger-6">
          <h3 className="text-[11px] font-bold text-[#9fa6b2] uppercase tracking-[0.15em] px-1">Active Alerts</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {alerts.map((alert, idx) => (
              <AlertItem key={alert.id} alert={alert} idx={idx} />
            ))}
          </div>
        </div>
      )}

      {/* ═══ Charts Row ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Trend chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E4E8EE] overflow-hidden opacity-0 animate-slide-in-up stagger-7">
          <div className="px-6 py-5 border-b border-[#E4E8EE]/50 flex items-baseline justify-between">
            <div>
              <h3 className="text-[16px] font-bold text-[#262626]">Complaint Trend</h3>
              <p className="text-[12px] text-[#9fa6b2] mt-0.5">Monthly overview</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-[#9fa6b2]">
              <span className="flex items-center gap-1.5"><span className="w-3 h-[2px] bg-[#1266f1] rounded-full" /> Complaints</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-[2px] bg-[#ffa900] rounded-full" /> Resolved</span>
            </div>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1266f1" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#1266f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradAmber" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffa900" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#ffa900" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E8EE" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9fa6b2' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9fa6b2' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="complaints" stroke="#1266f1" strokeWidth={2.5} fill="url(#gradBlue)" dot={{ fill: '#1266f1', r: 3 }} activeDot={{ r: 5, stroke: '#1266f1', strokeWidth: 2 }} name="Complaints" />
                  <Area type="monotone" dataKey="resolved" stroke="#ffa900" strokeWidth={2} fill="url(#gradAmber)" dot={{ fill: '#ffa900', r: 3 }} activeDot={{ r: 5, stroke: '#ffa900', strokeWidth: 2 }} name="Resolved" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category pie */}
        <div className="bg-white rounded-2xl border border-[#E4E8EE] overflow-hidden opacity-0 animate-slide-in-up stagger-8">
          <div className="px-6 py-5 border-b border-[#E4E8EE]/50">
            <h3 className="text-[16px] font-bold text-[#262626]">By Category</h3>
            <p className="text-[12px] text-[#9fa6b2] mt-0.5">Distribution</p>
          </div>
          <div className="p-6">
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cats}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="count"
                    stroke="none"
                    animationBegin={200}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  >
                    {cats.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-1">
              {cats.map((c, i) => (
                <CategoryPill
                  key={c.category}
                  category={c.category}
                  count={c.count}
                  total={totalCats}
                  color={COLORS[i % COLORS.length]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Department bar chart ═══ */}
      <div className="bg-white rounded-2xl border border-[#E4E8EE] overflow-hidden opacity-0 animate-slide-in-up stagger-9">
        <div className="px-6 py-5 border-b border-[#E4E8EE]/50">
          <h3 className="text-[16px] font-bold text-[#262626]">Complaints by Department</h3>
          <p className="text-[12px] text-[#9fa6b2] mt-0.5">Top reported departments</p>
        </div>
        <div className="p-6">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={depts} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E8EE" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#9fa6b2' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="department" tick={{ fontSize: 11, fill: '#4f4f4f' }} axisLine={false} tickLine={false} width={110} />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="count"
                  name="Complaints"
                  radius={[0, 8, 8, 0]}
                  barSize={22}
                  animationBegin={300}
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  {depts.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85 - i * 0.05} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
