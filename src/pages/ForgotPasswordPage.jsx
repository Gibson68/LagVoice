/**
 * ForgotPasswordPage — Warm Palette Redesign
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../services/authService'
import Button from '../components/common/Button/Button'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await authService.forgotPassword(email)
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-9 h-9 rounded-lg bg-maroon/10 flex items-center justify-center">
            <span className="text-maroon text-lg font-bold">V</span>
          </div>
          <span className="text-maroon font-semibold tracking-tight">LagVoice</span>
        </div>

        <div className="bg-paper rounded-xl border border-mist/60 p-8">
          {success ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-resolved/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-resolved" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-ink mb-2">Check your email</h2>
              <p className="text-ink/45 text-sm leading-relaxed">
                We've sent a reset link to <strong className="text-ink/70">{email}</strong>.
              </p>
              <Link to="/login" className="inline-block mt-6 text-[12px] text-gold-dark hover:text-gold font-semibold uppercase tracking-wide transition-colors">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-ink text-center mb-1">Reset password</h2>
              <p className="text-ink/40 text-sm text-center mb-6">Enter your email and we'll send you a reset link.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="fp-email" className="block text-[11px] font-semibold text-ink/50 uppercase tracking-widest mb-2">Email</label>
                  <input
                    id="fp-email"
                    type="email"
                    placeholder="you@student.unilag.edu.ng"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError('') }}
                    required
                    className="w-full px-4 py-3 text-sm rounded-lg bg-mist-light border border-mist text-ink placeholder:text-ink/25 focus:outline-none focus:ring-2 focus:ring-maroon/30 focus:border-maroon focus:bg-paper transition-all"
                  />
                </div>

                {error && (
                  <div className="px-4 py-3 rounded-lg bg-escalated/5 border border-escalated/15" role="alert">
                    <p className="text-sm text-escalated font-medium">{error}</p>
                  </div>
                )}

                <Button type="submit" fullWidth loading={loading}>Send Reset Link</Button>
              </form>

              <p className="mt-6 text-center text-sm text-ink/40">
                Remember your password?{' '}
                <Link to="/login" className="text-maroon font-semibold hover:text-maroon-dark transition-colors">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
