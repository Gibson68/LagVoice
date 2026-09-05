/**
 * ProfilePage — Busy, functional profile with account info, settings, activity
 * Pulls user data from localStorage, dark mode aware
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { formatRelativeTime } from '../utils/formatters'
import { useDarkMode } from '../hooks/useDarkMode'

const mockActivity = [
  { id: 1, action: 'Submitted feedback', detail: 'Broken AC in Lecture Hall B', time: new Date(Date.now() - 3600000).toISOString(), icon: 'feedback', color: '#1266f1' },
  { id: 2, action: 'Completed evaluation', detail: 'CSC 301 - Data Structures', time: new Date(Date.now() - 86400000).toISOString(), icon: 'eval', color: '#ffa900' },
  { id: 3, action: 'Voted in poll', detail: 'Campus Security Survey', time: new Date(Date.now() - 172800000).toISOString(), icon: 'poll', color: '#b23cfd' },
  { id: 4, action: 'Ticket resolved', detail: 'Water supply outage in Hall 4', time: new Date(Date.now() - 259200000).toISOString(), icon: 'resolved', color: '#00b74a' },
  { id: 5, action: 'Submitted feedback', detail: 'Slow internet on student portal', time: new Date(Date.now() - 345600000).toISOString(), icon: 'feedback', color: '#1266f1' },
  { id: 6, action: 'Account created', detail: 'Joined LagVoice platform', time: new Date(Date.now() - 604800000).toISOString(), icon: 'account', color: '#0e52c1' },
]

function ActivityIcon({ icon, color }) {
  const icons = {
    feedback: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    eval: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
    poll: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    resolved: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    account: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  }
  return (
    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15`, color }}>
      {icons[icon] || icons.account}
    </div>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const dark = useDarkMode()
  const [userName, setUserName] = useState('Student')
  const [userEmail, setUserEmail] = useState('')
  const [userRole, setUserRole] = useState('Student')
  const [userDept, setUserDept] = useState('Computer Science')
  const [userId, setUserId] = useState('')
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [notifPrefs, setNotifPrefs] = useState({
    email: true,
    push: true,
    sms: false,
    complaints: true,
    evaluations: true,
    polls: true,
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lagvoice_user')
      if (stored) {
        const u = JSON.parse(stored)
        setUserName(u.name || 'Student')
        setUserEmail(u.email || '')
        setUserRole(u.role || 'Student')
        setUserDept(u.department || 'Computer Science')
        setUserId(u.studentId || u.staffId || 'N/A')
        setEditForm({ name: u.name || '', email: u.email || '', department: u.department || '' })
      }
    } catch {}
  }, [])

  const cardBg = dark ? 'bg-[#1e293b]' : 'bg-white'
  const cardBorder = dark ? 'border-white/5' : 'border-[#E4E8EE]'
  const textPrimary = dark ? 'text-white' : 'text-[#262626]'
  const textSecondary = dark ? 'text-white/60' : 'text-[#4f4f4f]'
  const textMuted = dark ? 'text-white/30' : 'text-[#9fa6b2]'
  const hoverBg = dark ? 'hover:bg-white/5' : 'hover:bg-[#F5F7FA]'
  const inputBg = dark ? 'bg-[#0f172a] border-white/10 text-white' : 'bg-[#F5F7FA] border-[#E4E8EE] text-[#262626]'
  const dividerColor = dark ? 'border-white/5' : 'border-[#E4E8EE]/30'

  const handleSave = () => {
    try {
      const stored = localStorage.getItem('lagvoice_user')
      const u = stored ? JSON.parse(stored) : {}
      u.name = editForm.name
      u.email = editForm.email
      u.department = editForm.department
      localStorage.setItem('lagvoice_user', JSON.stringify(u))
      setUserName(editForm.name)
      setUserEmail(editForm.email)
      setUserDept(editForm.department)
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {}
  }

  const handleLogout = () => {
    setShowLogoutConfirm(true)
  }

  const confirmLogout = () => {
    logout()
    navigate('/login')
  }

  const stats = [
    { label: 'Total Complaints', value: '3', color: '#1266f1' },
    { label: 'Resolved', value: '1', color: '#00b74a' },
    { label: 'Evaluations Done', value: '4', color: '#ffa900' },
    { label: 'Polls Voted', value: '2', color: '#b23cfd' },
  ]

  return (
    <div className="space-y-6 opacity-0 animate-slide-in-up">

      {/* ═══ Profile Header ═══ */}
      <div className={`${cardBg} rounded-2xl border ${cardBorder} overflow-hidden`}>
        <div className="relative h-32 lg:h-40" style={{ background: 'linear-gradient(135deg, #1266f1 0%, #0e52c1 50%, #0a3d94 100%)' }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-[#ffa900] rounded-full blur-[60px]" />
            <div className="absolute -bottom-4 left-1/3 w-32 h-32 bg-white rounded-full blur-[50px]" />
          </div>
        </div>
        <div className="relative px-6 lg:px-8 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 sm:-mt-10">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-[#1266f1] flex items-center justify-center text-white text-[2rem] lg:text-[2.5rem] font-bold border-4 shadow-lg shrink-0"
              style={{ borderColor: dark ? '#1e293b' : '#fff' }}>
              {userName.charAt(0)}
            </div>
            <div className="flex-1 pt-2 sm:pt-0">
              <h1 className={`text-[1.4rem] lg:text-[1.6rem] font-bold ${textPrimary} leading-tight`}>{userName}</h1>
              <p className={`text-[13px] ${textMuted} mt-0.5`}>{userEmail}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#1266f1]/10 text-[#1266f1]">{userRole}</span>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#ffa900]/10 text-[#ffa900]">{userDept}</span>
                <span className="text-[11px] font-mono text-[#9fa6b2]">ID: {userId}</span>
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 rounded-xl text-[13px] font-semibold border border-[#1266f1]/20 text-[#1266f1] hover:bg-[#1266f1]/5 transition-all duration-200"
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Quick Stats ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`${cardBg} rounded-2xl border ${cardBorder} p-5`}>
            <p className={`text-[11px] font-semibold uppercase tracking-wider ${textMuted}`}>{stat.label}</p>
            <p className="text-[1.8rem] font-bold mt-2 leading-none" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ═══ Account Info ═══ */}
        <div className={`${cardBg} rounded-2xl border ${cardBorder} overflow-hidden lg:col-span-2`}>
          <div className={`px-6 py-5 border-b ${dividerColor}`}>
            <h2 className={`text-[16px] font-bold ${textPrimary}`}>Account Information</h2>
          </div>
          <div className="p-6 space-y-5">
            {editing ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-[11px] font-semibold uppercase tracking-wider ${textMuted} mb-2`}>Full Name</label>
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${inputBg} text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1266f1]/20 focus:border-[#1266f1]/40 transition-all`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] font-semibold uppercase tracking-wider ${textMuted} mb-2`}>Email</label>
                    <input
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${inputBg} text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1266f1]/20 focus:border-[#1266f1]/40 transition-all`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-[11px] font-semibold uppercase tracking-wider ${textMuted} mb-2`}>Department</label>
                  <input
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border ${inputBg} text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1266f1]/20 focus:border-[#1266f1]/40 transition-all`}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 rounded-xl bg-[#1266f1] text-white text-[13px] font-semibold hover:bg-[#0e52c1] transition-all duration-200 shadow-[0_2px_8px_rgba(18,102,241,0.2)]"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className={`px-6 py-2.5 rounded-xl border ${cardBorder} ${textSecondary} text-[13px] font-semibold ${hoverBg} transition-all duration-200`}
                  >
                    Cancel
                  </button>
                </div>
                {saved && (
                  <div className="px-4 py-3 rounded-xl bg-[#00b74a]/10 border border-[#00b74a]/20 text-[13px] text-[#00b74a] font-medium">
                    Profile updated successfully
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                {[
                  { label: 'Full Name', value: userName },
                  { label: 'Email', value: userEmail },
                  { label: 'Role', value: userRole },
                  { label: 'Department', value: userDept },
                  { label: 'Student / Staff ID', value: userId },
                  { label: 'Faculty', value: 'Faculty of Science' },
                  { label: 'Level', value: '300 Level' },
                  { label: 'Session', value: '2025/2026' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: dark ? 'rgba(255,255,255,0.05)' : 'rgba(228,232,238,0.5)' }}>
                    <span className={`text-[13px] ${textMuted}`}>{item.label}</span>
                    <span className={`text-[14px] font-semibold ${textPrimary}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ═══ Quick Actions ═══ */}
        <div className="space-y-6">
          <div className={`${cardBg} rounded-2xl border ${cardBorder} overflow-hidden`}>
            <div className={`px-6 py-5 border-b ${dividerColor}`}>
              <h2 className={`text-[16px] font-bold ${textPrimary}`}>Quick Actions</h2>
            </div>
            <div className="p-4 space-y-2">
              {[
                { label: 'Submit Feedback', desc: 'Report an issue or share a suggestion', path: '/student/feedback', color: '#1266f1' },
                { label: 'My Tickets', desc: 'Track your complaint submissions', path: '/student/tickets', color: '#ffa900' },
                { label: 'Evaluations', desc: 'Complete course evaluations', path: '/student/evaluations', color: '#b23cfd' },
                { label: 'Polls', desc: 'Vote in campus surveys', path: '/student/polls', color: '#00b74a' },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${hoverBg} transition-all duration-200 text-left group`}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${action.color}12` }}>
                    <svg className="w-4 h-4" style={{ color: action.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-[13px] font-semibold ${textPrimary} group-hover:text-[#1266f1] transition-colors`}>{action.label}</p>
                    <p className={`text-[11px] ${textMuted}`}>{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Notification Preferences ═══ */}
      <div className={`${cardBg} rounded-2xl border ${cardBorder} overflow-hidden`}>
        <div className={`px-6 py-5 border-b ${dividerColor}`}>
          <h2 className={`text-[16px] font-bold ${textPrimary}`}>Notification Preferences</h2>
          <p className={`text-[12px] ${textMuted} mt-0.5`}>Choose how you want to be notified about updates</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: 'email', label: 'Email notifications', desc: 'Receive updates via email' },
              { key: 'push', label: 'Push notifications', desc: 'Browser push alerts' },
              { key: 'sms', label: 'SMS notifications', desc: 'Text message alerts' },
              { key: 'complaints', label: 'Complaint updates', desc: 'Status changes on your tickets' },
              { key: 'evaluations', label: 'Evaluation reminders', desc: 'Deadline notifications' },
              { key: 'polls', label: 'New polls', desc: 'When surveys are published' },
            ].map((pref) => (
              <label
                key={pref.key}
                className={`flex items-center gap-3 p-4 rounded-xl border ${cardBorder} ${hoverBg} cursor-pointer transition-all duration-200 ${notifPrefs[pref.key] ? (dark ? 'border-[#1266f1]/30 bg-[#1266f1]/5' : 'border-[#1266f1]/20 bg-[#1266f1]/3') : ''}`}
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={notifPrefs[pref.key]}
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, [pref.key]: e.target.checked })}
                    className="peer sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full transition-all duration-200 ${notifPrefs[pref.key] ? 'bg-[#1266f1]' : (dark ? 'bg-white/10' : 'bg-[#E4E8EE]')}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${notifPrefs[pref.key] ? 'translate-x-5' : 'translate-x-1'}`} />
                  </div>
                </div>
                <div>
                  <p className={`text-[13px] font-semibold ${textPrimary}`}>{pref.label}</p>
                  <p className={`text-[11px] ${textMuted}`}>{pref.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Security ═══ */}
      <div className={`${cardBg} rounded-2xl border ${cardBorder} overflow-hidden`}>
        <div className={`px-6 py-5 border-b ${dividerColor}`}>
          <h2 className={`text-[16px] font-bold ${textPrimary}`}>Security</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: dark ? 'rgba(255,255,255,0.05)' : 'rgba(228,232,238,0.5)' }}>
            <div>
              <p className={`text-[14px] font-semibold ${textPrimary}`}>Password</p>
              <p className={`text-[12px] ${textMuted}`}>Last changed 45 days ago</p>
            </div>
            <button className="px-4 py-2 rounded-xl text-[12px] font-semibold border border-[#1266f1]/20 text-[#1266f1] hover:bg-[#1266f1]/5 transition-all">
              Change Password
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: dark ? 'rgba(255,255,255,0.05)' : 'rgba(228,232,238,0.5)' }}>
            <div>
              <p className={`text-[14px] font-semibold ${textPrimary}`}>Two-Factor Authentication</p>
              <p className={`text-[12px] ${textMuted}`}>Add an extra layer of security to your account</p>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#ffa900]/10 text-[#ffa900]">Not enabled</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className={`text-[14px] font-semibold ${textPrimary}`}>Active Sessions</p>
              <p className={`text-[12px] ${textMuted}`}>1 active session (this device)</p>
            </div>
            <button className="px-4 py-2 rounded-xl text-[12px] font-semibold border border-[#D32F2F]/20 text-[#D32F2F] hover:bg-[#D32F2F]/5 transition-all">
              Sign out all
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Activity History ═══ */}
      <div className={`${cardBg} rounded-2xl border ${cardBorder} overflow-hidden`}>
        <div className={`flex items-center justify-between px-6 py-5 border-b ${dividerColor}`}>
          <h2 className={`text-[16px] font-bold ${textPrimary}`}>Recent Activity</h2>
          <button className="text-[11px] text-[#1266f1] hover:text-[#0e52c1] font-semibold transition-colors">View All</button>
        </div>
        <div className="divide-y" style={{ borderColor: dark ? 'rgba(255,255,255,0.05)' : 'rgba(228,232,238,0.3)' }}>
          {mockActivity.map((item) => (
            <div key={item.id} className={`flex items-center gap-4 px-6 py-4 ${hoverBg} transition-colors`}>
              <ActivityIcon icon={item.icon} color={item.color} />
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-semibold ${textPrimary}`}>{item.action}</p>
                <p className={`text-[12px] ${textMuted} truncate`}>{item.detail}</p>
              </div>
              <span className={`text-[11px] ${textMuted} shrink-0`}>{formatRelativeTime(item.time)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Danger Zone ═══ */}
      <div className={`${cardBg} rounded-2xl border border-[#D32F2F]/20 overflow-hidden`}>
        <div className="px-6 py-5">
          <h2 className="text-[16px] font-bold text-[#D32F2F]">Danger Zone</h2>
        </div>
        <div className="px-6 pb-6 space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#D32F2F]/5 border border-[#D32F2F]/10">
            <div>
              <p className="text-[14px] font-semibold text-[#D32F2F]">Log Out</p>
              <p className="text-[12px] text-[#D32F2F]/60">Sign out of your account</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-[12px] font-semibold bg-[#D32F2F] text-white hover:bg-[#b71c1c] transition-all shadow-[0_2px_8px_rgba(211,47,47,0.2)]"
            >
              Log Out
            </button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-[#D32F2F]/10">
            <div>
              <p className="text-[14px] font-semibold text-[#D32F2F]">Delete Account</p>
              <p className="text-[12px] text-[#D32F2F]/60">Permanently delete your account and all associated data</p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 rounded-xl text-[12px] font-semibold border border-[#D32F2F]/30 text-[#D32F2F] hover:bg-[#D32F2F]/5 transition-all"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Logout Confirmation ═══ */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[380px] p-8 animate-slide-in-up border border-[#E4E8EE]">
            <div className="w-14 h-14 rounded-2xl bg-[#D32F2F]/10 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-[#D32F2F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </div>
            <h3 className="text-[18px] font-bold text-[#262626] text-center mb-2">Log out?</h3>
            <p className="text-[13px] text-[#9fa6b2] text-center mb-7 leading-relaxed">
              You will be signed out of your account and redirected to the login page.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-[#E4E8EE] text-[14px] font-semibold text-[#4f4f4f] hover:bg-[#F5F7FA] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-3 rounded-xl bg-[#D32F2F] text-white text-[14px] font-semibold hover:bg-[#b71c1c] active:scale-[0.98] transition-all shadow-[0_4px_14px_rgba(211,47,47,0.25)]"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Delete Account Confirmation ═══ */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[380px] p-8 animate-slide-in-up border border-[#E4E8EE]">
            <div className="w-14 h-14 rounded-2xl bg-[#D32F2F]/10 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-[#D32F2F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-[18px] font-bold text-[#262626] text-center mb-2">Delete account?</h3>
            <p className="text-[13px] text-[#9fa6b2] text-center mb-7 leading-relaxed">
              This action is permanent and cannot be undone. All your data will be removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-[#E4E8EE] text-[14px] font-semibold text-[#4f4f4f] hover:bg-[#F5F7FA] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-[#D32F2F] text-white text-[14px] font-semibold hover:bg-[#b71c1c] active:scale-[0.98] transition-all shadow-[0_4px_14px_rgba(211,47,47,0.25)]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
