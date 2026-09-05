/**
 * StudentLayout — Desktop: animated icon-only rail, Mobile: bottom nav
 * Dark mode support with toggle
 */
import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useNotifications } from '../../../hooks/useNotifications'
import { useDarkMode } from '../../../hooks/useDarkMode'

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

/* ── Logout Confirmation Modal ── */
function LogoutModal({ open, onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Confirm logout">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-[380px] p-8 animate-slide-in-up border border-[#E4E8EE] dark:border-white/10">
        <div className="w-14 h-14 rounded-2xl bg-[#f93154]/10 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-[#f93154]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
        </div>
        <h3 className="text-[18px] font-bold text-[#262626] dark:text-white text-center mb-2">Log out?</h3>
        <p className="text-[13px] text-[#9fa6b2] text-center mb-7 leading-relaxed">
          You will be signed out of your account and redirected to the login page.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-[#E4E8EE] dark:border-white/10 text-[14px] font-semibold text-[#4f4f4f] dark:text-white/70
              hover:bg-[#F5F7FA] dark:hover:bg-white/5 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-[#f93154] text-white text-[14px] font-semibold
              hover:bg-[#d42843] active:scale-[0.98] transition-all duration-200
              shadow-[0_4px_14px_rgba(249,49,84,0.25)]"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}

export default function StudentLayout({ children }) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [showLogout, setShowLogout] = useState(false)
  const darkMode = useDarkMode()
  const [sidebarReady, setSidebarReady] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { notifications, unreadCount, markAllAsRead } = useNotifications()

  // Sidebar entrance animation
  useEffect(() => {
    const t = setTimeout(() => setSidebarReady(true), 100)
    return () => clearTimeout(t)
  }, [])

  const toggleDark = () => {
    const next = !darkMode
    try { localStorage.setItem('lagvoice_dark', String(next)) } catch {}
  }

  const handleLogout = () => setShowLogout(true)
  const confirmLogout = () => {
    logout()
    setShowLogout(false)
    navigate('/login')
  }

  return (
    <div className={`flex h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0f172a]' : 'bg-[#F0F3F8]'}`}>
      <LogoutModal open={showLogout} onConfirm={confirmLogout} onCancel={() => setShowLogout(false)} />

      {/* ═══ Desktop Sidebar — animated entry ═══ */}
      <aside className={`
        hidden lg:flex fixed inset-y-0 left-0 z-50 w-[72px] bg-[#1E1B4B] flex-col items-center
        transition-all duration-700 ease-out
        ${sidebarReady ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}
      `}>
        {/* Logo */}
        <div className="w-full flex justify-center pt-6 pb-4">
          <div className="w-11 h-11 rounded-2xl overflow-hidden" style={{
            animation: sidebarReady ? 'sidebar-logo-glow 1.5s ease-out forwards' : 'none',
          }}>
            <img src="/images/logo-n.png" alt="LagVoice" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Nav icons with staggered entrance */}
        <nav className="flex-1 flex flex-col items-center gap-1 py-4" aria-label="Student navigation">
          {navItems.map((item, i) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  sidebarReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                } ${
                  isActive
                    ? 'bg-white text-[#1E1B4B] shadow-lg shadow-black/20'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/8'
                }`
              }
              style={{ transitionDelay: sidebarReady ? `${200 + i * 60}ms` : '0ms' }}
              end={item.path === '/student'}
              title={item.label}
            >
              {item.icon}
              <span className="absolute left-full ml-3 px-3 py-1.5 bg-[#1E1B4B] text-white text-[12px] font-medium rounded-lg
                opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[70] shadow-lg border border-white/10">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom icons */}
        <div className="flex flex-col items-center gap-1 pb-6">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 group ${
              sidebarReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            } ${darkMode ? 'text-yellow-400 bg-white/8' : 'text-white/40 hover:text-white/70 hover:bg-white/8'}`}
            style={{ transitionDelay: sidebarReady ? `${200 + navItems.length * 60}ms` : '0ms' }}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
            <span className="absolute left-full ml-3 px-3 py-1.5 bg-[#1E1B4B] text-white text-[12px] font-medium rounded-lg
              opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[70] shadow-lg border border-white/10">
              {darkMode ? 'Light mode' : 'Dark mode'}
            </span>
          </button>
          <button
            className={`relative w-11 h-11 rounded-xl flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/8 transition-all duration-200 group ${
              sidebarReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
            style={{ transitionDelay: sidebarReady ? `${200 + (navItems.length + 1) * 60}ms` : '0ms' }}
            aria-label="Settings"
          >
            <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
            <span className="absolute left-full ml-3 px-3 py-1.5 bg-[#1E1B4B] text-white text-[12px] font-medium rounded-lg
              opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[70] shadow-lg border border-white/10">
              Settings
            </span>
          </button>
          <button
            onClick={handleLogout}
            className={`relative w-11 h-11 rounded-xl flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-white/8 transition-all duration-200 group ${
              sidebarReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
            style={{ transitionDelay: sidebarReady ? `${200 + (navItems.length + 2) * 60}ms` : '0ms' }}
            aria-label="Log out"
          >
            <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span className="absolute left-full ml-3 px-3 py-1.5 bg-[#1E1B4B] text-white text-[12px] font-medium rounded-lg
              opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[70] shadow-lg border border-white/10">
              Log out
            </span>
          </button>
        </div>
      </aside>

      {/* ═══ Main Content ═══ */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[72px]">
        {/* Top bar */}
        <header className={`h-[68px] px-4 sm:px-6 shrink-0 transition-colors duration-300 ${
          darkMode ? 'bg-[#1e293b] border-b border-white/5' : 'bg-white border-b border-[#1266f1]/10'
        }`}>
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-3">
              {/* Mobile logo (shown on mobile only) */}
              <div className="lg:hidden flex items-center gap-2">
                <img src="/images/logo-n.png" alt="LagVoice" className="w-8 h-8 rounded-lg object-cover" />
                <span className={`font-bold text-[15px] ${darkMode ? 'text-white' : 'text-[#262626]'}`}>LagVoice</span>
              </div>
              <div className="hidden lg:block">
                <h2 className={`text-[17px] font-bold tracking-tight leading-tight ${darkMode ? 'text-white' : 'text-[#262626]'}`}>
                  {navItems.find((i) => i.path === location.pathname)?.label || 'Home'}
                </h2>
                <p className={`text-[11px] ${darkMode ? 'text-white/40' : 'text-[#9fa6b2]'}`}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors w-56 ${
                darkMode ? 'bg-[#0f172a] border-white/10 hover:border-white/20' : 'bg-[#F5F7FA] border-[#1266f1]/8 hover:border-[#1266f1]/20'
              }`}>
                <svg className={`w-4 h-4 ${darkMode ? 'text-white/30' : 'text-[#9fa6b2]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search anything..."
                  className={`bg-transparent border-none text-[13px] focus:outline-none w-full placeholder:text-[#9fa6b2] ${darkMode ? 'text-white' : 'text-[#4f4f4f]'}`}
                  aria-label="Search"
                />
                <kbd className={`text-[10px] bg-white border rounded px-1.5 py-0.5 font-mono shrink-0 ${darkMode ? 'text-white/30 border-white/10' : 'text-[#9fa6b2] border-[#1266f1]/10'}`}>/</kbd>
              </div>

              <div className={`w-px h-6 hidden md:block ${darkMode ? 'bg-white/10' : 'bg-[#1266f1]/8'}`} />

              {/* Dark mode toggle (visible on all sizes) */}
              <button
                onClick={toggleDark}
                className={`p-2.5 rounded-xl transition-colors ${darkMode ? 'hover:bg-white/5 text-yellow-400' : 'hover:bg-[#F0F3F8] text-[#4f4f4f]'}`}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className={`relative p-2.5 rounded-xl transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-[#F0F3F8]'}`}
                  aria-label="Notifications"
                >
                  <svg className={`w-5 h-5 ${darkMode ? 'text-white/40' : 'text-[#4f4f4f]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f93154] pulse-dot" />
                  )}
                </button>
              </div>

              {/* User */}
              <div className={`flex items-center gap-2.5 pl-3 border-l ${darkMode ? 'border-white/10' : 'border-[#1266f1]/8'}`}>
                <div className="w-9 h-9 rounded-xl bg-[#1266f1] flex items-center justify-center text-white font-bold text-[13px]">
                  {user?.name?.charAt(0) || 'S'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${
          darkMode ? 'bg-[#0f172a]' : 'bg-[#F0F3F8]'
        }`}>
          {children}
        </main>
      </div>

      {/* ═══ Mobile Bottom Nav ═══ */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t transition-colors duration-300 ${
        darkMode ? 'bg-[#1e293b] border-white/5' : 'bg-white border-[#E4E8EE]'
      }`} aria-label="Student navigation">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-[#1266f1] bg-[#1266f1]/8'
                    : darkMode ? 'text-white/30 hover:text-white/60' : 'text-[#9fa6b2] hover:text-[#4f4f4f]'
                }`
              }
              end={item.path === '/student'}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="lg:hidden h-[72px]" />
    </div>
  )
}
