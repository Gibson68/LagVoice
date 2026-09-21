/**
 * AuthPage — Sign In / Sign Up
 * Split-screen: clean form left, floating preview cards right
 * Inspired by modern SaaS auth designs with UNILAG maroon/gold palette
 * Includes back-to-home button
 */
import { useState, useCallback, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { DEPARTMENTS, FACULTIES } from '../services/userService'

const ROLES = [
  { id: 'student', label: 'Student' },
  { id: 'staff', label: 'Staff' },
  { id: 'non-staff', label: 'Non-Staff' },
]

/* ── Inline validation message (stable module-level component) ── */
function FieldError({ message }) {
  if (!message) return null
  return <p className="text-[11px] text-red-500 mt-1.5">{message}</p>
}

/* ── Floating preview card: Ticket Status ── */
function TicketPreviewCard() {
  return (
    <div className="floating-card floating-card-1 w-[260px] bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-mist/40 p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-maroon via-gold to-maroon" />
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-semibold text-ink/40 uppercase tracking-widest">Recent Ticket</span>
        <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
      </div>
      <p className="text-[13px] font-semibold text-ink leading-snug mb-3">Broken AC in Lecture Hall B</p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-ink/40">#UNILAG-00042</span>
        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-pending/10 text-pending uppercase tracking-wide">Under Review</span>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-mist-light rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-maroon to-gold rounded-full" style={{ width: '60%' }} />
        </div>
        <span className="text-[10px] font-mono text-ink/30">60%</span>
      </div>
    </div>
  )
}

/* ── Floating preview card: Satisfaction Score ── */
function SatisfactionCard() {
  return (
    <div className="floating-card floating-card-2 w-[220px] bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-mist/40 p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-maroon/8 flex items-center justify-center">
          <svg className="w-4 h-4 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <span className="text-[11px] font-semibold text-ink/50">Satisfaction</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[2rem] font-bold text-ink font-mono leading-none">78%</span>
        <span className="text-[11px] text-resolved font-semibold">↑ 4.2%</span>
      </div>
      <div className="mt-3 flex items-center gap-1">
        {[1,2,3,4,5].map(i => (
          <svg key={i} className={`w-3.5 h-3.5 ${i <= 4 ? 'text-gold' : 'text-mist'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
  )
}

/* ── Floating preview card: Stats ── */
function StatsCard() {
  return (
    <div className="floating-card floating-card-3 w-[200px] bg-gradient-to-br from-maroon-deep to-maroon rounded-2xl shadow-[0_12px_40px_rgba(80,4,4,0.25)] p-5 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
      }} />
      <div className="relative z-10">
        <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">Campus Impact</p>
        <p className="text-[2rem] font-bold font-mono leading-none">47</p>
        <p className="text-[11px] text-white/40 mt-1.5">Complaints resolved so far</p>
        <div className="mt-4 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-[10px] font-semibold">48h</span>
          <span className="text-[10px] text-white/30">avg response</span>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  const navigate = useNavigate()
  const { login, registerUser, loading, error, clearError } = useAuth()
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [signupStep, setSignupStep] = useState(1)
  const [fieldErrors, setFieldErrors] = useState({})
  const [form, setForm] = useState({
    email: '', password: '', role: 'student', remember: false,
    firstName: '', lastName: '', studentId: '', department: '',
    faculty: 'Science', phone: '', confirmPassword: '', agreeTerms: false,
  })

  const switchMode = useCallback((next) => {
    setMode(next)
    clearError()
    setSignupStep(1)
    setFieldErrors({})
  }, [clearError])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (error) clearError()
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  /* ── Sign-up wizard ── */
  const SIGNUP_STEPS = [
    { id: 'account', label: 'Account' },
    { id: 'details', label: 'Details' },
    { id: 'secure', label: 'Secure' },
  ]
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const passwordStrength = (pw) => {
    if (!pw) return 0
    let score = 0
    if (pw.length >= 8) score += 1
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1
    if (/\d/.test(pw)) score += 1
    if (/[^A-Za-z0-9]/.test(pw)) score += 1
    return score
  }
  const strength = passwordStrength(form.password)
  const strengthLabel = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-500', 'bg-emerald-500'][strength]

  const validateSignupStep = (step) => {
    const errs = {}
    if (step === 1) {
      if (!form.firstName.trim()) errs.firstName = 'Enter your first name'
      if (!form.lastName.trim()) errs.lastName = 'Enter your last name'
      if (!EMAIL_RE.test(form.email.trim())) errs.email = 'Enter a valid email address'
    }
    if (step === 2) {
      if (!String(form.department).trim()) errs.department = form.role === 'non-staff' ? 'Type your unit or office' : 'Select your department'
      if (!form.studentId.trim()) errs.studentId = form.role === 'student' ? 'Enter your matric number' : 'Enter your staff ID'
      if (form.phone && !/^[+\d][\d\s-]{6,14}$/.test(form.phone.trim())) errs.phone = 'Enter a valid phone number'
    }
    return errs
  }

  const goNextSignup = () => {
    const errs = validateSignupStep(signupStep)
    setFieldErrors(errs)
    if (Object.keys(errs).length === 0) setSignupStep(s => Math.min(s + 1, 3))
  }

  const handleRegisterStep = (e) => {
    if (signupStep < 3) {
      e.preventDefault()
      goNextSignup()
      return
    }
    const errs = {}
    if (!form.password || passwordStrength(form.password) < 2) errs.password = 'Use at least 8 characters with mixed case and a number'
    if (form.confirmPassword !== form.password) errs.confirmPassword = 'Passwords do not match'
    if (!form.agreeTerms) errs.agreeTerms = 'Please accept the policy to continue'
    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) {
      e.preventDefault()
      return
    }
    handleRegister(e)
  }

  const errCls = (name) => (fieldErrors[name]
    ? 'border-red-400 focus:ring-red-400/15 focus:border-red-400/50'
    : 'border-mist/80 focus:ring-maroon/15 focus:border-maroon/40')
  const inputCls = (name) => `w-full px-4 py-3 text-[14px] rounded-xl bg-white border ${errCls(name)} text-ink
    placeholder:text-ink/25 focus:outline-none focus:ring-2 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]`
  const selectCls = (name) => `w-full px-4 py-3 text-[14px] rounded-xl bg-white border ${errCls(name)} text-ink
    focus:outline-none focus:ring-2 transition-all duration-200 appearance-none cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]
    bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20fill%3D%22%23800000%22%20d%3D%22M4.5%206l3.5%204%203.5-4z%22/%3E%3C/svg%3E')]
    bg-no-repeat bg-[right_12px_center]`
  const errText = (name) => fieldErrors[name] || null

  const handleLogin = async (e) => {
    e.preventDefault()
    // Same mapping as sign-up: students get the student portal, Staff and
    // Non-Staff share the staff portal, and the category rides along so the
    // profile shows the right label.
    const internalRole = form.role === 'student' ? 'student' : 'faculty'
    await login(form.email, form.password, internalRole, form.role === 'student' ? '' : form.role)
    navigate(`/${internalRole}`)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    // Student / Staff / Non-Staff are what the form collects; Staff and
    // Non-Staff share the staff portal, and the category rides along on the
    // profile so every screen can show the right label.
    const internalRole = form.role === 'student' ? 'student' : 'faculty'
    const result = await registerUser({
      ...form,
      role: internalRole,
      staffCategory: form.role === 'student' ? '' : form.role,
    })
    if (result?.meta?.requestStatus === 'fulfilled') {
      // Registration signs you in, so land on the dashboard for your role.
      navigate(`/${result.payload?.user?.role || internalRole}`)
    }
  }

  return (
    <div className="auth-surface min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[#F5F0EB] via-[#FAF8F3] to-[#F0EDE8]">
      {/* ─── Left Panel: Auth Form ─── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-10 min-h-screen overflow-y-auto">
        <div className="w-full max-w-[420px]">
          {/* Back to Home */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[13px] text-ink/40 hover:text-ink/70 font-medium transition-colors mb-5 group"
            aria-label="Back to home page"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <img src="/images/logo-n.png" alt="LagVoice" className="w-12 h-12 rounded-xl object-cover shadow-[0_2px_8px_rgba(128,0,0,0.15)]" />
            <div>
              <span className="text-ink font-bold text-lg tracking-tight">LagVoice</span>
              <span className="text-ink/20 mx-1.5">·</span>
              <span className="text-ink/30 text-[10px] tracking-widest uppercase font-medium">UNILAG QAS</span>
            </div>
          </div>

          {/* ── Login Form ── */}
          <div
            className={`transition-all duration-[500ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
              mode === 'login'
                ? 'opacity-100 translate-y-0 scale-100 relative'
                : 'opacity-0 translate-y-4 scale-[0.98] absolute inset-0 pointer-events-none'
            }`}
          >
            <h1 className="text-[1.6rem] sm:text-[1.8rem] lg:text-[2.2rem] text-ink font-bold leading-[1.1] tracking-tight mb-1.5">
              Welcome<br />back<span className="text-maroon">.</span>
            </h1>
            <p className="text-ink/40 text-[13px] sm:text-[14px] mb-5 sm:mb-6 leading-relaxed">
              Sign in to access the UNILAG Quality Assurance platform.
            </p>

            <form onSubmit={handleLogin} className="space-y-3.5">
              {/* Role */}
              <div>
                <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-2">
                  Signing in as
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-[14px] rounded-xl bg-white border border-mist/80 text-ink
                      focus:outline-none focus:ring-2 focus:ring-maroon/15 focus:border-maroon/40
                      transition-all duration-200 appearance-none cursor-pointer
                      bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20fill%3D%22%23800000%22%20d%3D%22M4.5%206l3.5%204%203.5-4z%22/%3E%3C/svg%3E')]
                      bg-no-repeat bg-[right_14px_center] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                  >
                    {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="login-email" className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-2">
                  Email or Student ID
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-ink/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="you@student.unilag.edu.ng"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 text-[14px] rounded-xl bg-white border border-mist/80 text-ink
                      placeholder:text-ink/25
                      focus:outline-none focus:ring-2 focus:ring-maroon/15 focus:border-maroon/40
                      transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="login-password" className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em]">
                    Password
                  </label>
                  <button type="button" onClick={() => navigate('/forgot-password')} className="text-[11px] text-gold-dark hover:text-gold font-medium transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-ink/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-11 py-3 text-[14px] rounded-xl bg-white border border-mist/80 text-ink
                      placeholder:text-ink/25
                      focus:outline-none focus:ring-2 focus:ring-maroon/15 focus:border-maroon/40
                      transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/20 hover:text-ink/40 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer group pt-1">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div className="w-[18px] h-[18px] rounded-md border-[1.5px] border-mist bg-white
                    peer-checked:bg-maroon peer-checked:border-maroon
                    transition-all duration-200 flex items-center justify-center
                    group-hover:border-ink/30">
                    {form.remember && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-[13px] text-ink/40 group-hover:text-ink/55 transition-colors">Remember me</span>
              </label>

              {/* Error */}
              {error && (
                <div className="px-4 py-3 rounded-xl bg-escalated/5 border border-escalated/15 animate-shake" role="alert">
                  <p className="text-[13px] text-escalated font-medium">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-maroon text-white font-semibold text-[14px]
                  shadow-[0_4px_14px_rgba(128,0,0,0.25)] hover:shadow-[0_8px_25px_rgba(128,0,0,0.35)]
                  hover:bg-maroon-dark active:bg-maroon-deep active:scale-[0.98]
                  transition-all duration-300 ease-out
                  disabled:opacity-50 disabled:cursor-not-allowed
                  relative overflow-hidden group mt-2"
              >
                <span className={`transition-all duration-200 ${loading ? 'translate-y-[-20px] opacity-0' : ''}`}>
                  Sign In
                </span>
                {loading && (
                  <svg className="animate-spin absolute inset-0 m-auto h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-mist/50" /></div>
              <div className="relative flex justify-center">
                <span className="bg-[#F5F0EB] px-3 text-[11px] text-ink/25 uppercase tracking-[0.15em] font-medium">or</span>
              </div>
            </div>

            {/* SSO */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-mist/70 rounded-xl
                text-[14px] text-ink/50 hover:text-ink hover:border-ink/15 hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]
                transition-all duration-200 font-medium group"
            >
              <svg className="w-4 h-4 text-maroon group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
              </svg>
              Continue with UNILAG SSO
            </button>

            {/* Sign up link */}
            <p className="mt-5 text-center text-[13px] text-ink/35">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="text-maroon font-semibold hover:text-maroon-dark transition-colors inline-flex items-center gap-1 group"
              >
                Create one
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </p>
          </div>

          {/* ── Register Form ── */}
          <div
            className={`transition-all duration-[500ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
              mode === 'register'
                ? 'opacity-100 translate-y-0 scale-100 relative'
                : 'opacity-0 translate-y-4 scale-[0.98] absolute inset-0 pointer-events-none'
            }`}
          >
            <h1 className="text-[1.6rem] sm:text-[1.8rem] lg:text-[2.2rem] text-ink font-bold leading-[1.1] tracking-tight mb-1.5">
              Join the<br />conversation<span className="text-gold">.</span>
            </h1>
            <p className="text-ink/40 text-[13px] sm:text-[14px] mb-5 sm:mb-6 leading-relaxed">
              {['Create your account in three quick steps.', 'Tell us about your role and where you work or study.', 'Secure your account and review your details.'][signupStep - 1]}
            </p>

            <form onSubmit={handleRegisterStep} noValidate className="space-y-3 sm:space-y-3.5">
              {/* Step rail */}
              <div className="flex items-center gap-2 mb-4" aria-label="Sign-up steps">
                {SIGNUP_STEPS.map((s, i) => (
                  <Fragment key={s.id}>
                    <button
                      type="button"
                      onClick={() => { if (i < signupStep) { setFieldErrors({}); setSignupStep(i + 1) } }}
                      className={`flex items-center gap-2 ${i < signupStep ? 'cursor-pointer' : 'cursor-default'}`}
                      aria-current={signupStep === i + 1 ? 'step' : undefined}
                    >
                      <span className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center transition-all duration-300 ${
                        signupStep > i + 1 ? 'bg-emerald-500 text-white'
                        : signupStep === i + 1 ? 'bg-maroon text-white shadow-[0_2px_8px_rgba(128,0,0,0.3)] scale-110'
                        : 'bg-mist/60 text-ink/30'
                      }`}>
                        {signupStep > i + 1 ? (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        ) : i + 1}
                      </span>
                      <span className={`text-[11px] font-semibold uppercase tracking-wider transition-colors ${signupStep === i + 1 ? 'text-maroon' : 'text-ink/25'}`}>{s.label}</span>
                    </button>
                    {i < SIGNUP_STEPS.length - 1 && (
                      <span className={`flex-1 h-px transition-colors duration-500 ${signupStep > i + 1 ? 'bg-emerald-400/60' : 'bg-mist/60'}`} />
                    )}
                  </Fragment>
                ))}
              </div>

              {signupStep === 1 && (
              <div className="space-y-3 animate-fade-step">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-1.5">First Name</label>
                  <input name="firstName" placeholder="Chidinma" value={form.firstName} onChange={handleChange}
                    className={inputCls('firstName')} />
                  <FieldError message={errText('firstName')} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-1.5">Last Name</label>
                  <input name="lastName" placeholder="Okafor" value={form.lastName} onChange={handleChange}
                    className={inputCls('lastName')} />
                  <FieldError message={errText('lastName')} />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-1.5">Email Address</label>
                <input name="email" type="email" placeholder="you@student.unilag.edu.ng" value={form.email} onChange={handleChange}
                  className={inputCls('email')} />
                <FieldError message={errText('email')} />
              </div>
              </div>
              )}

              {signupStep === 2 && (
              <div className="space-y-3 animate-fade-step">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-1.5">Role</label>
                  <select name="role" value={form.role} onChange={handleChange} className={selectCls('role')}>
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="non-staff">Non-Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-1.5">
                    {form.role === 'non-staff' ? 'Unit / Office' : 'Department'}
                  </label>
                  {form.role === 'non-staff' ? (
                    <input name="department" placeholder="Type your unit or office" value={form.department} onChange={handleChange}
                      className={inputCls('department')} />
                  ) : (
                    <select name="department" value={form.department} onChange={handleChange} className={selectCls('department')}>
                      <option value="">Select</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  )}
                  <FieldError message={errText('department')} />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-1.5">
                  {form.role === 'student' ? 'Student ID (Matric Number)' : 'Staff ID'}
                </label>
                <input name="studentId" placeholder={form.role === 'student' ? 'e.g., 2021/12345' : 'e.g., UNILAG/STF/0482'} value={form.studentId} onChange={handleChange}
                  className={inputCls('studentId')} />
                <FieldError message={errText('studentId')} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-1.5">Faculty</label>
                  <select name="faculty" value={form.faculty} onChange={handleChange} className={selectCls('faculty')} disabled={form.role === 'non-staff'}>
                    {form.role === 'non-staff' && <option value="">Not applicable</option>}
                    {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-1.5">Phone Number</label>
                  <input name="phone" type="tel" placeholder="080 0000 0000" value={form.phone} onChange={handleChange}
                    className={inputCls('phone')} />
                  <FieldError message={errText('phone')} />
                </div>
              </div>
              </div>
              )}

              {signupStep === 3 && (
              <div className="space-y-3 animate-fade-step">
              <div>
                <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-ink/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input name="password" type="password" placeholder="Create a strong password" value={form.password} onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 text-[14px] rounded-xl bg-white border ${errCls('password')} text-ink
                      placeholder:text-ink/25 focus:outline-none focus:ring-2 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]`} />
                </div>
                {/* Strength meter */}
                {form.password && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 flex gap-1">
                      {[0, 1, 2, 3].map(seg => (
                        <span key={seg} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${seg < strength ? strengthColor : 'bg-mist/70'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold text-ink/40 w-16 text-right">{strengthLabel}</span>
                  </div>
                )}
                <FieldError message={errText('password')} />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-1.5">Confirm Password</label>
                <input name="confirmPassword" type="password" placeholder="Confirm your password" value={form.confirmPassword} onChange={handleChange}
                  className={inputCls('confirmPassword')} />
                <FieldError message={errText('confirmPassword')} />
              </div>

              {/* Review */}
              <div className="rounded-xl bg-cream/70 border border-mist/50 p-4">
                <p className="text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-2.5">Review your details</p>
                <div className="space-y-1.5">
                  {[
                    ['Name', `${form.firstName} ${form.lastName}`.trim() || '—'],
                    ['Email', form.email || '—'],
                    ['Role', ROLES.find(r => r.id === form.role)?.label || form.role],
                    ['Department', form.department || '—'],
                    [form.role === 'student' ? 'Student ID' : 'Staff ID', form.studentId || '—'],
                    ['Faculty', form.role === 'non-staff' ? 'Not applicable' : form.faculty],
                    ['Phone', form.phone || '—'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-3 text-[12px]">
                      <span className="text-ink/35">{k}</span>
                      <span className="text-ink font-medium text-right truncate max-w-[60%]">{v}</span>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => { setFieldErrors({}); setSignupStep(2) }} className="mt-3 text-[12px] font-semibold text-maroon hover:text-maroon-dark transition-colors">
                  Edit details
                </button>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer group pt-1">
                <div className="relative mt-0.5">
                  <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} className="peer sr-only" required />
                  <div className="w-[18px] h-[18px] rounded-md border-[1.5px] border-mist bg-white
                    peer-checked:bg-maroon peer-checked:border-maroon
                    transition-all duration-200 flex items-center justify-center
                    group-hover:border-ink/30">
                    {form.agreeTerms && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-[13px] text-ink/35 group-hover:text-ink/50 transition-colors leading-relaxed">
                  I agree to the <span className="text-maroon font-medium">UNILAG QAS Policy</span> and <span className="text-maroon font-medium">Terms of Service</span>
                </span>
              </label>
              <FieldError message={errText('agreeTerms')} />
              </div>
              )}

              {error && (
                <div className="px-4 py-3 rounded-xl bg-escalated/5 border border-escalated/15 animate-shake" role="alert">
                  <p className="text-[13px] text-escalated font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-maroon text-white font-semibold text-[14px]
                  shadow-[0_4px_14px_rgba(128,0,0,0.25)] hover:shadow-[0_8px_25px_rgba(128,0,0,0.35)]
                  hover:bg-maroon-dark active:bg-maroon-deep active:scale-[0.98]
                  transition-all duration-300 ease-out
                  disabled:opacity-50 disabled:cursor-not-allowed
                  relative overflow-hidden group mt-1"
              >
                <span className={`inline-flex items-center gap-2 transition-all duration-200 ${loading ? 'translate-y-[-20px] opacity-0' : ''}`}>
                  {signupStep < 3 ? 'Continue' : 'Create Account'}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={signupStep < 3 ? 'M13 7l5 5-5 5M18 12H3' : 'M5 13l4 4L19 7'} />
                  </svg>
                </span>
                {loading && (
                  <svg className="animate-spin absolute inset-0 m-auto h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </form>

            <p className="mt-5 text-center text-[13px] text-ink/35">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-maroon font-semibold hover:text-maroon-dark transition-colors inline-flex items-center gap-1 group"
              >
                <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* ─── Right Panel: Floating Preview Cards ─── */}
      <div className="hidden lg:flex lg:w-[45%] relative items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F0E8E0] via-[#EDE5DA] to-[#E8DDD0]" />

        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-maroon) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />

        {/* Decorative blobs */}
        <div className="absolute top-20 right-20 w-[300px] h-[300px] rounded-full bg-maroon/5 blur-[100px]" />
        <div className="absolute bottom-20 left-10 w-[250px] h-[250px] rounded-full bg-gold/8 blur-[80px]" />

        {/* Floating cards */}
        <div className="relative z-10 w-full max-w-[500px] h-[500px]">
          <div className="absolute top-[10%] left-[5%]">
            <TicketPreviewCard />
          </div>
          <div className="absolute top-[35%] right-[0%]">
            <SatisfactionCard />
          </div>
          <div className="absolute bottom-[5%] left-[15%]">
            <StatsCard />
          </div>
        </div>

        {/* Bottom branding */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-[11px] text-ink/20 tracking-widest uppercase">
            University of Lagos · Quality Assurance
          </p>
        </div>
      </div>
    </div>
  )
}
