/**
 * AdminLayout — CleanMac-inspired icon-only sidebar
 * Dark navy sidebar with icons only on desktop, modern cards, warm welcome banner
 */
import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useNotifications } from '../../../hooks/useNotifications'

const adminNavItems = [
  { label: 'Overview', path: '/admin', icon: 'grid' },
  { label: 'Complaints', path: '/admin/complaints', icon: 'inbox' },
  { label: 'Evaluations', path: '/admin/evaluations', icon: 'star' },
  { label: 'Polls', path: '/admin/polls', icon: 'chart' },
  { label: 'Reports', path: '/admin/reports', icon: 'file' },
  { label: 'Users', path: '/admin/users', icon: 'people' },
]

const facultyNavItems = [
  { label: 'Overview', path: '/faculty', icon: 'grid' },
  { label: 'Peer Reviews', path: '/faculty/reviews', icon: 'people' },
  { label: 'Results', path: '/faculty/evaluations', icon: 'star' },
  { label: 'Metrics', path: '/faculty/metrics', icon: 'chart' },
]

function NavIcon({ icon, isActive }) {
  const s = 'w-[22px] h-[22px]'
  const icons = {
    grid: (
      <svg className={s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </svg>
    ),
    inbox: (
      <svg className={s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    star: (
      <svg className={s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    chart: (
      <svg className={s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M4 20h16M4 20V10m4 10V6m4 14V12m4 8V4m4 16V8" />
      </svg>
    ),
    file: (
      <svg className={s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
    people: (
      <svg className={s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    settings: (
      <svg className={s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  }
  return icons[icon] || null
}

export default function AdminLayout({ children }) {
  const [mobileNav, setMobileNav] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAdmin } = useAuth()
  const { notifications, unreadCount, markAllAsRead } = useNotifications()

  const navItems = isAdmin ? adminNavItems : facultyNavItems

  return (
    <div className="flex h-screen bg-[#F0F3F8]">
      {/* Mobile overlay */}
      {mobileNav && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobileNav(false)} />
      )}

      {/* ═══ Sidebar — Icon-only rail ═══ */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[72px] bg-[#1E1B4B] flex flex-col items-center
        transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto
        ${mobileNav ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="w-full flex justify-center pt-6 pb-4">
          <img src="/images/logo-n.png" alt="LagVoice" className="w-11 h-11 rounded-2xl object-cover" />
        </div>

        {/* Nav icons */}
        <nav className="flex-1 flex flex-col items-center gap-1 py-4" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileNav(false)}
              className={({ isActive }) =>
                `group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-[#1E1B4B] shadow-lg shadow-black/20'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/8'
                }`
              }
              end={item.path === (isAdmin ? '/admin' : '/faculty')}
              title={item.label}
            >
              <NavIcon icon={item.icon} />
              {/* Tooltip on hover */}
              <span className="absolute left-full ml-3 px-3 py-1.5 bg-[#1E1B4B] text-white text-[12px] font-medium rounded-lg
                opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom icons */}
        <div className="flex flex-col items-center gap-1 pb-6">
          <button
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/8 transition-all duration-200"
            aria-label="Settings"
            title="Settings"
          >
            <NavIcon icon="settings" />
          </button>
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-white/8 transition-all duration-200"
            aria-label="Log out"
            title="Log out"
          >
            <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </aside>

      {/* ═══ Main Content ═══ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar — Busy & Pretty Desktop Nav */}
        <header className="h-[68px] px-6 bg-white border-b border-[#E4E8EE] shrink-0">
          <div className="flex items-center justify-between h-full">
            {/* Left: hamburger + title + breadcrumb */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileNav(true)}
                className="p-2 -ml-2 rounded-lg hover:bg-[#F0F3F8] lg:hidden transition-colors"
                aria-label="Open navigation"
              >
                <svg className="w-5 h-5 text-[#4f4f4f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h2 className="text-[17px] font-bold text-[#262626] tracking-tight leading-tight">
                  {navItems.find((i) => i.path === location.pathname)?.label || 'Overview'}
                </h2>
                <p className="text-[11px] text-[#9fa6b2] hidden sm:block">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            {/* Right: search + quick actions + notif + avatar */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5F7FA] border border-[#E4E8EE] hover:border-[#1266f1]/20 transition-colors w-56">
                <svg className="w-4 h-4 text-[#9fa6b2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="bg-transparent border-none text-[13px] focus:outline-none w-full text-[#4f4f4f] placeholder:text-[#9fa6b2]"
                  aria-label="Search"
                />
                <kbd className="text-[10px] text-[#9fa6b2] bg-white border border-[#E4E8EE] rounded px-1.5 py-0.5 font-mono shrink-0">/</kbd>
              </div>

              {/* Quick action buttons */}
              <div className="hidden md:flex items-center gap-1.5">
                <button className="p-2 rounded-lg hover:bg-[#F0F3F8] transition-colors text-[#9fa6b2] hover:text-[#1266f1]" title="Export report">
                  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
                <button className="p-2 rounded-lg hover:bg-[#F0F3F8] transition-colors text-[#9fa6b2] hover:text-[#1266f1]" title="Settings">
                  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                  </svg>
                </button>
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-[#E4E8EE] hidden md:block" />

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2.5 rounded-xl hover:bg-[#F0F3F8] transition-colors"
                  aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
                >
                  <svg className="w-5 h-5 text-[#9fa6b2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#f93154] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#E4E8EE] z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4E8EE]">
                      <h3 className="text-[14px] font-semibold text-[#262626]">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => { markAllAsRead(); setNotifOpen(false) }}
                          className="text-[11px] text-[#1266f1] hover:text-[#0e52c1] font-semibold"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="px-5 py-8 text-[13px] text-[#9fa6b2] text-center">No notifications yet</p>
                      ) : notifications.map((n) => (
                        <div key={n.id} className={`px-5 py-3.5 border-b border-[#E4E8EE]/50 hover:bg-[#F5F7FA] cursor-pointer transition-colors ${!n.read ? 'bg-[#EBF3FF]' : ''}`}>
                          <p className="text-[13px] font-medium text-[#262626]">{n.title}</p>
                          <p className="text-[12px] text-[#9fa6b2] mt-0.5 leading-relaxed">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Avatar with name */}
              <div className="flex items-center gap-2.5 pl-2">
                <div className="text-right hidden sm:block">
                  <p className="text-[13px] font-semibold text-[#262626] leading-tight">{user?.name || 'Admin'}</p>
                  <p className="text-[11px] text-[#9fa6b2]">{user?.role || 'Administrator'}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#1266f1] flex items-center justify-center text-white text-[13px] font-bold shadow-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8" role="main">
          {children}
        </main>
      </div>
    </div>
  )
}
