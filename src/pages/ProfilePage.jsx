/**
 * ProfilePage — the student's account record.
 *
 * Everything captured at sign-up lives here and can be completed or corrected
 * afterwards: identity, academic details, contact and guardian information,
 * notification preferences and security. Edits are written through
 * services/userService, which is the single owner of the account record.
 */
import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { formatRelativeTime } from '../utils/formatters'
import { useDarkMode } from '../hooks/useDarkMode'
import { STORAGE_KEYS, readObject, removeKey, writeJSON } from '../utils/storage'
import {
  DEPARTMENTS,
  FACULTIES,
  GENDERS,
  LEVELS,
  PROGRAMMES,
  SESSIONS,
  deleteAccount,
  getProfile,
  roleLabel,
  saveProfile,
} from '../services/userService'

const ACTIVITY = [
  { id: 1, action: 'Submitted feedback', detail: 'Broken AC in Lecture Hall B', time: new Date(Date.now() - 3600000).toISOString(), icon: 'feedback', color: '#1266f1' },
  { id: 2, action: 'Completed evaluation', detail: 'CSC 301 — Data Structures', time: new Date(Date.now() - 86400000).toISOString(), icon: 'eval', color: '#ffa900' },
  { id: 3, action: 'Voted in poll', detail: 'Campus security survey', time: new Date(Date.now() - 172800000).toISOString(), icon: 'poll', color: '#b23cfd' },
  { id: 4, action: 'Ticket resolved', detail: 'Water supply outage in Hall 4', time: new Date(Date.now() - 259200000).toISOString(), icon: 'resolved', color: '#00b74a' },
  { id: 5, action: 'Submitted feedback', detail: 'Slow internet on student portal', time: new Date(Date.now() - 345600000).toISOString(), icon: 'feedback', color: '#1266f1' },
  { id: 6, action: 'Account created', detail: 'Joined LagVoice', time: new Date(Date.now() - 604800000).toISOString(), icon: 'account', color: '#0e52c1' },
]

const ICONS = {
  feedback: <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
  eval: <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
  poll: <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
  resolved: <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  account: <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
}

const COMPLETION_FIELDS = [
  'name', 'email', 'phone', 'studentId', 'faculty', 'department',
  'programme', 'level', 'session', 'gender', 'dateOfBirth',
  'stateOfOrigin', 'address', 'guardianName', 'guardianPhone',
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* ── Small building blocks ── */
function Section({ title, description, children, dark, className = '', flush = false }) {
  return (
    <section className={`${dark ? 'bg-[#1e293b] border-white/10' : 'bg-white border-[#E4E8EE]'} rounded-2xl border overflow-hidden ${className}`}>
      <header className={`px-6 py-5 border-b ${dark ? 'border-white/5' : 'border-[#E4E8EE]/60'}`}>
        <h2 className={`text-[16px] font-bold ${dark ? 'text-white' : 'text-[#262626]'}`}>{title}</h2>
        {description && (
          <p className={`text-[12px] mt-0.5 ${dark ? 'text-white/30' : 'text-[#9fa6b2]'}`}>{description}</p>
        )}
      </header>
      <div className={flush ? '' : 'p-6'}>{children}</div>
    </section>
  )
}

function Labelled({ label, hint, error, children, dark }) {
  return (
    <label className="block">
      <span className={`block text-[11px] font-semibold uppercase tracking-wider mb-1.5 ${dark ? 'text-white/30' : 'text-[#9fa6b2]'}`}>
        {label}
      </span>
      {children}
      {error ? (
        <span className="block text-[11px] text-[#D32F2F] mt-1.5">{error}</span>
      ) : hint ? (
        <span className={`block text-[11px] mt-1.5 ${dark ? 'text-white/25' : 'text-[#9fa6b2]/80'}`}>{hint}</span>
      ) : null}
    </label>
  )
}

function Field({ label, name, value, onChange, type = 'text', placeholder, hint, error, disabled, dark, autoComplete }) {
  return (
    <Labelled label={label} hint={hint} error={error} dark={dark}>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`w-full px-4 py-3 rounded-xl border text-[14px] transition-all focus:outline-none focus:ring-2 focus:ring-[#1266f1]/20 focus:border-[#1266f1]/40 disabled:opacity-50 disabled:cursor-not-allowed ${
          error
            ? 'border-[#D32F2F]/50'
            : dark ? 'bg-[#0f172a] border-white/10 text-white placeholder:text-slate-500' : 'bg-[#F5F7FA] border-[#E4E8EE] text-[#262626] placeholder:text-[#9fa6b2]'
        }`}
      />
    </Labelled>
  )
}

function Select({ label, name, value, onChange, options, hint, disabled, dark }) {
  return (
    <Labelled label={label} hint={hint} dark={dark}>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl border text-[14px] transition-all focus:outline-none focus:ring-2 focus:ring-[#1266f1]/20 focus:border-[#1266f1]/40 disabled:opacity-50 disabled:cursor-not-allowed ${
          dark ? 'bg-[#0f172a] border-white/10 text-white' : 'bg-[#F5F7FA] border-[#E4E8EE] text-[#262626]'
        }`}
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </Labelled>
  )
}

function Toggle({ label, description, checked, onChange, dark }) {
  return (
    <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
      checked
        ? dark ? 'border-[#1266f1]/40 bg-[#1266f1]/10' : 'border-[#1266f1]/25 bg-[#1266f1]/[0.04]'
        : dark ? 'border-white/10 hover:bg-white/5' : 'border-[#E4E8EE] hover:bg-[#F5F7FA]'
    }`}>
      <span className="relative inline-flex shrink-0">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <span className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-[#1266f1]' : dark ? 'bg-white/15' : 'bg-[#E4E8EE]'}`} />
        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-4' : ''}`} />
      </span>
      <span className="min-w-0">
        <span className={`block text-[13px] font-semibold ${dark ? 'text-white' : 'text-[#262626]'}`}>{label}</span>
        <span className={`block text-[11px] ${dark ? 'text-white/30' : 'text-[#9fa6b2]'}`}>{description}</span>
      </span>
    </label>
  )
}

function Stat({ label, value, color, dark }) {
  return (
    <div className={`${dark ? 'bg-[#1e293b] border-white/10' : 'bg-white border-[#E4E8EE]'} rounded-2xl border p-5`}>
      <p className={`text-[11px] font-semibold uppercase tracking-wider ${dark ? 'text-white/30' : 'text-[#9fa6b2]'}`}>{label}</p>
      <p className="text-[1.8rem] font-bold mt-2 leading-none" style={{ color }}>{value}</p>
    </div>
  )
}

function ConfirmDialog({ open, title, body, confirmLabel, onConfirm, onCancel, dark, tone = 'danger', confirmDisabled, children }) {
  if (!open) return null
  const toneColor = tone === 'danger' ? '#D32F2F' : '#1266f1'
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className={`relative w-full max-w-[400px] p-8 rounded-2xl shadow-2xl animate-slide-in-up border ${
        dark ? 'bg-[#1e293b] border-white/10' : 'bg-white border-[#E4E8EE]'
      }`}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: `${toneColor}18` }}>
          <svg className="w-7 h-7" style={{ color: toneColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h3 className={`text-[18px] font-bold text-center mb-2 ${dark ? 'text-white' : 'text-[#262626]'}`}>{title}</h3>
        <p className={`text-[13px] text-center leading-relaxed mb-5 ${dark ? 'text-white/40' : 'text-[#9fa6b2]'}`}>{body}</p>
        {children}
        <div className="flex gap-3 mt-1">
          <button
            onClick={onCancel}
            className={`flex-1 py-3 rounded-xl border text-[14px] font-semibold transition-all ${
              dark ? 'border-white/10 text-white/70 hover:bg-white/5' : 'border-[#E4E8EE] text-[#4f4f4f] hover:bg-[#F5F7FA]'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={confirmDisabled}
            className="flex-1 py-3 rounded-xl text-white text-[14px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
            style={{ backgroundColor: toneColor }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const dark = useDarkMode()
  const fileRef = useRef(null)

  const [profile, setProfile] = useState(getProfile)
  const [form, setForm] = useState(getProfile)
  const [editing, setEditing] = useState(false)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')
  const [prefs, setPrefs] = useState(() => ({
    email: true, push: true, sms: false, complaints: true, evaluations: true, polls: true,
    ...readObject(STORAGE_KEYS.prefs),
  }))
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' })
  const [passwordState, setPasswordState] = useState({ status: 'idle', message: '' })
  const [twoFactor, setTwoFactor] = useState(false)
  const [showLogout, setShowLogout] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteWord, setDeleteWord] = useState('')
  const [prefsSaved, setPrefsSaved] = useState(false)

  // Preferences are the one thing saved as you toggle, no submit button.
  useEffect(() => {
    writeJSON(STORAGE_KEYS.prefs, prefs)
  }, [prefs])

  const completion = useMemo(() => {
    const filled = COMPLETION_FIELDS.filter((key) => String(profile[key] || '').trim().length > 0)
    return Math.round((filled.length / COMPLETION_FIELDS.length) * 100)
  }, [profile])

  const missing = useMemo(
    () => COMPLETION_FIELDS.filter((key) => !String(profile[key] || '').trim()).length,
    [profile]
  )

  const set = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Enter your full name'
    if (!EMAIL_PATTERN.test(form.email.trim())) next.email = 'Enter a valid email address'
    if (!form.studentId.trim()) next.studentId = 'Enter your matric number'
    if (form.phone.trim() && !/^[0-9+\-\s()]{7,20}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number'
    if (form.guardianPhone.trim() && !/^[0-9+\-\s()]{7,20}$/.test(form.guardianPhone.trim())) next.guardianPhone = 'Enter a valid phone number'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const startEditing = () => {
    setForm(profile)
    setErrors({})
    setNotice('')
    setEditing(true)
  }

  const cancelEditing = () => {
    setForm(profile)
    setErrors({})
    setEditing(false)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!validate()) return
    setProfile(saveProfile(form))
    setEditing(false)
    setNotice('Account details saved.')
    setTimeout(() => setNotice(''), 2500)
  }

  const handleAvatar = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 1_500_000) {
      setNotice('Choose an image smaller than 1.5 MB.')
      setTimeout(() => setNotice(''), 3000)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setProfile(saveProfile({ avatar: reader.result }))
      setNotice('Profile photo updated.')
      setTimeout(() => setNotice(''), 2500)
    }
    reader.readAsDataURL(file)
  }

  const handlePassword = (e) => {
    e.preventDefault()
    const { current, next, confirm } = passwordForm
    if (!current) {
      setPasswordState({ status: 'error', message: 'Enter your current password' })
      return
    }
    if (next.length < 8) {
      setPasswordState({ status: 'error', message: 'New password must be at least 8 characters' })
      return
    }
    if (next !== confirm) {
      setPasswordState({ status: 'error', message: 'New passwords do not match' })
      return
    }
    setProfile(saveProfile({ passwordUpdatedAt: new Date().toISOString() }))
    setPasswordForm({ current: '', next: '', confirm: '' })
    setPasswordState({ status: 'success', message: 'Password updated. Use it next time you sign in.' })
  }

  const handlePrefs = (key) => (value) => {
    setPrefs((prev) => ({ ...prev, [key]: value }))
    setPrefsSaved(true)
    setTimeout(() => setPrefsSaved(false), 1500)
  }

  const confirmLogout = () => {
    logout()
    navigate('/login')
  }

  const confirmDelete = () => {
    deleteAccount()
    removeKey(STORAGE_KEYS.complaints)
    logout()
    navigate('/')
  }

  const stats = [
    { label: 'Complaints filed', value: '3', color: '#1266f1' },
    { label: 'Resolved', value: '1', color: '#00b74a' },
    { label: 'Evaluations done', value: '4', color: '#ffa900' },
    { label: 'Polls voted', value: '2', color: '#b23cfd' },
  ]

  const initials = profile.name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()

  return (
    <div className="space-y-6 page-enter">

      {/* ═══ Identity header ═══ */}
      <div className={`${dark ? 'bg-[#1e293b] border-white/10' : 'bg-white border-[#E4E8EE]'} rounded-2xl border overflow-hidden`}>
        <div className="relative h-32 lg:h-40" style={{ background: 'linear-gradient(135deg, #1266f1 0%, #0e52c1 55%, #0a3d94 100%)' }}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-[#ffa900] rounded-full blur-[60px]" />
            <div className="absolute -bottom-4 left-1/3 w-32 h-32 bg-white rounded-full blur-[50px]" />
          </div>
        </div>

        <div className="relative px-5 sm:px-6 lg:px-8 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 sm:-mt-10">
            <div className="relative shrink-0">
              <div
                className={`w-20 h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden flex items-center justify-center text-white text-[2rem] lg:text-[2.5rem] font-bold border-4 shadow-lg ${
                  profile.avatar ? '' : 'bg-[#1266f1]'
                }`}
                style={{ borderColor: dark ? '#1e293b' : '#ffffff' }}
              >
                {profile.avatar
                  ? <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                  : initials || 'S'}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-white text-[#1266f1] shadow-md flex items-center justify-center hover:scale-105 transition-transform"
                aria-label="Change profile photo"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h1.6l.9-1.5A1 1 0 018.35 5h7.3a1 1 0 01.85.5l.9 1.5H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <circle cx="12" cy="13" r="3.2" />
                </svg>
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
            </div>

            <div className="flex-1 min-w-0 pt-2 sm:pt-0">
              <h1 className={`text-[1.4rem] lg:text-[1.6rem] font-bold leading-tight truncate ${dark ? 'text-white' : 'text-[#262626]'}`}>
                {profile.name}
              </h1>
              <p className={`text-[13px] mt-0.5 truncate ${dark ? 'text-white/40' : 'text-[#9fa6b2]'}`}>{profile.email || 'No email on file'}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#1266f1]/10 text-[#1266f1]">{roleLabel(profile)}</span>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#ffa900]/12 text-[#cc8800]">{profile.department}</span>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#b23cfd]/10 text-[#b23cfd]">{profile.level}</span>
                <span className={`text-[11px] font-mono ${dark ? 'text-white/30' : 'text-[#9fa6b2]'}`}>{profile.studentId || 'No matric number'}</span>
              </div>
            </div>

            {!editing && (
              <button
                onClick={startEditing}
                className="px-4 py-2 rounded-xl text-[13px] font-semibold border border-[#1266f1]/25 text-[#1266f1] hover:bg-[#1266f1]/5 transition-all"
              >
                Edit details
              </button>
            )}
          </div>

          {/* Completion meter — an action prompt, not decoration */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[12px] font-semibold ${dark ? 'text-white/50' : 'text-[#4f4f4f]'}`}>
                Profile {completion}% complete
              </span>
              {missing > 0 && (
                <button onClick={startEditing} className="text-[11px] font-semibold text-[#1266f1] hover:underline">
                  Add {missing} missing {missing === 1 ? 'detail' : 'details'}
                </button>
              )}
            </div>
            <div className={`h-1.5 rounded-full overflow-hidden ${dark ? 'bg-white/10' : 'bg-[#E4E8EE]'}`}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#1266f1] to-[#00b74a] transition-all duration-700"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {notice && (
        <div className="px-4 py-3 rounded-xl bg-[#00b74a]/10 border border-[#00b74a]/25 text-[13px] text-[#2E7D32] dark:text-[#00b74a] font-medium">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => <Stat key={stat.label} {...stat} dark={dark} />)}
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="space-y-6">
          <Section title="Personal details" description="How the university can identify and reach you" dark={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field dark={dark} label="Full name" name="name" value={form.name} onChange={set} placeholder="Chidinma Okafor" error={errors.name} autoComplete="name" />
              <Field dark={dark} label="Email" name="email" type="email" value={form.email} onChange={set} placeholder="you@student.unilag.edu.ng" error={errors.email} autoComplete="email" />
              <Field dark={dark} label="Phone number" name="phone" value={form.phone} onChange={set} placeholder="080 0000 0000" error={errors.phone} autoComplete="tel" />
              <Field dark={dark} label="Date of birth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={set} />
              <Select dark={dark} label="Gender" name="gender" value={form.gender || GENDERS[0]} onChange={set} options={GENDERS} />
              <Field dark={dark} label="State of origin" name="stateOfOrigin" value={form.stateOfOrigin} onChange={set} placeholder="Lagos" />
            </div>
            <div className="mt-4">
              <Labelled dark={dark} label="Home address" hint="Used only for correspondence">
                <textarea
                  name="address"
                  value={form.address}
                  onChange={set}
                  rows={2}
                  placeholder="12 University Road, Akoka, Lagos"
                  className={`w-full px-4 py-3 rounded-xl border text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-[#1266f1]/20 focus:border-[#1266f1]/40 ${
                    dark ? 'bg-[#0f172a] border-white/10 text-white placeholder:text-slate-500' : 'bg-[#F5F7FA] border-[#E4E8EE] text-[#262626] placeholder:text-[#9fa6b2]'
                  }`}
                />
              </Labelled>
            </div>
          </Section>

          <Section title="Academic record" description="Matches what the registry holds for you" dark={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field dark={dark} label="Matric / staff number" name="studentId" value={form.studentId} onChange={set} placeholder="2021/12345" error={errors.studentId} />
              <Select dark={dark} label="Faculty" name="faculty" value={form.faculty} onChange={set} options={FACULTIES} />
              {form.role === 'student' ? (
                <Select dark={dark} label="Department" name="department" value={form.department} onChange={set} options={DEPARTMENTS} />
              ) : (
                <Field dark={dark} label="Department / Unit" name="department" value={form.department} onChange={set} placeholder="e.g., Works & Maintenance" />
              )}
              <Select dark={dark} label="Programme" name="programme" value={form.programme} onChange={set} options={PROGRAMMES} />
              <Select dark={dark} label="Level" name="level" value={form.level} onChange={set} options={LEVELS} />
              <Select dark={dark} label="Session" name="session" value={form.session} onChange={set} options={SESSIONS} />
            </div>
          </Section>

          <Section title="Emergency contact" description="Who we contact if something happens on campus" dark={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field dark={dark} label="Guardian name" name="guardianName" value={form.guardianName} onChange={set} placeholder="Mrs. Ngozi Okafor" />
              <Field dark={dark} label="Guardian phone" name="guardianPhone" value={form.guardianPhone} onChange={set} placeholder="080 1111 1111" error={errors.guardianPhone} />
            </div>
          </Section>

          <div className={`sticky bottom-0 flex flex-col sm:flex-row gap-3 p-4 rounded-2xl border backdrop-blur ${
            dark ? 'bg-[#1e293b]/90 border-white/10' : 'bg-white/90 border-[#E4E8EE]'
          }`}>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#1266f1] text-white text-[14px] font-semibold hover:bg-[#0e52c1] transition-all shadow-[0_2px_10px_rgba(18,102,241,0.25)]"
            >
              Save changes
            </button>
            <button
              type="button"
              onClick={cancelEditing}
              className={`px-6 py-3 rounded-xl border text-[14px] font-semibold transition-all ${
                dark ? 'border-white/10 text-white/70 hover:bg-white/5' : 'border-[#E4E8EE] text-[#4f4f4f] hover:bg-[#F5F7FA]'
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Section title="Personal details" dark={dark} className="lg:col-span-2">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                {[
                  { label: 'Full name', value: profile.name },
                  { label: 'Email', value: profile.email },
                  { label: 'Phone number', value: profile.phone },
                  { label: 'Date of birth', value: profile.dateOfBirth },
                  { label: 'Gender', value: profile.gender },
                  { label: 'State of origin', value: profile.stateOfOrigin },
                  { label: 'Home address', value: profile.address },
                ].map((item) => (
                  <div key={item.label} className={`py-3 border-b ${dark ? 'border-white/5' : 'border-[#E4E8EE]/50'}`}>
                    <dt className={`text-[11px] uppercase tracking-wider font-semibold ${dark ? 'text-white/30' : 'text-[#9fa6b2]'}`}>{item.label}</dt>
                    <dd className={`text-[14px] font-semibold mt-0.5 ${item.value ? (dark ? 'text-white' : 'text-[#262626]') : (dark ? 'text-white/25' : 'text-[#9fa6b2]/70')}`}>
                      {item.value || 'Not provided'}
                    </dd>
                  </div>
                ))}
              </dl>
            </Section>

            <div className="space-y-6">
              <Section title="Academic record" dark={dark}>
                <dl className="space-y-3">
                  {[
                    { label: profile.role === 'student' ? 'Matric number' : 'Staff ID', value: profile.studentId },
                    { label: 'Faculty', value: profile.faculty },
                    { label: 'Department / Unit', value: profile.department },
                    { label: 'Programme', value: profile.programme },
                    { label: 'Level', value: profile.level },
                    { label: 'Session', value: profile.session },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-3">
                      <dt className={`text-[12px] ${dark ? 'text-white/30' : 'text-[#9fa6b2]'}`}>{item.label}</dt>
                      <dd className={`text-[13px] font-semibold text-right ${dark ? 'text-white' : 'text-[#262626]'}`}>{item.value || '—'}</dd>
                    </div>
                  ))}
                </dl>
              </Section>

              <Section title="Emergency contact" dark={dark}>
                <dl className="space-y-3">
                  <div>
                    <dt className={`text-[11px] uppercase tracking-wider font-semibold ${dark ? 'text-white/30' : 'text-[#9fa6b2]'}`}>Guardian</dt>
                    <dd className={`text-[14px] font-semibold ${dark ? 'text-white' : 'text-[#262626]'}`}>{profile.guardianName || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className={`text-[11px] uppercase tracking-wider font-semibold ${dark ? 'text-white/30' : 'text-[#9fa6b2]'}`}>Guardian phone</dt>
                    <dd className={`text-[14px] font-semibold ${dark ? 'text-white' : 'text-[#262626]'}`}>{profile.guardianPhone || 'Not provided'}</dd>
                  </div>
                </dl>
              </Section>
            </div>
          </div>

          <Section title="Shortcuts" description="Jump back into the things you do most" dark={dark}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Submit feedback', desc: 'Report an issue', path: '/student/feedback', color: '#1266f1' },
                { label: 'My tickets', desc: 'Track submissions', path: '/student/tickets', color: '#ffa900' },
                { label: 'Evaluations', desc: 'Rate your courses', path: '/student/evaluations', color: '#b23cfd' },
                { label: 'Polls', desc: 'Vote in surveys', path: '/student/polls', color: '#00b74a' },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all group ${
                    dark ? 'border-white/10 hover:bg-white/5' : 'border-[#E4E8EE] hover:bg-[#F5F7FA]'
                  }`}
                >
                  <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${action.color}18`, color: action.color }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-[13px] font-semibold group-hover:text-[#1266f1] transition-colors ${dark ? 'text-white' : 'text-[#262626]'}`}>{action.label}</span>
                    <span className={`block text-[11px] ${dark ? 'text-white/30' : 'text-[#9fa6b2]'}`}>{action.desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </Section>
        </>
      )}

      {/* ═══ Notification preferences ═══ */}
      <Section
        title="Notification preferences"
        description={prefsSaved ? 'Saved' : 'Choose how we reach you about your requests'}
        dark={dark}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Toggle dark={dark} label="Email notifications" description="Updates sent to your inbox" checked={prefs.email} onChange={handlePrefs('email')} />
          <Toggle dark={dark} label="Push notifications" description="Alerts in this browser" checked={prefs.push} onChange={handlePrefs('push')} />
          <Toggle dark={dark} label="SMS notifications" description="Text messages for urgent items" checked={prefs.sms} onChange={handlePrefs('sms')} />
          <Toggle dark={dark} label="Complaint updates" description="Status changes on your tickets" checked={prefs.complaints} onChange={handlePrefs('complaints')} />
          <Toggle dark={dark} label="Evaluation reminders" description="Before a course closes" checked={prefs.evaluations} onChange={handlePrefs('evaluations')} />
          <Toggle dark={dark} label="New polls" description="When a survey opens" checked={prefs.polls} onChange={handlePrefs('polls')} />
        </div>
      </Section>

      {/* ═══ Security ═══ */}
      <Section title="Security" description="Keep your account and your submissions private" dark={dark}>
        <form onSubmit={handlePassword} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field dark={dark} label="Current password" name="current" type="password" value={passwordForm.current}
            onChange={(e) => { setPasswordForm((p) => ({ ...p, current: e.target.value })); setPasswordState({ status: 'idle', message: '' }) }}
            placeholder="••••••••" autoComplete="current-password" />
          <Field dark={dark} label="New password" name="next" type="password" value={passwordForm.next}
            onChange={(e) => { setPasswordForm((p) => ({ ...p, next: e.target.value })); setPasswordState({ status: 'idle', message: '' }) }}
            placeholder="At least 8 characters" autoComplete="new-password" />
          <Field dark={dark} label="Confirm new password" name="confirm" type="password" value={passwordForm.confirm}
            onChange={(e) => { setPasswordForm((p) => ({ ...p, confirm: e.target.value })); setPasswordState({ status: 'idle', message: '' }) }}
            placeholder="Repeat new password" autoComplete="new-password" />

          {passwordState.message && (
            <p className={`sm:col-span-3 text-[12px] font-medium ${passwordState.status === 'error' ? 'text-[#D32F2F]' : 'text-[#00b74a]'}`}>
              {passwordState.message}
            </p>
          )}

          <div className="sm:col-span-3 flex flex-col sm:flex-row gap-3">
            <button type="submit" className="px-6 py-3 rounded-xl bg-[#1266f1] text-white text-[13px] font-semibold hover:bg-[#0e52c1] transition-all">
              Update password
            </button>
            <span className={`self-center text-[12px] ${dark ? 'text-white/30' : 'text-[#9fa6b2]'}`}>
              {profile.passwordUpdatedAt
                ? `Last changed ${formatRelativeTime(profile.passwordUpdatedAt)}`
                : 'You have not changed this password yet'}
            </span>
          </div>
        </form>

        <div className={`mt-6 space-y-4 pt-6 border-t ${dark ? 'border-white/5' : 'border-[#E4E8EE]/60'}`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={`text-[14px] font-semibold ${dark ? 'text-white' : 'text-[#262626]'}`}>Two-factor authentication</p>
              <p className={`text-[12px] ${dark ? 'text-white/30' : 'text-[#9fa6b2]'}`}>
                {twoFactor ? 'A code is required at every sign-in' : 'Add a second step to your sign-in'}
              </p>
            </div>
            <button
              onClick={() => setTwoFactor((v) => !v)}
              className={`px-4 py-2 rounded-xl text-[12px] font-semibold border transition-all ${
                twoFactor
                  ? 'border-[#D32F2F]/25 text-[#D32F2F] hover:bg-[#D32F2F]/5'
                  : 'border-[#00b74a]/25 text-[#2E7D32] dark:text-[#00b74a] hover:bg-[#00b74a]/5'
              }`}
            >
              {twoFactor ? 'Turn off' : 'Turn on'}
            </button>
          </div>

          <div className={`flex items-center justify-between gap-4 pt-4 border-t ${dark ? 'border-white/5' : 'border-[#E4E8EE]/60'}`}>
            <div>
              <p className={`text-[14px] font-semibold ${dark ? 'text-white' : 'text-[#262626]'}`}>Active sessions</p>
              <p className={`text-[12px] ${dark ? 'text-white/30' : 'text-[#9fa6b2]'}`}>1 session — this device</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/login') }}
              className="px-4 py-2 rounded-xl text-[12px] font-semibold border border-[#D32F2F]/25 text-[#D32F2F] hover:bg-[#D32F2F]/5 transition-all"
            >
              Sign out everywhere
            </button>
          </div>
        </div>
      </Section>

      {/* ═══ Activity ═══ */}
      <Section title="Recent activity" description="What you have done on LagVoice" dark={dark} flush>
        <div className={`divide-y ${dark ? 'divide-white/5' : 'divide-[#E4E8EE]/50'}`}>
          {ACTIVITY.map((item) => (
            <div key={item.id} className={`flex items-center gap-4 px-6 py-4 transition-colors ${dark ? 'hover:bg-white/5' : 'hover:bg-[#F5F7FA]'}`}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}18`, color: item.color }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  {ICONS[item.icon] || ICONS.account}
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-semibold ${dark ? 'text-white' : 'text-[#262626]'}`}>{item.action}</p>
                <p className={`text-[12px] truncate ${dark ? 'text-white/30' : 'text-[#9fa6b2]'}`}>{item.detail}</p>
              </div>
              <span className={`text-[11px] shrink-0 ${dark ? 'text-white/30' : 'text-[#9fa6b2]'}`}>{formatRelativeTime(item.time)}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ Danger zone ═══ */}
      <section className={`${dark ? 'bg-[#1e293b]' : 'bg-white'} rounded-2xl border border-[#D32F2F]/20 overflow-hidden`}>
        <header className="px-6 py-5">
          <h2 className="text-[16px] font-bold text-[#D32F2F]">Danger zone</h2>
        </header>
        <div className="px-6 pb-6 space-y-3">
          <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-[#D32F2F]/5 border-[#D32F2F]/10'}`}>
            <div>
              <p className="text-[14px] font-semibold text-[#D32F2F]">Sign out</p>
              <p className={`text-[12px] ${dark ? 'text-white/30' : 'text-[#9fa6b2]'}`}>Leave your account on this device</p>
            </div>
            <button
              onClick={() => setShowLogout(true)}
              className="px-4 py-2 rounded-xl text-[12px] font-semibold bg-[#D32F2F] text-white hover:bg-[#b71c1c] transition-all shrink-0"
            >
              Sign out
            </button>
          </div>
          <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border ${dark ? 'border-white/10' : 'border-[#D32F2F]/10'}`}>
            <div>
              <p className="text-[14px] font-semibold text-[#D32F2F]">Delete account</p>
              <p className={`text-[12px] ${dark ? 'text-white/30' : 'text-[#9fa6b2]'}`}>Removes your profile, tickets and preferences</p>
            </div>
            <button
              onClick={() => { setDeleteWord(''); setShowDelete(true) }}
              className="px-4 py-2 rounded-xl text-[12px] font-semibold border border-[#D32F2F]/30 text-[#D32F2F] hover:bg-[#D32F2F]/5 transition-all shrink-0"
            >
              Delete account
            </button>
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={showLogout}
        dark={dark}
        title="Sign out?"
        body="You will be returned to the sign-in page. Your profile and submissions stay saved."
        confirmLabel="Sign out"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogout(false)}
      />

      <ConfirmDialog
        open={showDelete}
        dark={dark}
        title="Delete your account?"
        body="This removes your profile, submitted complaints and notification preferences from this device. It cannot be undone."
        confirmLabel="Delete account"
        confirmDisabled={deleteWord.trim().toUpperCase() !== 'DELETE'}
        onConfirm={confirmDelete}
        onCancel={() => setShowDelete(false)}
      >
        <Labelled dark={dark} label="Type DELETE to confirm">
          <input
            value={deleteWord}
            onChange={(e) => setDeleteWord(e.target.value)}
            placeholder="DELETE"
            className={`w-full px-4 py-3 rounded-xl border text-[14px] font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F]/40 ${
              dark ? 'bg-[#0f172a] border-white/10 text-white placeholder:text-slate-600' : 'bg-[#F5F7FA] border-[#E4E8EE] text-[#262626] placeholder:text-[#9fa6b2]'
            }`}
          />
        </Labelled>
      </ConfirmDialog>
    </div>
  )
}
