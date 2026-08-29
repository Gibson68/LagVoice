/**
 * StudentLayout — Left sidebar matching CleanMac icon-only rail style
 * Dark navy sidebar with icons only on desktop, bottom nav on mobile
 */
import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useNotifications } from '../../../hooks/useNotifications'

const navItems = [
  { label: 'Home', path: '/student', icon: (
    <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2" />
    </svg>
  )},
  { label: 'Feedback', path: '/student/feedback', icon: (
    <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )},
  { label: 'Tickets', path: '/student/tickets', icon: (
    <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  )},
  { label: 'Evaluate', path: '/student/evaluations', icon: (
    <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  )},
  { label: 'Polls', path: '/student/polls', icon: (
    <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )},
  { label: 'Profile', path: '/student/profile', icon: (
    <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )},
]

const settingsIcon = (
  <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
)

const logoutIcon = (
  <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
)

export default function StudentLayout({ children }) {
  const [mobileNav, setMobileNav] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { notifications, unreadCount, markAllAsRead } = useNotifications()

  return (
    <div className="flex h-screen bg-[#F0F3F8]">
      {/* Mobile overlay */}
      {mobileNav && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobileNav(false)} />
      )}

      {/* ═══ Sidebar — Icon-only rail (desktop) ═══ */}
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
        <nav className="flex-1 flex flex-col items-center gap-1 py-4" aria-label="Student navigation">
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
              end={item.path === '/student'}
              title={item.label}
            >
              {item.icon}
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
            {settingsIcon}
          </button>
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-white/8 transition-all duration-200"
            aria-label="Log out"
            title="Log out"
          >
            {logoutIcon}
          </button>
        </div>
      </aside>

      {/* ═══ Main Content ═══ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-[68px] px-6 bg-white border-b border-[#E4E8EE] shrink-0">
          <div className="flex items-center justify-between h-full">
            {/* Left: hamburger + title */}
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
                  {navItems.find((i) => i.path === location.pathname)?.label || 'Home'}
                </h2>
                <p className="text-[11px] text-[#9fa6b2] hidden sm:block">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Right: search + notif + avatar */}
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

              {/* Avatar */}
              <div className="flex items-center gap-2.5 pl-2">
                <div className="text-right hidden sm:block">
                  <p className="text-[13px] font-semibold text-[#262626] leading-tight">{user?.name || 'Student'}</p>
                  <p className="text-[11px] text-[#9fa6b2]">{user?.role || 'Student'}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#ffa900] flex items-center justify-center text-[#1E1B4B] text-[13px] font-bold shadow-sm">
                  {user?.name?.charAt(0) || 'C'}
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

      {/* ═══ Mobile Bottom Nav ═══ */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-[#1E1B4B] flex justify-around items-center h-[72px] px-2 z-40 lg:hidden safe-area-pb"
        role="navigation"
        aria-label="Student navigation"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1.5 transition-all duration-200`
            }
            end={item.path === '/student'}
          >
            {({ isActive }) => (
              <div className={`flex flex-col items-center gap-1.5`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-[#1E1B4B] shadow-lg shadow-black/20'
                    : 'text-white/40 hover:text-white/70'
                }`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-medium tracking-wide ${
                  isActive ? 'text-white' : 'text-white/40'
                }`}>{item.label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
