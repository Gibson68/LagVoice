/**
 * LoginPage — UNILAG Maroon & Gold
 * Clean institutional design, not AI-default
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/common/Button/Button'

const ROLES = [
  { id: 'student', label: 'Student' },
  { id: 'faculty', label: 'Faculty' },
  { id: 'admin', label: 'Administrator' },
  { id: 'external', label: 'External Stakeholder' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loading, error, clearError } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', role: 'student', remember: false })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (error) clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(form.email, form.password, form.role)
    navigate(`/${form.role}`)
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-cream">
      {/* ─── Left Panel: Maroon Brand Wall ─── */}
      <div className="relative bg-maroon-deep overflow-hidden lg:w-[52%] flex flex-col justify-between p-8 lg:p-12">
        {/* Subtle grain */}
        <div className="absolute inset-0 grain" />

        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Top: Logo */}
          <div className="flex items-center gap-3 mb-12 lg:mb-0">
            <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center">
              <span className="text-white text-lg font-bold leading-none">V</span>
            </div>
            <div>
              <span className="text-white font-semibold text-sm tracking-wide">LagVoice</span>
              <span className="text-white/30 mx-2">·</span>
              <span className="text-white/50 text-[10px] tracking-widest uppercase">UNILAG QAS</span>
            </div>
          </div>

          {/* Center: Headline — bold, not serif-pretty */}
          <div className="flex-1 flex items-center">
            <div>
              <h1 className="text-white leading-[1.05] tracking-tight">
                <span className="block text-[2.8rem] lg:text-[4.2rem] font-extrabold">Your voice</span>
                <span className="block text-[2.8rem] lg:text-[4.2rem] font-extrabold">
                  shapes <span className="text-gold">campus.</span>
                </span>
              </h1>
              <div className="mt-6 lg:mt-8 max-w-md">
                <p className="text-white/45 text-sm leading-relaxed">
                  Report issues, track resolutions, and influence change at the
                  University of Lagos — anonymously if you choose.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom: Stats — monospace, data-forward */}
          <div className="relative z-10 flex items-center gap-8 lg:gap-12 mt-12 lg:mt-0 pt-8 border-t border-white/10">
            {[
              { value: '1,823', label: 'Complaints resolved' },
              { value: '78%', label: 'Satisfaction rate' },
              { value: '48h', label: 'Avg. response time' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-mono text-gold text-xl lg:text-2xl font-semibold tracking-tight">{stat.value}</p>
                <p className="text-white/35 text-[11px] tracking-wide uppercase mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Right Panel: Login Form ─── */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-lg bg-maroon/10 flex items-center justify-center">
              <span className="text-maroon text-lg font-bold">V</span>
            </div>
            <span className="text-maroon font-semibold tracking-tight">LagVoice</span>
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h2 className="text-[1.8rem] lg:text-[2.2rem] text-ink font-bold leading-tight tracking-tight">
              Welcome back.
            </h2>
            <p className="text-ink/45 text-sm mt-2">
              Sign in to continue to the QAS platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role */}
            <div>
              <label className="block text-[11px] font-semibold text-ink/50 uppercase tracking-widest mb-2">
                Signing in as
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm rounded-lg bg-mist-light border border-mist text-ink
                  focus:outline-none focus:ring-2 focus:ring-maroon/30 focus:border-maroon
                  transition-all duration-200 appearance-none cursor-pointer
                  bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20fill%3D%22%23800000%22%20d%3D%22M4.5%206l3.5%204%203.5-4z%22/%3E%3C/svg%3E')]
                  bg-no-repeat bg-[right_12px_center]"
              >
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-[11px] font-semibold text-ink/50 uppercase tracking-widest mb-2">
                Email or Student ID
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="you@student.unilag.edu.ng"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-sm rounded-lg bg-mist-light border border-mist text-ink
                  placeholder:text-ink/25
                  focus:outline-none focus:ring-2 focus:ring-maroon/30 focus:border-maroon focus:bg-paper
                  transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="login-password" className="block text-[11px] font-semibold text-ink/50 uppercase tracking-widest">
                  Password
                </label>
                <Link to="/forgot-password" className="text-[11px] text-gold-dark hover:text-gold font-medium transition-colors">
                  Forgot?
                </Link>
              </div>
              <input
                id="login-password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-sm rounded-lg bg-mist-light border border-mist text-ink
                  placeholder:text-ink/25
                  focus:outline-none focus:ring-2 focus:ring-maroon/30 focus:border-maroon focus:bg-paper
                  transition-all duration-200"
              />
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <div className="w-4 h-4 rounded border border-mist bg-mist-light
                  peer-checked:bg-maroon peer-checked:border-maroon
                  transition-all duration-200 flex items-center justify-center">
                  {form.remember && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-ink/50 group-hover:text-ink/70 transition-colors">Remember me</span>
            </label>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-lg bg-escalated/5 border border-escalated/15" role="alert">
                <p className="text-sm text-escalated font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <Button type="submit" fullWidth loading={loading} size="lg"
              className="bg-maroon hover:bg-maroon-dark text-white font-semibold rounded-lg h-12
                shadow-[0_1px_2px_rgba(128,0,0,0.25)] hover:shadow-[0_4px_12px_rgba(128,0,0,0.2)]
                transition-all duration-200">
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-mist" /></div>
            <div className="relative flex justify-center">
              <span className="bg-cream px-3 text-[11px] text-ink/30 uppercase tracking-widest font-medium">or</span>
            </div>
          </div>

          {/* SSO */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-mist rounded-lg
              text-sm text-ink/60 hover:text-ink hover:border-ink/20 hover:bg-paper
              transition-all duration-200 font-medium"
          >
            <svg className="w-4 h-4 text-maroon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
            </svg>
            Continue with UNILAG SSO
          </button>

          {/* Sign up */}
          <p className="mt-8 text-center text-sm text-ink/40">
            New here?{' '}
            <Link to="/register" className="text-maroon font-semibold hover:text-maroon-dark transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
