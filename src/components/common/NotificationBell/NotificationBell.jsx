/**
 * NotificationBell — the one notification control used by every layout.
 *
 * Renders the bell, the unread badge and the dropdown panel, and owns its own
 * open/closed state, click-outside and Escape handling so both layouts behave
 * identically. Reads notifications from the Redux slice via useNotifications.
 */
import { useEffect, useRef, useState } from 'react'
import { useDarkMode } from '../../../hooks/useDarkMode'
import { useNotifications } from '../../../hooks/useNotifications'
import { formatRelativeTime } from '../../../utils/formatters'

const TONE = {
  info: '#1266f1',
  success: '#00b74a',
  warning: '#ffa900',
  danger: '#f93154',
}

function BellIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  )
}

export default function NotificationBell() {
  const dark = useDarkMode()
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  // Close on outside click and on Escape, so it never traps the user.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const panelBg = dark ? 'bg-[#1e293b] border-white/10' : 'bg-white border-[#1266f1]/10'
  const titleColor = dark ? 'text-white' : 'text-[#262626]'
  const mutedColor = dark ? 'text-white/35' : 'text-[#9fa6b2]'
  const rowHover = dark ? 'hover:bg-white/5' : 'hover:bg-[#F5F7FA]'
  const rowDivider = dark ? 'border-white/5' : 'border-[#1266f1]/8'
  const unreadRow = dark ? 'bg-[#1266f1]/10' : 'bg-[#EBF3FF]'

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        className={`relative p-2.5 rounded-xl transition-colors ${
          dark ? 'hover:bg-white/5' : 'hover:bg-[#F0F3F8]'
        } ${open ? (dark ? 'bg-white/5' : 'bg-[#F0F3F8]') : ''}`}
      >
        <BellIcon className={`w-5 h-5 ${dark ? 'text-white/50' : 'text-[#4f4f4f]'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#f93154] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className={`notification-panel absolute right-0 top-full mt-2 w-[330px] sm:w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border shadow-[0_12px_40px_rgba(0,0,0,0.18)] overflow-hidden ${panelBg}`}
        >
          <div className={`flex items-center justify-between px-5 py-4 border-b ${rowDivider}`}>
            <div className="flex items-center gap-2">
              <h3 className={`text-[14px] font-semibold ${titleColor}`}>Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1266f1]/12 text-[#1266f1]">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-[#1266f1] hover:text-[#0e52c1] transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[340px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <BellIcon className={`w-6 h-6 mx-auto mb-3 ${dark ? 'text-white/20' : 'text-[#9fa6b2]/50'}`} />
                <p className={`text-[13px] font-medium ${titleColor}`}>You are all caught up</p>
                <p className={`text-[12px] mt-1 ${mutedColor}`}>
                  Updates on your tickets, evaluations and polls arrive here.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => markAsRead(n.id)}
                  className={`w-full text-left px-5 py-3.5 border-b last:border-b-0 transition-colors ${rowDivider} ${rowHover} ${!n.read ? unreadRow : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: n.read ? (dark ? 'rgba(255,255,255,0.2)' : '#D9DEE6') : TONE[n.type] || TONE.info }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className={`flex items-center justify-between gap-2 ${titleColor}`}>
                        <span className={`text-[13px] ${n.read ? 'font-medium' : 'font-semibold'}`}>{n.title}</span>
                        <span className={`text-[10px] font-mono shrink-0 ${mutedColor}`}>{formatRelativeTime(n.createdAt)}</span>
                      </span>
                      <span className={`block text-[12px] mt-0.5 leading-relaxed ${mutedColor}`}>{n.message}</span>
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className={`px-5 py-3 border-t ${rowDivider}`}>
              <button
                type="button"
                onClick={() => { clearNotifications(); setOpen(false) }}
                className={`text-[11px] font-semibold transition-colors ${mutedColor} hover:text-[#f93154]`}
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
